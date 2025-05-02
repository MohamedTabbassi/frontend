import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// Import for currency pipe
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// Register locale data
registerLocaleData(localeFr);

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withFetch()
    ),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'fr-FR' } // Set locale for currency pipe
  ]
};