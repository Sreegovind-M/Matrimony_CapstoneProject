import express from 'express';
import cors from 'cors';

import eventRoutes from './routes/event.routes';
import bookingRoutes from './routes/booking.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/events', eventRoutes);
app.use('/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running successfully');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
