import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ServiceListComponent } from './components/services/service-list/service-list.component';
import { ServiceDetailComponent } from './components/services/service-detail/service-detail.component';
import { BookingListComponent } from './components/bookings/booking-list/booking-list.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { ServiceProviderDashboardComponent } from './components/dashboard/service-provider-dashboard/service-provider-dashboard.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { RemorquageComponent } from './components/services/remorquage/remorquage.component';
import { MecaniqueComponent } from './components/services/mecanique/mecanique.component';
import { PieceAutoComponent } from './components/services/piece-auto/piece-auto.component';
import { LocationComponent } from './components/services/location/location.component';

import { AuthGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { UserRole } from './models/user.model';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'services', component: ServiceListComponent },
  { path: 'services/:id', component: ServiceDetailComponent },
  { path: 'services/remorquage', component: RemorquageComponent },
  { path: 'services/mecanique', component: MecaniqueComponent },
  { path: 'services/piece-auto', component: PieceAutoComponent },
  { path: 'services/location', component: LocationComponent },

  { path: 'bookings', component: BookingListComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { 
    path: 'service-provider', 
    component: ServiceProviderDashboardComponent, 
    canActivate: [AuthGuard, roleGuard], 
    data: { roles: [UserRole.SERVICE_USER] } 
  },
  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [AuthGuard, roleGuard], 
    data: { roles: [UserRole.ADMIN] } 
  },

  { path: '**', redirectTo: '' }
];
