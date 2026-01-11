import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { EventService } from '../../../core/services/event.service';

interface Category {
  id: number;
  name: string;
  icon?: string;
}

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  eventForm!: FormGroup;
  categories: Category[] = [];
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  eventId!: number;
  eventName = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();

    this.route.params.subscribe(params => {
      this.eventId = +params['id'];
      this.loadEventData();
    });
  }

  initForm(): void {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      venue: ['', Validators.required],
      venue_address: [''],
      date_time: ['', Validators.required],
      end_date_time: [''],
      category_id: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      ticket_price: [0, [Validators.required, Validators.min(0)]],
      image_url: [''],
      status: ['PUBLISHED']
    });
  }

  loadCategories(): void {
    this.eventService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  loadEventData(): void {
    this.isLoading = true;
    this.eventService.getEvent(this.eventId).subscribe({
      next: (event) => {
        this.eventName = event.name;
        // Format date for datetime-local input
        const dateTime = new Date(event.date_time);
        const formattedDateTime = this.formatDateForInput(dateTime);

        let formattedEndDateTime = '';
        if (event.end_date_time) {
          const endDateTime = new Date(event.end_date_time);
          formattedEndDateTime = this.formatDateForInput(endDateTime);
        }

        this.eventForm.patchValue({
          name: event.name,
          description: event.description,
          venue: event.venue,
          venue_address: event.venue_address || '',
          date_time: formattedDateTime,
          end_date_time: formattedEndDateTime,
          category_id: event.category_id,
          capacity: event.capacity,
          ticket_price: event.ticket_price || 0,
          image_url: event.image_url || '',
          status: event.status || 'PUBLISHED'
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading event:', err);
        this.errorMessage = 'Failed to load event details';
        this.isLoading = false;
      }
    });
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = {
      ...this.eventForm.value,
      category_id: Number(this.eventForm.value.category_id),
      capacity: Number(this.eventForm.value.capacity),
      ticket_price: Number(this.eventForm.value.ticket_price)
    };

    this.eventService.updateEvent(this.eventId, formData).subscribe({
      next: () => {
        this.successMessage = 'Event updated successfully!';
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/organizer/my-events']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error updating event:', err);
        this.errorMessage = 'Failed to update event. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/organizer/my-events']);
  }

  // Form field getters for validation
  get f() {
    return this.eventForm.controls;
  }
}
