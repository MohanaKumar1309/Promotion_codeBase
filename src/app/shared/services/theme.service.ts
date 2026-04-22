import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _isDark = new BehaviorSubject<boolean>(true);
  isDark$ = this._isDark.asObservable();

  constructor() {
    const saved = localStorage.getItem('theme');
    const dark = saved !== null ? saved === 'dark' : true;
    this._isDark.next(dark);
    this.apply(dark);
  }

  toggle(): void {
    const dark = !this._isDark.value;
    this._isDark.next(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    this.apply(dark);
  }

  get isDark(): boolean {
    return this._isDark.value;
  }

  private apply(dark: boolean): void {
    document.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
  }
}
