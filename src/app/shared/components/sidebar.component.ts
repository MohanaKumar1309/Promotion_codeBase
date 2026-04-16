import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../services";

const MENU_MAP: { [key: string]: { icon: string; label: string; route: string }[] } = {
  ADMIN: [
    { icon: "speedometer2", label: "Dashboard", route: "/admin" },
    { icon: "people", label: "Users", route: "/admin/users" },
    { icon: "tags", label: "Categories", route: "/admin/categories" },
    { icon: "box", label: "Products", route: "/admin/products" },
    { icon: "file-earmark-text", label: "Audit Logs", route: "/admin/audit-logs" }
  ],
  MERCHANDISER: [
    { icon: "speedometer2", label: "Dashboard", route: "/merchandiser" },
    { icon: "percent", label: "Promotions", route: "/merchandiser/promotions" }
  ],
  MARKETING_MANAGER: [
    { icon: "speedometer2", label: "Dashboard", route: "/marketing-manager" },
    { icon: "megaphone", label: "Campaigns", route: "/marketing-manager/campaigns" },
    { icon: "ticket-perforated", label: "Coupons", route: "/marketing-manager/coupons" }
  ],
  STORE_MANAGER: [
    { icon: "speedometer2", label: "Dashboard", route: "/store-manager" },
    { icon: "check2-circle", label: "Approvals", route: "/store-manager/approvals" },
    { icon: "bar-chart-line", label: "Analytics", route: "/store-manager/analytics" }
  ],
  CUSTOMER: [
    { icon: "shop", label: "Shop", route: "/customer/shop" },
    { icon: "cart", label: "Cart", route: "/customer/cart" }
  ]
};

const ROLE_LABELS: { [key: string]: string } = {
  ADMIN: "Administrator",
  MERCHANDISER: "Merchandiser",
  MARKETING_MANAGER: "Marketing Manager",
  STORE_MANAGER: "Store Manager",
  CUSTOMER: "Customer"
};

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css"
})
export class SidebarComponent implements OnInit, OnChanges {
  @Input() role: string = "";

  isOpen: boolean = false;
  menuItems: { icon: string; label: string; route: string }[] = [];
  userName: string = "";
  userEmail: string = "";
  roleLabel: string = "";

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.menuItems = MENU_MAP[this.role] || [];
    this.roleLabel = ROLE_LABELS[this.role] || this.role;
    this.userName = localStorage.getItem('name') || 'User';
    this.userEmail = localStorage.getItem('email') || '';
  }

  ngOnChanges(): void {
    this.menuItems = MENU_MAP[this.role] || [];
    this.roleLabel = ROLE_LABELS[this.role] || this.role;
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  closeSidebar(): void {
    this.isOpen = false;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(["/landing"]);
  }
}
