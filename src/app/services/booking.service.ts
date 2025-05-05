import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private endpoint = 'bookings';

  constructor(private apiService: ApiService) { }

  createBooking(bookingData: any): Observable<any> {
    return this.apiService.post(this.endpoint, bookingData);
  }

  // Add this method for regular users to get their bookings
  getBookings(): Observable<any> {
    return this.apiService.get(this.endpoint);
  }

  // Add this method for admins to get all bookings
  getAllBookings(): Observable<any> {
    return this.apiService.get(`${this.endpoint}/all`);
  }

  getClientBookings(): Observable<any> {
    return this.apiService.get(`${this.endpoint}/client`);
  }

  getProviderBookings(): Observable<any> {
    return this.apiService.get(`${this.endpoint}/provider`);
  }

  getBookingById(id: string): Observable<any> {
    return this.apiService.get(`${this.endpoint}/${id}`);
  }

  updateBookingStatus(id: string, status: string): Observable<any> {
    return this.apiService.patch(`${this.endpoint}/${id}/status`, { status });
  }
}