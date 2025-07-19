import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { User, CreateUserRequest, UpdateUserRoleRequest, Role } from '../../models/user.interface';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  userForm: FormGroup;
  isLoading = false;
  isCreating = false;
  editingUser: User | null = null;
  errorMessage = '';
  successMessage = '';
  showCreateForm = false;

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
      const roleUpdate: UpdateUserRoleRequest = { roleId: this.userForm.value.roleId };
      
      this.userService.updateUserRole(this.editingUser.id, roleUpdate).subscribe({
        next: (user) => {
          this.successMessage = 'User role updated successfully';
          this.userForm.reset();
          this.showCreateForm = false;
          this.editingUser = null;
          this.loadUsers();
          this.isCreating = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to update user role';
          this.isCreating = false;
        }
      });
    }
  }

  onDeleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.successMessage = 'User deleted successfully';
          this.loadUsers();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete user';
        }
      });
    }
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
}
