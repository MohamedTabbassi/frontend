import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { HttpErrorResponse } from "@angular/common/http"
import  { ServiceService } from "../../../services/service.service"

@Component({
  selector: "app-location",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./location.component.html",
  styleUrls: ["./location.component.css"],
})
export class LocationComponent implements OnInit {
  rentalVehicles: any[] = []
  filteredVehicles: any[] = []
  loading = false
  error: string | null = null
  differentReturnLocation = false
  activeTab = 'cars'; // 'cars', 'prices', 'agencies', 'strengths', 'transfer'

  // For rental search
  searchParams = {
    startDate: "",
    endDate: "",
    startTime: "10:00",
    endTime: "10:00",
    vehicleType: "",
    location: "",
    returnLocation: "",
  }

  // Filter options
  filterCategory = ""
  filterTransmission = ""
  filterSeats = ""
  filterFuel = ""

  // Locations
  locations = [
    { id: "tunis", name: "Aéroport Tunis Carthage" },
    { id: "carthage", name: "Tunis Centre" },
    { id: "sousse", name: "Sousse" },
    { id: "monastir", name: "Aéroport Monastir" },
    { id: "djerba", name: "Djerba" },
    { id: "enfidha", name: "Aéroport Enfidha" },
    { id: "hammamet", name: "Hammamet" },
    { id: "tozeur", name: "Tozeur" },
    { id: "tabarka", name: "Tabarka" },
  ]

  // Selected vehicle for booking
  selectedVehicle: any = null

  // Booking options
  bookingOptions = {
    insurance: false,
    gps: false,
    childSeat: false,
    additionalDriver: false,
  }

  // Price table for different car models
  priceTable = [
    { class: "A", model: "Hyundai i10", price3Days: 22, price1Week: 20 },
    { class: "A", model: "Skoda Fabia", price3Days: 22, price1Week: 20 },
    { class: "A", model: "Renault CLIO Symbole (AC)", price3Days: 22, price1Week: 20 },
    { class: "B", model: "Seat Ibiza (AC) Tunisie", price3Days: 25, price1Week: 22 },
    { class: "B", model: "Suzuki swift BVA", price3Days: 25, price1Week: 22 },
    { class: "B", model: "Volkswagen POLO (AC) Tunisie", price3Days: 25, price1Week: 22 },
    { class: "B", model: "Citroen C3 (AC) Tunisie", price3Days: 25, price1Week: 22 },
    { class: "B", model: "Fiat Grande PUNTO (AC) Tunisie", price3Days: 22, price1Week: 20 },
    { class: "B", model: "Ford Fiesta (AC) Tunisie", price3Days: 25, price1Week: 22 },
    { class: "B", model: "Peugeot 301 Tunisie", price3Days: 20, price1Week: 18 },
    { class: "D", model: "Renault KANGOO (AC) Tunisie", price3Days: 30, price1Week: 25 },
    { class: "C", model: "Renault MEGANE (AC) Tunisie", price3Days: 28, price1Week: 28 },
    { class: "C", model: "Ford Eco Sport", price3Days: 29, price1Week: 29 },
    { class: "C", model: "Volkswagen GOLF", price3Days: 32, price1Week: 32 },
    { class: "F", model: "Skoda Octavia Tunisie", price3Days: 40, price1Week: 35 },
    { class: "F", model: "BMW serie 3", price3Days: 100, price1Week: 80 },
  ]

  // Agencies information
  agencies = [
    {
      name: "Agence aéroport Tunis",
      description: "Vous êtes à la recherche d'une location voiture à l'aéroport de Tunis. Tunisia Rent Car vous livre le véhicule à votre arrivée. Notre agent vous attendra même en cas de retard d'avion.",
      phone: "00216 50 222 151 (24 H / 24 H 7 J / 7 J)",
      email: "reservation@tunisia-rent-car.com"
    },
    {
      name: "Agence aéroport Monastir",
      description: "Vous êtes à la recherche d'une location voiture à l'aéroport de Monastir. Tunisia Rent Car vous livre le véhicule à votre arrivée. Notre agent vous attendra même en cas de retard d'avion.",
      phone: "00216 50 222 151 (24 H / 24 H 7 J / 7 J)",
      email: "reservation@tunisia-rent-car.com"
    },
    {
      name: "Agence aéroport Enfidha",
      description: "Vous êtes à la recherche d'une location voiture à l'aéroport d'Enfidha. Tunisia Rent Car vous livre le véhicule à votre arrivée. Notre agent vous attendra même en cas de retard d'avion.",
      phone: "00216 50 222 151 (24 H / 24 H 7 J / 7 J)",
      email: "reservation@tunisia-rent-car.com"
    }
  ]

