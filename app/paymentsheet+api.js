import { stripe } from "../util";
import { NextResponse } from "next/server";
export async function POST(Request) {
  try {
    const { value } = await Request.json();
    console.log(value);
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2025-01-27.acacia" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: value * 100,
      currency: "INR",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PUB_KEY,
    });
  } catch (error) {
    return NextResponse.json({
      error: "error",
    });
  }
}
