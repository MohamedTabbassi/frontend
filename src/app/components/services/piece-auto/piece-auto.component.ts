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
  filteredParts: any[] = []
  loading = true
  error: string | null = null
  cartCount = 0

  // For part search
  searchQuery = ""

  // Vehicle selection
  selectedManufacturer = ""
  selectedModel = ""
  selectedEngine = ""

  // Manufacturers
  manufacturers = [
    { id: "renault", name: "Renault" },
    { id: "peugeot", name: "Peugeot" },
    { id: "citroen", name: "Citroën" },
    { id: "volkswagen", name: "Volkswagen" },
    { id: "bmw", name: "BMW" },
    { id: "mercedes", name: "Mercedes" },
    { id: "audi", name: "Audi" },
    { id: "toyota", name: "Toyota" },
    { id: "ford", name: "Ford" },
    { id: "fiat", name: "Fiat" },
  ]

  // Models (would be filtered based on manufacturer in a real app)
  models = [
    { id: "clio", name: "Clio", manufacturer: "renault" },
    { id: "megane", name: "Megane", manufacturer: "renault" },
    { id: "208", name: "208", manufacturer: "peugeot" },
    { id: "308", name: "308", manufacturer: "peugeot" },
    { id: "c3", name: "C3", manufacturer: "citroen" },
    { id: "c4", name: "C4", manufacturer: "citroen" },
    { id: "golf", name: "Golf", manufacturer: "volkswagen" },
    { id: "polo", name: "Polo", manufacturer: "volkswagen" },
    { id: "serie3", name: "Série 3", manufacturer: "bmw" },
    { id: "serie5", name: "Série 5", manufacturer: "bmw" },
  ]

  // Engines (would be filtered based on model in a real app)
  engines = [
    { id: "1.5dci", name: "1.5 dCi", model: "clio" },
    { id: "1.2tce", name: "1.2 TCe", model: "clio" },
    { id: "1.6hdi", name: "1.6 HDi", model: "208" },
    { id: "1.2puretech", name: "1.2 PureTech", model: "208" },
    { id: "2.0tdi", name: "2.0 TDI", model: "golf" },
    { id: "1.4tsi", name: "1.4 TSI", model: "golf" },
  ]

  // Part categories
  partCategories = [
    { id: "filtres", name: "Filtres", icon: "/assets/images/parts/filtres.jpg" },
    { id: "freinage", name: "Freinage", icon: "/assets/images/parts/freinage.jpg" },
    { id: "courroie", name: "Courroie, tendeur et chaîne", icon: "/assets/images/parts/courroie.jpg" },
    { id: "allumage", name: "Allumage", icon: "/assets/images/parts/allumage.jpg" },
    { id: "suspension", name: "Suspension", icon: "/assets/images/parts/suspension.jpg" },
    { id: "direction", name: "Direction et Trains roulants", icon: "/assets/images/parts/direction.jpg" },
    { id: "embrayage", name: "Embrayage", icon: "/assets/images/parts/embrayage.jpg" },
    { id: "moteur", name: "Moteur", icon: "/assets/images/parts/moteur.jpg" },
    { id: "eclairage", name: "Éclairage", icon: "/assets/images/parts/eclairage.jpg" },
    { id: "demarreur", name: "Démarreur et alternateur", icon: "/assets/images/parts/demarreur.jpg" },
    { id: "electronique", name: "Électronique", icon: "/assets/images/parts/electronique.jpg" },
    { id: "carrosserie", name: "Carrosserie", icon: "/assets/images/parts/carrosserie.jpg" },
  ]

  // Filter
  selectedCategory = ""

  // Cart
  cart: any[] = []

  // Mock parts data
  mockParts = [
    {
      id: 1,
      name: "Filtre à huile MANN-FILTER HU7008z",
      reference: "HU7008z",
      category: "filtres",
      compatibility: "BMW Série 3, Série 5",
      description: "Filtre à huile de qualité supérieure pour moteurs BMW",
      price: 12.99,
      inStock: true,
      imageUrl: "https://via.placeholder.com/300x300/ffffff/333333?text=Filtre+Huile",
      manufacturer: "MANN-FILTER",
    },
    {
      id: 2,
      name: "Filtre à air MAHLE LX1566",
      reference: "LX1566",
      category: "filtres",
      compatibility: "Volkswagen Golf, Audi A3",
      description: "Filtre à air haute performance pour moteurs du groupe VAG",
      price: 18.5,
      inStock: true,
      imageUrl: "https://via.placeholder.com/300x300/ffffff/333333?text=Filtre+Air",
      manufacturer: "MAHLE",
    },
    {
      id: 3,
      name: "Plaquettes de frein avant FERODO FDB1323",
      reference: "FDB1323",
      category: "freinage",
      compatibility: "Renault Clio, Megane",
      description: "Plaquettes de frein haute performance pour un freinage optimal",
      price: 35.9,
      inStock: true,
      imageUrl: "https://via.placeholder.com/300x300/ffffff/333333?text=Plaquettes+Frein",
      manufacturer: "FERODO",
    },
    {
      id: 4,
      name: "Disques de frein avant BREMBO 09.9772.10",
      reference: "09.9772.10",
      category: "freinage",
      compatibility: "Peugeot 208, 308",
      description: "Disques de frein ventilés pour une meilleure dissipation de la chaleur",
      price: 78.5,
      inStock: true,
      imageUrl: "https://via.placeholder.com/300x300/ffffff/333333?text=Disques+Frein",
      manufacturer: "BREMBO",
    },
    {
      id: 5,
      name: "Kit de distribution GATES K015603XS",
      reference: "K015603XS",
      category: "courroie",
      compatibility: "Renault 1.5 dCi",
      description: "Kit complet avec courroie, galets et pompe à eau",
      price: 129.9,
      inStock: false,
      imageUrl: "https://via.placeholder.com/300x300/ffffff/333333?text=Kit+Distribution",
      manufacturer: "GATES",
    },
    {
      id: 6,
      name: "Amortisseur avant MONROE G8108",
      reference: "G8108",
      category: "suspension",
      compatibility: "Citroën C3, C4",
      description: "Amortisseur de qualité d'origine pour un confort optimal",
      price: 65.75,
      inStock: true,
      imageUrl: "https://via.placeholder.com/300x300/ffffff/333333?text=Amortisseur",
      manufacturer: "MONROE",
    },
    {
      id: 7,
      name: "Bougie d'allumage NGK LZKAR6-11",
      reference: "LZKAR6-11",
      category: "allumage",
      compatibility: "BMW, Mercedes, Audi",
      description: "Bougie d'allumage à iridium pour performances optimales",
      price: 15.99,
      inStock: true,
      imageUrl: "https://via.placeholder.com/300x300/ffffff/333333?text=Bougie+Allumage",
      manufacturer: "NGK",
    },
    {
      id: 8,
      name: "Rotule de direction LEMFÖRDER 33321 01",
      reference: "33321 01",
      category: "direction",
      compatibility: "Volkswagen Golf, Passat",
      description: "Rotule de direction de qualité allemande pour une tenue de route parfaite",
      price: 28.5,
      inStock: true,
      imageUrl: "https://via.placeholder.com/300x300/ffffff/333333?text=Rotule+Direction",
      manufacturer: "LEMFÖRDER",
    },
  ]

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.loadAutoParts()
  }

  loadAutoParts(): void {
    this.loading = true
    this.error = null

    try {
      this.serviceService.getServicesByCategory("piece-auto").subscribe({
        next: (parts) => {
          if (parts && parts.length > 0) {
            this.autoParts = parts
          } else {
            // If no parts returned, use mock data
            this.autoParts = [...this.mockParts]
          }
          this.filteredParts = [...this.autoParts]
          this.loading = false
        },
        error: (err) => {
          console.error("Error loading auto parts:", err)
          // Use mock data when service fails
          this.autoParts = [...this.mockParts]
          this.filteredParts = [...this.mockParts]
          this.loading = false
          // Don't set error message since we're providing mock data
        },
      })
    } catch (err) {
      console.error("Exception in loadAutoParts:", err)
      // Use mock data when service fails
      this.autoParts = [...this.mockParts]
      this.filteredParts = [...this.mockParts]
      this.loading = false
    }
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category
    this.applyFilters()
  }

  applyFilters(): void {
    let filtered = [...this.autoParts]

    if (this.selectedCategory) {
      filtered = filtered.filter((part) => part.category === this.selectedCategory)
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (part) =>
          part.name.toLowerCase().includes(query) ||
          part.reference.toLowerCase().includes(query) ||
          part.description.toLowerCase().includes(query),
      )
    }

    this.filteredParts = filtered
  }

  // Add these new methods to your existing component class:

