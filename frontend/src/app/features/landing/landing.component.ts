import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../../core/services/event.service';

interface Event {
  id: number;
  name: string;
  description: string;
  venue: string;
  date_time: string;
  category_name?: string;
  ticket_price: number;
  capacity: number;
  tickets_booked?: number;
  image_url?: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit, OnDestroy {
  featuredEvents: Event[] = [];
  private statsInterval: any;

  // Animated stats
  animatedStats = {
    events: 0,
    users: 0,
    cities: 0
  };

  targetStats = {
    events: 500,
    users: 50,
    cities: 120
  };

  // Particles for hero animation
  particles = Array(8).fill(0);
  confetti = Array(10).fill(0);

  // Marquee items
  marqueeItems = [
    { emoji: '🎵', text: 'Live Concerts' },
    { emoji: '🍔', text: 'Food Festivals' },
    { emoji: '🎮', text: 'Gaming Events' },
    { emoji: '🎨', text: 'Art Exhibitions' },
    { emoji: '📚', text: 'Workshops' },
    { emoji: '👥', text: 'Networking' },
    { emoji: '🎭', text: 'Theater Shows' },
    { emoji: '⚽', text: 'Sports Events' },
  ];

  // Categories with colors
  categories = [
    { name: 'Technology', subtitle: 'Innovation & Code', emoji: '💻', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { name: 'Music', subtitle: 'Live Performances', emoji: '🎵', color: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    { name: 'Food & Drink', subtitle: 'Culinary Adventures', emoji: '🍽️', color: 'linear-gradient(135deg, #f7971e, #ffd200)' },
    { name: 'Arts', subtitle: 'Creative Expression', emoji: '🎨', color: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
    { name: 'Sports', subtitle: 'Active Lifestyle', emoji: '⚽', color: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
    { name: 'Business', subtitle: 'Networking & Growth', emoji: '💼', color: 'linear-gradient(135deg, #fa709a, #fee140)' },
  ];

  // Features
  features = [
    {
      title: 'Smart Discovery',
      description: 'AI-powered recommendations that learn your preferences and suggest events you\'ll love.',
      emoji: '✨',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
    },
    {
      title: 'Instant Booking',
      description: 'Secure your spot with one-tap booking and receive instant digital tickets.',
      emoji: '⚡',
      gradient: 'linear-gradient(135deg, #f093fb, #f5576c)'
    },
    {
      title: 'Live Updates',
      description: 'Real-time notifications about event changes, reminders, and exclusive offers.',
      emoji: '🔔',
      gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)'
    },
    {
      title: 'Social Connect',
      description: 'Find friends attending the same events and plan memorable experiences together.',
      emoji: '👥',
      gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)'
    },
    {
      title: 'Secure Payments',
      description: 'Multiple payment options with bank-grade encryption for worry-free transactions.',
      emoji: '🔒',
      gradient: 'linear-gradient(135deg, #fa709a, #fee140)'
    },
    {
      title: 'Easy Refunds',
      description: 'Hassle-free cancellations with quick refunds directly to your payment method.',
      emoji: '↩️',
      gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)'
    }
  ];

  // Testimonials
  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Event Enthusiast',
      avatar: '👩',
      text: 'This platform made discovering local events so easy! I\'ve attended 15 amazing concerts this year alone. The booking process is seamless!',
      event: 'Summer Music Festival'
    },
    {
      name: 'Mike Chen',
      role: 'Tech Professional',
      avatar: '👨‍💻',
      text: 'As someone who attends tech conferences regularly, this is a game-changer. The recommendations are spot-on and I never miss important events.',
      event: 'TechCon 2026'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Food Blogger',
      avatar: '👩‍🍳',
      text: 'Found the most incredible food festivals through this app! The variety of events and the detailed descriptions helped me plan my foodie adventures.',
      event: 'International Food Festival'
    }
  ];

  constructor(
    private router: Router,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.loadFeaturedEvents();
    this.animateStats();
  }

  ngOnDestroy(): void {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }
  }

  loadFeaturedEvents(): void {
    this.eventService.getAllEvents({}).subscribe({
      next: (events) => {
        // Get first 6 events as featured
        this.featuredEvents = events.slice(0, 6).map((event: any) => ({
          ...event,
          image_url: event.image_url || this.getDefaultImage(event.category_name)
        }));
      },
      error: (err) => {
        console.error('Error loading events:', err);
        // Use fallback data
        this.featuredEvents = this.getFallbackEvents();
      }
    });
  }

  getDefaultImage(category?: string): string {
    const images: Record<string, string> = {
      'Technology': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
      'Music': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600',
      'Food & Drink': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
      'Arts & Culture': 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=600',
      'Sports & Fitness': 'https://images.unsplash.com/photo-1461896836934- voices?w=600',
      'Business': 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600',
    };
    return images[category || ''] || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600';
  }

  getFallbackEvents(): Event[] {
    return [
      {
        id: 1,
        name: 'Summer Music Festival 2026',
        description: 'The biggest outdoor music experience',
        venue: 'Greenfield Park',
        date_time: '2026-06-20T18:00:00',
        category_name: 'Music',
        ticket_price: 149.99,
        capacity: 500,
        tickets_booked: 320,
        image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600'
      },
      {
        id: 2,
        name: 'TechCon 2026',
        description: 'Future of technology conference',
        venue: 'Convention Center Hall A',
        date_time: '2026-03-15T09:00:00',
        category_name: 'Technology',
        ticket_price: 299.99,
        capacity: 200,
        tickets_booked: 150,
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600'
      },
      {
        id: 3,
        name: 'International Food Festival',
        description: 'Taste cuisines from around the world',
        venue: 'Downtown Square',
        date_time: '2026-04-05T11:00:00',
        category_name: 'Food & Drink',
        ticket_price: 25,
        capacity: 1000,
        tickets_booked: 650,
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600'
      }
    ];
  }

  animateStats(): void {
    const duration = 2000;
    const steps = 50;
    const stepDuration = duration / steps;
    let currentStep = 0;

    this.statsInterval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      this.animatedStats.events = Math.floor(this.targetStats.events * progress);
      this.animatedStats.users = Math.floor(this.targetStats.users * progress);
      this.animatedStats.cities = Math.floor(this.targetStats.cities * progress);

      if (currentStep >= steps) {
        clearInterval(this.statsInterval);
        this.animatedStats = { ...this.targetStats };
      }
    }, stepDuration);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getCategoryIcon(icon: string): string {
    const iconMap: Record<string, string> = {
      'computer': 'devices',
      'business': 'work',
      'theaters': 'theater_comedy',
      'groups': 'group',
    };
    return iconMap[icon] || icon;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  goToEvents(): void {
    this.router.navigate(['/events']);
  }

  viewEvent(event: Event): void {
    // Navigate to public event page (no login required)
    this.router.navigate(['/event', event.id]);
  }

  filterByCategory(category: any): void {
    // Navigate to events page with category filter
    this.router.navigate(['/events'], { queryParams: { category: category.name } });
  }
}
