export interface Booking {
  id: number;
  event_id: number;
  attendee_id: number;
  tickets_booked: number;
  total_price: number;
  booking_time: string;
  status?: string;
  confirmation_code?: string;
  // Joined from events table
  event_name?: string;
  venue?: string;
  date_time?: string;
  image_url?: string;
  event_description?: string;
}
