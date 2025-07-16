import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">Inventory Management System</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">Welcome, {{ user?.email }}</span>
              <button
                (click)="logout()"
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div class="text-center">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
              <p class="text-gray-600 mb-6">Welcome to your inventory management dashboard!</p>
              
              <div class="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
                <h3 class="text-lg font-medium text-gray-900 mb-4">User Information</h3>
                <div class="space-y-2 text-left">
                  <p><span class="font-medium">Email:</span> {{ user?.email }}</p>
                  <p><span class="font-medium">Roles:</span> 
                    <span *ngFor="let role of user?.roles; let last = last" class="inline-block">
                      <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{{ role }}</span>
                      <span *ngIf="!last" class="mx-1"></span>
                    </span>
                  </p>
                </div>
              </div>

              <div class="mt-8">
                <p class="text-gray-500 text-sm">
                  This is a placeholder dashboard. Future features will include:
                </p>
                <ul class="mt-2 text-gray-500 text-sm space-y-1">
                  <li>• Product management</li>
                  <li>• Stock tracking</li>
                  <li>• Supplier management</li>
                  <li>• Reporting and analytics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
