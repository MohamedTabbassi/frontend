import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports :[RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  
  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isClient(): boolean {
    return this.authService.isLoggedIn() && this.authService.currentUserValue?.role === 'CLIENT';
  }

  isServiceProvider(): boolean {
    return this.authService.isLoggedIn() && this.authService.currentUserValue?.role === 'SERVICE_USER';
  }

  isAdmin(): boolean {
    return this.authService.isLoggedIn() && this.authService.currentUserValue?.role === 'ADMIN';
  }
}