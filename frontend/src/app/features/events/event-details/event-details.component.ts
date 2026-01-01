import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
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
  ) {}

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
        this.loading = false;
      },
    });
  }

  retry(): void {
    if (this.event?.id) {
      this.fetchEvent(this.event.id);
    }
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  getCategoryClass(category: string): string {
    switch (category?.toLowerCase()) {
      case 'conference':
        return 'event-hero--conference';
      case 'workshop':
        return 'event-hero--workshop';
      case 'seminar':
        return 'event-hero--seminar';
      default:
        return 'event-hero--default';
    }
  }
}
