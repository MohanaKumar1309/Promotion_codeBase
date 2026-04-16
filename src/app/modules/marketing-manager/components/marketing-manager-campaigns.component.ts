import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CampaignService, CatalogService } from '../../../shared/services';
import { Campaign, CreateCampaignRequest, Product, Category } from '../../../shared/models';

@Component({
  selector: 'app-marketing-manager-campaigns',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './marketing-manager-campaigns.component.html',
  styleUrl: './marketing-manager-campaigns.component.css'
})
export class MarketingManagerCampaignsComponent implements OnInit {
  campaignForm: FormGroup;
  campaigns: Campaign[] = [];
  products: Product[] = [];
  categories: Category[] = [];
  selectedProductIds: number[] = [];
  selectedCategoryIds: number[] = [];
  loading: boolean = false;
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private catalogService: CatalogService
  ) {
    this.campaignForm = this.fb.group({
      campaignName: ['', Validators.required],
      description: ['', Validators.required],
      minAge: [18, [Validators.required, Validators.min(1)]],
      maxAge: [65, [Validators.required, Validators.min(1)]],
      discountType: ['FLAT', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['PRODUCT', Validators.required]
    });
  }

  get selectedType(): string {
    return this.campaignForm.get('type')?.value || 'PRODUCT';
  }

  onTypeChange(): void {
    this.selectedProductIds = [];
    this.selectedCategoryIds = [];
  }

  ngOnInit(): void {
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
          this.campaigns = response.data;
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
    if (this.campaignForm.invalid) return;

    const type = this.selectedType;
    if (type === 'PRODUCT' && this.selectedProductIds.length === 0) {
      this.successMessage = '';
      return;
    }
    if (type === 'CATEGORY' && this.selectedCategoryIds.length === 0) {
      this.successMessage = '';
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
        this.campaignForm.reset();
        this.selectedProductIds = [];
        this.selectedCategoryIds = [];
        this.loadCampaigns();
        this.loading = false;
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: () => {
        this.loading = false;
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
