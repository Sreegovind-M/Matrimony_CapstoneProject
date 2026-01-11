import express, { Request, Response } from 'express';
import pool from '../config/db.config';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();

// GET all categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT id, name, description, icon, color
      FROM categories
      WHERE is_active = TRUE
      ORDER BY name ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// GET all organizers with events
router.get('/organizers', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT DISTINCT u.id, u.name
      FROM users u
      INNER JOIN events e ON u.id = e.organizer_id
      WHERE u.role = 'ORGANIZER' AND u.is_active = TRUE AND e.status = 'PUBLISHED'
      ORDER BY u.name ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching organizers:', error);
    res.status(500).json({ message: 'Error fetching organizers' });
  }
});

// GET all published events with optional filters (excludes private events for attendees)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, organizer, search, include_private } = req.query;

    let query = `
      SELECT e.*, c.name as category_name, u.name as organizer_name
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE e.status = 'PUBLISHED'
    `;

    // Exclude private events from public list unless specifically requested
    if (!include_private) {
      query += ` AND (e.is_private = FALSE OR e.is_private IS NULL)`;
    }

    const params: (string | number)[] = [];

    // Filter by category
    if (category) {
      query += ` AND e.category_id = ?`;
      params.push(Number(category));
    }

    // Filter by organizer
    if (organizer) {
      query += ` AND e.organizer_id = ?`;
      params.push(Number(organizer));
    }

    // Search by name or description
    if (search) {
      query += ` AND (e.name LIKE ? OR e.description LIKE ? OR e.venue LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ` ORDER BY e.date_time ASC`;

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// GET single event by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT e.*, c.name as category_name, u.name as organizer_name
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE e.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Error fetching event' });
  }
});

// POST create new event
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      organizer_id, name, description, venue, venue_address,
      date_time, end_date_time, category_id, capacity,
      ticket_price, image_url, status = 'DRAFT', is_private = false
    } = req.body;

    if (!name || !venue || !date_time || !capacity || !organizer_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [result] = await pool.query<ResultSetHeader>(`
      INSERT INTO events (
        organizer_id, name, description, venue, venue_address,
        date_time, end_date_time, category_id, capacity, 
        ticket_price, image_url, status, is_private
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      organizer_id, name, description, venue, venue_address,
      date_time, end_date_time, category_id, capacity,
      ticket_price || 0, image_url, status, is_private ? 1 : 0
    ]);

    res.status(201).json({
      id: result.insertId,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
});

// PUT update event
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const {
      name, description, venue, venue_address,
      date_time, end_date_time, category_id, capacity,
      ticket_price, image_url, status, is_private
    } = req.body;

    const [result] = await pool.query<ResultSetHeader>(`
      UPDATE events SET 
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        venue = COALESCE(?, venue),
        venue_address = COALESCE(?, venue_address),
        date_time = COALESCE(?, date_time),
        end_date_time = COALESCE(?, end_date_time),
        category_id = COALESCE(?, category_id),
        capacity = COALESCE(?, capacity),
        ticket_price = COALESCE(?, ticket_price),
        image_url = COALESCE(?, image_url),
        status = COALESCE(?, status),
        is_private = COALESCE(?, is_private)
      WHERE id = ?
    `, [
      name, description, venue, venue_address,
      date_time, end_date_time, category_id, capacity,
      ticket_price, image_url, status,
      is_private !== undefined ? (is_private ? 1 : 0) : null,
      req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
});

// DELETE event
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM events WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
});

// GET events by organizer
router.get('/organizer/:organizerId', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT e.*, c.name as category_name
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.organizer_id = ?
      ORDER BY e.created_at DESC
    `, [req.params.organizerId]);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching organizer events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

export default router;
