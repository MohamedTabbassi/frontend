import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../../../services/service.service';
import { Service, ServiceCategory } from '../../../models/service.model';
import { ServiceCardComponent } from '../service-card/service-card.component';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ServiceCardComponent],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  services: Service[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  selectedCategory = '';
  currentPage = 1;
  totalPages = 1;
  limit = 9;
  ServiceCategory = ServiceCategory;

  constructor(
    private serviceService: ServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      if (params['search']) {
        this.searchTerm = params['search'];
      }
      if (params['page']) {
        this.currentPage = +params['page'];
      }
      this.loadServices();
    });
  }

  loadServices(): void {
    this.loading = true;
    const params: any = {
      page: this.currentPage,
      limit: this.limit
    };

    if (this.selectedCategory) {
      params.category = this.selectedCategory;
    }

    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.serviceService.getServices(params).subscribe({
      next: (response) => {
        this.services = response.data;
        this.totalPages = Math.ceil(response.count / this.limit);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load services';
        this.loading = false;
        console.error('Error loading services:', error);
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.updateQueryParams();
  }

  search(): void {
    this.currentPage = 1;
    this.updateQueryParams();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updateQueryParams();
  }

  updateQueryParams(): void {
    const queryParams: any = { page: this.currentPage };
    
    if (this.selectedCategory) {
      queryParams.category = this.selectedCategory;
    }
    
    if (this.searchTerm) {
      queryParams.search = this.searchTerm;
    }
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show limited pages with current page in the middle if possible
      let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      
      if (endPage > this.totalPages) {
        endPage = this.totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
}