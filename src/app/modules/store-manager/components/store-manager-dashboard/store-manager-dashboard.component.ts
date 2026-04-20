import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalyticsService, NotificationService, PromotionService, CampaignService, CouponService } from '../../../../shared/services';
import { AnalyticsSummary, Notification } from '../../../../shared/models';

@Component({
  selector: 'app-store-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './store-manager-dashboard.component.html',
  styleUrl: './store-manager-dashboard.component.css'
})
export class StoreManagerDashboardComponent implements OnInit {
  analytics: AnalyticsSummary[] = [];
  notifications: Notification[] = [];
  pendingPromotions: number = 0;
  pendingCampaigns: number = 0;
  pendingCoupons: number = 0;

  constructor(
    private analyticsService: AnalyticsService,
    private notificationService: NotificationService,
    private promotionService: PromotionService,
    private campaignService: CampaignService,
    private couponService: CouponService
  ) {}

  ngOnInit(): void {
    this.loadAnalytics();
    this.loadNotifications();
    this.loadPendingCounts();
  }

  loadAnalytics(): void {
    this.analyticsService.getAnalyticsSummary().subscribe({
      next: (response) => {
        if (response.success) {
          this.analytics = response.data || [];
        }
      }
    });
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (response) => {
        if (response.success) {
          this.notifications = (response.data || []).slice(0, 5);
        }
      }
    });
  }

  loadPendingCounts(): void {
    this.promotionService.getPromotions().subscribe({
      next: (res) => {
        this.pendingPromotions = (res.data || []).filter(p => p.status === 'PENDING').length;
      }
    });
    this.campaignService.getCampaigns().subscribe({
      next: (res) => {
        this.pendingCampaigns = (res.data || []).filter(c => c.status === 'PENDING').length;
      }
    });
    this.couponService.getCoupons().subscribe({
      next: (res) => {
        this.pendingCoupons = (res.data || []).filter(c => c.status === 'PENDING').length;
      }
    });
  }

  get totalPendingApprovals(): number {
    return this.pendingPromotions + this.pendingCampaigns + this.pendingCoupons;
  }

  getSummaryFor(type: string): AnalyticsSummary | undefined {
    return this.analytics.find(a => a.referenceType === type);
  }
}
