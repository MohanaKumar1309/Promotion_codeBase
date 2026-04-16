import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class App {
  protected readonly title = signal('PromoEngineX');
}
