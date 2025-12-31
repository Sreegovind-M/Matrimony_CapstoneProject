import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { EventService } from '../../../core/services/event.service';

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
  error = '';
  success = false;

  categories = [
    'Wedding',
    'Birthday',
    'Anniversary',
    'Engagement',
    'Corporate Event',
    'Seminar',
    'Conference',
    'Meetup',
    'Party',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      venue: ['', [Validators.required, Validators.minLength(3)]],
      date_time: ['', Validators.required],
      category: ['Wedding', Validators.required],
      capacity: [100, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      this.error = 'Please fill all required fields correctly';
      return;
    }

    this.loading = true;
    this.error = '';

    const formData = this.eventForm.value;
    
    // Ensure date_time is in proper format
    const dateTime = new Date(formData.date_time).toISOString();

    this.eventService.createEvent({
      ...formData,
      date_time: dateTime
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/organizer/my-events']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to create event. Please try again.';
      }
    });
  }

  resetForm() {
    this.eventForm.reset({ category: 'Wedding', capacity: 100 });
    this.error = '';
  }

  goBack() {
    this.location.back();
  }

  get isFormValid(): boolean {
    return this.eventForm.valid;
  }

  getFieldError(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    if (field?.hasError('required')) return `${fieldName} is required`;
    if (field?.hasError('minlength')) return `${fieldName} is too short`;
    if (field?.hasError('min')) return `${fieldName} must be at least 1`;
    return '';
  }
}
