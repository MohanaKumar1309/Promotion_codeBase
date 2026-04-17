import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutService } from '../../../shared/services';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.css'
})
export class CustomerOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(private checkoutService: CheckoutService) {}

  ngOnInit(): void {
    this.checkoutService.getOrderHistory().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.orders = response.data || [];
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to load order history.';
      }
    });
  }

  hasDiscount(order: any): boolean {
    return order.discountAmount && parseFloat(order.discountAmount) > 0;
  }

  formatApplied(order: any): string {
    const parts: string[] = [];
    if (order.appliedPromotions && order.appliedPromotions !== '[]') parts.push('Promotion');
    if (order.appliedCampaigns && order.appliedCampaigns !== '[]') parts.push('Campaign');
    if (order.appliedCoupon) parts.push(`Coupon: ${order.appliedCoupon}`);
    return parts.length ? parts.join(', ') : 'None';
  }
}
