import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getBookings(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return this.http.get<any>(this.apiUrl, { params: httpParams })
      .pipe(
        catchError(error => {
          console.error('Error fetching bookings:', error);
          return throwError(() => new Error('Failed to load bookings. Please try again later.'));
        })
      );
  }

  getAllBookings(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return this.http.get<any>(`${this.apiUrl}/all`, { params: httpParams })
      .pipe(
        catchError(error => {
          console.error('Error fetching all bookings:', error);
          return throwError(() => new Error('Failed to load all bookings. Please try again later.'));
        })
      );
  }

  getBookingById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching booking:', error);
          return throwError(() => new Error('Failed to load booking. Please try again later.'));
        })
      );
  }

  createBooking(booking: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, booking)
      .pipe(
        catchError(error => {
          console.error('Error creating booking:', error);
          return throwError(() => new Error('Failed to create booking. Please try again later.'));
        })
      );
  }

  updateBookingStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(
        catchError(error => {
          console.error('Error updating booking status:', error);
          return throwError(() => new Error('Failed to update booking status. Please try again later.'));
        })
      );
  }

  deleteBooking(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting booking:', error);
          return throwError(() => new Error('Failed to delete booking. Please try again later.'));
        })
      );
  }
}