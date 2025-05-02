import { Injectable } from "@angular/core"
import {  HttpClient, HttpParams } from "@angular/common/http"
import {  Observable, catchError, of, throwError } from "rxjs"
import { environment } from "../environments/environment"

@Injectable({
  providedIn: "root",
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/services`

  // Mock data for development (remove in production)
  private mockServices = {
    remorquage: [
      {
        id: 1,
        name: "Remorquage Standard",
        description: "Service de remorquage pour véhicules légers dans un rayon de 50km",
        price: 80,
        imageUrl: "/assets/images/services/towing-standard.jpg",
      },
      {
        id: 2,
        name: "Remorquage Longue Distance",
        description: "Service de remorquage pour tous types de véhicules sur de longues distances",
        price: 150,
        imageUrl: "/assets/images/services/towing-long.jpg",
      },
      {
        id: 3,
        name: "Assistance Dépannage",
        description: "Intervention rapide sur place pour problèmes mineurs (batterie, pneu, etc.)",
        price: 60,
        imageUrl: "/assets/images/services/roadside-assistance.jpg",
      },
    ],
    mecanique: [
      {
        id: 4,
        name: "Révision Complète",
        description: "Révision complète de votre véhicule incluant vidange, filtres et vérifications",
        price: 120,
        duration: "2-3 heures",
        warranty: "6 mois",
        imageUrl: "/assets/images/services/full-service.jpg",
      },
      {
        id: 5,
        name: "Changement de Freins",
        description: "Remplacement des plaquettes et/ou disques de frein",
        price: 90,
        duration: "1-2 heures",
        warranty: "12 mois",
        imageUrl: "/assets/images/services/brake-service.jpg",
      },
      {
        id: 6,
        name: "Diagnostic Électronique",
        description: "Analyse complète des systèmes électroniques de votre véhicule",
        price: 50,
        duration: "30-60 minutes",
        imageUrl: "/assets/images/services/diagnostic.jpg",
      },
    ],
    "piece-auto": [
      {
        id: 7,
        name: "Batterie 60Ah",
        description: "Batterie haute performance pour véhicules de tourisme",
        price: 85,
        reference: "BAT-60AH-001",
        compatibility: "Multiples marques",
        inStock: true,
        imageUrl: "/assets/images/parts/battery.jpg",
      },
      {
        id: 8,
        name: "Kit de Filtres",
        description: "Kit complet de filtres (air, huile, carburant, habitacle)",
        price: 45,
        reference: "FIL-KIT-002",
        compatibility: "Renault, Peugeot, Citroën",
        inStock: true,
        imageUrl: "/assets/images/parts/filters.jpg",
      },
      {
        id: 9,
        name: "Amortisseurs Avant",
        description: "Paire d'amortisseurs avant haute qualité",
        price: 120,
        reference: "AMO-AVT-003",
        compatibility: "Volkswagen Golf, Audi A3",
        inStock: false,
        imageUrl: "/assets/images/parts/shock-absorbers.jpg",
      },
    ],
    location: [
      {
        id: 10,
        name: "Renault Clio",
        category: "Économique",
        seats: 5,
        transmission: "Manuelle",
        fuelType: "Essence",
        pricePerDay: 35,
        features: ["Climatisation", "Bluetooth", "GPS"],
        imageUrl: "/assets/images/rentals/clio.jpg",
      },
      {
        id: 11,
        name: "Peugeot 3008",
        category: "SUV",
        seats: 5,
        transmission: "Automatique",
        fuelType: "Diesel",
        pricePerDay: 65,
        features: ["Climatisation", "Caméra de recul", "GPS", "Bluetooth", "Régulateur de vitesse"],
        imageUrl: "/assets/images/rentals/3008.jpg",
      },
      {
        id: 12,
        name: "Mercedes Classe C",
        category: "Luxe",
        seats: 5,
        transmission: "Automatique",
        fuelType: "Essence",
        pricePerDay: 95,
        features: ["Climatisation", "Sièges cuir", "GPS", "Bluetooth", "Toit ouvrant", "Régulateur adaptatif"],
        imageUrl: "/assets/images/rentals/mercedes.jpg",
      },
    ],
  }

  constructor(private http: HttpClient) {}

  getServices(params?: any): Observable<any> {
    let httpParams = new HttpParams()

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key])
        }
      })
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      catchError((error) => {
        console.error("Error fetching services:", error)
        return throwError(() => new Error("Failed to load services. Please try again later."))
      }),
    )
  }

  // Combined getServiceById method that works with both string and number IDs
  getServiceById(id: string | number): Observable<any> {
    if (environment.production) {
      // For production: use API
      return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
        catchError((error) => {
          console.error("Error fetching service:", error)
          return throwError(() => new Error("Failed to load service. Please try again later."))
        }),
      )
    } else {
      // For development: use mock data
      const allServices = [
        ...this.mockServices.remorquage,
        ...this.mockServices.mecanique,
        ...this.mockServices["piece-auto"],
        ...this.mockServices.location,
      ]

      // Convert id to number if it's a string for comparison with mock data
      const numericId = typeof id === "string" ? Number.parseInt(id, 10) : id
      const service = allServices.find((s) => s.id === numericId)
      return of(service)
    }
  }

  getMyServices(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-services`).pipe(
      catchError((error) => {
        console.error("Error fetching my services:", error)
        return throwError(() => new Error("Failed to load your services. Please try again later."))
      }),
    )
  }

  createService(service: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, service).pipe(
      catchError((error) => {
        console.error("Error creating service:", error)
        return throwError(() => new Error("Failed to create service. Please try again later."))
      }),
    )
  }

  updateService(id: string, service: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, service).pipe(
      catchError((error) => {
        console.error("Error updating service:", error)
        return throwError(() => new Error("Failed to update service. Please try again later."))
      }),
    )
  }

  updateServiceAvailability(id: string, available: boolean): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/availability`, { available }).pipe(
      catchError((error) => {
        console.error("Error updating service availability:", error)
        return throwError(() => new Error("Failed to update service availability. Please try again later."))
      }),
    )
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error("Error deleting service:", error)
        return throwError(() => new Error("Failed to delete service. Please try again later."))
      }),
    )
  }

  testBackendConnection(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/health-check`).pipe(
      catchError((error) => {
        console.error("Backend connection test failed:", error)
        return throwError(() => new Error("Could not connect to backend"))
      }),
    )
  }

  // Mock data methods
  getServicesByCategory(category: string): Observable<any[]> {
    // In production, use this:
    // return this.http.get<any[]>(`${this.apiUrl}/${category}`)
    //   .pipe(
    //     catchError(this.handleError<any[]>('getServicesByCategory', []))
    //   );

    // For development with mock data:
    return of(this.mockServices[category as keyof typeof this.mockServices] || [])
  }

  getServicesBySubcategory(category: string, subcategory: string): Observable<any[]> {
    // In production, use this:
    // return this.http.get<any[]>(`${this.apiUrl}/${category}?subcategory=${subcategory}`)
    //   .pipe(
    //     catchError(this.handleError<any[]>('getServicesBySubcategory', []))
    //   );

    // For development with mock data:
    const services = this.mockServices[category as keyof typeof this.mockServices] || []
    // This is a simplified filter - in a real app, you'd have proper subcategory data
    return of(
      services.filter((service: any) => {
        if (category === "location" && service.category === subcategory) {
          return true
        }
        if (service.features && Array.isArray(service.features)) {
          return service.features.includes(subcategory)
        }
        return false
      }),
    )
  }

  searchServices(category: string, query: string): Observable<any[]> {
    // In production, use this:
    // return this.http.get<any[]>(`${this.apiUrl}/${category}/search?q=${query}`)
    //   .pipe(
    //     catchError(this.handleError<any[]>('searchServices', []))
    //   );

    // For development with mock data:
    const services = this.mockServices[category as keyof typeof this.mockServices] || []
    const lowerQuery = query.toLowerCase()
    return of(
      services.filter((service: any) => {
        if (service.name && service.name.toLowerCase().includes(lowerQuery)) {
          return true
        }
        if (service.description && service.description.toLowerCase().includes(lowerQuery)) {
          return true
        }
        return false
      }),
    )
  }

  searchRentalVehicles(params: any): Observable<any[]> {
    // In production, use this:
    // return this.http.post<any[]>(`${this.apiUrl}/location/search`, params)
    //   .pipe(
    //     catchError(this.handleError<any[]>('searchRentalVehicles', []))
    //   );

    // For development with mock data:
    const vehicles = this.mockServices["location"] || []
    return of(
      vehicles.filter(
        (vehicle) => !params.vehicleType || vehicle.category.toLowerCase() === params.vehicleType.toLowerCase(),
      ),
    )
  }

  // Error handling
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`)
      // Let the app keep running by returning an empty result
      return of(result as T)
    }
  }
}
