import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { EventService } from '../../../core/services/event.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-payment',
    standalone: true,
    imports: [CommonModule, FormsModule, NavbarComponent],
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
    eventId!: number;
    tickets!: number;
    event: any = null;

    isLoading = true;
    isProcessing = false;
    hasError = false;
    errorMessage = '';

    // Payment form fields
    cardNumber = '';
    cardName = '';
    expiryDate = '';
    cvv = '';
    selectedPaymentMethod = 'card';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private eventService: EventService,
        private bookingService: BookingService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.eventId = Number(this.route.snapshot.queryParamMap.get('eventId'));
        this.tickets = Number(this.route.snapshot.queryParamMap.get('tickets')) || 1;
        this.loadEventDetails();
    }

    loadEventDetails(): void {
        this.isLoading = true;
        this.eventService.getEventById(this.eventId).subscribe({
            next: (event) => {
                this.event = event;
                this.isLoading = false;
            },
            error: () => {
                this.hasError = true;
                this.isLoading = false;
            }
        });
    }

    get totalAmount(): number {
        if (!this.event) return 0;
        return this.event.ticket_price * this.tickets;
    }

    get serviceFee(): number {
        return this.totalAmount * 0.03; // 3% service fee
    }

    get grandTotal(): number {
        return this.totalAmount + this.serviceFee;
    }

    selectPaymentMethod(method: string): void {
        this.selectedPaymentMethod = method;
    }

    formatCardNumber(event: any): void {
        let value = event.target.value.replace(/\s/g, '').replace(/\D/g, '');
        value = value.substring(0, 16);
        const parts = value.match(/.{1,4}/g);
        this.cardNumber = parts ? parts.join(' ') : '';
    }

    formatExpiryDate(event: any): void {
        let value = event.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        this.expiryDate = value;
    }

    processPayment(): void {
        // Validate form
        if (this.selectedPaymentMethod === 'card') {
            if (!this.cardNumber || !this.cardName || !this.expiryDate || !this.cvv) {
                this.errorMessage = 'Please fill in all card details';
                return;
            }
        }

        this.isProcessing = true;
        this.errorMessage = '';

        // Get current user ID
        const user = this.authService.getCurrentUser();
        const attendeeId = user?.id || 1;

        // Simulate payment processing delay
        setTimeout(() => {
            // Create booking after "payment"
            this.bookingService.bookTickets({
                eventId: this.eventId,
                seats: this.tickets,
                attendee_id: attendeeId
            } as any).subscribe({
                next: (booking) => {
                    this.isProcessing = false;
                    if (booking && booking.id) {
                        this.router.navigate(['/booking-confirmation', booking.id]);
                    } else {
                        this.errorMessage = 'Booking failed. Please try again.';
                    }
                },
                error: (err) => {
                    this.isProcessing = false;
                    this.errorMessage = 'Payment failed. Please try again.';
                    console.error('Booking error:', err);
                }
            });
        }, 2000); // 2 second delay to simulate payment processing
    }

    goBack(): void {
        this.router.navigate(['/events', this.eventId]);
    }
}
