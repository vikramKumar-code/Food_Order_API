import React from "react";
import { CartSummary } from "../components/CartSummary";
import { SectionHeading } from "../components/SectionHeading";

export function CartPage() {
  return (
    <section id="cart" className="page-section">
      <SectionHeading
        eyebrow="Checkout & Cart"
        title="Your Delicious Food Cart"
        description="Review your selected items, apply promo vouchers, and place your order for lightning-fast delivery."
      />

      <CartSummary />
    </section>
  );
}
