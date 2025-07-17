import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { StockMovement } from '../../models/stock-movement.interface';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {
  lowStockProducts: Product[] = [];
  stockMovements: StockMovement[] = [];
  products: Product[] = [];
  lowStockForm: FormGroup;
  movementForm: FormGroup;
  isLoadingLowStock = false;
  isLoadingMovements = false;
  errorMessage = '';
  selectedProductId: number | null = null;

  constructor(
    private reportService: ReportService,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.lowStockForm = this.fb.group({
      threshold: [10]
    });

    this.movementForm = this.fb.group({
      productId: [''],
      count: [10]
    });
  }

  ngOnInit(): void {
    this.loadLowStockProducts();
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load products';
      }
    });
  }

  loadLowStockProducts(): void {
    this.isLoadingLowStock = true;
    const threshold = this.lowStockForm.get('threshold')?.value || 10;
    
    this.reportService.getLowStockProducts(threshold).subscribe({
      next: (products) => {
        this.lowStockProducts = products;
        this.isLoadingLowStock = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load low stock products';
        this.isLoadingLowStock = false;
      }
    });
  }

  loadProductMovements(): void {
    const productId = this.movementForm.get('productId')?.value;
    const count = this.movementForm.get('count')?.value || 10;
    
    if (!productId) {
      this.errorMessage = 'Please select a product';
      return;
    }

    this.selectedProductId = productId;
    this.isLoadingMovements = true;
    
    this.reportService.getProductStockMovements(productId, count).subscribe({
      next: (movements) => {
        this.stockMovements = movements;
        this.isLoadingMovements = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load stock movements';
        this.isLoadingMovements = false;
      }
    });
  }

  getSelectedProductName(): string {
    if (!this.selectedProductId) return '';
    const product = this.products.find(p => p.id === this.selectedProductId);
    return product ? product.name : '';
  }

  clearMessages(): void {
    this.errorMessage = '';
  }
}
