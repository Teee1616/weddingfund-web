// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Receive Stripe webhooks and reflect checkout results into Supabase
export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 },
    );
  }

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook secret is not configured' },
      { status: 500 },
    );
  }

  // Stripe webhooks need the raw request body
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature error:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Only process when the payment is actually settled
      if (session.payment_status !== 'paid') {
        console.warn(
          'checkout.session.completed received but not paid:',
          session.id,
          session.payment_status,
        );
        break;
      }

      const stripeSessionId = session.id;

      // payment_intent は string またはオブジェクトの可能性がある
      const paymentIntentId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? null;

      const { data, error: updateError } = await supabaseAdmin
        .from('payment_sessions')
        .update({
          status: 'paid',
          stripe_payment_intent_id: paymentIntentId,
          completed_at: new Date().toISOString(),
        })
        .eq('stripe_session_id', stripeSessionId)
        .eq('status', 'pending')
        .select('id');

      if (updateError) {
        console.error('Failed to update payment_sessions:', updateError);
        return NextResponse.json(
          { error: 'Failed to update payment session' },
          { status: 500 },
        );
      }

      if (!data || data.length === 0) {
        console.warn(
          'No payment_session updated (maybe already processed or missing record):',
          stripeSessionId,
        );
      } else {
        console.log('Payment marked as paid:', stripeSessionId);
      }

      break;
    }

    default:
      // Ack all other events but do not act on them
      console.log('Unhandled event type:', event.type);
  }

  return NextResponse.json({ received: true });
}
