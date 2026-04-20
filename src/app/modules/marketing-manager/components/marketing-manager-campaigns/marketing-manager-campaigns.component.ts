import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CampaignService, CatalogService } from '../../../../shared/services';
import { Campaign, CreateCampaignRequest, Product, Category } from '../../../../shared/models';

@Component({
  selector: 'app-marketing-manager-campaigns',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './marketing-manager-campaigns.component.html',
  styleUrl: './marketing-manager-campaigns.component.css'
})
export class MarketingManagerCampaignsComponent implements OnInit {
  campaignForm: FormGroup;
  allCampaigns: Campaign[] = [];
  campaigns: Campaign[] = [];
  products: Product[] = [];
  categories: Category[] = [];
  selectedProductIds: number[] = [];
  selectedCategoryIds: number[] = [];
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  filterStatus: string = '';

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private catalogService: CatalogService,
    private route: ActivatedRoute
  ) {
    this.campaignForm = this.fb.group({
      campaignName: ['', Validators.required],
      description: ['', Validators.required],
      minAge: [18, [Validators.required, Validators.min(1), Validators.max(120)]],
      maxAge: [65, [Validators.required, Validators.min(1), Validators.max(120)]],
      discountType: ['FLAT', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['PRODUCT', Validators.required]
    });
  }

  isFieldInvalid(field: string): boolean {
    const f = this.campaignForm.get(field);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  applyFilter(): void {
    this.campaigns = this.filterStatus
      ? this.allCampaigns.filter(c => c.status === this.filterStatus)
      : [...this.allCampaigns];
  }

  get selectedType(): string {
    return this.campaignForm.get('type')?.value || 'PRODUCT';
  }

  onTypeChange(): void {
    this.selectedProductIds = [];
    this.selectedCategoryIds = [];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filterStatus = params['status'] || '';
      this.applyFilter();
    });
    this.loadProducts();
    this.loadCategories();
    this.loadCampaigns();
  }

  loadProducts(): void {
    this.catalogService.getProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data;
        }
      }
    });
  }

  loadCategories(): void {
    this.catalogService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
        }
      }
    });
  }

  loadCampaigns(): void {
    this.campaignService.getCampaigns().subscribe({
      next: (response) => {
        if (response.success) {
          this.allCampaigns = response.data;
          this.applyFilter();
        }
      }
    });
  }

  onProductToggle(event: any, product: Product): void {
    if (event.target.checked) {
      this.selectedProductIds.push(product.productId);
    } else {
      this.selectedProductIds = this.selectedProductIds.filter(id => id !== product.productId);
    }
  }

  onCategoryToggle(event: any, category: Category): void {
    if (event.target.checked) {
      this.selectedCategoryIds.push(category.categoryId);
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== category.categoryId);
    }
  }

  onCreateCampaign(): void {
    if (this.campaignForm.invalid) {
      this.campaignForm.markAllAsTouched();
      return;
    }
    const minAge = this.campaignForm.value.minAge;
    const maxAge = this.campaignForm.value.maxAge;
    if (minAge >= maxAge) {
      this.errorMessage = 'Min age must be less than max age.';
      setTimeout(() => { this.errorMessage = ''; }, 3000);
      return;
    }
    const type = this.selectedType;
    if (type === 'PRODUCT' && this.selectedProductIds.length === 0) {
      this.errorMessage = 'Please select at least one product.';
      setTimeout(() => { this.errorMessage = ''; }, 3000);
      return;
    }
    if (type === 'CATEGORY' && this.selectedCategoryIds.length === 0) {
      this.errorMessage = 'Please select at least one category.';
      setTimeout(() => { this.errorMessage = ''; }, 3000);
      return;
    }

    this.loading = true;
    const { type: _type, ...formValues } = this.campaignForm.value;
    const request: CreateCampaignRequest = {
      ...formValues,
      productIds: type === 'PRODUCT' ? this.selectedProductIds : [],
      categoryIds: type === 'CATEGORY' ? this.selectedCategoryIds : []
    };

    this.campaignService.createCampaign(request).subscribe({
      next: () => {
        this.successMessage = 'Campaign created!';
        this.campaignForm.reset({ minAge: 18, maxAge: 65, discountType: 'FLAT', type: 'PRODUCT' });
        this.selectedProductIds = [];
        this.selectedCategoryIds = [];
        this.loadCampaigns();
        this.loading = false;
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Failed to create campaign.';
        setTimeout(() => { this.errorMessage = ''; }, 3000);
      }
    });
  }

  onDeleteCampaign(campaignId: number): void {
    if (confirm('Are you sure?')) {
      this.campaignService.deleteCampaign(campaignId).subscribe({
        next: () => {
          this.loadCampaigns();
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'bg-success';
      case 'PENDING': return 'bg-warning';
      case 'REJECTED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}
