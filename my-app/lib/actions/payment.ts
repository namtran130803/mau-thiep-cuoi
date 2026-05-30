"use server";

import { prisma } from "@/lib/db/prisma";
import { assertCheckoutOrder, clearCheckoutOrder } from "@/lib/checkout/session";
import { getSiteUrl, sendEmail } from "@/lib/email/smtp";
import { publishInvitationsForOrder } from "@/lib/actions/invitation";
import { sendPublishedEmail } from "@/lib/actions/order";
import { formatDbId, parseDbId } from "@/lib/db/id";
import { buildPaymentReference } from "@/lib/slug";
import type { PackageType } from "@/lib/pricing";

function getRequiredInvitationCount(packageType: PackageType): number {
  return packageType === "single" ? 1 : 2;
}

export async function createPayment(orderId: string) {
  await assertCheckoutOrder(orderId);
  const dbOrderId = parseDbId(orderId);

  const order = await prisma.order.findUnique({
    where: { id: dbOrderId },
    include: { invitations: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) throw new Error("Không tìm thấy đơn hàng");
  if (order.status === "published" || order.status === "paid") {
    throw new Error("Đơn hàng đã thanh toán.");
  }
  if (!order.sepayRef) throw new Error("Thiếu mã tham chiếu thanh toán.");

  const requiredInvitationCount = getRequiredInvitationCount(
    order.packageType as PackageType,
  );
  const demoInvitations = order.invitations.filter(
    (invitation) => invitation.status === "demo",
  );

  if (demoInvitations.length < requiredInvitationCount) {
    throw new Error(
      requiredInvitationCount === 1
        ? "Vui lòng tạo bản xem trước trước khi thanh toán."
        : "Vui lòng tạo bản xem trước cho cả 2 thiệp trước khi thanh toán.",
    );
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { orderId: dbOrderId },
  });

  const payment = existingPayment
    ? await prisma.payment.update({
        where: { orderId: dbOrderId },
        data: { amount: order.totalAmount, status: "pending" },
      })
      : await prisma.payment.create({
        data: {
          orderId: dbOrderId,
          amount: order.totalAmount,
          status: "pending",
        },
      });

  await prisma.order.update({
    where: { id: dbOrderId },
    data: { status: "pending_payment" },
  });

  return {
    id: formatDbId(payment.id),
    orderId: formatDbId(payment.orderId),
    amount: payment.amount,
    status: payment.status,
    sepayRef: order.sepayRef,
  };
}

export async function getPaymentStatus(ref: string) {
  const order = ref.startsWith("GW")
    ? await prisma.order.findUnique({
        where: { sepayRef: ref },
        include: { invitations: true, payment: true },
      })
    : await prisma.order.findUnique({
        where: { id: parseDbId(ref) },
        include: { invitations: true, payment: true },
      });
  if (!order || !order.payment) return { status: "not_found" as const };

  return {
    status: order.payment.status,
    invitations: order.invitations
      .filter((inv) => order.payment!.status !== "paid" || inv.status === "active")
      .map((inv) => ({
        id: formatDbId(inv.id),
        label: inv.label,
        slug: inv.slug,
        status: inv.status,
      })),
  };
}

export async function confirmPayment(orderId: string | bigint) {
  const dbOrderId = parseDbId(orderId);
  const orderIdText = formatDbId(dbOrderId);
  const payment = await prisma.payment.findUnique({
    where: { orderId: dbOrderId },
  });
  if (!payment) throw new Error("Không tìm thấy thanh toán");
  if (payment.status === "paid") return { alreadyPaid: true };

  await prisma.payment.update({
    where: { orderId: dbOrderId },
    data: { status: "paid", paidAt: new Date() },
  });

  await publishInvitationsForOrder(orderIdText);
  await sendPublishedEmail(orderIdText);
  await clearCheckoutOrder();

  return { alreadyPaid: false };
}

export async function sendWishEmail(input: {
  slug: string;
  wish: { name: string; message: string; attend: string };
}) {
  const invitation = await prisma.invitation.findUnique({
    where: { slug: input.slug },
    include: { order: true },
  });
  if (!invitation) return;

  const data = invitation.data as { wishNotificationEmail?: string };
  const to = data.wishNotificationEmail ?? invitation.order.email;
  const siteUrl = getSiteUrl();

  await sendEmail({
    to,
    subject: `Lời chúc mới từ ${input.wish.name} — GoatWedding`,
    html: `
      <h2>Bạn có lời chúc mới!</h2>
      <p><strong>Người gửi:</strong> ${input.wish.name}</p>
      <p><strong>Tham dự:</strong> ${input.wish.attend}</p>
      <p><strong>Lời chúc:</strong></p>
      <p>${input.wish.message.replace(/\n/g, "<br>")}</p>
      <p>Thiệp: <a href="${siteUrl}/${invitation.slug}">${siteUrl}/${invitation.slug}</a></p>
    `,
  });
}
