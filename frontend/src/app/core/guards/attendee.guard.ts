import { CanActivateFn } from '@angular/router';

export const attendeeGuard: CanActivateFn = (route, state) => {
  return true;
};
