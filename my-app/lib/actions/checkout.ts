"use server";

import {
  getCheckoutOrderId,
  setCheckoutOrderId,
} from "@/lib/checkout/session";
import { formatDbId, parseDbId, tryParseDbId } from "@/lib/db/id";
import { prisma } from "@/lib/db/prisma";
import type { InviteData } from "@/lib/invite/types";
import type { PackageType } from "@/lib/pricing";

export type RestoredCheckoutSession = {
  orderId: string;
  email: string;
  invitationId: string | null;
  demoUrl: string | null;
  invitations: Array<{
    invitationId: string;
    demoUrl: string;
    label: string | null;
    templateSlug: string;
    formData: InviteData;
  }>;
  packageType: PackageType;
  guestNameService: boolean;
  templateSlug: string | null;
  formData: InviteData | null;
  hasDemo: boolean;
};

export async function restoreCheckoutSession(): Promise<RestoredCheckoutSession | null> {
  const orderId = await getCheckoutOrderId();
  if (!orderId) return null;
  const dbOrderId = tryParseDbId(orderId);
  if (!dbOrderId) return null;

  const order = await prisma.order.findUnique({
    where: { id: dbOrderId },
    include: {
      invitations: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) return null;
  if (order.status === "published" || order.status === "paid") return null;

  const invitations = order.invitations.map((invitation) => ({
    invitationId: formatDbId(invitation.id),
    demoUrl: `/demo/${invitation.slug}`,
    label: invitation.label,
    templateSlug: invitation.templateSlug,
    formData: invitation.data as InviteData,
  }));
  const invitation = invitations[0];

  if (!invitation) {
    return {
      orderId: formatDbId(order.id),
      email: order.email,
      invitationId: null,
      demoUrl: null,
      invitations: [],
      packageType: order.packageType as PackageType,
      guestNameService: order.guestNameService,
      templateSlug: null,
      formData: null,
      hasDemo: false,
    };
  }

  return {
    orderId: formatDbId(order.id),
    email: order.email,
    invitationId: invitation.invitationId,
    demoUrl: invitation.demoUrl,
    invitations,
    packageType: order.packageType as PackageType,
    guestNameService: order.guestNameService,
    templateSlug: invitation.templateSlug,
    formData: invitation.formData,
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
    where: { id: parseDbId(input.orderId) },
    include: { invitations: true },
  });

  if (!order) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  if (order.status === "published" || order.status === "paid") {
    throw new Error("Đơn hàng đã thanh toán.");
  }

  const ownsInvitation = order.invitations.some(
    (invitation) => formatDbId(invitation.id) === input.invitationId,
  );
  if (!ownsInvitation) {
    throw new Error(
      "Phiên đặt hàng không hợp lệ. Vui lòng tạo và thanh toán thiệp trên cùng một thiết bị.",
    );
  }

  await setCheckoutOrderId(input.orderId);
  return { ok: true as const };
}
