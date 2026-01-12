import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { EventService } from '../../../core/services/event.service';
import { HttpClient } from '@angular/common/http';

interface Booking {
  id: number;
  attendee_id: number;
  attendee_name: string;
  attendee_email: string;
  tickets_booked: number;
  total_price: number;
  status: string;
  confirmation_code: string;
  booking_time: string;
}

interface EventDetails {
  id: number;
  name: string;
  venue: string;
  date_time: string;
  capacity: number;
  tickets_booked: number;
  ticket_price: number;
}

@Component({
  selector: 'app-attendee-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './attendee-list.component.html',
  styleUrls: ['./attendee-list.component.css']
})
export class AttendeeListComponent implements OnInit {
  eventId!: number;
  event: EventDetails | null = null;
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  statusFilter = 'ALL';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = +params['id'];
      this.loadEventDetails();
      this.loadBookings();
    });
  }

  loadEventDetails(): void {
    this.eventService.getEvent(this.eventId).subscribe({
      next: (event: any) => {
        this.event = event as EventDetails;
      },
      error: (err: Error) => {
        console.error('Error loading event:', err);
        this.errorMessage = 'Failed to load event details';
      }
    });
  }

  loadBookings(): void {
    this.isLoading = true;
    this.http.get<Booking[]>(`/api/bookings/event/${this.eventId}`).subscribe({
      next: (bookings) => {
        // Convert total_price from string to number for toFixed() to work
        this.bookings = bookings.map(b => ({
          ...b,
          total_price: parseFloat(b.total_price as any) || 0
        }));
        this.filteredBookings = this.bookings;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
        this.errorMessage = 'Failed to load attendee list';
        this.isLoading = false;
      }
    });
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.applyFilters();
  }

  onStatusFilter(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredBookings = this.bookings.filter(booking => {
      const matchesSearch =
        booking.attendee_name?.toLowerCase().includes(this.searchTerm) ||
        booking.attendee_email?.toLowerCase().includes(this.searchTerm) ||
        booking.confirmation_code?.toLowerCase().includes(this.searchTerm);

      const matchesStatus =
        this.statusFilter === 'ALL' ||
        booking.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  get totalTickets(): number {
    return this.bookings
      .filter(b => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + b.tickets_booked, 0);
  }

  get totalRevenue(): number {
    return this.bookings
      .filter(b => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + b.total_price, 0);
  }

  get confirmedCount(): number {
    return this.bookings.filter(b => b.status === 'CONFIRMED').length;
  }

  get cancelledCount(): number {
    return this.bookings.filter(b => b.status === 'CANCELLED').length;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'status-confirmed';
      case 'CANCELLED': return 'status-cancelled';
      case 'PENDING': return 'status-pending';
      default: return '';
    }
  }

  goBack(): void {
    this.router.navigate(['/organizer/my-events']);
  }

  exportToCSV(): void {
    const headers = ['Name', 'Email', 'Tickets', 'Amount', 'Status', 'Confirmation Code', 'Booking Date'];
    const rows = this.filteredBookings.map(b => [
      b.attendee_name,
      b.attendee_email,
      b.tickets_booked,
      b.total_price,
      b.status,
      b.confirmation_code,
      this.formatDate(b.booking_time)
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendees-${this.event?.name || 'event'}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
