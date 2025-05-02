import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isExpanded = true;
  userRole: string | null = null;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.userRole = this.authService.currentUserValue?.role || null;
  }
  
  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }
  
  isAdmin(): boolean {
    return this.userRole === UserRole.ADMIN;
  }
  
  isClient(): boolean {
    return this.userRole === UserRole.CLIENT;
  }
  
  isServiceProvider(): boolean {
    return this.userRole === UserRole.SERVICE_USER;
  }
}