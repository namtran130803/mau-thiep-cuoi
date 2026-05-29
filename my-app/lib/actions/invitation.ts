"use server";

import { prisma } from "@/lib/db/prisma";
import { assertCheckoutOrder } from "@/lib/checkout/session";
import { buildInviteSlug } from "@/lib/slug";
import { normalizeInviteData } from "@/lib/form/normalize-invite-data";
import type { InviteData } from "@/lib/invite/types";
import { saveInvitationSchema } from "@/lib/validation/invite";

const LOCKED_ORDER_STATUSES = new Set(["paid", "published"]);

async function ensureUniqueSlug(baseSlug: string, currentInvitationId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.invitation.findUnique({ where: { slug } });
    if (!existing || existing.id === currentInvitationId) return slug;
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

function assertOrderEditable(status: string) {
  if (LOCKED_ORDER_STATUSES.has(status)) {
    throw new Error("Đơn hàng đã thanh toán hoặc đang chờ thanh toán, không thể chỉnh sửa.");
  }
}

export async function saveInvitation(input: {
  orderId: string;
  templateSlug: string;
  label?: string;
  invitationId?: string;
  data: InviteData;
}) {
  const parsed = saveInvitationSchema.parse(input);
  const data = normalizeInviteData(parsed.data as InviteData);

  await assertCheckoutOrder(parsed.orderId);

  const order = await prisma.order.findUnique({
    where: { id: parsed.orderId },
    include: { invitations: true },
  });
  if (!order) throw new Error("Không tìm thấy đơn hàng");
  assertOrderEditable(order.status);

  if (parsed.invitationId) {
    const existing = await prisma.invitation.findFirst({
      where: { id: parsed.invitationId, orderId: parsed.orderId },
    });
    if (!existing) throw new Error("Không tìm thấy thiệp");

    const baseSlug = buildInviteSlug(data.groomName, data.brideName);
    const slug = await ensureUniqueSlug(baseSlug, existing.id);

    const updated = await prisma.invitation.update({
      where: { id: existing.id },
      data: {
        templateSlug: parsed.templateSlug,
        slug,
        label: parsed.label,
        data,
      },
    });

    await prisma.order.update({
      where: { id: parsed.orderId },
      data: { status: "demo_created" },
    });

    return {
      invitationId: updated.id,
      slug: updated.slug,
      demoUrl: `/demo/${updated.slug}`,
    };
  }

  const baseSlug = buildInviteSlug(data.groomName, data.brideName);
  const slug = await ensureUniqueSlug(baseSlug);

  const invitation = await prisma.invitation.create({
    data: {
      orderId: parsed.orderId,
      templateSlug: parsed.templateSlug,
      slug,
      label: parsed.label,
      data,
      status: "demo",
    },
  });

  await prisma.order.update({
    where: { id: parsed.orderId },
    data: { status: "demo_created" },
  });

  return {
    invitationId: invitation.id,
    slug: invitation.slug,
    demoUrl: `/demo/${invitation.slug}`,
  };
}

export async function getInvitationById(id: string) {
  return prisma.invitation.findUnique({
    where: { id },
    include: {
      order: true,
      wishes: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getInvitationBySlug(slug: string) {
  return prisma.invitation.findUnique({
    where: { slug },
    include: {
      order: true,
      wishes: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function publishInvitationsForOrder(orderId: string) {
  await prisma.invitation.updateMany({
    where: { orderId, status: "demo" },
    data: { status: "active" },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "published" },
  });
}
