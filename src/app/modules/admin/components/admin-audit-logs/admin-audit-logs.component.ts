import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditLogService } from '../../../../shared/services';
import { AuditLog } from '../../../../shared/models';

@Component({
  selector: 'app-admin-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-audit-logs.component.html',
  styleUrl: './admin-audit-logs.component.css'
})
export class AdminAuditLogsComponent implements OnInit {
  auditLogs: AuditLog[] = [];
  logSearch: string = '';
  actionFilter: string = '';
  loading: boolean = true;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 25;
  totalElements: number = 0;
  totalPages: number = 0;

  get filteredLogs(): AuditLog[] {
    const term = this.logSearch.toLowerCase().trim();
    return this.auditLogs.filter(log => {
      const matchesSearch = !term ||
        (log.userName || '').toLowerCase().includes(term) ||
        (log.userEmail || '').toLowerCase().includes(term) ||
        (log.action || '').toLowerCase().includes(term) ||
        (log.metadata || '').toLowerCase().includes(term);
      const matchesAction = !this.actionFilter ||
        (log.action || '').toUpperCase().includes(this.actionFilter);
      return matchesSearch && matchesAction;
    });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  constructor(private auditLogService: AuditLogService) {}

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    this.loading = true;
    this.auditLogService.getAuditLogsPaged(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        if (response.success) {
          this.auditLogs = response.data.content;
          this.totalElements = response.data.totalElements;
          this.totalPages = response.data.totalPages;
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadAuditLogs();
  }

  getActionBadgeClass(action: string): string {
    if (!action) return 'bg-secondary';
    const a = action.toUpperCase();
    if (a.includes('CREATE')) return 'bg-success';
    if (a.includes('DELETE')) return 'bg-danger';
    if (a.includes('UPDATE') || a.includes('STATUS')) return 'bg-warning';
    if (a.includes('LOGIN') || a.includes('LOGOUT')) return 'bg-info';
    return 'bg-secondary';
  }
}
