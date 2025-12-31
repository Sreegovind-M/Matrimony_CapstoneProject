import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private baseUrl = 'http://localhost:3000/api/bookings';

  constructor(private http: HttpClient) {}

  bookTickets(data: {
    eventId: number;
    seats: number;
  }): Observable<Booking> {
    return this.http.post<Booking>(this.baseUrl, data).pipe(
      catchError(error => {
        return of({} as Booking);
      })
    );
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        return of({} as Booking);
      })
    );
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.baseUrl).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }
}
