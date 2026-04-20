import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../../shared/services';
import { AnalyticsSummary } from '../../../../shared/models';

@Component({
  selector: 'app-store-manager-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store-manager-analytics.component.html',
  styleUrl: './store-manager-analytics.component.css'
})
export class StoreManagerAnalyticsComponent implements OnInit {
  analytics: AnalyticsSummary[] = [];
  loading = true;

  private readonly types = ['CAMPAIGN', 'COUPON', 'PROMOTION'];
  private readonly labels: Record<string, string> = {
    CAMPAIGN: 'Campaign',
    COUPON: 'Coupon',
    PROMOTION: 'Promotion'
  };
  private readonly colors: Record<string, string> = {
    CAMPAIGN: '#4a5568',
    COUPON: '#718096',
    PROMOTION: '#a0aec0'
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.analyticsService.getAnalyticsSummary().subscribe({
      next: (res) => {
        this.analytics = res.data || [];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get chartRows(): { type: string; label: string; color: string; events: number; amount: number }[] {
    return this.types.map(type => {
      const entry = this.analytics.find(a => a.referenceType === type);
      return {
        type,
        label: this.labels[type],
        color: this.colors[type],
        events: entry?.totalEvents || 0,
        amount: entry?.totalAmount || 0
      };
    });
  }

  get maxEvents(): number {
    const max = Math.max(...this.chartRows.map(r => r.events), 1);
    return max;
  }

  get maxAmount(): number {
    const max = Math.max(...this.chartRows.map(r => r.amount), 1);
    return max;
  }

  eventPct(events: number): number {
    return Math.round((events / this.maxEvents) * 100);
  }

  amountPct(amount: number): number {
    return Math.round((amount / this.maxAmount) * 100);
  }

  get totalEvents(): number {
    return this.chartRows.reduce((s, r) => s + r.events, 0);
  }

  get totalAmount(): number {
    return this.chartRows.reduce((s, r) => s + r.amount, 0);
  }
}
