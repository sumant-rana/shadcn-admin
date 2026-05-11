"""Billing webhook handler — no accompanying test file in this PR."""

from .billing import charge_customer, refund_charge


def handle_billing_event(event: dict) -> dict:
    event_type = event.get("type")
    if event_type == "payment_intent.requested":
        return charge_customer(
            amount=event["amount"],
            currency=event.get("currency", "usd"),
            customer_id=event["customer_id"],
        )
    if event_type == "charge.refund":
        return refund_charge(event["payment_intent_id"])
    return {"status": "ignored"}
