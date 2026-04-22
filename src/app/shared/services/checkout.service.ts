import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, CheckoutRequest } from '../models';
import { PagedData } from './audit-log.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly apiUrl = 'http://localhost:8082/api/redemptions';

  constructor(private http: HttpClient) {}

  checkout(request: CheckoutRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/checkout`, request);
  }

  getOrderHistory(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/my-orders`);
  }

  getAllOrdersAdmin(page: number = 0, size: number = 25): Observable<ApiResponse<PagedData<any>>> {
    return this.http.get<ApiResponse<PagedData<any>>>(`${this.apiUrl}/admin/all?page=${page}&size=${size}`);
  }
}
