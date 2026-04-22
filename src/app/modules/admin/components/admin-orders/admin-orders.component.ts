import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutService } from '../../../../shared/services';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  searchTerm = '';
  totalRevenue = 0;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 25;
  totalElements: number = 0;
  totalPages: number = 0;

  get filteredOrders(): any[] {
    if (!this.searchTerm.trim()) return this.orders;
    const term = this.searchTerm.toLowerCase();
    return this.orders.filter(o =>
      (o.customerName || '').toLowerCase().includes(term) ||
      (o.customerEmail || '').toLowerCase().includes(term) ||
      String(o.orderId).includes(term)
    );
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  constructor(private checkoutService: CheckoutService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.checkoutService.getAllOrdersAdmin(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.orders = res.data?.content || [];
        this.totalElements = res.data?.totalElements || 0;
        this.totalPages = res.data?.totalPages || 0;
        this.totalRevenue = this.orders.reduce((sum, o) => sum + (o.finalAmount || 0), 0);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadOrders();
  }

  onSearch(term: string): void {
    this.searchTerm = term;
  }
}
