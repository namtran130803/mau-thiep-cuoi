"use client";

import Link from "next/link";
import { useEffect, useState, type ComponentProps } from "react";
import { restoreCheckoutSession } from "@/lib/actions/checkout";
import {
  loadCheckoutSession,
  saveCheckoutSession,
} from "@/lib/checkout/client-session";
import {
  PACKAGE_STORAGE_KEY,
  WIZARD_STORAGE_KEY,
  readLocalJson,
} from "@/lib/storage/local";

type CreateInviteLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href?: ComponentProps<typeof Link>["href"];
};

export default function CreateInviteLink({ href, ...props }: CreateInviteLinkProps) {
  const [targetHref, setTargetHref] = useState("/tao-thiep");

  useEffect(() => {
    async function resolve() {
      if (loadCheckoutSession()) {
        setTargetHref("/tao-thiep");
        return;
      }

      const restored = await restoreCheckoutSession();
      if (restored) {
        if (restored.hasDemo && restored.invitationId && restored.demoUrl) {
          saveCheckoutSession({
            orderId: restored.orderId,
            invitationId: restored.invitationId,
            demoUrl: restored.demoUrl,
          });
        }
        setTargetHref("/tao-thiep");
        return;
      }

      if (
        readLocalJson(WIZARD_STORAGE_KEY) ||
        readLocalJson(PACKAGE_STORAGE_KEY)
      ) {
        setTargetHref("/tao-thiep");
      }
    }

    void resolve();
  }, []);

  return <Link href={href ?? targetHref} {...props} />;
}
