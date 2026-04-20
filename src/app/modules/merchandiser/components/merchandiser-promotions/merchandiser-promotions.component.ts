import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, ActivatedRoute } from "@angular/router";
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { PromotionService, CatalogService } from "../../../../shared/services";
import { Promotion, Product, Category } from "../../../../shared/models";

@Component({
  selector: "app-merchandiser-promotions",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./merchandiser-promotions.component.html",
  styleUrl: "./merchandiser-promotions.component.css"
})
export class MerchandiserPromotionsComponent implements OnInit {
  allPromotions: Promotion[] = [];
  promotions: Promotion[] = [];
  products: Product[] = [];
  categories: Category[] = [];
  loading: boolean = false;
  successMessage: string = "";
  errorMessage: string = "";
  selectedProductIds: number[] = [];
  selectedCategoryIds: number[] = [];
  filterStatus: string = '';
  promotionForm: any;

  constructor(
    private promotionService: PromotionService,
    private catalogService: CatalogService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.promotionForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
      discountType: ["FLAT", Validators.required],
      discountValue: [0, [Validators.required, Validators.min(0)]],
      type: ["PRODUCT", Validators.required],
      minQuantity: [1],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filterStatus = params['status'] || '';
      this.applyFilter();
    });
    this.loadPromotions();
    this.loadProducts();
    this.loadCategories();
  }

  applyFilter(): void {
    if (this.filterStatus) {
      this.promotions = this.allPromotions.filter(p => p.status === this.filterStatus);
    } else {
      this.promotions = [...this.allPromotions];
    }
  }

  get selectedType(): string {
    return this.promotionForm.get('type')?.value || 'PRODUCT';
  }

  onTypeChange(): void {
    this.selectedProductIds = [];
    this.selectedCategoryIds = [];
  }

  loadPromotions(): void {
    this.promotionService.getPromotions().subscribe({
      next: (response) => {
        this.allPromotions = response.data || [];
        this.applyFilter();
      },
      error: () => { this.errorMessage = "Failed to load promotions"; }
    });
  }

  loadProducts(): void {
    this.catalogService.getProducts().subscribe({
      next: (response) => { this.products = response.data || []; }
    });
  }

  loadCategories(): void {
    this.catalogService.getCategories().subscribe({
      next: (response) => { this.categories = response.data || []; }
    });
  }

  toggleProduct(productId: number): void {
    const index = this.selectedProductIds.indexOf(productId);
    if (index === -1) this.selectedProductIds.push(productId);
    else this.selectedProductIds.splice(index, 1);
  }

  toggleCategory(categoryId: number): void {
    const index = this.selectedCategoryIds.indexOf(categoryId);
    if (index === -1) this.selectedCategoryIds.push(categoryId);
    else this.selectedCategoryIds.splice(index, 1);
  }

  onCreatePromotion(): void {
    if (!this.promotionForm.valid) {
      this.errorMessage = "Please fill all required fields";
      setTimeout(() => (this.errorMessage = ""), 3000);
      return;
    }

    const type = this.selectedType;
    if (type === 'PRODUCT' && this.selectedProductIds.length === 0) {
      this.errorMessage = "Please select at least one product.";
      setTimeout(() => (this.errorMessage = ""), 3000);
      return;
    }
    if (type === 'CATEGORY' && this.selectedCategoryIds.length === 0) {
      this.errorMessage = "Please select at least one category.";
      setTimeout(() => (this.errorMessage = ""), 3000);
      return;
    }

    this.loading = true;
    const request = {
      ...this.promotionForm.value,
      productIds: type === 'PRODUCT' ? this.selectedProductIds : [],
      categoryIds: type === 'CATEGORY' ? this.selectedCategoryIds : []
    };

    this.promotionService.createPromotion(request as any).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.successMessage = "Promotion created successfully!";
          this.promotionForm.reset({ discountType: 'FLAT', type: 'PRODUCT', minQuantity: 1 });
          this.selectedProductIds = [];
          this.selectedCategoryIds = [];
          setTimeout(() => (this.successMessage = ""), 3000);
          this.loadPromotions();
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || "Failed to create promotion";
        setTimeout(() => (this.errorMessage = ""), 3000);
      }
    });
  }

  onDeletePromotion(promotionId: number): void {
    if (!confirm("Are you sure?")) return;
    this.promotionService.deletePromotion(promotionId).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = "Promotion deleted!";
          this.loadPromotions();
          setTimeout(() => (this.successMessage = ""), 3000);
        }
      },
      error: () => {
        this.errorMessage = "Failed to delete promotion";
        setTimeout(() => (this.errorMessage = ""), 3000);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "APPROVED": return "bg-success";
      case "PENDING": return "bg-warning";
      case "REJECTED": return "bg-danger";
      default: return "bg-secondary";
    }
  }
}
