// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ONBOARDING_PRICE_ID = process.env.STRIPE_ONBOARDING_PRICE_ID!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

type RequestBody = {
  // Supabase の users.id（アプリ側ユーザーID）
  appUserId: string;
};

/**
 * 3,000円の利用料用 Checkout セッションを作成するAPI
 * POST /api/stripe/checkout
 */
export async function POST(req: NextRequest) {
  try {
    // 1) リクエストボディを取得
    const body = (await req.json()) as Partial<RequestBody>;
    const appUserId = body.appUserId;

    if (!appUserId) {
      return NextResponse.json(
        { error: 'appUserId is required' },
        { status: 400 },
      );
    }

    if (!ONBOARDING_PRICE_ID) {
      console.error('STRIPE_ONBOARDING_PRICE_ID is not set');
      return NextResponse.json(
        { error: 'Stripe price id is not configured' },
        { status: 500 },
      );
    }

    // 2) payment_sessions に pending レコードを作成
    //    ※ テーブルのカラム名はあなたの実際の schema に合わせて調整してね
    const { data: paymentSession, error: insertError } = await supabaseAdmin
      .from('payment_sessions')
      .insert({
        user_id: appUserId,
        type: 'onboarding', // 利用料
        amount: 3000,       // 円
        currency: 'jpy',
        status: 'pending',
      })
      .select('id')
      .single();

    if (insertError || !paymentSession) {
      console.error('Failed to insert payment_sessions:', insertError);
      return NextResponse.json(
        { error: 'Failed to create payment session' },
        { status: 500 },
      );
    }

    const paymentSessionId = paymentSession.id;

    // 3) Stripe Checkout セッションを作成
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: ONBOARDING_PRICE_ID,
          quantity: 1,
        },
      ],
      // 決済完了後/キャンセル後に戻すURL
      success_url: `${APP_URL}/dashboard?onboarding=success`,
      cancel_url: `${APP_URL}/dashboard?onboarding=cancel`,
      // Webhook 側で識別するためのメタデータ
      metadata: {
        type: 'onboarding',
        payment_session_id: paymentSessionId,
        app_user_id: appUserId,
      },
    });

    // 4) フロント側でリダイレクトに使うURLを返す
    return NextResponse.json(
      {
        checkoutUrl: session.url,
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err.message },
      { status: 500 },
    );
  }
}
