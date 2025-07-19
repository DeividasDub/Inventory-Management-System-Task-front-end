import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SupplierService } from '../../services/supplier.service';
import { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from '../../models/supplier.interface';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { DeleteConfirmationModalComponent } from '../shared/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PaginationComponent, DeleteConfirmationModalComponent],
  templateUrl: './suppliers.component.html'
})
export class SuppliersComponent implements OnInit {
  suppliers: Supplier[] = [];
  paginatedSuppliers: Supplier[] = [];
  supplierForm: FormGroup;
  isLoading = false;
  isCreating = false;
  editingSupplier: Supplier | null = null;
  errorMessage = '';
  successMessage = '';
  showCreateForm = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  showDeleteModal: boolean = false;
  supplierToDelete: Supplier | null = null;

  constructor(
    private supplierService: SupplierService,
    private fb: FormBuilder
  ) {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      contactName: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.isLoading = true;
    this.supplierService.getAllSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.updatePaginatedSuppliers();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load suppliers';
        this.isLoading = false;
      }
    });
  }

  onCreateSupplier(): void {
    if (this.supplierForm.valid) {
      this.isCreating = true;
      const supplierData: CreateSupplierRequest = this.supplierForm.value;
      
      this.supplierService.createSupplier(supplierData).subscribe({
        next: (supplier) => {
          this.successMessage = 'Supplier created successfully';
          this.supplierForm.reset();
          this.showCreateForm = false;
          this.loadSuppliers();
          this.isCreating = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to create supplier';
          this.isCreating = false;
        }
      });
    }
  }

  onEditSupplier(supplier: Supplier): void {
    this.editingSupplier = supplier;
    this.supplierForm.patchValue({
      name: supplier.name,
      contactName: supplier.contactName,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address
    });
    this.showCreateForm = true;
  }

  onUpdateSupplier(): void {
    if (this.supplierForm.valid && this.editingSupplier) {
      this.isCreating = true;
      const supplierData: UpdateSupplierRequest = this.supplierForm.value;
      
      this.supplierService.updateSupplier(this.editingSupplier.id, supplierData).subscribe({
        next: (supplier) => {
          this.successMessage = 'Supplier updated successfully';
          this.supplierForm.reset();
          this.showCreateForm = false;
          this.editingSupplier = null;
          this.loadSuppliers();
          this.isCreating = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to update supplier';
          this.isCreating = false;
        }
      });
    }
  }

  onDeleteSupplier(supplier: Supplier): void {
    this.supplierToDelete = supplier;
    this.showDeleteModal = true;
  }

  onConfirmDelete(): void {
    if (this.supplierToDelete) {
      this.supplierService.deleteSupplier(this.supplierToDelete.id).subscribe({
        next: () => {
          this.successMessage = 'Supplier deleted successfully';
          this.showDeleteModal = false;
          this.supplierToDelete = null;
          this.loadSuppliers();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete supplier';
          this.showDeleteModal = false;
          this.supplierToDelete = null;
        }
      });
    }
  }

  onCancelDelete(): void {
    this.showDeleteModal = false;
    this.supplierToDelete = null;
  }

  cancelEdit(): void {
    this.editingSupplier = null;
    this.supplierForm.reset();
    this.showCreateForm = false;
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedSuppliers();
  }

  private updatePaginatedSuppliers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedSuppliers = this.suppliers.slice(startIndex, endIndex);
  }
}
