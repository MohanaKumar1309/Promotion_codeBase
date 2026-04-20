import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { CouponService } from "../../../../shared/services";
import { Coupon } from "../../../../shared/models";

@Component({
  selector: "app-marketing-manager-coupons",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./marketing-manager-coupons.component.html",
  styleUrl: "./marketing-manager-coupons.component.css"
})
export class MarketingManagerCouponsComponent implements OnInit {
  coupons: Coupon[] = [];
  loading: boolean = false;
  successMessage: string = "";
  errorMessage: string = "";
  couponForm: any;

  constructor(
    private couponService: CouponService,
    private fb: FormBuilder
  ) {
    this.couponForm = this.fb.group({
      couponCode: ["", Validators.required],
      couponName: ["", Validators.required],
      description: ["", Validators.required],
      discountType: ["FLAT", Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      minCartValue: [0, Validators.required],
      maxDiscount: [0],
      usageLimit: [100, Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.couponService.getCoupons().subscribe({
      next: (response) => {
        this.coupons = response.data || [];
      },
      error: (err) => {
        this.errorMessage = "Failed to load coupons";
        console.error(err);
      }
    });
  }

  onCreateCoupon(): void {
    if (!this.couponForm.valid) {
      this.errorMessage = "Please fill all required fields";
      return;
    }

    this.loading = true;
    const request = this.couponForm.value;

    this.couponService.createCoupon(request as any).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.successMessage = "Coupon created successfully!";
          this.couponForm.reset();
          setTimeout(() => (this.successMessage = ""), 3000);
          this.loadCoupons();
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = "Failed to create coupon";
        console.error(err);
        setTimeout(() => (this.errorMessage = ""), 3000);
      }
    });
  }

  onDeleteCoupon(couponId: number): void {
    if (!confirm("Are you sure?")) return;
    this.couponService.deleteCoupon(couponId).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = "Coupon deleted successfully!";
          this.loadCoupons();
          setTimeout(() => (this.successMessage = ""), 3000);
        }
      },
      error: (err) => {
        this.errorMessage = "Failed to delete coupon";
        console.error(err);
        setTimeout(() => (this.errorMessage = ""), 3000);
      }
    });
  }
}
