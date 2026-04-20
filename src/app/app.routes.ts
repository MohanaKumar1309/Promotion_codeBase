import { Routes } from '@angular/router';
import { LandingComponent } from './modules/auth/components/landing/landing.component';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { SignupComponent } from './modules/auth/components/signup/signup.component';
import { AuthGuard } from './core/guards/auth.guard';

// Admin Components
import { AdminLayoutComponent } from './modules/admin/admin-layout.component';
import { AdminDashboardComponent } from './modules/admin/components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './modules/admin/components/admin-users/admin-users.component';
import { AdminCategoriesComponent } from './modules/admin/components/admin-categories/admin-categories.component';
import { AdminProductsComponent } from './modules/admin/components/admin-products/admin-products.component';
import { AdminAuditLogsComponent } from './modules/admin/components/admin-audit-logs/admin-audit-logs.component';

// Merchandiser Components
import { MerchandiserLayoutComponent } from './modules/merchandiser/merchandiser-layout.component';
import { MerchandiserDashboardComponent } from './modules/merchandiser/components/merchandiser-dashboard/merchandiser-dashboard.component';
import { MerchandiserPromotionsComponent } from './modules/merchandiser/components/merchandiser-promotions/merchandiser-promotions.component';

// Marketing Manager Components
import { MarketingManagerLayoutComponent } from './modules/marketing-manager/marketing-manager-layout.component';
import { MarketingManagerDashboardComponent } from './modules/marketing-manager/components/marketing-manager-dashboard/marketing-manager-dashboard.component';
import { MarketingManagerCampaignsComponent } from './modules/marketing-manager/components/marketing-manager-campaigns/marketing-manager-campaigns.component';
import { MarketingManagerCouponsComponent } from './modules/marketing-manager/components/marketing-manager-coupons/marketing-manager-coupons.component';

// Store Manager Components
import { StoreManagerLayoutComponent } from './modules/store-manager/store-manager-layout.component';
import { StoreManagerDashboardComponent } from './modules/store-manager/components/store-manager-dashboard/store-manager-dashboard.component';
import { StoreManagerApprovalsComponent } from './modules/store-manager/components/store-manager-approvals/store-manager-approvals.component';
import { StoreManagerAnalyticsComponent } from './modules/store-manager/components/store-manager-analytics/store-manager-analytics.component';

// Customer Components
import { CustomerLayoutComponent } from './modules/customer/customer-layout.component';
import { CustomerShopComponent } from './modules/customer/components/customer-shop/customer-shop.component';
import { CustomerCartComponent } from './modules/customer/components/customer-cart/customer-cart.component';
import { CustomerOrdersComponent } from './modules/customer/components/customer-orders/customer-orders.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },

  // Admin Routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'audit-logs', component: AdminAuditLogsComponent }
    ]
  },

  // Merchandiser Routes
  {
    path: 'merchandiser',
    component: MerchandiserLayoutComponent,
    canActivate: [AuthGuard],
    data: { role: 'MERCHANDISER' },
    children: [
      { path: '', component: MerchandiserDashboardComponent },
      { path: 'promotions', component: MerchandiserPromotionsComponent }
    ]
  },

  // Marketing Manager Routes
  {
    path: 'marketing-manager',
    component: MarketingManagerLayoutComponent,
    canActivate: [AuthGuard],
    data: { role: 'MARKETING_MANAGER' },
    children: [
      { path: '', component: MarketingManagerDashboardComponent },
      { path: 'campaigns', component: MarketingManagerCampaignsComponent },
      { path: 'coupons', component: MarketingManagerCouponsComponent }
    ]
  },

  // Store Manager Routes
  {
    path: 'store-manager',
    component: StoreManagerLayoutComponent,
    canActivate: [AuthGuard],
    data: { role: 'STORE_MANAGER' },
    children: [
      { path: '', component: StoreManagerDashboardComponent },
      { path: 'approvals', component: StoreManagerApprovalsComponent },
      { path: 'analytics', component: StoreManagerAnalyticsComponent }
    ]
  },

  // Customer Routes
  {
    path: 'customer',
    component: CustomerLayoutComponent,
    canActivate: [AuthGuard],
    data: { role: 'CUSTOMER' },
    children: [
      { path: '', redirectTo: 'shop', pathMatch: 'full' },
      { path: 'shop', component: CustomerShopComponent },
      { path: 'cart', component: CustomerCartComponent },
      { path: 'orders', component: CustomerOrdersComponent }
    ]
  },

  {
    path: '**',
    redirectTo: 'landing'
  }
];
