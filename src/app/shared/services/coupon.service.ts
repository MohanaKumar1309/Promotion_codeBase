import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Coupon, CreateCouponRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private readonly apiUrl = 'http://localhost:8082/api/coupons';

  constructor(private http: HttpClient) {}

  createCoupon(request: CreateCouponRequest): Observable<ApiResponse<Coupon>> {
    return this.http.post<ApiResponse<Coupon>>(this.apiUrl, request);
  }

  getCoupons(): Observable<ApiResponse<Coupon[]>> {
    return this.http.get<ApiResponse<Coupon[]>>(this.apiUrl);
  }

  getActiveCoupons(): Observable<ApiResponse<Coupon[]>> {
    return this.http.get<ApiResponse<Coupon[]>>(`${this.apiUrl}/active`);
  }

  updateStatus(couponId: number, status: string): Observable<ApiResponse<Coupon>> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<ApiResponse<Coupon>>(`${this.apiUrl}/${couponId}/status`, null, { params });
  }

  deleteCoupon(couponId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${couponId}`);
  }
}
