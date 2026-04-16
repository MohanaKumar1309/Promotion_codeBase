import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CampaignService, CouponService } from '../../../shared/services';

@Component({
  selector: 'app-marketing-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './marketing-manager-dashboard.component.html',
  styleUrl: './marketing-manager-dashboard.component.css'
})
export class MarketingManagerDashboardComponent implements OnInit {
  stats = {
    totalCampaigns: 0,
    totalCoupons: 0,
    pendingApproval: 0,
    usedCoupons: 0,
    activeCampaigns: 0,
    activeCoupons: 0,
    rejectedCoupons: 0
  };

  private campaignsPending = 0;
  private couponsPending = 0;

  constructor(
    private campaignService: CampaignService,
    private couponService: CouponService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.campaignService.getCampaigns().subscribe({
      next: (response) => {
        if (response.data) {
          const campaigns = response.data;
          this.stats.totalCampaigns = campaigns.length;
          this.stats.activeCampaigns = campaigns.filter((c: any) => c.status === 'APPROVED').length;
          this.campaignsPending = campaigns.filter((c: any) => c.status === 'PENDING').length;
          this.stats.pendingApproval = this.campaignsPending + this.couponsPending;
        }
      },
      error: (err) => console.error('Failed to load campaigns', err)
    });

    this.couponService.getCoupons().subscribe({
      next: (response) => {
        if (response.data) {
          const coupons = response.data;
          this.stats.totalCoupons = coupons.length;
          this.stats.activeCoupons = coupons.filter((c: any) => c.status === 'APPROVED').length;
          this.stats.rejectedCoupons = coupons.filter((c: any) => c.status === 'REJECTED').length;
          this.stats.usedCoupons = coupons.filter((c: any) => (c.usageCount || 0) > 0).length;
          this.couponsPending = coupons.filter((c: any) => c.status === 'PENDING').length;
          this.stats.pendingApproval = this.campaignsPending + this.couponsPending;
        }
      },
      error: (err) => console.error('Failed to load coupons', err)
    });
  }
}
