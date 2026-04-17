import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CheckoutService, CouponService, PromotionService, CampaignService } from "../../../shared/services";
import { CartItem, Coupon, Promotion, Campaign } from "../../../shared/models";

@Component({
  selector: "app-customer-cart",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./customer-cart.component.html",
  styleUrl: "./customer-cart.component.css"
})
export class CustomerCartComponent implements OnInit {
  cartItems: CartItem[] = [];
  activeCoupons: Coupon[] = [];
  activePromotions: Promotion[] = [];
  activeCampaigns: Campaign[] = [];
  appliedCoupon: Coupon | null = null;
  couponCode: string = "";
  couponError: string = "";
  subtotal: number = 0;
  promotionDiscount: number = 0;
  campaignDiscount: number = 0;
  couponDiscount: number = 0;
  total: number = 0;
  savingsMessage: string = "";
  loading: boolean = false;

  constructor(
    private checkoutService: CheckoutService,
    private couponService: CouponService,
    private promotionService: PromotionService,
    private campaignService: CampaignService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.loadActiveCoupons();
    this.loadActivePromotions();
    this.loadActiveCampaigns();
  }

  loadCart(): void {
    const cart = JSON.parse(localStorage.getItem("cart") || "{\"items\":[]}");
    this.cartItems = cart.items || [];
  }

  loadActiveCoupons(): void {
    this.couponService.getActiveCoupons().subscribe({
      next: (res) => {
        this.activeCoupons = res.data || [];
      }
    });
  }

  loadActivePromotions(): void {
    this.promotionService.getActivePromotions().subscribe({
      next: (res) => {
        this.activePromotions = res.data || [];
        this.calculateTotals();
      },
      error: () => { this.calculateTotals(); }
    });
  }

  loadActiveCampaigns(): void {
    const age = parseInt(localStorage.getItem('age') || '0', 10);
    if (!age) { return; }
    this.campaignService.getActiveCampaigns(age).subscribe({
      next: (res) => {
        this.activeCampaigns = res.data || [];
        this.calculateTotals();
      },
      error: () => {}
    });
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    this.promotionDiscount = this.calculatePromotionDiscount();
    this.campaignDiscount = this.calculateCampaignDiscount();
    this.couponDiscount = this.calculateCouponDiscount();
    this.total = Math.max(0, this.subtotal - this.promotionDiscount - this.campaignDiscount - this.couponDiscount);
    this.updateSavingsMessage();
  }

  calculateCampaignDiscount(): number {
    let total = 0;
    for (const campaign of this.activeCampaigns) {
      const applies = this.cartItems.some(item =>
        (campaign.productIds || []).includes(item.product.productId) ||
        (campaign.categoryIds || []).includes(item.product.categoryId)
      );
      if (!applies) continue;
      if (campaign.discountType === 'FLAT') total += campaign.amount;
      else if (campaign.discountType === 'PERCENTAGE') total += this.subtotal * campaign.amount / 100;
      else if (campaign.discountType === 'BOGO') total += this.subtotal / 2;
    }
    return Math.min(total, this.subtotal);
  }

  calculatePromotionDiscount(): number {
    let total = 0;
    for (const promo of this.activePromotions) {
      let promoBase = 0;
      let promoQty = 0;
      for (const item of this.cartItems) {
        const matches = (promo.productIds || []).includes(item.product.productId)
                     || (promo.categoryIds || []).includes(item.product.categoryId);
        if (matches) {
          promoBase += item.product.price * item.quantity;
          promoQty += item.quantity;
        }
      }
      if (!promoBase) continue;
      if (promo.minQuantity && promoQty < promo.minQuantity) continue;
      if (promo.discountType === 'FLAT') total += promo.discountValue;
      else if (promo.discountType === 'PERCENTAGE') total += promoBase * promo.discountValue / 100;
      else if (promo.discountType === 'BOGO') total += promoBase / 2;
    }
    return Math.min(total, this.subtotal);
  }

  calculateCouponDiscount(): number {
    if (!this.appliedCoupon) return 0;
    if (this.subtotal < this.appliedCoupon.minCartValue) return 0;

    let discount = 0;
    if (this.appliedCoupon.discountType === 'PERCENTAGE') {
      discount = this.subtotal * (this.appliedCoupon.amount / 100);
      if (this.appliedCoupon.maxDiscount) {
        discount = Math.min(discount, this.appliedCoupon.maxDiscount);
      }
    } else {
      discount = this.appliedCoupon.amount;
    }
    return discount;
  }

  increaseQty(index: number): void {
    this.cartItems[index].quantity++;
    this.calculateTotals();
    this.saveCart();
  }

  decreaseQty(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      this.calculateTotals();
      this.saveCart();
    }
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.calculateTotals();
    this.saveCart();
  }

  onApplyCoupon(): void {
    this.couponError = "";
    if (!this.couponCode.trim()) return;

    const found = this.activeCoupons.find(c => c.couponCode.toUpperCase() === this.couponCode.trim().toUpperCase());
    if (!found) {
      this.couponError = "Invalid or expired coupon code.";
      return;
    }
    if (this.subtotal < found.minCartValue) {
      this.couponError = `Minimum cart value $${found.minCartValue} required.`;
      return;
    }
    this.appliedCoupon = found;
    this.calculateTotals();
  }

  removeCoupon(): void {
    this.appliedCoupon = null;
    this.couponCode = "";
    this.couponError = "";
    this.calculateTotals();
  }

  saveCart(): void {
    localStorage.setItem("cart", JSON.stringify({ items: this.cartItems }));
  }

  onCheckout(): void {
    if (this.cartItems.length === 0) return;
    this.loading = true;
    const request = {
      items: this.cartItems.map(item => ({
        productId: item.product.productId,
        quantity: item.quantity
      })),
      couponCode: this.appliedCoupon?.couponCode || undefined
    };
    this.checkoutService.checkout(request).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          localStorage.removeItem("cart");
          alert("Order placed successfully!");
          this.router.navigate(["/customer/shop"]);
        } else {
          alert(response.message || "Checkout failed.");
        }
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || "Checkout failed. Please try again.";
        alert(msg);
      }
    });
  }

  updateSavingsMessage(): void {
    const totalSavings = this.promotionDiscount + this.campaignDiscount + this.couponDiscount;
    if (totalSavings > 0) {
      this.savingsMessage = `You're saving ₹${totalSavings.toFixed(2)}!`;
    } else {
      this.savingsMessage = "";
    }
  }
}
