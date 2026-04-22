import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService, NotificationService, ShopSearchService, ThemeService } from "../../services";
import { Notification } from "../../models";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css"
})
export class NavbarComponent implements OnInit, OnDestroy {
  userName: string = "";
  userRole: string = "";
  notifications: Notification[] = [];
  showNotifications: boolean = false;
  customerSearchTerm: string = "";
  cartCount: number = 0;

  private cartSub!: Subscription;

  private readonly internalRoles = ['STORE_MANAGER', 'MERCHANDISER', 'MARKETING_MANAGER', 'ADMIN'];

  get isInternalUser(): boolean {
    return this.internalRoles.includes(this.userRole);
  }

  get isCustomer(): boolean {
    return this.userRole === 'CUSTOMER';
  }

  get unreadCount(): number {
    return this.notifications.filter(n => n.status === 'UNREAD').length;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private shopSearchService: ShopSearchService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('name') || 'Guest';
    this.userRole = localStorage.getItem('role') || '';

    if (this.isInternalUser) {
      this.loadNotifications();
    }

    if (this.isCustomer) {
      this.shopSearchService.refreshCartCount();
      this.cartSub = this.shopSearchService.cartCount$.subscribe(count => {
        this.cartCount = count;
      });
    }
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }

  onSearchInput(): void {
    this.shopSearchService.setSearchTerm(this.customerSearchTerm);
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (res) => {
        if (res.success) {
          this.notifications = res.data || [];
        }
      },
      error: () => {}
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(notificationId: number, event: Event): void {
    event.stopPropagation();
    const notif = this.notifications.find(n => n.notificationId === notificationId);
    if (notif && notif.status === 'UNREAD') {
      this.notificationService.markAsRead(notificationId).subscribe({
        next: () => { if (notif) notif.status = 'READ'; },
        error: () => {}
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-bell')) {
      this.showNotifications = false;
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(["/landing"]);
  }
}
