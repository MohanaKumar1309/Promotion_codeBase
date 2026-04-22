import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { CatalogService, CouponService, CampaignService, PromotionService, ShopSearchService } from "../../../../shared/services";
import { Product, Coupon, Campaign, Category, Promotion } from "../../../../shared/models";

@Component({
  selector: "app-customer-shop",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./customer-shop.component.html",
  styleUrl: "./customer-shop.component.css"
})
export class CustomerShopComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  coupons: Coupon[] = [];
  campaigns: Campaign[] = [];
  activePromotions: Promotion[] = [];
  filteredProducts: Product[] = [];
  selectedCategoryId: number | null = null;
  searchTerm: string = "";

  // Filters
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortOption: string = '';
  activeFilter: string = '';   // 'promo' | 'campaign' | ''

  // Campaign carousel
  currentCampaignIndex: number = 0;
  private carouselTimer: any;

  private searchSub!: Subscription;
  private routeSub!: Subscription;

  constructor(
    private catalogService: CatalogService,
    private couponService: CouponService,
    private campaignService: CampaignService,
    private promotionService: PromotionService,
    private shopSearchService: ShopSearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadCoupons();
    this.loadCampaigns();
    this.loadActivePromotions();
    this.shopSearchService.refreshCartCount();

    this.searchSub = this.shopSearchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.applyFilters();
    });

    this.routeSub = this.route.queryParams.subscribe(params => {
      this.activeFilter = params['filter'] || '';
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
    this.routeSub?.unsubscribe();
    this.stopCarousel();
  }

  loadProducts(): void {
    this.catalogService.getProducts().subscribe({
      next: (response: any) => {
        this.products = response.data || [];
        this.applyFilters();
      },
      error: (err: any) => console.error("Failed to load products", err)
    });
  }

  loadCategories(): void {
    this.catalogService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data || [];
      },
      error: (err: any) => console.error("Failed to load categories", err)
    });
  }

  loadCoupons(): void {
    this.couponService.getActiveCoupons().subscribe({
      next: (response: any) => {
        this.coupons = response.data || [];
      },
      error: (err: any) => console.error("Failed to load coupons", err)
    });
  }

  loadCampaigns(): void {
    const age = parseInt(localStorage.getItem('age') || '25', 10);
    this.campaignService.getActiveCampaigns(age).subscribe({
      next: (response: any) => {
        this.campaigns = response.data || [];
        if (this.campaigns.length > 1) {
          this.startCarousel();
        }
      },
      error: (err: any) => console.error("Failed to load campaigns", err)
    });
  }

  loadActivePromotions(): void {
    this.promotionService.getActivePromotions().subscribe({
      next: (res: any) => {
        this.activePromotions = res.data || [];
        this.applyFilters();
      },
      error: () => {}
    });
  }

  // ── Carousel ──────────────────────────────────────────

  startCarousel(): void {
    this.carouselTimer = setInterval(() => {
      this.currentCampaignIndex = (this.currentCampaignIndex + 1) % this.campaigns.length;
    }, 4000);
  }

  stopCarousel(): void {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
    }
  }

  prevCampaign(): void {
    this.stopCarousel();
    this.currentCampaignIndex = (this.currentCampaignIndex - 1 + this.campaigns.length) % this.campaigns.length;
    this.startCarousel();
  }

  nextCampaign(): void {
    this.stopCarousel();
    this.currentCampaignIndex = (this.currentCampaignIndex + 1) % this.campaigns.length;
    this.startCarousel();
  }

  goToCampaign(index: number): void {
    this.stopCarousel();
    this.currentCampaignIndex = index;
    this.startCarousel();
  }

  // ── Filtering ─────────────────────────────────────────

  filterByCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.minPrice = null;
    this.maxPrice = null;
    this.sortOption = '';
    this.applyFilters();
  }

  applyFilters(): void {
    let result = this.products.filter(product => {
      const matchesCategory = this.selectedCategoryId === null || product.categoryId === this.selectedCategoryId;
      const matchesSearch = !this.searchTerm || product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const effectivePrice = this.getDiscountedPrice(product) ?? product.price;
      const matchesMin = this.minPrice === null || effectivePrice >= this.minPrice;
      const matchesMax = this.maxPrice === null || effectivePrice <= this.maxPrice;

      // Sidebar filter from queryParam: promo or campaign
      let matchesFilter = true;
      if (this.activeFilter === 'promo') {
        matchesFilter = !!this.getPromotionForProduct(product);
      } else if (this.activeFilter === 'campaign') {
        matchesFilter = !!this.getCampaignForProduct(product);
      }

      return matchesCategory && matchesSearch && matchesMin && matchesMax && matchesFilter;
    });

    // Sort
    if (this.sortOption === 'price_asc') {
      result.sort((a, b) => (this.getDiscountedPrice(a) ?? a.price) - (this.getDiscountedPrice(b) ?? b.price));
    } else if (this.sortOption === 'price_desc') {
      result.sort((a, b) => (this.getDiscountedPrice(b) ?? b.price) - (this.getDiscountedPrice(a) ?? a.price));
    } else if (this.sortOption === 'name_az') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortOption === 'name_za') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    this.filteredProducts = result;
  }

  get filterLabel(): string {
    if (this.activeFilter === 'promo') return 'Promo Offers';
    if (this.activeFilter === 'campaign') return 'Campaign Deals';
    return '';
  }

  // ── Cart ──────────────────────────────────────────────

  isOutOfStock(product: Product): boolean {
    return product.stockQuantity !== undefined && product.stockQuantity !== null && product.stockQuantity <= 0;
  }

  addToCart(product: Product): void {
    if (this.isOutOfStock(product)) return;
    const cart = JSON.parse(localStorage.getItem("cart") || "{\"items\":[]}");
    const existingItem = cart.items.find((item: any) => item.product.productId === product.productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    this.shopSearchService.refreshCartCount();
  }

  // ── Promotions / Campaigns ────────────────────────────

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
    const promo = this.getPromotionForProduct(product);
    if (promo) {
      if (promo.discountType === 'FLAT') return Math.max(0, product.price - promo.discountValue);
      if (promo.discountType === 'PERCENTAGE') return product.price * (1 - promo.discountValue / 100);
      if (promo.discountType === 'BOGO') return product.price / 2;  // 50% off (2nd item free)
    }
    return null;
  }

  getCampaignLabel(product: Product): string | null {
    const campaign = this.getCampaignForProduct(product);
    if (!campaign) return null;
    if (campaign.discountType === 'BOGO') return 'Buy 1 Get 1';
    const sign = campaign.discountType === 'PERCENTAGE' ? '%' : '₹';
    return `${campaign.amount}${sign} OFF`;
  }

  getCampaignDiscountLabel(campaign: Campaign): string {
    if (campaign.discountType === 'BOGO') return 'Buy 1 Get 1 FREE';
    const sign = campaign.discountType === 'PERCENTAGE' ? '%' : '₹';
    return `${campaign.amount}${sign} OFF`;
  }
}
