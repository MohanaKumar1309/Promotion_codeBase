import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLogService } from '../../../shared/services';
import { AuditLog } from '../../../shared/models';

@Component({
  selector: 'app-admin-audit-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-audit-logs.component.html',
  styleUrl: './admin-audit-logs.component.css'
})
export class AdminAuditLogsComponent implements OnInit {
  auditLogs: AuditLog[] = [];

  constructor(private auditLogService: AuditLogService) {}

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    this.auditLogService.getAuditLogs().subscribe({
      next: (response) => {
        if (response.success) {
          this.auditLogs = response.data;
        }
      }
    });
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
