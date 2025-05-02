import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Service, ServiceCategory } from '../../../models/service.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css']
})
export class ServiceCardComponent {
  @Input() service!: Service;

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

  getCategoryIcon(category: ServiceCategory): string {
    switch (category) {
      case ServiceCategory.REMORQUAGE:
        return 'bi-truck';
      case ServiceCategory.MECANIQUE:
        return 'bi-tools';
      case ServiceCategory.PIECE_AUTO:
        return 'bi-box-seam';
      case ServiceCategory.LOCATION_VOITURE:
        return 'bi-car-front';
      default:
        return 'bi-question-circle';
    }
  }
}