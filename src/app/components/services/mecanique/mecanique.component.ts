import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import  { ServiceService } from "../../../services/service.service"

@Component({
  selector: "app-mecanique",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./mecanique.component.html",
  styleUrls: ["./mecanique.component.css"],
})
export class MecaniqueComponent implements OnInit {
  mechanicServices: any[] = []
  loading = true
  error: string | null = null

  // For appointment booking
  appointmentRequest = {
    serviceType: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    preferredDate: "",
    preferredTime: "",
    customerName: "",
    contactNumber: "",
    additionalInfo: "",
    serviceLocation: "shop", // Default to shop, can be 'shop' or 'home'
  }

  // Service categories
  serviceCategories = [
    { id: "maintenance", name: "Entretien régulier" },
    { id: "repair", name: "Réparation" },
    { id: "diagnostic", name: "Diagnostic" },
    { id: "suspension", name: "Suspension et direction" },
    { id: "brakes", name: "Freins" },
    { id: "engine", name: "Moteur" },
    { id: "electrical", name: "Système électrique" },
    { id: "mobile", name: "Service à domicile" }, // Added mobile mechanic category
  ]

  // Filter
  selectedCategory = ""

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.loadMechanicServices()
  }

  loadMechanicServices(): void {
    this.loading = true
    this.serviceService.getServicesByCategory("mecanique").subscribe({
      next: (services) => {
        this.mechanicServices = services
        this.loading = false
      },
      error: (err) => {
        this.error = "Impossible de charger les services mécaniques"
        this.loading = false
        console.error(err)
      },
    })
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category
    if (!category) {
      this.loadMechanicServices()
      return
    }

    this.loading = true
    this.serviceService.getServicesBySubcategory("mecanique", category).subscribe({
      next: (services) => {
        this.mechanicServices = services
        this.loading = false
      },
      error: (err) => {
        this.error = "Impossible de filtrer les services"
        this.loading = false
        console.error(err)
      },
    })
  }

  bookAppointment(): void {
    // Here you would implement the API call to book an appointment
    const locationText = this.appointmentRequest.serviceLocation === "home" ? "à domicile" : "à l'atelier"
    alert(`Demande de rendez-vous ${locationText} envoyée! Nous vous contacterons pour confirmer.`)
    console.log("Appointment request:", this.appointmentRequest)

    // Reset form
    this.appointmentRequest = {
      serviceType: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
      preferredDate: "",
      preferredTime: "",
      customerName: "",
      contactNumber: "",
      additionalInfo: "",
      serviceLocation: "shop",
    }
  }

  // Method to book mobile service
  bookMobileService(serviceName: string): void {
    alert(
      `Vous avez demandé le service mobile: ${serviceName}. Un conseiller vous contactera pour confirmer les détails.`,
    )
  }
}
