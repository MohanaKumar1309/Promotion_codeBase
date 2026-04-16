import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CatalogService, CouponService, CampaignService, PromotionService } from "../../../shared/services";
import { Product, Coupon, Campaign, Category, Promotion } from "../../../shared/models";

@Component({
  selector: "app-customer-shop",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./customer-shop.component.html",
  styleUrl: "./customer-shop.component.css"
})
export class CustomerShopComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  coupons: Coupon[] = [];
  campaigns: Campaign[] = [];
  activePromotions: Promotion[] = [];
  filteredProducts: Product[] = [];
  selectedCategoryId: number | null = null;
  searchTerm: string = "";
  cartCount: number = 0;

  constructor(
    private catalogService: CatalogService,
    private couponService: CouponService,
    private campaignService: CampaignService,
    private promotionService: PromotionService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadCoupons();
    this.loadCampaigns();
    this.loadActivePromotions();
    this.updateCartCount();
  }

  loadProducts(): void {
    this.catalogService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data || [];
        this.filteredProducts = this.products;
      },
      error: (err) => console.error("Failed to load products", err)
    });
  }

  loadCategories(): void {
    this.catalogService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data || [];
      },
      error: (err) => console.error("Failed to load categories", err)
    });
  }

  loadCoupons(): void {
    this.couponService.getActiveCoupons().subscribe({
      next: (response) => {
        this.coupons = response.data || [];
      },
      error: (err) => console.error("Failed to load coupons", err)
    });
  }

  loadCampaigns(): void {
    const age = parseInt(localStorage.getItem('age') || '25', 10);
    this.campaignService.getActiveCampaigns(age).subscribe({
      next: (response) => {
        this.campaigns = response.data || [];
      },
      error: (err) => console.error("Failed to load campaigns", err)
    });
  }

  loadActivePromotions(): void {
    this.promotionService.getActivePromotions().subscribe({
      next: (res) => { this.activePromotions = res.data || []; },
      error: () => {}
    });
  }

  filterByCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = this.selectedCategoryId === null || product.categoryId === this.selectedCategoryId;
      const matchesSearch = !this.searchTerm || product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  addToCart(product: Product): void {
    const cart = JSON.parse(localStorage.getItem("cart") || "{\"items\":[]}");
    const existingItem = cart.items.find((item: any) => item.product.productId === product.productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    this.updateCartCount();
  }

  updateCartCount(): void {
    const cart = JSON.parse(localStorage.getItem("cart") || "{\"items\":[]}");
    this.cartCount = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }

  isInCampaign(product: Product): boolean {
    return this.campaigns.some(campaign =>
      (campaign.productIds || []).includes(product.productId) ||
      (campaign.categoryIds || []).includes(product.categoryId)
    );
  }

  getCampaignForProduct(product: Product): Campaign | undefined {
    return this.campaigns.find(campaign =>
      (campaign.productIds || []).includes(product.productId) ||
      (campaign.categoryIds || []).includes(product.categoryId)
    );
  }

  getPromotionForProduct(product: Product): Promotion | undefined {
    return this.activePromotions.find(promo =>
      (promo.productIds || []).includes(product.productId) ||
      (promo.categoryIds || []).includes(product.categoryId)
    );
  }

  getDiscountedPrice(product: Product): number | null {
    // Promotion-level discount (per-product)
    const promo = this.getPromotionForProduct(product);
    if (promo) {
      if (promo.discountType === 'FLAT') return Math.max(0, product.price - promo.discountValue);
      if (promo.discountType === 'PERCENTAGE') return product.price * (1 - promo.discountValue / 100);
      if (promo.discountType === 'BOGO') return product.price / 2;
    }
    return null;
  }

  getCampaignLabel(product: Product): string | null {
    const campaign = this.getCampaignForProduct(product);
    if (!campaign) return null;
    if (campaign.discountType === 'BOGO') return 'Buy 1 Get 1';
    const sign = campaign.discountType === 'PERCENTAGE' ? '%' : '$';
    return `${campaign.amount}${sign} OFF`;
  }
}
