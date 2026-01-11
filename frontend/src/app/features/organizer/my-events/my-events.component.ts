import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { EventService } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { Event } from '../../../core/models/event.model';

type FilterType = 'all' | 'upcoming' | 'past' | 'draft';
type SortType = 'date' | 'name' | 'capacity' | 'bookings';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css'
})
export class MyEventsComponent implements OnInit {
  allEvents: Event[] = [];
  filteredEvents: Event[] = [];
  isLoading = true;
  searchQuery = '';
  activeFilter: FilterType = 'all';
  sortBy: SortType = 'date';
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.isLoading = false;
      return;
    }

    // Load only this organizer's events
    this.eventService.getEventsByOrganizer(currentUser.id).subscribe({
      next: (events) => {
        this.allEvents = events;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.allEvents];

    // Apply filter
    const now = new Date();
    switch (this.activeFilter) {
      case 'upcoming':
        filtered = filtered.filter(e => new Date(e.date_time) > now);
        break;
      case 'past':
        filtered = filtered.filter(e => new Date(e.date_time) <= now);
        break;
      case 'draft':
        filtered = filtered.filter(e => e.status === 'DRAFT');
        break;
    }

    // Apply search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.venue.toLowerCase().includes(query) ||
        (e.category || e.category_name || '').toLowerCase().includes(query)
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'date':
          return new Date(b.date_time).getTime() - new Date(a.date_time).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'capacity':
          return b.capacity - a.capacity;
        default:
          return 0;
      }
    });

    this.filteredEvents = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  setFilter(filter: FilterType): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  setSortBy(sort: SortType): void {
    this.sortBy = sort;
    this.applyFilters();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEventStatus(event: Event): string {
    const eventDate = new Date(event.date_time);
    const now = new Date();

    if (event.status === 'DRAFT') {
      return 'draft';
    } else if (eventDate > now) {
      return 'upcoming';
    } else if (eventDate.toDateString() === now.toDateString()) {
      return 'today';
    } else {
      return 'completed';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'upcoming':
        return '#48bb78';
      case 'today':
        return '#ed8936';
      case 'completed':
        return '#718096';
      case 'draft':
        return '#a0aec0';
      default:
        return '#718096';
    }
  }

  getDaysUntilEvent(date: string): number {
    const eventDate = new Date(date);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  deleteEvent(eventId: number, eventName: string): void {
    if (confirm(`Are you sure you want to delete "${eventName}"? This action cannot be undone.`)) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          // Remove from local array
          this.allEvents = this.allEvents.filter(e => e.id !== eventId);
          this.applyFilters();
          alert('Event deleted successfully!');
        },
        error: (err: Error) => {
          console.error('Error deleting event:', err);
          alert('Failed to delete event. Please try again.');
        }
      });
    }
  }

  duplicateEvent(event: Event): void {
    // Duplicate logic will be implemented with backend
  }

  get upcomingCount(): number {
    const now = new Date();
    return this.allEvents.filter(e => new Date(e.date_time) > now).length;
  }

  get pastCount(): number {
    const now = new Date();
    return this.allEvents.filter(e => new Date(e.date_time) <= now).length;
  }

  get draftCount(): number {
    return this.allEvents.filter(e => e.status === 'DRAFT').length;
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

  editEvent(event: Event): void {
    this.router.navigate(['/organizer/events', event.id, 'edit']);
  }

  viewAttendees(event: Event): void {
    this.router.navigate(['/organizer/events', event.id, 'attendees']);
  }
}

