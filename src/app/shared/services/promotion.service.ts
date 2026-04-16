import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Promotion, CreatePromotionRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private readonly apiUrl = 'http://localhost:8082/api/promotions';

  constructor(private http: HttpClient) {}

  createPromotion(request: CreatePromotionRequest): Observable<ApiResponse<Promotion>> {
    return this.http.post<ApiResponse<Promotion>>(this.apiUrl, request);
  }

  getPromotions(): Observable<ApiResponse<Promotion[]>> {
    return this.http.get<ApiResponse<Promotion[]>>(this.apiUrl);
  }

  getActivePromotions(): Observable<ApiResponse<Promotion[]>> {
    return this.http.get<ApiResponse<Promotion[]>>(`${this.apiUrl}/active`);
  }

  updateStatus(promotionId: number, status: string): Observable<ApiResponse<Promotion>> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<ApiResponse<Promotion>>(`${this.apiUrl}/${promotionId}/status`, null, { params });
  }

  deletePromotion(promotionId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${promotionId}`);
  }
}
