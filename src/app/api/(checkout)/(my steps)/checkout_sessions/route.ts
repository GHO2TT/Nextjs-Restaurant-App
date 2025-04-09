import { NextRequest, NextResponse } from "next/server";
import { newStripe as stripe } from "@/utils/stripe";
import { prisma } from "@/utils/connect";

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const { products, orderId } = await req.json();
    // const products = body.products;

    if (!products || products.length === 0) {
      return NextResponse.json({ error: "No products found" }, { status: 400 });
    }
    const line_items = products.map((product: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.title,
        },
        unit_amount: Math.round(product.price * 100), // make sure it's an integer
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        orderId: orderId, // Your internal order ID
      },
      payment_intent_data: {
        metadata: {
          orderId: orderId, // Also include in payment intent
        },
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
