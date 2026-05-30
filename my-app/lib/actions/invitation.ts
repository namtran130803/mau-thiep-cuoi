"use server";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { formatDbId, parseDbId, tryParseDbId } from "@/lib/db/id";
import { assertCheckoutOrder } from "@/lib/checkout/session";
import { buildInviteSlug } from "@/lib/slug";
import { normalizeInviteData } from "@/lib/form/normalize-invite-data";
import type { PackageType } from "@/lib/pricing";
import type { InviteData } from "@/lib/invite/types";
import { saveInvitationSchema } from "@/lib/validation/invite";

const LOCKED_ORDER_STATUSES = new Set(["pending_payment", "paid", "published"]);

async function ensureUniqueSlug(
  baseSlug: string,
  currentInvitationId?: string | bigint,
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.invitation.findUnique({ where: { slug } });
    if (
      !existing ||
      (currentInvitationId && existing.id === parseDbId(currentInvitationId))
    ) return slug;
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

type InvitationWithOrderAndWishes = Prisma.InvitationGetPayload<{
  include: {
    order: true;
    wishes: true;
  };
}>;

function serializeInvitation(invitation: InvitationWithOrderAndWishes | null) {
  if (!invitation) return null;

  return {
    ...invitation,
    id: formatDbId(invitation.id),
    orderId: formatDbId(invitation.orderId),
    order: invitation.order
      ? {
          ...invitation.order,
          id: formatDbId(invitation.order.id),
        }
      : undefined,
    wishes: invitation.wishes?.map((wish) => ({
      ...wish,
      id: formatDbId(wish.id),
      invitationId: formatDbId(wish.invitationId),
    })),
  };
}

function assertOrderEditable(status: string) {
  if (LOCKED_ORDER_STATUSES.has(status)) {
    throw new Error("Đơn hàng đã thanh toán hoặc đang chờ thanh toán, không thể chỉnh sửa.");
  }
}

function getRequiredInvitationCount(packageType: PackageType): number {
  return packageType === "single" ? 1 : 2;
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
    where: { id: parseDbId(parsed.orderId) },
    include: { invitations: true },
  });
  if (!order) throw new Error("Không tìm thấy đơn hàng");
  assertOrderEditable(order.status);

  if (parsed.invitationId) {
    const existing = await prisma.invitation.findFirst({
      where: {
        id: parseDbId(parsed.invitationId),
        orderId: parseDbId(parsed.orderId),
      },
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
      where: { id: parseDbId(parsed.orderId) },
      data: { status: "demo_created" },
    });

    return {
      invitationId: formatDbId(updated.id),
      slug: updated.slug,
      demoUrl: `/demo/${updated.slug}`,
    };
  }

  const baseSlug = buildInviteSlug(data.groomName, data.brideName);
  const slug = await ensureUniqueSlug(baseSlug);

  const invitation = await prisma.invitation.create({
    data: {
      orderId: parseDbId(parsed.orderId),
      templateSlug: parsed.templateSlug,
      slug,
      label: parsed.label,
      data,
      status: "demo",
    },
  });

  await prisma.order.update({
    where: { id: parseDbId(parsed.orderId) },
    data: { status: "demo_created" },
  });

  return {
    invitationId: formatDbId(invitation.id),
    slug: invitation.slug,
    demoUrl: `/demo/${invitation.slug}`,
  };
}

export async function getInvitationById(id: string) {
  const dbId = tryParseDbId(id);
  if (!dbId) return null;

  const invitation = await prisma.invitation.findUnique({
    where: { id: dbId },
    include: {
      order: true,
      wishes: { orderBy: { createdAt: "desc" } },
    },
  });

  return serializeInvitation(invitation);
}

export async function getInvitationBySlug(slug: string) {
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    include: {
      order: true,
      wishes: { orderBy: { createdAt: "desc" } },
    },
  });

  return serializeInvitation(invitation);
}

export async function publishInvitationsForOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: parseDbId(orderId) },
    include: { invitations: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) throw new Error("Không tìm thấy đơn hàng");

  const requiredInvitationCount = getRequiredInvitationCount(
    order.packageType as PackageType,
  );
  const invitationIds = order.invitations
    .filter((invitation) => invitation.status === "demo")
    .slice(0, requiredInvitationCount)
    .map((invitation) => invitation.id);

  if (invitationIds.length > 0) {
    await prisma.invitation.updateMany({
      where: { id: { in: invitationIds } },
      data: { status: "active" },
    });
  }

  await prisma.order.update({
    where: { id: parseDbId(orderId) },
    data: { status: "published" },
  });
}
