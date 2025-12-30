// user.model.ts
export interface User {
  id: number;
  role: 'ATTENDEE' | 'ORGANIZER' | 'ADMIN';
}
