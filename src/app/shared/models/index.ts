export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  role: string;
  name: string;
  age?: number;
}

export interface User {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt?: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface Product {
  productId: number;
  name: string;
  sku: string;
  price: number;
  categoryId: number;
  categoryName: string;
  imageUrl?: string;
}

export interface Promotion {
  promotionId: number;
  name: string;
  description: string;
  status: string;
  discountType: string;
  discountValue: number;
  minAmount?: number;
  minQuantity?: number;
  startDate: string;
  endDate: string;
  type: string;
  createdBy: number;
  productIds: number[];
  categoryIds: number[];
}

export interface Campaign {
  campaignId: number;
  campaignName: string;
  description: string;
  status: string;
  minAge: number;
  maxAge: number;
  discountType: string;
  amount: number;
  startDate: string;
  endDate: string;
  createdBy: number;
  productIds: number[];
  categoryIds: number[];
}

export interface Coupon {
  couponId: number;
  couponCode: string;
  couponName: string;
  description: string;
  status: string;
  usageLimit: number;
  usageCount: number;
  discountType: string;
  amount: number;
  minCartValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  createdBy: number;
}

export interface Notification {
  notificationId: number;
  message: string;
  status: string;
  category: string;
  createdBy: number;
  targetUserId: number;
  createdAt: string;
}

export interface AnalyticsSummary {
  referenceType: string;
  totalEvents: number;
  totalAmount: number;
}

export interface AuditLog {
  auditId: number;
  userId: number;
  userEmail: string;
  userName: string;
  action: string;
  metadata: string;
  timestamp: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  appliedCoupon?: Coupon;
  subtotal: number;
  promotionDiscount: number;
  couponDiscount: number;
  total: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  age?: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: string;
}

export interface CreateCategoryRequest {
  categoryName: string;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  price: number;
  categoryId: number;
  imageUrl?: string;
}

export interface CreatePromotionRequest {
  name: string;
  description?: string;
  discountType: string;
  discountValue: number;
  minAmount?: number;
  minQuantity?: number;
  startDate: string;
  endDate: string;
  type: string;
  productIds?: number[];
  categoryIds?: number[];
}

export interface CreateCampaignRequest {
  campaignName: string;
  description?: string;
  minAge: number;
  maxAge: number;
  discountType: string;
  amount: number;
  startDate: string;
  endDate: string;
  productIds?: number[];
  categoryIds?: number[];
}

export interface CreateCouponRequest {
  couponCode: string;
  couponName: string;
  description?: string;
  usageLimit: number;
  discountType: string;
  amount: number;
  minCartValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
}

export interface CheckoutRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
  couponCode?: string;
}
