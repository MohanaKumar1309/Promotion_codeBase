import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CatalogService } from '../../../../shared/services';
import { Product, Category } from '../../../../shared/models';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  productForm: FormGroup;
  products: Product[] = [];
  categories: Category[] = [];
  loading: boolean = false;
  uploadingImage: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  editingProductId: number | null = null;
  productSearch: string = '';

  // Image upload
  selectedFile: File | null = null;
  imagePreviewUrl: string = '';

  get filteredProducts(): Product[] {
    const term = this.productSearch.toLowerCase().trim();
    if (!term) return this.products;
    return this.products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      (p.sku || '').toLowerCase().includes(term) ||
      (p.categoryName || '').toLowerCase().includes(term)
    );
  }

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
        if (response.success) this.products = response.data;
      }
    });
  }

  loadCategories(): void {
    this.catalogService.getCategories().subscribe({
      next: (response) => {
        if (response.success) this.categories = response.data;
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.selectedFile = input.files[0];
    const reader = new FileReader();
    reader.onload = () => { this.imagePreviewUrl = reader.result as string; };
    reader.readAsDataURL(this.selectedFile);
  }

  private buildRequest(): any {
    const formVal = this.productForm.value;
    return {
      name: formVal.name,
      sku: formVal.sku,
      price: formVal.price,
      categoryId: Number(formVal.categoryId),
      imageUrl: formVal.imageUrl || undefined,
      stockQuantity: Number(formVal.stockQuantity) || 0
    };
  }

  onCreateProduct(): void {
    if (this.productForm.invalid) return;
    if (this.selectedFile) {
      this.uploadingImage = true;
      this.catalogService.uploadProductImage(this.selectedFile).subscribe({
        next: (res) => {
          this.uploadingImage = false;
          this.productForm.patchValue({ imageUrl: res.data });
          this.selectedFile = null;
          this.submitCreate();
        },
        error: () => {
          this.uploadingImage = false;
          this.errorMessage = 'Image upload failed. Product not saved.';
          setTimeout(() => { this.errorMessage = ''; }, 3000);
        }
      });
    } else {
      this.submitCreate();
    }
  }

  private submitCreate(): void {
    this.loading = true;
    this.catalogService.createProduct(this.buildRequest()).subscribe({
      next: () => {
        this.successMessage = 'Product added successfully!';
        this.productForm.reset({ stockQuantity: 0 });
        this.imagePreviewUrl = '';
        this.selectedFile = null;
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

  startEdit(product: Product): void {
    this.editingProductId = product.productId;
    this.selectedFile = null;
    this.imagePreviewUrl = product.imageUrl || '';
    this.productForm.patchValue({
      name: product.name,
      sku: product.sku,
      price: product.price,
      stockQuantity: product.stockQuantity ?? 0,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingProductId = null;
    this.selectedFile = null;
    this.imagePreviewUrl = '';
    this.productForm.reset({ stockQuantity: 0 });
  }

  onUpdateProduct(): void {
    if (this.productForm.invalid || !this.editingProductId) return;
    if (this.selectedFile) {
      this.uploadingImage = true;
      this.catalogService.uploadProductImage(this.selectedFile).subscribe({
        next: (res) => {
          this.uploadingImage = false;
          this.productForm.patchValue({ imageUrl: res.data });
          this.selectedFile = null;
          this.submitUpdate();
        },
        error: () => {
          this.uploadingImage = false;
          this.errorMessage = 'Image upload failed. Product not saved.';
          setTimeout(() => { this.errorMessage = ''; }, 3000);
        }
      });
    } else {
      this.submitUpdate();
    }
  }

  private submitUpdate(): void {
    this.loading = true;
    this.catalogService.updateProduct(this.editingProductId!, this.buildRequest()).subscribe({
      next: () => {
        this.successMessage = 'Product updated successfully!';
        this.cancelEdit();
        this.loadProducts();
        this.loading = false;
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Failed to update product.';
        setTimeout(() => { this.errorMessage = ''; }, 3000);
      }
    });
  }

  onDeleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.catalogService.deleteProduct(productId).subscribe({
        next: () => {
          this.successMessage = 'Product deleted.';
          this.loadProducts();
          setTimeout(() => { this.successMessage = ''; }, 3000);
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Failed to delete product.';
          setTimeout(() => { this.errorMessage = ''; }, 3000);
        }
      });
    }
  }
}
