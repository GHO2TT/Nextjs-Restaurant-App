"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
// or
const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!key) {
  throw new Error("Stripe publishable key not found");
}

const stripePromise = loadStripe(key);

interface StripeProps {
  children: ReactNode;
}

function StripeProvider({ children }: StripeProps) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}

export default StripeProvider;
