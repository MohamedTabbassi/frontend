import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: any[] = [];
  loading = true;
  error: string | null = null;
  userRole: string | null = null;
  
  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.userRole = this.authService.currentUserValue?.role || null;
    this.loadBookings();
  }
  
  loadBookings(): void {
    this.loading = true;
    
    this.bookingService.getBookings().subscribe({
      next: (response) => {
        this.bookings = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load bookings';
        this.loading = false;
        console.error('Error loading bookings:', error);
      }
    });
  }
  
  updateBookingStatus(bookingId: string, status: string): void {
    this.bookingService.updateBookingStatus(bookingId, status).subscribe({
      next: () => {
        // Update the booking status in the local array
        const index = this.bookings.findIndex(b => b._id === bookingId);
        if (index !== -1) {
          this.bookings[index].status = status;
        }
      },
      error: (error) => {
        console.error('Error updating booking status:', error);
      }
    });
  }
  
  cancelBooking(bookingId: string): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) {
      this.updateBookingStatus(bookingId, 'CANCELLED');
    }
  }
  
  acceptBooking(bookingId: string): void {
    this.updateBookingStatus(bookingId, 'ACCEPTED');
  }
  
  rejectBooking(bookingId: string): void {
    if (confirm('Êtes-vous sûr de vouloir rejeter cette réservation?')) {
      this.updateBookingStatus(bookingId, 'REJECTED');
    }
  }
  
  completeBooking(bookingId: string): void {
    this.updateBookingStatus(bookingId, 'COMPLETED');
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
  
  isServiceProvider(): boolean {
    return this.userRole === UserRole.SERVICE_USER;
  }
  
  isClient(): boolean {
    return this.userRole === UserRole.CLIENT;
  }
  
  isAdmin(): boolean {
    return this.userRole === UserRole.ADMIN;
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