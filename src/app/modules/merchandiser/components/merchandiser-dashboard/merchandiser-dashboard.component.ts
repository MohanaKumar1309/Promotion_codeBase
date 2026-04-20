import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PromotionService, CatalogService } from '../../../../shared/services';

@Component({
  selector: 'app-merchandiser-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './merchandiser-dashboard.component.html',
  styleUrl: './merchandiser-dashboard.component.css'
})
export class MerchandiserDashboardComponent implements OnInit {
  stats = {
    activePromotions: 0,
    pendingPromotions: 0,
    completedPromotions: 0,
    totalProducts: 0,
    totalCategories: 0
  };

  constructor(
    private promotionService: PromotionService,
    private catalogService: CatalogService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Load promotions
    this.promotionService.getPromotions().subscribe({
      next: (response) => {
        if (response.data) {
          const promotions = response.data;
          this.stats.activePromotions = promotions.filter((p: any) => p.status === 'APPROVED').length;
          this.stats.pendingPromotions = promotions.filter((p: any) => p.status === 'PENDING').length;
          this.stats.completedPromotions = promotions.filter((p: any) => p.status === 'REJECTED').length;
        }
      },
      error: (err) => console.error('Failed to load promotions', err)
    });

    // Load products
    this.catalogService.getProducts().subscribe({
      next: (response) => {
        if (response.data) {
          this.stats.totalProducts = response.data.length;
        }
      },
      error: (err) => console.error('Failed to load products', err)
    });

    // Load categories
    this.catalogService.getCategories().subscribe({
      next: (response) => {
        if (response.data) {
          this.stats.totalCategories = response.data.length;
        }
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }
}
