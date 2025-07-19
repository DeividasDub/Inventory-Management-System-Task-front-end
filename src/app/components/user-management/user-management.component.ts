import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { User, CreateUserRequest, UpdateUserRoleRequest, UpdateUserRequest, Role } from '../../models/user.interface';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { DeleteConfirmationModalComponent } from '../shared/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PaginationComponent, DeleteConfirmationModalComponent],
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  paginatedUsers: User[] = [];
  roles: Role[] = [];
  userForm: FormGroup;
  isLoading = false;
  isCreating = false;
  editingUser: User | null = null;
  errorMessage = '';
  successMessage = '';
  showCreateForm = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  showDeleteModal: boolean = false;
  userToDelete: User | null = null;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.updatePaginatedUsers();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users';
        this.isLoading = false;
      }
    });
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load roles';
      }
    });
  }

  onCreateUser(): void {
    if (this.userForm.valid) {
      this.isCreating = true;
      const userData: CreateUserRequest = this.userForm.value;
      
      this.userService.createUser(userData).subscribe({
        next: (user) => {
          this.successMessage = 'User created successfully';
          this.userForm.reset();
          this.showCreateForm = false;
          this.loadUsers();
          this.isCreating = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to create user';
          this.isCreating = false;
        }
      });
    }
  }

  onEditUser(user: User): void {
    this.editingUser = user;
    this.userForm.patchValue({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: '',
      roleId: this.roles.find(r => user.roleNames.includes(r.name))?.id || ''
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.showCreateForm = true;
  }

  onUpdateUser(): void {
    if (this.userForm.valid && this.editingUser) {
      this.isCreating = true;
      const userUpdate: UpdateUserRequest = {
        email: this.userForm.value.email,
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        roleId: this.userForm.value.roleId
      };
      
      this.userService.updateUser(this.editingUser.id, userUpdate).subscribe({
        next: (user) => {
          this.successMessage = 'User updated successfully';
          this.userForm.reset();
          this.showCreateForm = false;
          this.editingUser = null;
          this.loadUsers();
          this.isCreating = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to update user';
          this.isCreating = false;
        }
      });
    }
  }

  onDeleteUser(user: User): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  onConfirmDelete(): void {
    if (this.userToDelete) {
      this.userService.deleteUser(this.userToDelete.id).subscribe({
        next: () => {
          this.successMessage = 'User deleted successfully';
          this.showDeleteModal = false;
          this.userToDelete = null;
          this.loadUsers();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete user';
          this.showDeleteModal = false;
          this.userToDelete = null;
        }
      });
    }
  }

  onCancelDelete(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.userForm.reset();
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showCreateForm = false;
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedUsers();
  }

  private updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }
}
