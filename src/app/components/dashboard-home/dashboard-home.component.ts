import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.interface';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }

  isAdmin(): boolean {
    return this.user?.roles?.includes('Admin') || false;
  }

  navigateToProducts(): void {
    this.router.navigate(['/dashboard/products']);
  }

  navigateToStock(): void {
    this.router.navigate(['/dashboard/stock']);
  }

  navigateToSuppliers(): void {
    this.router.navigate(['/dashboard/suppliers']);
  }

  navigateToReports(): void {
    this.router.navigate(['/dashboard/reports']);
  }
}
