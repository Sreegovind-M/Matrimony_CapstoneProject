import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models/booking.model';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationComponent implements OnInit {

  bookingId!: number;
  booking!: Booking;

  isLoading = true;
  hasError = false;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.bookingId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchBooking();
  }

  fetchBooking(): void {
    this.isLoading = true;
    this.hasError = false;

    console.log('Fetching booking ID:', this.bookingId);

    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: (res) => {
        console.log('Booking data received:', res);
        this.booking = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching booking:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  goToBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  browseEvents(): void {
    this.router.navigate(['/events']);
  }

  retry(): void {
    this.fetchBooking();
  }
}