  // Strength points
  strengthPoints = [
    { title: "Transfert Aéroport", description: "Nous vous accueillons à l'aéroport et livrons votre véhicule sur place." },
    { title: "Prix Compétitifs", description: "Nous offrons les meilleurs tarifs de location de voitures en Tunisie." },
    { title: "Véhicules Récents", description: "Notre flotte est composée de véhicules récents et bien entretenus." },
    { title: "Service 24/7", description: "Notre service client est disponible 24h/24 et 7j/7." },
    { title: "Kilométrage Illimité", description: "Tous nos forfaits incluent le kilométrage illimité." },
    { title: "Assurance Complète", description: "Tous nos véhicules sont entièrement assurés." }
  ]

  // Mock data for when service fails
  mockVehicles = [
    {
      id: 1,
      name: "Fiat Panda",
      category: "economy",
      class: "A",
      seats: 4,
      transmission: "Manuelle",
      fuelType: "Essence",
      pricePerDay: 20,
      features: ["Climatisation", "Radio"],
      imageUrl: "https://via.placeholder.com/300x200/ffffff/333333?text=Fiat+Panda",
      isNew: false,
      hasAC: true,
      luggage: 2,
    },
    {
      id: 2,
      name: "Renault Clio",
      category: "economy",
      class: "A",
      seats: 5,
      transmission: "Manuelle",
      fuelType: "Diesel",
      pricePerDay: 22,
      features: ["Climatisation", "Radio", "Bluetooth"],
      imageUrl: "https://via.placeholder.com/300x200/ffffff/333333?text=Renault+Clio",
      isNew: true,
      hasAC: true,
      luggage: 3,
    },
    {
      id: 3,
      name: "Volkswagen Polo",
      category: "compact",
      class: "B",
      seats: 5,
      transmission: "Manuelle",
      fuelType: "Essence",
      pricePerDay: 25,
      features: ["Climatisation", "Radio", "Bluetooth", "USB"],
      imageUrl: "https://via.placeholder.com/300x200/ffffff/333333?text=Volkswagen+Polo",
      isNew: false,
      hasAC: true,
      luggage: 3,
    },
    {
      id: 4,
      name: "Hyundai i10 BVA",
      category: "economy",
      class: "A",
      seats: 4,
      transmission: "Automatique",
      fuelType: "Essence",
      pricePerDay: 22,
      features: ["Climatisation", "Radio", "Bluetooth"],
      imageUrl: "https://via.placeholder.com/300x200/ffffff/333333?text=Hyundai+i10",
      isNew: true,
      hasAC: true,
      luggage: 2,
    },
    {
      id: 5,
      name: "Peugeot 301",
      category: "sedan",
      class: "B",
      seats: 5,
      transmission: "Manuelle",
      fuelType: "Diesel",
      pricePerDay: 20,
      features: ["Climatisation", "Radio", "Bluetooth", "USB"],
      imageUrl: "https://via.placeholder.com/300x200/ffffff/333333?text=Peugeot+301",
      isNew: false,
      hasAC: true,
      luggage: 4,
    },
    {
      id: 6,
      name: "Volkswagen Golf",
      category: "compact",
      class: "C",
      seats: 5,
      transmission: "Manuelle",
      fuelType: "Diesel",
      pricePerDay: 32,
      features: ["Climatisation", "Radio", "Bluetooth", "USB", "GPS"],
      imageUrl: "https://via.placeholder.com/300x200/ffffff/333333?text=Volkswagen+Golf",
      isNew: true,
      hasAC: true,
      luggage: 3,
    },
  ]

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    // Set default dates (today and tomorrow)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    this.searchParams.startDate = this.formatDate(today)
    this.searchParams.endDate = this.formatDate(tomorrow)

