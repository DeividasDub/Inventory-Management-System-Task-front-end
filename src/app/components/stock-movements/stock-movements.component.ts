import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StockMovementService } from '../../services/stock-movement.service';
import { ProductService } from '../../services/product.service';
import { StockMovement, CreateStockMovementRequest, StockMovementType } from '../../models/stock-movement.interface';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-stock-movements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './stock-movements.component.html'
})
export class StockMovementsComponent implements OnInit {
  products: Product[] = [];
  stockMovements: StockMovement[] = [];
  movementForm: FormGroup;
  isLoading = false;
  isCreating = false;
  errorMessage = '';
  successMessage = '';
  showCreateForm = false;
  selectedProductId: number | null = null;

  StockMovementType = StockMovementType;

  constructor(
    private stockMovementService: StockMovementService,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.movementForm = this.fb.group({
      productId: ['', Validators.required],
      type: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      reason: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
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

  loadStockMovements(productId: number): void {
    this.isLoading = true;
    this.stockMovementService.getProductStockMovements(productId, 20).subscribe({
      next: (movements) => {
        this.stockMovements = movements;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load stock movements';
        this.isLoading = false;
      }
    });
  }

  onCreateMovement(): void {
    if (this.movementForm.valid) {
      this.isCreating = true;
      const movementData: CreateStockMovementRequest = this.movementForm.value;
      
      this.stockMovementService.createStockMovement(movementData).subscribe({
        next: (movement) => {
          this.successMessage = 'Stock movement created successfully';
          this.movementForm.reset();
          this.showCreateForm = false;
          if (this.selectedProductId) {
            this.loadStockMovements(this.selectedProductId);
          }
          this.isCreating = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to create stock movement';
          this.isCreating = false;
        }
      });
    }
  }

  onProductSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const productId = +target.value;
    if (productId) {
      this.selectedProductId = productId;
      this.loadStockMovements(productId);
    }
  }

  cancelCreate(): void {
    this.movementForm.reset();
    this.showCreateForm = false;
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
