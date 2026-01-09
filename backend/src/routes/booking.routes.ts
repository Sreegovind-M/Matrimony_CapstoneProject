import express, { Request, Response } from 'express';
import pool from '../config/db.config';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();

// Generate confirmation code
const generateConfirmationCode = (): string => {
  return 'EVT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// POST create booking
router.post('/', async (req: Request, res: Response) => {
  const connection = await pool.getConnection();

  try {
    const { eventId, attendee_id, tickets, seats } = req.body;
    const ticketCount = tickets || seats; // Support both field names

    if (!eventId || ticketCount <= 0) {
      return res.status(400).json({ message: 'Invalid booking data' });
    }

    await connection.beginTransaction();

    // Get event details
    const [events] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM events WHERE id = ? FOR UPDATE',
      [eventId]
    );

    if (events.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = events[0];
    const availableSeats = event.capacity - event.tickets_booked;

    if (ticketCount > availableSeats) {
      await connection.rollback();
      return res.status(400).json({
        message: `Not enough seats available. Only ${availableSeats} seats left.`
      });
    }

    const totalPrice = event.ticket_price * ticketCount;
    const confirmationCode = generateConfirmationCode();

    // Create booking
    const [result] = await connection.query<ResultSetHeader>(`
      INSERT INTO bookings (
        event_id, attendee_id, tickets_booked, total_price, 
        status, confirmation_code
      ) VALUES (?, ?, ?, ?, 'CONFIRMED', ?)
    `, [eventId, attendee_id || 1, ticketCount, totalPrice, confirmationCode]);

    // Update event tickets_booked
    await connection.query(
      'UPDATE events SET tickets_booked = tickets_booked + ? WHERE id = ?',
      [ticketCount, eventId]
    );

    await connection.commit();

    res.status(201).json({
      id: result.insertId,
      eventId,
      tickets: ticketCount,
      totalPrice,
      confirmationCode,
      status: 'CONFIRMED',
      message: 'Booking successful!'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  } finally {
    connection.release();
  }
});

// GET all bookings (for attendee)
router.get('/', async (req: Request, res: Response) => {
  try {
    const attendeeId = req.query.attendee_id;

    let query = `
      SELECT b.*, e.name as event_name, e.venue, e.date_time, e.image_url
      FROM bookings b
      JOIN events e ON b.event_id = e.id
    `;

    const params: any[] = [];
    if (attendeeId) {
      query += ' WHERE b.attendee_id = ?';
      params.push(attendeeId);
    }

    query += ' ORDER BY b.booking_time DESC';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// GET booking by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT b.*, e.name as event_name, e.venue, e.date_time, 
             e.image_url, e.description as event_description
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
});

// GET bookings by event (for organizer)
router.get('/event/:eventId', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT b.*, u.name as attendee_name, u.email as attendee_email
      FROM bookings b
      JOIN users u ON b.attendee_id = u.id
      WHERE b.event_id = ?
      ORDER BY b.booking_time DESC
    `, [req.params.eventId]);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching event bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// PUT cancel booking
router.put('/:id/cancel', async (req: Request, res: Response) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Get booking
    const [bookings] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM bookings WHERE id = ? FOR UPDATE',
      [req.params.id]
    );

    if (bookings.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookings[0];

    if (booking.status === 'CANCELLED') {
      await connection.rollback();
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    // Update booking status
    await connection.query(
      'UPDATE bookings SET status = ?, cancelled_at = NOW() WHERE id = ?',
      ['CANCELLED', req.params.id]
    );

    // Restore tickets to event
    await connection.query(
      'UPDATE events SET tickets_booked = tickets_booked - ? WHERE id = ?',
      [booking.tickets_booked, booking.event_id]
    );

    await connection.commit();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  } finally {
    connection.release();
  }
});

export default router;
