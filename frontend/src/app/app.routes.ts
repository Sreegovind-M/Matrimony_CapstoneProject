import { Routes } from '@angular/router';
import { AttendeeGuard } from './core/guards/attendee.guard';
import { OrganizerGuard } from './core/guards/organizer.guard';

import { LoginComponent } from './features/auth/login/login.component';
import { EventListComponent } from './features/events/event-list/event-list.component';
import { DashboardComponent } from './features/organizer/dashboard/dashboard.component';
import { MyEventsComponent } from './features/organizer/my-events/my-events.component';
import { CreateEventComponent } from './features/organizer/create-event/create-event.component';
import { UnauthorizedComponent } from './shared/unauthorized/unauthorized.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'events',
    component: EventListComponent,
    canActivate: [AttendeeGuard]
  },

  {
    path: 'organizer/dashboard',
    component: DashboardComponent,
    canActivate: [OrganizerGuard]
  },

  {
    path: 'organizer/my-events',
    component: MyEventsComponent,
    canActivate: [OrganizerGuard]
  },

  {
    path: 'organizer/create-event',
    component: CreateEventComponent,
    canActivate: [OrganizerGuard]
  },

  { path: 'unauthorized', component: UnauthorizedComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
