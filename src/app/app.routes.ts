import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

// Import your components here
import { HomeComponent } from './components/home/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { ServiceListComponent } from './components/services/service-list/service-list.component';
import { ServiceDetailComponent } from './components/services/service-detail/service-detail.component';
import { BookingListComponent } from './components/bookings/booking-list/booking-list.component';
import { MobileMechanicComponent } from './components/services/mobile-mechanic/mobile-mechanic.component';
import { ServiceProviderDashboardComponent } from './components/dashboard/service-provider-dashboard/service-provider-dashboard.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';

// Import your service category components
import { RemorquageComponent } from './components/services/remorquage/remorquage.component';
import { MecaniqueComponent } from './components/services/mecanique/mecanique.component';
import { PieceAutoComponent } from './components/services/piece-auto/piece-auto.component';
import { LocationComponent } from './components/services/location/location.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'services', component: ServiceListComponent },
  { path: 'services/:id', component: ServiceDetailComponent },
  
  // Service category routes
  { path: 'remorquage', component: RemorquageComponent },
  { path: 'mecanique', component: MecaniqueComponent },
  { path: "services/mobile-mechanic", component: MobileMechanicComponent },
  { path: 'piece-auto', component: PieceAutoComponent },
  { path: 'location', component: LocationComponent },
  
  // Protected routes
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'bookings', 
    component: BookingListComponent, 
    canActivate: [AuthGuard] 
  },
  
  // Service provider routes
  { 
    path: 'service-provider', 
    component: ServiceProviderDashboardComponent, 
    canActivate: [roleGuard],
    data: { roles: ['SERVICE_USER', 'ADMIN'] }
  },
  
  // Admin routes
  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] }
  },
  
  // Wildcard route for 404
  { path: '**', redirectTo: '' }
];