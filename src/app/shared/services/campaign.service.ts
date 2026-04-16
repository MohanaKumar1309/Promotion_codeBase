import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Campaign, CreateCampaignRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private readonly apiUrl = 'http://localhost:8082/api/campaigns';

  constructor(private http: HttpClient) {}

  createCampaign(request: CreateCampaignRequest): Observable<ApiResponse<Campaign>> {
    return this.http.post<ApiResponse<Campaign>>(this.apiUrl, request);
  }

  getCampaigns(): Observable<ApiResponse<Campaign[]>> {
    return this.http.get<ApiResponse<Campaign[]>>(this.apiUrl);
  }

  getActiveCampaigns(age: number): Observable<ApiResponse<Campaign[]>> {
    const params = new HttpParams().set('age', age.toString());
    return this.http.get<ApiResponse<Campaign[]>>(`${this.apiUrl}/active`, { params });
  }

  updateStatus(campaignId: number, status: string): Observable<ApiResponse<Campaign>> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<ApiResponse<Campaign>>(`${this.apiUrl}/${campaignId}/status`, null, { params });
  }

  deleteCampaign(campaignId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${campaignId}`);
  }
}
