import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService, Category } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent implements OnInit {
  eventForm!: FormGroup;
  loading = false;
  success = false;
  error = '';
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.initializeForm();
  }

  loadCategories() {
    this.eventService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  initializeForm() {
    const currentUser = this.authService.getCurrentUser();
    const organizerId = currentUser?.id || 0;

    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      venue: ['', [Validators.required]],
      venue_address: [''],
      date_time: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      ticket_price: [0, [Validators.required, Validators.min(0)]],
      is_private: [false], // Default to public event
      organizer_id: [organizerId, Validators.required],
      status: ['PUBLISHED']
    });
  }

  get f() {
    return this.eventForm.controls;
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      this.error = 'Please fill all required fields correctly';
      return;
    }

    // Double-check organizer_id is set correctly
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.error = 'You must be logged in to create an event';
      return;
    }

    this.loading = true;
    this.error = '';

    const formData = {
      ...this.eventForm.value,
      organizer_id: currentUser.id,
      category_id: Number(this.eventForm.value.category_id),
      capacity: Number(this.eventForm.value.capacity),
      ticket_price: Number(this.eventForm.value.ticket_price) || 0
    };

    this.eventService.createEvent(formData).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/organizer/dashboard']);
        }, 1500);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to create event. Please try again.';
      }
    });
  }

  resetForm() {
    const currentUser = this.authService.getCurrentUser();
    this.eventForm.reset({
      organizer_id: currentUser?.id || 0,
      status: 'PUBLISHED',
      ticket_price: 0
    });
    this.error = '';
    this.success = false;
  }
}