getCategoryName(): string {
  if (!this.selectedCategory) return 'Pièces auto';
  const category = this.partCategories.find(c => c.id === this.selectedCategory);
  return category?.name || 'Pièces auto';
}

getCartTotal(): number {
  return this.cart.reduce((sum, item) => sum + item.price, 0);
}

getCartCountText(): string {
  return `${this.cart.length} article${this.cart.length > 1 ? 's' : ''}`;
}

resetCategory(): void {
  this.selectedCategory = '';
  this.applyFilters();
}

  searchParts(): void {
    this.applyFilters()
  }

  searchByVehicle(): void {
    // In a real app, this would filter parts based on vehicle compatibility
    alert(
      `Recherche de pièces pour ${this.getManufacturerName(this.selectedManufacturer)} ${this.getModelName(
        this.selectedModel,
      )} ${this.getEngineName(this.selectedEngine)}`,
    )
    // Reset filters to show all parts for demo purposes
    this.selectedCategory = ""
    this.applyFilters()
  }

  getManufacturerName(id: string): string {
    const manufacturer = this.manufacturers.find((m) => m.id === id)
    return manufacturer ? manufacturer.name : ""
  }

  getModelName(id: string): string {
    const model = this.models.find((m) => m.id === id)
    return model ? model.name : ""
  }

  getEngineName(id: string): string {
    const engine = this.engines.find((e) => e.id === id)
    return engine ? engine.name : ""
  }

  getFilteredModels(): any[] {
    if (!this.selectedManufacturer) return []
    return this.models.filter((model) => model.manufacturer === this.selectedManufacturer)
  }

  getFilteredEngines(): any[] {
    if (!this.selectedModel) return []
    return this.engines.filter((engine) => engine.model === this.selectedModel)
  }

  addToCart(part: any): void {
    this.cart.push(part)
    this.cartCount = this.cart.length
    alert(`${part.name} ajouté au panier!`)
  }

  clearCart(): void {
    this.cart = []
    this.cartCount = 0
    alert("Panier vidé!")
  }

  checkout(): void {
    alert("Redirection vers le paiement...")
    console.log("Checkout with items:", this.cart)
  }
}
