import express, { Request, Response } from 'express';
import { events } from '../data/events';
import { bookings } from '../data/bookings';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  const { eventId, tickets } = req.body;

  if (!eventId || tickets <= 0) {
    return res.status(400).json({ message: 'Invalid booking data' });
  }

  const event = events.find(e => e.id === eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (event.booked + tickets > event.capacity) {
    return res.status(400).json({ message: 'Not enough seats available' });
  }

  event.booked += tickets;

  const booking = {
    id: bookings.length + 1,
    eventId,
    tickets
  };

  bookings.push(booking);
  res.status(201).json(booking);
});

export default router;
