/**
 * Audit logging. NOTE: the log line below intentionally includes a user
 * email — demo for the pii-leak concept detector. In real code we'd
 * hash this.
 */
export function logCharge(userEmail: string, amount: number): void {
  console.log(`charge: email=${userEmail} amount=${amount}`);
}
