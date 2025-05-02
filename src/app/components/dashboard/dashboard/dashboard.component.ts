import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BookingService } from '../../../services/booking.service';
import { ServiceService } from '../../../services/service.service';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userRole: string | null = null;
  userName: string = '';
  bookings: any[] = [];
  services: any[] = [];
  recentBookings: any[] = [];
  loading = {
    bookings: true,
    services: true
  };
  stats = {
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalServices: 0
  };
  
  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private serviceService: ServiceService
  ) {}
  
  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    this.userRole = currentUser?.role || null;
    this.userName = currentUser?.name || 'Utilisateur';
    
    this.loadData();
  }
  
  loadData(): void {
    // Load bookings
    this.bookingService.getBookings().subscribe({
      next: (response) => {
        this.bookings = response.data;
        this.recentBookings = this.bookings.slice(0, 5);
        this.stats.totalBookings = this.bookings.length;
        this.stats.pendingBookings = this.bookings.filter(b => b.status === 'PENDING').length;
        this.stats.completedBookings = this.bookings.filter(b => b.status === 'COMPLETED').length;
        this.loading.bookings = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.loading.bookings = false;
      }
    });
    
    // Load services if service provider
    if (this.isServiceProvider()) {
      this.serviceService.getMyServices().subscribe({
        next: (response) => {
          this.services = response.data;
          this.stats.totalServices = this.services.length;
          this.loading.services = false;
        },
        error: (error) => {
          console.error('Error loading services:', error);
          this.loading.services = false;
        }
      });
    } else {
      this.loading.services = false;
    }
  }
  
  isAdmin(): boolean {
    return this.userRole === UserRole.ADMIN;
  }
  
  isClient(): boolean {
    return this.userRole === UserRole.CLIENT;
  }
  
  isServiceProvider(): boolean {
    return this.userRole === UserRole.SERVICE_USER;
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-warning';
      case 'ACCEPTED':
        return 'bg-success';
      case 'REJECTED':
        return 'bg-danger';
      case 'CANCELLED':
        return 'bg-secondary';
      case 'COMPLETED':
        return 'bg-info';
      default:
        return 'bg-primary';
    }
  }
  
  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'ACCEPTED':
        return 'Acceptée';
      case 'REJECTED':
        return 'Rejetée';
      case 'CANCELLED':
        return 'Annulée';
      case 'COMPLETED':
        return 'Terminée';
      default:
        return status;
    }
  }
}