import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  success = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      venue: ['', [Validators.required]],
      date_time: ['', [Validators.required]],
      category: ['', [Validators.required]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      organizer_id: [1, Validators.required]
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

    this.loading = true;
    this.error = '';

    const formData = this.eventForm.value;

    this.eventService.createEvent(formData).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/organizer/my-events']);
        }, 1500);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to create event. Please try again.';
      }
    });
  }

  resetForm() {
    this.eventForm.reset();
    this.error = '';
    this.success = false;
  }
}
