"""Stripe billing handler — exercises billing-side-effect concept."""

import stripe
import httpx


def charge_customer(amount: int, currency: str, customer_id: str) -> dict:
    # billing-side-effect concept fires on Stripe API calls.
    # NOTE: No idempotency_key parameter — Stage 4 policy will flag this.
    intent = stripe.PaymentIntents.create(
        amount=amount,
        currency=currency,
        customer=customer_id,
    )
    return {"payment_intent_id": intent.id}


def fetch_exchange_rate(currency: str):
    # external-http-call concept fires on httpx.get without timeout.
    # Policy rule external-http-needs-timeout will warn.
    r = httpx.get(f"https://api.example.com/rates/{currency}")
    return r.json()


def refund_charge(payment_intent_id: str):
    return stripe.Refunds.create(payment_intent=payment_intent_id)
