import { CanActivateFn } from '@angular/router';

export const organizerGuard: CanActivateFn = (route, state) => {
  return true;
};
