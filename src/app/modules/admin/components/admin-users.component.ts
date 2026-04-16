import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService, CatalogService } from '../../../shared/services';
import { User, CreateUserRequest } from '../../../shared/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  userForm: FormGroup;
  users: User[] = [];
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
      role: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onCreateUser(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: CreateUserRequest = this.userForm.value;

    this.userService.createUser(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'User created successfully!';
          this.userForm.reset();
          this.loadUsers();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Failed to create user';
      }
    });
  }

  onDeleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.successMessage = 'User deleted successfully!';
          this.loadUsers();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to delete user';
        }
      });
    }
  }

  formatRole(role: string): string {
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'Admin',
      'MERCHANDISER': 'Merchandiser',
      'MARKETING_MANAGER': 'Marketing Manager',
      'STORE_MANAGER': 'Store Manager',
      'CUSTOMER': 'Customer'
    };
    return roleMap[role] || role;
  }

  getRoleBadgeClass(role: string): string {
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'bg-danger',
      'MERCHANDISER': 'bg-info',
      'MARKETING_MANAGER': 'bg-warning',
      'STORE_MANAGER': 'bg-success',
      'CUSTOMER': 'bg-secondary'
    };
    return roleMap[role] || 'bg-secondary';
  }
}
