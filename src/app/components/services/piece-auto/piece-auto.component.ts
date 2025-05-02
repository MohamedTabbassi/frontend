import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import  { ServiceService } from "../../../services/service.service"

@Component({
  selector: "app-piece-auto",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./piece-auto.component.html",
  styleUrls: ["./piece-auto.component.css"],
})
export class PieceAutoComponent implements OnInit {
  autoParts: any[] = []
  loading = true
  error: string | null = null

  // For part search
  searchQuery = ""

  // Part categories
  partCategories = [
    { id: "engine", name: "Moteur" },
    { id: "brakes", name: "Freins" },
    { id: "suspension", name: "Suspension" },
    { id: "electrical", name: "Électrique" },
    { id: "body", name: "Carrosserie" },
    { id: "transmission", name: "Transmission" },
    { id: "cooling", name: "Refroidissement" },
  ]

  // Filter
  selectedCategory = ""

  // Cart
  cart: any[] = []

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.loadAutoParts()
  }

  loadAutoParts(): void {
    this.loading = true
    this.serviceService.getServicesByCategory("piece-auto").subscribe({
      next: (parts) => {
        this.autoParts = parts
        this.loading = false
      },
      error: (err) => {
        this.error = "Impossible de charger les pièces auto"
        this.loading = false
        console.error(err)
      },
    })
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category
    if (!category) {
      this.loadAutoParts()
      return
    }

    this.loading = true
    this.serviceService.getServicesBySubcategory("piece-auto", category).subscribe({
      next: (parts) => {
        this.autoParts = parts
        this.loading = false
      },
      error: (err) => {
        this.error = "Impossible de filtrer les pièces"
        this.loading = false
        console.error(err)
      },
    })
  }

  searchParts(): void {
    if (!this.searchQuery.trim()) {
      this.loadAutoParts()
      return
    }

    this.loading = true
    this.serviceService.searchServices("piece-auto", this.searchQuery).subscribe({
      next: (parts) => {
        this.autoParts = parts
        this.loading = false
      },
      error: (err) => {
        this.error = "Erreur lors de la recherche"
        this.loading = false
        console.error(err)
      },
    })
  }

  addToCart(part: any): void {
    this.cart.push(part)
    alert(`${part.name} ajouté au panier!`)
  }

  clearCart(): void {
    this.cart = []
    alert("Panier vidé!")
  }

  checkout(): void {
    alert("Redirection vers le paiement...")
    console.log("Checkout with items:", this.cart)
  }
}
