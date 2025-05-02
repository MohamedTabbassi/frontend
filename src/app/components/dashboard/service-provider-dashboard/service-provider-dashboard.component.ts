import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceService } from '../../../services/service.service';
import { BookingService } from '../../../services/booking.service';
import { Service } from '../../../models/service.model';

@Component({
  selector: 'app-service-provider-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './service-provider-dashboard.component.html',
  styleUrls: ['./service-provider-dashboard.component.css']
})
export class ServiceProviderDashboardComponent implements OnInit {
  services: Service[] = [];
  bookings: any[] = [];
  loading = {
    services: true,
    bookings: true
  };
  error = {
    services: null as string | null,
    bookings: null as string | null
  };
  stats = {
    totalServices: 0,
    activeServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    acceptedBookings: 0,
    completedBookings: 0,
    revenue: 0
  };
  
  constructor(
    private serviceService: ServiceService,
    private bookingService: BookingService
  ) {}
  
  ngOnInit(): void {
    this.loadServices();
    this.loadBookings();
  }
  
  loadServices(): void {
    this.serviceService.getMyServices().subscribe({
      next: (response) => {
        this.services = response.data;
        this.stats.totalServices = this.services.length;
        this.stats.activeServices = this.services.filter(s => s.available).length;
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
    this.bookingService.getBookings().subscribe({
      next: (response) => {
        this.bookings = response.data;
        this.stats.totalBookings = this.bookings.length;
        this.stats.pendingBookings = this.bookings.filter(b => b.status === 'PENDING').length;
        this.stats.acceptedBookings = this.bookings.filter(b => b.status === 'ACCEPTED').length;
        this.stats.completedBookings = this.bookings.filter(b => b.status === 'COMPLETED').length;
        
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
  
  toggleServiceAvailability(serviceId: string, currentStatus: boolean): void {
    this.serviceService.updateServiceAvailability(serviceId, !currentStatus).subscribe({
      next: () => {
        // Update the service in the local array
        const index = this.services.findIndex(s => s._id === serviceId);
        if (index !== -1) {
          this.services[index].available = !currentStatus;
          
          // Update stats
          this.stats.activeServices = this.services.filter(s => s.available).length;
        }
      },
      error: (error) => {
        console.error('Error updating service availability:', error);
      }
    });
  }
  
  deleteService(serviceId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service? Cette action est irréversible.')) {
      this.serviceService.deleteService(serviceId).subscribe({
        next: () => {
          // Remove the service from the local array
          this.services = this.services.filter(s => s._id !== serviceId);
          
          // Update stats
          this.stats.totalServices = this.services.length;
          this.stats.activeServices = this.services.filter(s => s.available).length;
        },
        error: (error) => {
          console.error('Error deleting service:', error);
        }
      });
    }
  }
  
  getCategoryName(category: string): string {
    switch (category) {
      case 'REMORQUAGE':
        return 'Remorquage';
      case 'MECANIQUE':
        return 'Mécanique';
      case 'PIECE_AUTO':
        return 'Pièces Auto';
      case 'LOCATION_VOITURE':
        return 'Location de Voiture';
      default:
        return category;
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