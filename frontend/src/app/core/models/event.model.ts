export interface Event {
  id: number;
  organizer_id: number;
  name: string;
  description: string;
  venue: string;
  venue_address?: string;
  date_time: string;
  end_date_time?: string;
  category_id?: number;
  category_name?: string;
  category?: string;  // Alias for backward compatibility
  capacity: number;
  tickets_booked?: number;
  ticket_price?: number;
  image_url?: string;
  status?: string;
  is_featured?: boolean;
  organizer_name?: string;
  created_at?: string;
  updated_at?: string;
}
