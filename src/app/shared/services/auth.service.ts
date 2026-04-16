import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, AuthResponse, LoginRequest, SignupRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8082/api/auth';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, request);
  }

  customerSignup(request: SignupRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/customer/signup`, request);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  setUserData(data: AuthResponse): void {
    localStorage.setItem('userId', data.userId.toString());
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', typeof data.role === 'string' ? data.role : data.role);
    localStorage.setItem('name', data.name);
    localStorage.setItem('token', data.token);
    if (data.age != null) {
      localStorage.setItem('age', data.age.toString());
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('age');
    localStorage.removeItem('cart');
  }
}
