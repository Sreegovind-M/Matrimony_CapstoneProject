import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { attendeeGuard } from './attendee.guard';

describe('attendeeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => attendeeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
