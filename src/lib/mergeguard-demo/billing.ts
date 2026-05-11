/**
 * Stripe billing handler. Processes charge intents and refund flows.
 * Demo file for MergeGuard PR-review intelligence.
 */
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export interface ChargeRequest {
  amount: number;
  currency: string;
  customer_id: string;
  idempotency_key: string;
}

export interface ChargeResult {
  charged_at: Date | null;
  payment_intent_id: string | null;
  retried_count: number;
}

/**
 * Tighten the retry budget from 5 to 3 attempts.
 * Avoid double-charges on transient errors via idempotency_key.
 */
export async function chargeCustomer(
  req: ChargeRequest,
  maxRetries = 3,
): Promise<ChargeResult> {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      const intent = await stripe.paymentIntents.create({
        amount: req.amount,
        currency: req.currency,
        customer: req.customer_id,
      }, { idempotencyKey: req.idempotency_key });
      return {
        charged_at: new Date(),
        payment_intent_id: intent.id,
        retried_count: attempts,
      };
    } catch (err) {
      attempts++;
      if (attempts >= maxRetries) {
        // Behavioral change: now returns null instead of throwing.
        return { charged_at: null, payment_intent_id: null, retried_count: attempts };
      }
    }
  }
  return { charged_at: null, payment_intent_id: null, retried_count: attempts };
}

export async function refundCharge(payment_intent_id: string): Promise<void> {
  await stripe.refunds.create({ payment_intent: payment_intent_id });
}
