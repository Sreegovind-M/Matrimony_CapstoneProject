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
  timestamp: string | undefined;
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
  ) { }

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
          type: 'event' as const,
          message: `Created event: ${event.name}`,
          timestamp: event.created_at,
          relativeTime: this.getRelativeTime(event.created_at || new Date().toISOString())
        }));

        this.loading = false;
      },
      error: (err) => {

        this.error = 'Failed to load dashboard data';
        this.loading = false;
      }
    });

    // Load bookings
    this.bookingService.getAllBookings().subscribe({
      next: (bookings: any) => {
        this.stats.totalBookings = bookings.length;
        // Assuming each booking represents revenue (could be multiplied by price)
        this.stats.totalRevenue = bookings.length * 500; // Example: ₹500 per booking
      },
      error: (err: any) => {
        // Handle error silently
      }
    });
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const timeUnits = [
      { unit: 'year', secs: 31536000 },
      { unit: 'month', secs: 2592000 },
      { unit: 'week', secs: 604800 },
      { unit: 'day', secs: 86400 },
      { unit: 'hour', secs: 3600 },
      { unit: 'minute', secs: 60 }
    ];

    for (const { unit, secs } of timeUnits) {
      const interval = Math.floor(seconds / secs);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    return 'just now';
  }

  getDefaultImage(categoryName: string | undefined): string {
    const category = (categoryName || '').toLowerCase();
    if (category.includes('tech') || category.includes('conference')) {
      return 'assets/events/tech_conference.png';
    } else if (category.includes('music') || category.includes('concert')) {
      return 'assets/events/music_festival.png';
    } else if (category.includes('sport') || category.includes('marathon')) {
      return 'assets/events/sports_marathon.png';
    } else if (category.includes('food') || category.includes('drink')) {
      return 'assets/events/food_festival.png';
    } else if (category.includes('art') || category.includes('culture')) {
      return 'assets/events/art_exhibition.png';
    }
    return 'assets/events/tech_conference.png';
  }
}
