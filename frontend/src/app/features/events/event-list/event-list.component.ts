import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  events: Event[] = [];
  loading = true;
  error = false;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.loading = true;
    this.error = false;

    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
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
