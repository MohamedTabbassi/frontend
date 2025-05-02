import { CanActivateFn } from '@angular/router';

export const serviceUserGuard: CanActivateFn = (route, state) => {
  return true;
};
