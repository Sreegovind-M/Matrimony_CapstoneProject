import { Routes } from '@angular/router';
import { AttendeeGuard } from './core/guards/attendee.guard';
import { OrganizerGuard } from './core/guards/organizer.guard';

import { LoginComponent } from './features/auth/login/login.component';
import { EventListComponent } from './features/events/event-list/event-list.component';
import { EventDetailsComponent } from './features/events/event-details/event-details.component';
import { TicketBookingComponent } from './features/events/ticket-booking/ticket-booking.component';
import { BookingConfirmationComponent } from './features/booking/booking-confirmation/booking-confirmation.component';
import { MyBookingsComponent } from './features/booking/my-bookings/my-bookings.component';
import { DashboardComponent } from './features/organizer/dashboard/dashboard.component';
import { MyEventsComponent } from './features/organizer/my-events/my-events.component';
import { CreateEventComponent } from './features/organizer/create-event/create-event.component';
import { EditEventComponent } from './features/organizer/edit-event/edit-event.component';
import { AttendeeListComponent } from './features/organizer/attendee-list/attendee-list.component';
import { WelcomeComponent } from './features/organizer/welcome/welcome.component';
import { UnauthorizedComponent } from './shared/unauthorized/unauthorized.component';
import { LandingComponent } from './features/landing/landing.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { PublicEventComponent } from './features/public/public-event/public-event.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: LandingComponent },

  // Public event page (no auth required - for QR code scans)
  { path: 'event/:id', component: PublicEventComponent },

  {
    path: 'events',
    component: EventListComponent,
    canActivate: [AttendeeGuard],
  },

  {
    path: 'events/:id',
    component: EventDetailsComponent,
    canActivate: [AttendeeGuard],
  },

  {
    path: 'events/:id/book',
    component: TicketBookingComponent,
    canActivate: [AttendeeGuard],
  },

  {
    path: 'booking-confirmation/:id',
    component: BookingConfirmationComponent,
    canActivate: [AttendeeGuard],
  },

  {
    path: 'my-bookings',
    component: MyBookingsComponent,
    canActivate: [AttendeeGuard],
  },

  {
    path: 'organizer/welcome',
    component: WelcomeComponent,
    canActivate: [OrganizerGuard],
  },

  {
    path: 'organizer/dashboard',
    component: DashboardComponent,
    canActivate: [OrganizerGuard],
  },

  {
    path: 'organizer/my-events',
    component: MyEventsComponent,
    canActivate: [OrganizerGuard],
  },

  {
    path: 'organizer/create-event',
    component: CreateEventComponent,
    canActivate: [OrganizerGuard],
  },

  {
    path: 'organizer/events/:id/edit',
    component: EditEventComponent,
    canActivate: [OrganizerGuard],
  },

  {
    path: 'organizer/events/:id/attendees',
    component: AttendeeListComponent,
    canActivate: [OrganizerGuard],
  },

  { path: 'unauthorized', component: UnauthorizedComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
