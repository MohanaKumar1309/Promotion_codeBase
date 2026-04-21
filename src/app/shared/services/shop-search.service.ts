import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShopSearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

  refreshCartCount(): void {
    const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
    const count = (cart.items || []).reduce((sum: number, item: any) => sum + item.quantity, 0);
    this.cartCountSubject.next(count);
  }
}
