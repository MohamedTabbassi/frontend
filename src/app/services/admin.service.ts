import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private endpoint = 'admin';

  constructor(private apiService: ApiService) { }

  getUsers(): Observable<any> {
    return this.apiService.get(`${this.endpoint}/users`);
  }

  getUserById(id: string): Observable<any> {
    return this.apiService.get(`${this.endpoint}/users/${id}`);
  }

  updateUserStatus(userId: string, active: boolean): Observable<any> {
    return this.apiService.patch(`${this.endpoint}/users/${userId}/status`, { active });
  }

  deleteUser(userId: string): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/users/${userId}`);
  }

  getDashboardStats(): Observable<any> {
    return this.apiService.get(`${this.endpoint}/stats`);
  }
}