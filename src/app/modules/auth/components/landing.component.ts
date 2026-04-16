import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  adminEmail = 'admin@promoenginex.com';
  adminPassword = 'admin123';

  constructor(private router: Router) {}

  navigateToAdminLogin() {
    this.router.navigate(['/login'], { queryParams: { role: 'admin' } });
  }

  navigateToCustomerLogin() {
    this.router.navigate(['/login'], { queryParams: { role: 'customer' } });
  }

  navigateToCustomerSignup() {
    this.router.navigate(['/signup']);
  }
}
