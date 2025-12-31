import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketBookingComponent } from './ticket-booking.component';

describe('TicketBookingComponent', () => {
  let component: TicketBookingComponent;
  let fixture: ComponentFixture<TicketBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
