import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, CheckoutRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly apiUrl = 'http://localhost:8082/api/redemptions';

  constructor(private http: HttpClient) {}

  checkout(request: CheckoutRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/checkout`, request);
  }
}
