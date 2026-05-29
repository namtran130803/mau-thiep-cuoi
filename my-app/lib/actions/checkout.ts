"use server";

import {
  getCheckoutOrderId,
  setCheckoutOrderId,
} from "@/lib/checkout/session";
import { prisma } from "@/lib/db/prisma";
import type { InviteData } from "@/lib/invite/types";
import type { PackageType } from "@/lib/pricing";

export type RestoredCheckoutSession = {
  orderId: string;
  invitationId: string | null;
  demoUrl: string | null;
  packageType: PackageType;
  guestNameService: boolean;
  templateSlug: string | null;
  formData: InviteData | null;
  hasDemo: boolean;
};

export async function restoreCheckoutSession(): Promise<RestoredCheckoutSession | null> {
  const orderId = await getCheckoutOrderId();
  if (!orderId) return null;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      invitations: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!order) return null;
  if (order.status === "published" || order.status === "paid") return null;

  const invitation = order.invitations[0];
  if (!invitation) {
    return {
      orderId: order.id,
      invitationId: null,
      demoUrl: null,
      packageType: order.packageType as PackageType,
      guestNameService: order.guestNameService,
      templateSlug: null,
      formData: null,
      hasDemo: false,
    };
  }

  return {
    orderId: order.id,
    invitationId: invitation.id,
    demoUrl: `/demo/${invitation.slug}`,
    packageType: order.packageType as PackageType,
    guestNameService: order.guestNameService,
    templateSlug: invitation.templateSlug,
    formData: invitation.data as InviteData,
    hasDemo: true,
  };
}

export async function reclaimCheckoutSession(input: {
  orderId: string;
  invitationId: string;
}) {
  const current = await getCheckoutOrderId();
  if (current === input.orderId) {
    return { ok: true as const };
  }

  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
    include: { invitations: true },
  });

  if (!order) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  if (order.status === "published" || order.status === "paid") {
    throw new Error("Đơn hàng đã thanh toán.");
  }

  const ownsInvitation = order.invitations.some(
    (invitation) => invitation.id === input.invitationId,
  );
  if (!ownsInvitation) {
    throw new Error(
      "Phiên đặt hàng không hợp lệ. Vui lòng tạo và thanh toán thiệp trên cùng một thiết bị.",
    );
  }

  await setCheckoutOrderId(input.orderId);
  return { ok: true as const };
}