    this.loadRentalVehicles()
  }

  formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  loadRentalVehicles(): void {
    this.loading = true
    this.error = null

    try {
      this.serviceService.getServicesByCategory("location").subscribe({
        next: (vehicles) => {
          if (vehicles && vehicles.length > 0) {
            // Add additional properties to match Tunisia Rent Car
            this.rentalVehicles = vehicles.map((vehicle: any, index: number) => ({
              ...vehicle,
              isNew: index % 3 === 0, // Mark some vehicles as new
              hasAC: true,
              luggage: Math.floor(Math.random() * 3) + 2, // Random luggage capacity between 2-4
            }))
          } else {
            // If no vehicles returned, use mock data
            this.rentalVehicles = [...this.mockVehicles]
          }

          this.filteredVehicles = [...this.rentalVehicles]
          this.loading = false
        },
        error: (err: HttpErrorResponse) => {
          console.error("Error loading vehicles:", err)
          // Use mock data when service fails
          this.rentalVehicles = [...this.mockVehicles]
          this.filteredVehicles = [...this.mockVehicles]
          this.loading = false
          // Don't set error message since we're providing mock data
        },
      })
    } catch (err) {
      console.error("Exception in loadRentalVehicles:", err)
      // Use mock data when service fails
      this.rentalVehicles = [...this.mockVehicles]
      this.filteredVehicles = [...this.mockVehicles]
      this.loading = false
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
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
    this.error = null

    try {
      // In a real app, you would send these parameters to the backend
      this.serviceService.searchRentalVehicles(this.searchParams).subscribe({
        next: (vehicles) => {
          if (vehicles && vehicles.length > 0) {
            // Add additional properties to match Tunisia Rent Car
            this.rentalVehicles = vehicles.map((vehicle: any, index: number) => ({
              ...vehicle,
              isNew: index % 3 === 0, // Mark some vehicles as new
              hasAC: true,
              luggage: Math.floor(Math.random() * 3) + 2, // Random luggage capacity between 2-4
            }))
          } else {
            // If no vehicles returned, use mock data
            this.rentalVehicles = [...this.mockVehicles]
          }

          this.filteredVehicles = [...this.rentalVehicles]
          this.applyFilters()
          this.loading = false
          this.activeTab = 'cars'; // Switch to cars tab after search
        },
        error: (err: HttpErrorResponse) => {
          console.error("Error searching vehicles:", err)
          // Use mock data when service fails
          this.rentalVehicles = [...this.mockVehicles]
          this.filteredVehicles = [...this.mockVehicles]
          this.applyFilters()
          this.loading = false
          this.activeTab = 'cars'; // Switch to cars tab after search
        },
      })
    } catch (err) {
      console.error("Exception in searchVehicles:", err)
      // Use mock data when service fails
      this.rentalVehicles = [...this.mockVehicles]
      this.filteredVehicles = [...this.mockVehicles]
      this.applyFilters()
      this.loading = false
      this.activeTab = 'cars'; // Switch to cars tab after search
    }
  }

  applyFilters(): void {
    // Apply all filters
    let filtered = [...this.rentalVehicles]

    if (this.filterCategory) {
      filtered = filtered.filter((vehicle) => vehicle.category.toLowerCase() === this.filterCategory.toLowerCase())
    }

    if (this.filterTransmission) {
      filtered = filtered.filter(
        (vehicle) => vehicle.transmission.toLowerCase() === this.filterTransmission.toLowerCase(),
      )
    }

    if (this.filterSeats) {
      filtered = filtered.filter((vehicle) => vehicle.seats.toString() === this.filterSeats)
    }

    if (this.filterFuel) {
      filtered = filtered.filter((vehicle) => vehicle.fuelType.toLowerCase() === this.filterFuel.toLowerCase())
    }

    this.filteredVehicles = filtered
  }

  selectVehicle(vehicle: any): void {
    this.selectedVehicle = vehicle

    // Reset booking options
    this.bookingOptions = {
      insurance: false,
      gps: false,
      childSeat: false,
      additionalDriver: false,
    }
  }

  closeModal(event: MouseEvent): void {
    // Only close if clicking outside the modal content
    if ((event.target as HTMLElement).className === "booking-modal") {
      this.selectedVehicle = null
    }
  }

  calculateDays(): number {
    if (!this.searchParams.startDate || !this.searchParams.endDate) {
      return 2 // Default to 2 days
    }

    const startDate = new Date(this.searchParams.startDate)
    const endDate = new Date(this.searchParams.endDate)
    return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
  }

  calculateTotalPrice(vehicle: any): number {
    return vehicle.pricePerDay * this.calculateDays()
  }

  calculateOptionPrice(pricePerDay: number): number {
    return pricePerDay * this.calculateDays()
  }

  calculateFinalPrice(): number {
    if (!this.selectedVehicle) return 0

    let total = this.calculateTotalPrice(this.selectedVehicle)

    if (this.bookingOptions.insurance) {
      total += this.calculateOptionPrice(10)
    }

    if (this.bookingOptions.gps) {
      total += this.calculateOptionPrice(5)
    }

    if (this.bookingOptions.childSeat) {
      total += this.calculateOptionPrice(7)
    }

    if (this.bookingOptions.additionalDriver) {
      total += this.calculateOptionPrice(8)
    }

    return total
  }

  getLocationName(locationId: string): string {
    const location = this.locations.find((loc) => loc.id === locationId)
    return location ? location.name : "Location non spécifiée"
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
      dates: {
        startDate: this.searchParams.startDate,
        startTime: this.searchParams.startTime,
        endDate: this.searchParams.endDate,
        endTime: this.searchParams.endTime,
      },
      location: this.searchParams.location,
      returnLocation: this.differentReturnLocation ? this.searchParams.returnLocation : this.searchParams.location,
      options: this.bookingOptions,
      totalPrice: this.calculateFinalPrice(),
    })

    // Reset selection
    this.selectedVehicle = null
  }
}
