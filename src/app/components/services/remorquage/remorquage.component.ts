import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import  { ServiceService } from "../../../services/service.service"

@Component({
  selector: "app-remorquage",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./remorquage.component.html",
  styleUrls: ["./remorquage.component.css"],
})
export class RemorquageComponent implements OnInit {
  towingServices: any[] = []
  loading = true
  error: string | null = null

  // For emergency request form
  emergencyRequest = {
    location: "",
    vehicleType: "",
    description: "",
    contactNumber: "",
  }

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.loadTowingServices()
  }

  loadTowingServices(): void {
    this.loading = true
    this.serviceService.getServicesByCategory("remorquage").subscribe({
      next: (services) => {
        this.towingServices = services
        this.loading = false
      },
      error: (err) => {
        this.error = "Impossible de charger les services de remorquage"
        this.loading = false
        console.error(err)
      },
    })
  }

  requestEmergencyTowing(): void {
    // Here you would implement the API call to request emergency towing
    alert("Demande de remorquage d'urgence envoyée! Nous vous contacterons bientôt.")
    console.log("Emergency towing request:", this.emergencyRequest)
    // Reset form
    this.emergencyRequest = {
      location: "",
      vehicleType: "",
      description: "",
      contactNumber: "",
    }
  }
}
