import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StockMovementService } from '../../services/stock-movement.service';
import { ProductService } from '../../services/product.service';
import { StockMovement, CreateStockMovementRequest, StockMovementType } from '../../models/stock-movement.interface';
import { Product } from '../../models/product.interface';
import { PaginationComponent } from '../shared/pagination/pagination.component';

@Component({
  selector: 'app-stock-movements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PaginationComponent],
  templateUrl: './stock-movements.component.html'
})
export class StockMovementsComponent implements OnInit {
  products: Product[] = [];
  stockMovements: StockMovement[] = [];
  paginatedStockMovements: StockMovement[] = [];
  movementForm: FormGroup;
  isLoading = false;
  isCreating = false;
  errorMessage = '';
  successMessage = '';
  showCreateForm = false;
  selectedProduct: Product | null = null;
  selectedProductId: number | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  StockMovementType = StockMovementType;

  constructor(
    private stockMovementService: StockMovementService,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.movementForm = this.fb.group({
      productId: [null, Validators.required],
      type: [null, Validators.required],
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
        this.currentPage = 1;
        this.updatePaginatedStockMovements();
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
    const movementData: CreateStockMovementRequest = this.movementForm.value;
    
    if (
      movementData.type === StockMovementType.OUT &&
      this.selectedProduct &&
      movementData.quantity > this.selectedProduct.quantityInStock
    ) {
      this.errorMessage = `Cannot remove more than available stock (${this.selectedProduct.quantityInStock})`;
      return;
    }

    this.isCreating = true;

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
  const selectedId = +target.value;

  if (selectedId) {
    this.selectedProductId = selectedId;
    this.selectedProduct = this.products.find(p => p.id === selectedId) || null;
    this.loadStockMovements(selectedId);
  } else {
    this.selectedProductId = null;
    this.selectedProduct = null;
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedStockMovements();
  }

  private updatePaginatedStockMovements(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedStockMovements = this.stockMovements.slice(startIndex, endIndex);
  }
}
