import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService, CatalogService, AuditLogService } from '../../../../shared/services';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalCategories: 0,
    totalProducts: 0,
    totalLogs: 0
  };

  constructor(
    private userService: UserService,
    private catalogService: CatalogService,
    private auditLogService: AuditLogService
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (r) => { this.stats.totalUsers = r.data?.length || 0; },
      error: () => {}
    });
    this.catalogService.getCategories().subscribe({
      next: (r) => { this.stats.totalCategories = r.data?.length || 0; },
      error: () => {}
    });
    this.catalogService.getProducts().subscribe({
      next: (r) => { this.stats.totalProducts = r.data?.length || 0; },
      error: () => {}
    });
    this.auditLogService.getAuditLogs().subscribe({
      next: (r) => { this.stats.totalLogs = r.data?.length || 0; },
      error: () => {}
    });
  }
}
