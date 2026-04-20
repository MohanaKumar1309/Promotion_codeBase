import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-marketing-manager-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: './marketing-manager-layout.component.html',
  styleUrl: './marketing-manager-layout.component.css'
})
export class MarketingManagerLayoutComponent implements OnInit {
  userRole: string = '';

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role') || '';
  }
}
