import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { BookingService } from '../../../core/services/booking.service';
import { Event } from '../../../core/models/event.model';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-ticket-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './ticket-booking.component.html',
  styleUrls: ['./ticket-booking.component.css'],
})
export class TicketBookingComponent implements OnInit {
  event!: Event;

  ticketCount = 1; // UI default
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private bookingService: BookingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));

    if (!eventId) {
      this.errorMessage = 'Invalid event';
      this.isLoading = false;
      return;
    }

    this.eventService.getEventById(eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load event details';
        this.isLoading = false;
      },
    });
  }

  onConfirmBooking(): void {
    if (this.ticketCount < 1 || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.bookingService
      .bookTickets({
        eventId: this.event.id,
        seats: this.ticketCount,
      })
      .subscribe({
        next: (booking) => {
          // Navigate to booking confirmation page
          this.router.navigate(['/booking-confirmation', booking.id]);
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.message ||
            'Requested number of tickets is not available';
          this.isSubmitting = false;
        },
      });
  }

  onBack(): void {
    this.router.navigate(['/events', this.event.id]);
  }
}
