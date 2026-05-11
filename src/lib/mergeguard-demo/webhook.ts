/**
 * /webhooks/billing endpoint. Handles incoming Stripe webhook events.
 * No accompanying test file in this PR — Stage 5 evidence mapper
 * should flag this.
 */
import { chargeCustomer, refundCharge } from "./billing.js";
import type { Request, Response } from "express";

export async function handleBillingWebhook(req: Request, res: Response): Promise<void> {
  const event = req.body;
  switch (event.type) {
    case "payment_intent.succeeded":
      await chargeCustomer(event.data, 3);
      break;
    case "charge.refunded":
      await refundCharge(event.data.payment_intent);
      break;
    default:
      res.status(200).send("ignored");
      return;
  }
  res.status(200).send("ok");
}
