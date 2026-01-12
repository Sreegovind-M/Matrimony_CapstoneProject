// user.model.ts
export interface User {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  profile_image_url?: string;
  created_at?: string;
  role: 'ATTENDEE' | 'ORGANIZER' | 'ADMIN';
}
