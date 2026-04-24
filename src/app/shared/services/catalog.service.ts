import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Category, Product, CreateCategoryRequest, CreateProductRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private readonly apiUrl = 'http://localhost:8082/api/catalog';

  constructor(private http: HttpClient) {}

  createCategory(request: CreateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/categories`, request);
  }

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`);
  }

  deleteCategory(categoryId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/categories/${categoryId}`);
  }

  createProduct(request: CreateProductRequest): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}/products`, request);
  }

  getProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products`);
  }

  updateProduct(productId: number, request: CreateProductRequest): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/products/${productId}`, request);
  }

  deleteProduct(productId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/products/${productId}`);
  }

  uploadProductImage(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/products/upload-image`, formData);
  }
}
