import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, AnalyticsSummary } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly apiUrl = 'http://localhost:8082/api/analytics';

  constructor(private http: HttpClient) {}

  getAnalyticsSummary(): Observable<ApiResponse<AnalyticsSummary[]>> {
    return this.http.get<ApiResponse<AnalyticsSummary[]>>(`${this.apiUrl}/summary`);
  }
}
