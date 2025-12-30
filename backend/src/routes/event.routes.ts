import express, { Request, Response } from 'express';
import { events } from '../data/events';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  const { name, venue, date_time, capacity } = req.body;

  if (!name || !venue || !date_time || capacity <= 0) {
    return res.status(400).json({ message: 'Invalid event data' });
  }

  const newEvent = {
    id: events.length + 1,
    name,
    venue,
    date_time,
    capacity,
    booked: 0
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
});

router.get('/', (req: Request, res: Response) => {
  res.json(events);
});

router.get('/:id', (req: Request, res: Response) => {
  const event = events.find(e => e.id === Number(req.params.id));
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json(event);
});

export default router;
