import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Check if user is logged in
  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
  // Check if route has data.roles specified
  const allowedRoles = route.data?.['roles'] as string[];
  if (!allowedRoles || allowedRoles.length === 0) {
    return true; // No specific roles required
  }
  
  // Check if user has one of the required roles
  const currentUser = authService.currentUserValue;
  if (currentUser && allowedRoles.includes(currentUser.role)) {
    return true;
  }
  
  // User doesn't have the required role
  router.navigate(['/dashboard']);
  return false;
};