import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CatalogService } from '../../../shared/services';
import { Category, CreateCategoryRequest } from '../../../shared/models';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit {
  categoryForm: FormGroup;
  categories: Category[] = [];
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService
  ) {
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
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

  onCreateCategory(): void {
    if (this.categoryForm.invalid) return;

    this.loading = true;
    const request: CreateCategoryRequest = this.categoryForm.value;

    this.catalogService.createCategory(request).subscribe({
      next: () => {
        this.successMessage = 'Category created successfully!';
        this.categoryForm.reset();
        this.loadCategories();
        this.loading = false;
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Failed to create category';
      }
    });
  }

  onDeleteCategory(categoryId: number): void {
    if (confirm('Are you sure?')) {
      this.catalogService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.loadCategories();
          this.successMessage = 'Category deleted!';
          setTimeout(() => { this.successMessage = ''; }, 3000);
        }
      });
    }
  }
}
