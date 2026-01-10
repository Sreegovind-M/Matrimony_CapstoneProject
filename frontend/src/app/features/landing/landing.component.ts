import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent {
  constructor(private router: Router) {}
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  trendingEvents = [
    {
      title: 'React 19 Deep Dive',
      category: 'Workshop',
      location: 'San Francisco',
      description: 'Master the latest server components and actions.',
      image: 'PASTE_IMAGE_URL_HERE',
    },
    {
      title: 'Web3 Builders Forum',
      category: 'Conference',
      location: 'London',
      description: 'The largest gathering of decentralized app developers.',
      image: 'PASTE_IMAGE_URL_HERE',
    },
    {
      title: 'AI Ethics Seminar',
      category: 'Seminar',
      location: 'Online',
      description: 'Exploring the ethical boundaries of machine learning.',
      image: 'PASTE_IMAGE_URL_HERE',
    },
  ];

  categories = [
    { name: 'Conferences', subtitle: 'Global Networking', icon: 'groups' },
    { name: 'Workshops', subtitle: 'Hands-on Learning', icon: 'terminal' },
    { name: 'Seminars', subtitle: 'Expert Insights', icon: 'school' },
    { name: 'Tech Talks', subtitle: 'Short & Sharp', icon: 'forum' },
  ];

  upcomingEvents = [
    {
      title: 'Cybersecurity Summit',
      venue: 'The Grand Hall, NYC',
      date: 'Oct 12',
      image: 'PASTE_IMAGE_URL_HERE',
    },
    {
      title: 'UX Research Meetup',
      venue: 'Online Event',
      date: 'Oct 15',
      image: 'PASTE_IMAGE_URL_HERE',
    },
    {
      title: 'DevOps Days',
      venue: 'Convention Center, Berlin',
      date: 'Oct 28',
      image: 'PASTE_IMAGE_URL_HERE',
    },
  ];

  features = [
    {
      title: 'Smart Discovery',
      description: 'AI-powered recommendations based on your interests.',
      icon: 'search',
    },
    {
      title: 'Instant Booking',
      description: 'One-tap ticket booking with secure digital storage.',
      icon: 'confirmation_number',
    },
    {
      title: 'Advanced Analytics',
      description: 'Real-time engagement metrics for organizers.',
      icon: 'analytics',
    },
  ];

  stats = [
    { value: '500+', label: 'Events Hosted' },
    { value: '50k+', label: 'Tickets Sold' },
    { value: '120', label: 'Global Cities' },
    { value: '4.9/5', label: 'Organizer Rating' },
  ];
}
