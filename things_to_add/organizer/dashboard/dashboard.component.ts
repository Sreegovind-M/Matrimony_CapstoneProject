import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { EventService } from '../../../core/services/event.service';
import { BookingService } from '../../../core/services/booking.service';
import { Event } from '../../../core/models/event.model';
import { Booking } from '../../../core/models/booking.model';

interface DashboardStats {
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  upcomingEvents: number;
}

interface Activity {
  id: number;
  type: 'booking' | 'event';
  message: string;
  timestamp: string;
  relativeTime: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    upcomingEvents: 0
  };

  upcomingEvents: Event[] = [];
  recentActivities: Activity[] = [];
  loading = true;
  error = '';

  constructor(
    private eventService: EventService,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    this.error = '';

    // Load events
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.stats.totalEvents = events.length;
        
        const now = new Date();
        this.upcomingEvents = events
          .filter(e => new Date(e.date_time) > now)
          .slice(0, 5);
        
        this.stats.upcomingEvents = events.filter(e => new Date(e.date_time) > now).length;

        // Generate recent activities from events
        this.recentActivities = events.slice(0, 5).map((event, index) => ({
          id: event.id,
          type: 'event',
          message: `Created event: ${event.name}`,
          timestamp: event.created_at,
          relativeTime: this.getRelativeTime(event.created_at)
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load events:', err);
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      }
    });

    // Load bookings
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.stats.totalBookings = bookings.length;
        // Assuming each booking represents revenue (could be multiplied by price)
        this.stats.totalRevenue = bookings.length * 500; // Example: ₹500 per booking
      },
      error: (err) => {
        console.error('Failed to load bookings:', err);
      }
    });
  }

  getRelativeTime(dateString: string): string {
    return this.generateRecentActivities();
  }

  generateRecentActivities(): string {
    const now = new Date();
    const timeUnits = [
      { unit: 'year', seconds: 31536000 },
      { unit: 'month', seconds: 2592000 },
      { unit: 'week', seconds: 604800 },
      { unit: 'day', seconds: 86400 },
      { unit: 'hour', seconds: 3600 },
      { unit: 'minute', seconds: 60 }
    ];

    for (const { unit, seconds } of timeUnits) {
      const interval = Math.floor(1 / seconds);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    return 'just now';
  }
}
