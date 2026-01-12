import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Event } from '../models/event.model';

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface Organizer {
  id: number;
  name: string;
}

export interface EventFilters {
  category?: number;
  organizer?: number;
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private baseUrl = '/api/events';

  constructor(private http: HttpClient) { }

  getAllEvents(filters?: EventFilters): Observable<Event[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.category) {
        params = params.set('category', filters.category.toString());
      }
      if (filters.organizer) {
        params = params.set('organizer', filters.organizer.toString());
      }
      if (filters.search) {
        params = params.set('search', filters.search);
      }
    }

    return this.http.get<Event[]>(this.baseUrl, { params }).pipe(
      catchError(error => {
        console.log('Error loading events from API');
        return of([]);
      })
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`).pipe(
      catchError(error => {
        console.log('Error loading categories from API');
        return of([]);
      })
    );
  }

  getOrganizers(): Observable<Organizer[]> {
    return this.http.get<Organizer[]>(`${this.baseUrl}/organizers`).pipe(
      catchError(error => {
        console.log('Error loading organizers from API');
        return of([]);
      })
    );
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.log('Error loading event from API');
        return of({} as Event);
      })
    );
  }

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, event).pipe(
      catchError(error => {
        console.log('Error creating event');
        return of(event);
      })
    );
  }

  updateEvent(id: number, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/${id}`, event).pipe(
      catchError(error => {
        console.log('Error updating event');
        return of(event);
      })
    );
  }

  getEventsByOrganizer(organizerId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/organizer/${organizerId}`).pipe(
      catchError(error => {
        console.log('Error loading organizer events from API');
        return of([]);
      })
    );
  }

  // Alias for getEventById for convenience
  getEvent(id: number): Observable<Event> {
    return this.getEventById(id);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}

