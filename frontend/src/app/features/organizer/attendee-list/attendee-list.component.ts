import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-attendee-list',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './attendee-list.component.html',
  styleUrl: './attendee-list.component.css'
})
export class AttendeeListComponent {

}
