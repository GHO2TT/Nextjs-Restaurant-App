"use client";

// import StripeProvider from "@/components/Stripe_Provider";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { FormEvent } from "react";

const PayPage: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(
      CardElement
    ) as StripeCardElement | null;
    if (!cardElement) {
      console.error("CardElement not found");
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
    if (error) {
      console.log("[error]", error);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      // Send paymentMethod.id to your server (see Step 4)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default PayPage;
