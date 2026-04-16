import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar.component';

@Component({
  selector: 'app-store-manager-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: './store-manager-layout.component.html',
  styleUrl: './store-manager-layout.component.css'
})
export class StoreManagerLayoutComponent implements OnInit {
  userRole: string = '';

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role') || '';
  }
}
