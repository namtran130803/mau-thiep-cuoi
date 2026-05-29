import { readLocalJson, removeLocalJson, writeLocalJson } from "@/lib/storage/local";

export const CHECKOUT_SESSION_KEY = "goatwedding_checkout";

export type CheckoutSession = {
  orderId: string;
  invitationId: string;
  demoUrl: string;
};

export function loadCheckoutSession(): CheckoutSession | null {
  return readLocalJson<CheckoutSession>(CHECKOUT_SESSION_KEY);
}

export function saveCheckoutSession(session: CheckoutSession) {
  writeLocalJson(CHECKOUT_SESSION_KEY, session);
}

export function clearCheckoutSession() {
  removeLocalJson(CHECKOUT_SESSION_KEY);
}
