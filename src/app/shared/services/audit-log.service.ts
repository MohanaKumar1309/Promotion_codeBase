import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, AuditLog } from '../models';

export interface PagedData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private readonly apiUrl = 'http://localhost:8082/api/audit-logs';

  constructor(private http: HttpClient) {}

  getAuditLogsPaged(page: number = 0, size: number = 25): Observable<ApiResponse<PagedData<AuditLog>>> {
    return this.http.get<ApiResponse<PagedData<AuditLog>>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }
}
