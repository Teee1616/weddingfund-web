// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// ★ apiVersion を指定しておくと型エラーが減る
// こうしてOK
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { type } = body; // "support" | "publish_fee" を想定
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

    if (type === "publish_fee") {
      // ===============================
      // ① ご祝儀ページ公開 3,000円の決済
      // ===============================
      const projectId: string | undefined = body.projectId;

      if (!projectId) {
        return NextResponse.json(
          { error: "Missing projectId" },
          { status: 400 }
        );
      }

      // Stripe Checkout Session 作成
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            // ★ ここで Stripe の price_xxx を使う
            price: process.env.STRIPE_PUBLISH_FEE_PRICE_ID!,
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/dashboard/projects/${projectId}?publish=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/dashboard/projects/${projectId}?publish=cancel`,
        metadata: {
          type: "publish_fee",
          projectId,
        },
      });

      // DB に pending として登録
      const { error: insertError } = await supabaseAdmin
        .from("payment_sessions")
        .insert({
          amount: 3000,
          stripe_session_id: session.id,
          status: "pending",
          type: "publish_fee",
          project_id: projectId,
        });

      if (insertError) {
        console.error("Failed to insert payment_session:", insertError);
        return NextResponse.json(
          { error: "DB insert failed" },
          { status: 500 }
        );
      }

      return NextResponse.json({ url: session.url }, { status: 200 });
    }

    // ===============================
    // ② それ以外は従来の「ギフト支援」
    // ===============================
    const giftItemId = body.giftItemId;
    const amount = body.amount;

    if (!giftItemId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid gift item or amount" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: { name: "ギフト支援" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/support/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/support/cancel`,
      metadata: {
        type: "support_contribution",
        giftItemId,
      },
    });

    const { error: insertError } = await supabaseAdmin
      .from("payment_sessions")
      .insert({
        amount,
        stripe_session_id: session.id,
        status: "pending",
        type: "support_contribution",
        gift_item_id: giftItemId,
      });

    if (insertError) {
      console.error("Failed to insert payment_session:", insertError);
      return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e) {
    console.error("Error in checkout:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
