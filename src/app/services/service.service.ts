import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { RentalCarFilter } from '../models/rental-car.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private endpoint = 'services';

  constructor(private apiService: ApiService) { }

  getServices(params?: any): Observable<any> {
    return this.apiService.get(this.endpoint, params);
  }

  getServiceById(id: string): Observable<any> {
    return this.apiService.get(`${this.endpoint}/${id}`);
  }

  getServicesByCategory(category: string): Observable<any> {
    return this.apiService.get(`${this.endpoint}/category/${category}`);
  }

  // Add this method for subcategory filtering
  getServicesBySubcategory(category: string, subcategory: string): Observable<any> {
    return this.apiService.get(`${this.endpoint}/category/${category}/subcategory/${subcategory}`);
  }

  // Add this method for searching services
  searchServices(category: string, query: string): Observable<any> {
    return this.apiService.get(`${this.endpoint}/search`, { category, query });
  }

  // Add this method for searching rental vehicles
  searchrentalvehicle(params: any): Observable<any> {
    return this.apiService.get(`${this.endpoint}/rental/search`, params);
  }

  getMyServices(): Observable<any> {
    return this.apiService.get(`${this.endpoint}/user/my-services`);
  }

  createService(serviceData: FormData): Observable<any> {
    return this.apiService.post(this.endpoint, serviceData);
  }

  updateService(id: string, serviceData: FormData): Observable<any> {
    return this.apiService.put(`${this.endpoint}/${id}`, serviceData);
  }

  updateServiceAvailability(id: string, available: boolean): Observable<any> {
    return this.apiService.patch(`${this.endpoint}/${id}/availability`, { available });
  }

  deleteService(id: string): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
 
 
  }



// Add these methods to your existing ServiceService

// Get all rental cars
getRentalCars(params?: any): Observable<any> {
  return this.apiService.get(`${this.endpoint}/rental`, params);
}

// Get rental car by ID
getRentalCarById(id: string): Observable<any> {
  return this.apiService.get(`${this.endpoint}/rental/${id}`);
}

// Search rental cars with filters
searchRentalVehicles(filters: RentalCarFilter): Observable<any> {
  return this.apiService.get(`${this.endpoint}/rental/search`, filters);
}




}

