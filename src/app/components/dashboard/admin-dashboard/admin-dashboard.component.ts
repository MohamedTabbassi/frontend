import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { ServiceService } from '../../../services/service.service';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  providers :[AdminService]
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  services: any[] = [];
  bookings: any[] = [];
  loading = {
    users: true,
    services: true,
    bookings: true
  };
  error = {
    users: null as string | null,
    services: null as string | null,
    bookings: null as string | null
  };
  stats = {
    totalUsers: 0,
    clientUsers: 0,
    serviceUsers: 0,
    totalServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    revenue: 0
  };
  
  constructor(
    private adminService: AdminService,
    private serviceService: ServiceService,
    private bookingService: BookingService
  ) {}
  
  ngOnInit(): void {
    this.loadUsers();
    this.loadServices();
    this.loadBookings();
  }
  
  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data;
        this.stats.totalUsers = this.users.length;
        this.stats.clientUsers = this.users.filter(u => u.role === 'CLIENT').length;
        this.stats.serviceUsers = this.users.filter(u => u.role === 'SERVICE_USER').length;
        this.loading.users = false;
      },
      error: (error) => {
        this.error.users = 'Failed to load users';
        this.loading.users = false;
        console.error('Error loading users:', error);
      }
    });
  }
  
  loadServices(): void {
    this.serviceService.getServices({ limit: 100 }).subscribe({
      next: (response) => {
        this.services = response.data;
        this.stats.totalServices = response.count;
        this.loading.services = false;
      },
      error: (error) => {
        this.error.services = 'Failed to load services';
        this.loading.services = false;
        console.error('Error loading services:', error);
      }
    });
  }
  
  loadBookings(): void {
    this.bookingService.getAllBookings().subscribe({
      next: (response) => {
        this.bookings = response.data;
        this.stats.totalBookings = response.count;
        this.stats.pendingBookings = this.bookings.filter(b => b.status === 'PENDING').length;
        
        // Calculate revenue from completed bookings
        this.stats.revenue = this.bookings
          .filter(b => b.status === 'COMPLETED')
          .reduce((total, booking) => total + booking.serviceId.price, 0);
        
        this.loading.bookings = false;
      },
      error: (error) => {
        this.error.bookings = 'Failed to load bookings';
        this.loading.bookings = false;
        console.error('Error loading bookings:', error);
      }
    });
  }
  
  toggleUserStatus(userId: string, currentStatus: boolean): void {
    this.adminService.updateUserStatus(userId, !currentStatus).subscribe({
      next: () => {
        // Update the user in the local array
        const index = this.users.findIndex(u => u._id === userId);
        if (index !== -1) {
          this.users[index].active = !currentStatus;
        }
      },
      error: (error) => {
        console.error('Error updating user status:', error);
      }
    });
  }
  
  deleteUser(userId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur? Cette action est irréversible.')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          // Remove the user from the local array
          this.users = this.users.filter(u => u._id !== userId);
          
          // Update stats
          this.stats.totalUsers = this.users.length;
          this.stats.clientUsers = this.users.filter(u => u.role === 'CLIENT').length;
          this.stats.serviceUsers = this.users.filter(u => u.role === 'SERVICE_USER').length;
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }
  
  getRoleName(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'Administrateur';
      case 'CLIENT':
        return 'Client';
      case 'SERVICE_USER':
        return 'Prestataire';
      default:
        return role;
    }
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}