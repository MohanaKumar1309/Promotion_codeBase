import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../shared/services';
import { LoginRequest } from '../../../../shared/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isAdmin: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isAdmin = params['role'] === 'admin';
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const request: LoginRequest = this.loginForm.value;

    this.authService.login(request).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.authService.setUserData(response.data);
          this.redirectBasedOnRole(response.data.role);
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  private redirectBasedOnRole(role: string): void {
    const roleRoutes: { [key: string]: string } = {
      'ADMIN': '/admin',
      'MERCHANDISER': '/merchandiser',
      'MARKETING_MANAGER': '/marketing-manager',
      'STORE_MANAGER': '/store-manager',
      'CUSTOMER': '/customer'
    };

    const route = roleRoutes[role];
    if (route) {
      this.router.navigate([route]);
    } else {
      this.router.navigate(['/landing']);
    }
  }

  goBack(): void {
    this.router.navigate(['/landing']);
  }
}
