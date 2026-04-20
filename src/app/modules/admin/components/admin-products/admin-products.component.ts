import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CatalogService } from '../../../../shared/services';
import { Product, Category } from '../../../../shared/models';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  productForm: FormGroup;
  products: Product[] = [];
  categories: Category[] = [];
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required],
      imageUrl: [''],
      stockQuantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
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

  onCreateProduct(): void {
    if (this.productForm.invalid) return;

    this.loading = true;
    const formVal = this.productForm.value;
    const request = {
      name: formVal.name,
      sku: formVal.sku,
      price: formVal.price,
      categoryId: Number(formVal.categoryId),
      imageUrl: formVal.imageUrl || undefined,
      stockQuantity: Number(formVal.stockQuantity) || 0
    };

    this.catalogService.createProduct(request).subscribe({
      next: () => {
        this.successMessage = 'Product added successfully!';
        this.productForm.reset();
        this.loadProducts();
        this.loading = false;
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Failed to add product.';
        setTimeout(() => { this.errorMessage = ''; }, 3000);
      }
    });
  }

  onDeleteProduct(productId: number): void {
    if (confirm('Are you sure?')) {
      this.catalogService.deleteProduct(productId).subscribe({
        next: () => { this.loadProducts(); }
      });
    }
  }
}
