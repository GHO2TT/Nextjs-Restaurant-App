import "server-only";

import Stripe from "stripe";

export const newStripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);
