// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});


// Webhook エンドポイント
export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature')!;
  const body = await req.text(); // JSON ではなく text() が必須

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature error:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Stripeイベントの種類に応じて処理
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;

      // ここに支援者の支払い情報をDBへ保存する処理を書く
      console.log('🎉 支払い完了:', session);

      break;
    }
  }

  return NextResponse.json({ received: true });
}
