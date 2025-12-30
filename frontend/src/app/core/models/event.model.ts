// event.model.ts
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;          // ISO string from backend
  location: string;
  availableSeats: number;
}
