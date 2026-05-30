import { readLocalJson, removeLocalJson, writeLocalJson } from "@/lib/storage/local";

export const CHECKOUT_SESSION_KEY = "goatwedding_checkout";

export type CheckoutInvitation = {
  invitationId: string;
  demoUrl: string;
  label?: string | null;
};

export type CheckoutSession = {
  orderId: string;
  invitations: CheckoutInvitation[];
  invitationId?: string;
  demoUrl?: string;
};

export function loadCheckoutSession(): CheckoutSession | null {
  const session = readLocalJson<CheckoutSession>(CHECKOUT_SESSION_KEY);
  if (!session) return null;

  if (session.invitations?.length) return session;

  if (session.invitationId && session.demoUrl) {
    return {
      orderId: session.orderId,
      invitations: [
        {
          invitationId: session.invitationId,
          demoUrl: session.demoUrl,
        },
      ],
      invitationId: session.invitationId,
      demoUrl: session.demoUrl,
    };
  }

  return null;
}

export function saveCheckoutSession(session: CheckoutSession) {
  writeLocalJson(CHECKOUT_SESSION_KEY, session);
}

export function getCheckoutSessionInvitations(
  session: CheckoutSession | null,
): CheckoutInvitation[] {
  return session?.invitations ?? [];
}

export function clearCheckoutSession() {
  removeLocalJson(CHECKOUT_SESSION_KEY);
}
