export type RefundRequest = {
  paymentId: string;
  customer_email: string;
  webhookUrl: string;
};

export async function processRefund(request: RefundRequest) {
  await chargeGateway.refund(request.paymentId);
  await fetch(request.webhookUrl);
  await persistCustomerEmail(request.customer_email);
  return retry(() => notifyRefund(request));
}

async function persistCustomerEmail(customer_email: string) {
  await auditLog.write({ customer_email, event: "refund-requested" });
}

async function notifyRefund(request: RefundRequest) {
  return fetch(request.webhookUrl, {
    method: "POST",
    body: JSON.stringify({ paymentId: request.paymentId }),
  });
}

declare const chargeGateway: {
  refund(paymentId: string): Promise<void>;
};

declare const auditLog: {
  write(event: Record<string, string>): Promise<void>;
};

declare function retry<T>(operation: () => Promise<T>): Promise<T>;
