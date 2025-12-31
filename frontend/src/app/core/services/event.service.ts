import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private baseUrl = 'http://localhost:3000/api/events';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.baseUrl).pipe(
      catchError(error => {
        console.log('Error loading events from API');
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
}
