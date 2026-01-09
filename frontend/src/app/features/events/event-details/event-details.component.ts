import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;

  loading = true;
  error = false;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));

    if (!eventId) {
      this.notFound = true;
      this.loading = false;
      return;
    }

    this.fetchEvent(eventId);
  }

  fetchEvent(id: number): void {
    this.loading = true;
    this.error = false;
    this.notFound = false;

    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        if (!event) {
          this.notFound = true;
        } else {
          this.event = event;
        }
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false
      },
    });
  }

  retry(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (eventId) {
      this.fetchEvent(eventId);
    }
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  bookTickets(): void {
    if (this.event) {
      this.router.navigate(['/events', this.event.id, 'book']);
    }
  }

  getAvailableSeats(): number {
    if (!this.event) return 0;
    return (this.event.capacity || 0) - (this.event.tickets_booked || 0);
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
