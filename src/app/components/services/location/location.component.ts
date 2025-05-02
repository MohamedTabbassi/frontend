import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { ServiceService } from "../../../services/service.service"

@Component({
  selector: "app-location",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./location.component.html",
  styleUrls: ["./location.component.css"],
})
export class LocationComponent implements OnInit {
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

  constructor(private serviceService: ServiceService) {}

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
}
