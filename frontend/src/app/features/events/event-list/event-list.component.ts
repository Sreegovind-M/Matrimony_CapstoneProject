import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EventService, Category, Organizer, EventFilters } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  events: Event[] = [];
  categories: Category[] = [];
  organizers: Organizer[] = [];
  loading = true;
  error = false;

  // Filter state
  selectedCategory: number | null = null;
  selectedOrganizer: number | null = null;
  searchQuery = '';

  // Search debounce
  private searchSubject = new Subject<string>();

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadOrganizers();
    this.fetchEvents();

    // Debounce search input
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchQuery = query;
      this.fetchEvents();
    });
  }

  loadCategories(): void {
    this.eventService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  loadOrganizers(): void {
    this.eventService.getOrganizers().subscribe({
      next: (organizers) => {
        this.organizers = organizers;
      }
    });
  }

  fetchEvents(): void {
    this.loading = true;
    this.error = false;

    const filters: EventFilters = {};
    if (this.selectedCategory) filters.category = this.selectedCategory;
    if (this.selectedOrganizer) filters.organizer = this.selectedOrganizer;
    if (this.searchQuery) filters.search = this.searchQuery;

    this.eventService.getAllEvents(filters).subscribe({
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

  onSearchInput(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    this.fetchEvents();
  }

  selectOrganizer(organizerId: number | null): void {
    this.selectedOrganizer = organizerId;
    this.fetchEvents();
  }

  clearFilters(): void {
    this.selectedCategory = null;
    this.selectedOrganizer = null;
    this.searchQuery = '';
    this.fetchEvents();
  }

  hasActiveFilters(): boolean {
    return this.selectedCategory !== null ||
      this.selectedOrganizer !== null ||
      this.searchQuery.length > 0;
  }

  getCategoryName(categoryId: number): string {
    return this.categories.find(c => c.id === categoryId)?.name || '';
  }

  getOrganizerName(organizerId: number): string {
    return this.organizers.find(o => o.id === organizerId)?.name || '';
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

  // Map potentially invalid icon names to valid Material Symbols
  getCategoryIcon(icon: string | undefined): string {
    const iconMap: { [key: string]: string } = {
      'computer': 'devices',
      'business': 'work',
      'theaters': 'theater_comedy',
      'groups': 'group',
      'sports_soccer': 'sports_soccer',
      'music_note': 'music_note',
      'devices': 'devices',
      'work': 'work',
      'palette': 'palette',
      'restaurant': 'restaurant',
      'school': 'school',
      'fitness_center': 'fitness_center',
      'theater_comedy': 'theater_comedy',
      'group': 'group'
    };

    if (!icon) return 'category';
    return iconMap[icon] || icon;
  }
}
