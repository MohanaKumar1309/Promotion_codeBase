import { Component, OnInit, HostListener } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService, NotificationService } from "../services";
import { Notification } from "../models";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css"
})
export class NavbarComponent implements OnInit {
  userName: string = "";
  userRole: string = "";
  notifications: Notification[] = [];
  showNotifications: boolean = false;

  private readonly internalRoles = ['STORE_MANAGER', 'MERCHANDISER', 'MARKETING_MANAGER', 'ADMIN'];

  get isInternalUser(): boolean {
    return this.internalRoles.includes(this.userRole);
  }

  get unreadCount(): number {
    return this.notifications.filter(n => n.status === 'UNREAD').length;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('name') || 'Guest';
    this.userRole = localStorage.getItem('role') || '';
    if (this.isInternalUser) {
      this.loadNotifications();
    }
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
