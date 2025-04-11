// app/api/verify-payment/route.ts
import { NextResponse } from "next/server";
import { newStripe as stripe } from "@/utils/stripe";
import { prisma } from "@/utils/connect";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { message: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the Stripe session with expanded payment intent and proper typing
    const session = (await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    })) as Stripe.Checkout.Session & {
      payment_intent: Stripe.PaymentIntent;
    };

    // Verify payment was successful
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { message: "Payment not completed" },
        { status: 402 }
      );
    }

    const orderId = session.metadata?.orderId;
    const paymentIntentId = session.payment_intent.id; // Now safely accessible

    if (!orderId || !paymentIntentId) {
      return NextResponse.json(
        { message: "Order ID or Payment Intent ID missing" },
        { status: 400 }
      );
    }

    // Update the order in your database
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "Paid and Being prepared",
        intent_id: paymentIntentId,
      },
    });

    return NextResponse.json(
      {
        orderId: updatedOrder.id,
        message: "Payment verified and order updated",
      },
      { status: 200 }
    );
  } catch (err) {
    const error = err as Error;
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
