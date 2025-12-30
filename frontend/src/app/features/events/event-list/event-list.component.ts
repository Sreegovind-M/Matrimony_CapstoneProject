import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent {

}
