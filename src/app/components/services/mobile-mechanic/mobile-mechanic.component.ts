import { Component, type ElementRef, ViewChild } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-mobile-mechanic",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./mobile-mechanic.component.html",
  styleUrls: ["./mobile-mechanic.component.css"],
})
export class MobileMechanicComponent {
  @ViewChild("services") servicesSection?: ElementRef
  @ViewChild("booking") bookingSection?: ElementRef

  // Mobile services
  mobileServices = [
    {
      id: 1,
      name: "Vidange d'huile",
      description: "Changement d'huile et de filtre à domicile",
      originalPrice: 80,
      discountedPrice: 40,
      image: "https://via.placeholder.com/300x200/ff6b00/ffffff?text=Vidange",
    },
    {
      id: 2,
      name: "Remplacement de batterie",
      description: "Installation d'une nouvelle batterie à domicile",
      originalPrice: 100,
      discountedPrice: 50,
      image: "https://via.placeholder.com/300x200/ff6b00/ffffff?text=Batterie",
    },
    {
      id: 3,
      name: "Remplacement de freins",
      description: "Changement de plaquettes et/ou disques à domicile",
      originalPrice: 160,
      discountedPrice: 80,
      image: "https://via.placeholder.com/300x200/ff6b00/ffffff?text=Freins",
    },
    {
      id: 4,
      name: "Diagnostic électronique",
      description: "Analyse complète des systèmes de votre véhicule",
      originalPrice: 90,
      discountedPrice: 45,
      image: "https://via.placeholder.com/300x200/ff6b00/ffffff?text=Diagnostic",
    },
  ]

  // Booking form
  bookingRequest = {
    service: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    date: "",
    time: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    notes: "",
  }

  // Method to scroll to services section
  scrollToServices(): void {
    const servicesElement = document.getElementById("services")
    if (servicesElement) {
      servicesElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Method to scroll to booking section
  scrollToBooking(): void {
    const bookingElement = document.getElementById("booking")
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  bookService(serviceId: number): void {
    const service = this.mobileServices.find((s) => s.id === serviceId)
    if (service) {
      this.bookingRequest.service = service.name
      // In a real app, you would show a booking modal or navigate to a booking page
      alert(
        `Vous avez sélectionné le service: ${service.name} à ${service.discountedPrice}€. Veuillez remplir le formulaire de réservation.`,
      )
      // Scroll to booking form
      this.scrollToBooking()
    }
  }

  submitBooking(): void {
    // Here you would implement the API call to submit the booking
    alert("Votre demande de service à domicile a été envoyée! Nous vous contacterons bientôt pour confirmer.")
    console.log("Booking request:", this.bookingRequest)

    // Reset form
    this.bookingRequest = {
      service: "",
      name: "",
      phone: "",
      email: "",
      address: "",
      date: "",
      time: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
      notes: "",
    }
  }
}
