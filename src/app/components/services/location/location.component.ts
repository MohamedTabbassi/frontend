import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { ServiceService } from "../../../services/service.service"
import { RentalCar, RentalCarFilter } from "../../../models/rental-car.service"
import { MockDataService } from '../../../services/mock-data.service';
@Component({
  selector: "app-location",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./location.component.html",
  styleUrls: ["./location.component.css"],
})
export class LocationComponent implements OnInit {
  rentalCars: RentalCar[] = [];
  filteredCars: RentalCar[] = [];

  rentalVehicles: any[] = []
  loading = true
  error: string | null = null

  // For rental search
  searchParams = {
    startDate: "",
    endDate: "",
    vehicleType: "",
    location: "",
  }
   // Filter options
   categories: string[] = ['Compact', 'Sedan', 'SUV', 'Luxury', 'Van', 'Truck'];
   
 
 // Filter values
 filters: RentalCarFilter= {
  available: true
};

 // Sorting
 sortOption: string = 'price-asc';

  // Vehicle types
  vehicleTypes = [
    { id: "economy", name: "Économique" },
    { id: "compact", name: "Compacte" },
    { id: "sedan", name: "Berline" },
    { id: "suv", name: "SUV" },
    { id: "luxury", name: "Luxe" },
    { id: "van", name: "Utilitaire" },
  ]

  // Locations
  locations = [
    { id: "paris", name: "Paris" },
    { id: "lyon", name: "Lyon" },
    { id: "marseille", name: "Marseille" },
    { id: "toulouse", name: "Toulouse" },
    { id: "nice", name: "Nice" },
  ]

  // Selected vehicle for booking
  selectedVehicle: any = null

  constructor(private serviceService: ServiceService  ,  private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.loadRentalVehicles()
  }

  loadRentalVehicles(): void {
    this.loading = true
    this.serviceService.getServicesByCategory("location").subscribe({
      next: (vehicles) => {
        this.rentalVehicles = vehicles
        this.loading = false
      },
      error: (err) => {
        this.error = "Impossible de charger les véhicules de location"
        this.loading = false
        console.error(err)
      },
    })
  }

  searchVehicles(): void {
    // Validate dates
    if (!this.searchParams.startDate || !this.searchParams.endDate) {
      alert("Veuillez sélectionner les dates de début et de fin de location")
      return
    }

    const startDate = new Date(this.searchParams.startDate)
    const endDate = new Date(this.searchParams.endDate)

    if (startDate >= endDate) {
      alert("La date de fin doit être postérieure à la date de début")
      return
    }

    this.loading = true
    // In a real app, you would send these parameters to the backend
    this.serviceService.searchRentalVehicles(this.searchParams).subscribe({
      next: (vehicles) => {
        this.rentalVehicles = vehicles
        this.loading = false
      },
      error: (err) => {
        this.error = "Erreur lors de la recherche de véhicules"
        this.loading = false
        console.error(err)
      },
    })
  }

  selectVehicle(vehicle: any): void {
    this.selectedVehicle = vehicle
  }

  calculateTotalPrice(vehicle: any): number {
    if (!this.searchParams.startDate || !this.searchParams.endDate) {
      return vehicle.pricePerDay
    }

    const startDate = new Date(this.searchParams.startDate)
    const endDate = new Date(this.searchParams.endDate)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    return vehicle.pricePerDay * Math.max(1, days)
  }

  bookVehicle(): void {
    if (!this.selectedVehicle) {
      return
    }

    if (!this.searchParams.startDate || !this.searchParams.endDate) {
      alert("Veuillez sélectionner les dates de location")
      return
    }

    // Here you would implement the API call to book the vehicle
    alert(`Réservation du véhicule ${this.selectedVehicle.name} confirmée!`)
    console.log("Booking details:", {
      vehicle: this.selectedVehicle,
      ...this.searchParams,
    })

    // Reset selection
    this.selectedVehicle = null
  }

  loadRentalCars(): void {
    this.loading = true;
    this.serviceService.getRentalCars().subscribe({
      next: (response) => {
        this.rentalCars = response.data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load rental cars';
        this.loading = false;
        console.error('Error loading rental cars:', error);
      }
    });

    setTimeout(() => {
      try {
        this.rentalCars = this.mockDataService.getRentalCars();
        this.applyFilters();
        this.loading = false;
      } catch (error) {
        this.error = 'Failed to load rental cars';
        this.loading = false;
        console.error('Error loading rental cars:', error);
      }
    }, 1000);
  }
  
  applyFilters(): void {
    this.filteredCars = this.rentalCars.filter(car => {
      // Filter by availability
      if (this.filters.available !== undefined && car.available !== this.filters.available) {
        return false;
      }
      
      // Filter by category
      if (this.filters.category && car.category !== this.filters.category) {
        return false;
      }
      
      // Filter by price range
      if (this.filters.priceMin && car.price < this.filters.priceMin) {
        return false;
      }
      if (this.filters.priceMax && car.price > this.filters.priceMax) {
        return false;
      }
      
      // Filter by transmission
      if (this.filters.transmission && car.transmission !== this.filters.transmission) {
        return false;
      }
      
      // Filter by seats
      if (this.filters.seats && car.seats < this.filters.seats) {
        return false;
      }
      
      // Filter by location
      if (this.filters.location && car.location !== this.filters.location) {
        return false;
      }
      
      // Filter by search term
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        return (
          car.make.toLowerCase().includes(searchTerm) ||
          car.model.toLowerCase().includes(searchTerm) ||
          car.description.toLowerCase().includes(searchTerm)
        );
      }
      
      return true;
    });
    
    // Apply sorting
    this.sortCars();
  }
  
  sortCars(): void {
    switch (this.sortOption) {
      case 'price-asc':
        this.filteredCars.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredCars.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        this.filteredCars.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        this.filteredCars.sort((a, b) => b.year - a.year);
        break;
    }
  }
  
  resetFilters(): void {
    this.filters = {
      available: true
    };
    this.applyFilters();
  }
  
  onSortChange(): void {
    this.sortCars();
  }
  
  onFilterChange(): void {
    this.applyFilters();
  }
  
  getMainImage(car: RentalCar): string {
    return `https://via.placeholder.com/400x250/007bff/ffffff?text=${car.make}+${car.model}`;
    return car.images && car.images.length > 0 
      ? car.images[0] 
      : '/assets/images/car-placeholder.jpg';
  }
  
  
  formatPrice(price: number, unit: string): string {
    return `${price.toLocaleString('fr-FR')} DH/${unit === 'day' ? 'jour' : unit === 'week' ? 'semaine' : 'mois'}`;
  }




  
}





  

