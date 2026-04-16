import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Notification } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly apiUrl = 'http://localhost:8082/api/notifications';

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<ApiResponse<Notification[]>> {
    return this.http.get<ApiResponse<Notification[]>>(`${this.apiUrl}/me`);
  }

  markAsRead(notificationId: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/${notificationId}/read`, null);
  }
}
