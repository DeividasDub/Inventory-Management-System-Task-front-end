import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { SupplierService } from '../../services/supplier.service';
import { AuthService } from '../../services/auth.service';
import { Product, CreateProductRequest, UpdateProductRequest, ProductSearchRequest } from '../../models/product.interface';
import { Supplier } from '../../models/supplier.interface';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { DeleteConfirmationModalComponent } from '../shared/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PaginationComponent, DeleteConfirmationModalComponent],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  suppliers: Supplier[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  productForm: FormGroup;
  searchForm: FormGroup;
  isLoading = false;
  isCreating = false;
  editingProduct: Product | null = null;
  errorMessage = '';
  successMessage = '';
  showCreateForm = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  showDeleteModal: boolean = false;
  productToDelete: Product | null = null;

  constructor(
    private productService: ProductService,
    private supplierService: SupplierService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      sku: ['', [Validators.required, Validators.maxLength(50)]],
      quantityInStock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      supplierId: ['', Validators.required]
    });

    this.searchForm = this.fb.group({
      name: [''],
      sku: [''],
      supplierId: [null],
      lowStockOnly: [false],
      lowStockThreshold: [10]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadSuppliers();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.updatePaginatedProducts();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load products';
        this.isLoading = false;
      }
    });
  }

  loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
      },
      error: (error) => {
        console.error('Failed to load suppliers', error);
      }
    });
  }

  onSearch(): void {
    this.isLoading = true;
    const searchRequest: ProductSearchRequest = this.searchForm.value;

    console.log("Search Request - ", searchRequest);

    this.productService.searchProducts(searchRequest).subscribe({
      next: (products) => {
        this.filteredProducts = products;
        this.currentPage = 1;
        this.updatePaginatedProducts();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Search failed';
        this.isLoading = false;
      }
    });
  }

  onCreateProduct(): void {
    if (this.productForm.valid) {
      this.isCreating = true;
      const productData: CreateProductRequest = this.productForm.value;
      
      this.productService.createProduct(productData).subscribe({
        next: (product) => {
          this.successMessage = 'Product created successfully';
          this.productForm.reset();
          this.showCreateForm = false;
          this.loadProducts();
          this.isCreating = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to create product';
          this.isCreating = false;
        }
      });
    }
  }

  onEditProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm.patchValue({
      name: product.name,
      sku: product.sku,
      quantityInStock: product.quantityInStock,
      price: product.price,
      supplierId: product.supplierId
    });
    this.showCreateForm = true;
  }

  onUpdateProduct(): void {
    if (this.productForm.valid && this.editingProduct) {
      this.isCreating = true;
      const productData: UpdateProductRequest = this.productForm.value;
      
      this.productService.updateProduct(this.editingProduct.id, productData).subscribe({
        next: (product) => {
          this.successMessage = 'Product updated successfully';
          this.productForm.reset();
          this.showCreateForm = false;
          this.editingProduct = null;
          this.loadProducts();
          this.isCreating = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to update product';
          this.isCreating = false;
        }
      });
    }
  }

  onDeleteProduct(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  onConfirmDelete(): void {
    if (this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.successMessage = 'Product deleted successfully';
          this.showDeleteModal = false;
          this.productToDelete = null;
          this.loadProducts();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete product';
          this.showDeleteModal = false;
          this.productToDelete = null;
        }
      });
    }
  }

  onCancelDelete(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  cancelEdit(): void {
    this.editingProduct = null;
    this.productForm.reset();
    this.showCreateForm = false;
  }

  isAdmin(): boolean {
    return this.authService.getCurrentUser()?.roles?.includes('Admin') || false;
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  private updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }
}
