import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionService, CampaignService, CouponService } from '../../../shared/services';
import { Promotion, Campaign, Coupon } from '../../../shared/models';

@Component({
  selector: 'app-store-manager-approvals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store-manager-approvals.component.html',
  styleUrl: './store-manager-approvals.component.css'
})
export class StoreManagerApprovalsComponent implements OnInit {
  activeTab: string = 'promotions';
  promotions: Promotion[] = [];
  campaigns: Campaign[] = [];
  coupons: Coupon[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private promotionService: PromotionService,
    private campaignService: CampaignService,
    private couponService: CouponService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loadPromotions();
    this.loadCampaigns();
    this.loadCoupons();
  }

  loadPromotions(): void {
    this.promotionService.getPromotions().subscribe({
      next: (res) => {
        this.promotions = (res.data || []).filter(p => p.status === 'PENDING');
      },
      error: () => { this.promotions = []; }
    });
  }

  loadCampaigns(): void {
    this.campaignService.getCampaigns().subscribe({
      next: (res) => {
        this.campaigns = (res.data || []).filter(c => c.status === 'PENDING');
      },
      error: () => { this.campaigns = []; }
    });
  }

  loadCoupons(): void {
    this.couponService.getCoupons().subscribe({
      next: (res) => {
        this.coupons = (res.data || []).filter(c => c.status === 'PENDING');
      },
      error: () => { this.coupons = []; }
    });
  }

  approvePromotion(promotionId: number): void {
    this.promotionService.updateStatus(promotionId, 'APPROVED').subscribe({
      next: () => {
        this.showSuccess('Promotion approved.');
        this.loadPromotions();
      },
      error: () => this.showError('Failed to approve promotion.')
    });
  }

  rejectPromotion(promotionId: number): void {
    this.promotionService.updateStatus(promotionId, 'REJECTED').subscribe({
      next: () => {
        this.showSuccess('Promotion rejected.');
        this.loadPromotions();
      },
      error: () => this.showError('Failed to reject promotion.')
    });
  }

  approveCampaign(campaignId: number): void {
    this.campaignService.updateStatus(campaignId, 'APPROVED').subscribe({
      next: () => {
        this.showSuccess('Campaign approved.');
        this.loadCampaigns();
      },
      error: () => this.showError('Failed to approve campaign.')
    });
  }

  rejectCampaign(campaignId: number): void {
    this.campaignService.updateStatus(campaignId, 'REJECTED').subscribe({
      next: () => {
        this.showSuccess('Campaign rejected.');
        this.loadCampaigns();
      },
      error: () => this.showError('Failed to reject campaign.')
    });
  }

  approveCoupon(couponId: number): void {
    this.couponService.updateStatus(couponId, 'APPROVED').subscribe({
      next: () => {
        this.showSuccess('Coupon approved.');
        this.loadCoupons();
      },
      error: () => this.showError('Failed to approve coupon.')
    });
  }

  rejectCoupon(couponId: number): void {
    this.couponService.updateStatus(couponId, 'REJECTED').subscribe({
      next: () => {
        this.showSuccess('Coupon rejected.');
        this.loadCoupons();
      },
      error: () => this.showError('Failed to reject coupon.')
    });
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    this.errorMessage = '';
    setTimeout(() => { this.successMessage = ''; }, 3000);
  }

  private showError(msg: string): void {
    this.errorMessage = msg;
    this.successMessage = '';
    setTimeout(() => { this.errorMessage = ''; }, 3000);
  }
}
