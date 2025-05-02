import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService { 
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getUsers(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return this.http.get<any>(`${this.apiUrl}/users`, { params: httpParams })
      .pipe(
        catchError(error => {
          console.error('Error fetching users:', error);
          return throwError(() => new Error('Failed to load users. Please try again later.'));
        })
      );
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching user:', error);
          return throwError(() => new Error('Failed to load user. Please try again later.'));
        })
      );
  }

  updateUserStatus(id: string, active: boolean): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/${id}/status`, { active })
      .pipe(
        catchError(error => {
          console.error('Error updating user status:', error);
          return throwError(() => new Error('Failed to update user status. Please try again later.'));
        })
      );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting user:', error);
          return throwError(() => new Error('Failed to delete user. Please try again later.'));
        })
      );
  }

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`)
      .pipe(
        catchError(error => {
          console.error('Error fetching dashboard stats:', error);
          return throwError(() => new Error('Failed to load dashboard stats. Please try again later.'));
        })
      );
  }
}