import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, AuditLog } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private readonly apiUrl = 'http://localhost:8082/api/audit-logs';

  constructor(private http: HttpClient) {}

  getAuditLogs(): Observable<ApiResponse<AuditLog[]>> {
    return this.http.get<ApiResponse<AuditLog[]>>(this.apiUrl);
  }
}
