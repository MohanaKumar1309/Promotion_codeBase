import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar.component';

@Component({
  selector: 'app-merchandiser-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: './merchandiser-layout.component.html',
  styleUrl: './merchandiser-layout.component.css'
})
export class MerchandiserLayoutComponent implements OnInit {
  userRole: string = '';

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role') || '';
  }
}
