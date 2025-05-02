import { Component, OnInit } from '@angular/core';
import { CommonModule,CurrencyPipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../../services/service.service';
import { AuthService } from '../../../services/auth.service';
import { Service, ServiceCategory } from '../../../models/service.model';
import { BookingFormComponent } from '../../bookings/booking-form/booking-form.component';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BookingFormComponent,CurrencyPipe],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  serviceId: string | null = null;
  service: Service | null = null;
  loading = true;
  error: string | null = null;
  showBookingForm = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    if (!this.serviceId) {
      this.error = 'Service ID not found';
      this.loading = false;
      return;
    }
    
    this.loadService();
  }
  
  loadService(): void {
    this.serviceService.getServiceById(this.serviceId!).subscribe({
      next: (service) => {
        this.service = service;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load service details';
        this.loading = false;
        console.error('Error loading service:', error);
        setTimeout(() => this.router.navigate(['/services']), 3000);
      }
    });
  }
  
  getCategoryName(category: ServiceCategory): string {
    switch (category) {
      case ServiceCategory.REMORQUAGE:
        return 'Remorquage';
      case ServiceCategory.MECANIQUE:
        return 'Mécanique';
      case ServiceCategory.PIECE_AUTO:
        return 'Pièces Auto';
      case ServiceCategory.LOCATION_VOITURE:
        return 'Location de Voiture';
      default:
        return category;
    }
  }
  
  toggleBookingForm(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: `/services/${this.serviceId}` } 
      });
      return;
    }
    
    this.showBookingForm = !this.showBookingForm;
  }
  
  isOwner(): boolean {
    return this.authService.currentUserValue?._id === this.service?.userId;
  }
}