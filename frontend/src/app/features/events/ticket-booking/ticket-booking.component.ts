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

    // Navigate to payment page with event and ticket details
    this.router.navigate(['/payment'], {
      queryParams: {
        eventId: this.event.id,
        tickets: this.ticketCount
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/events', this.event.id]);
  }
}
