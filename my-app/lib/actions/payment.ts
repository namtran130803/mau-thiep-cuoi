"use server";

import { prisma } from "@/lib/db/prisma";
import { assertCheckoutOrder, clearCheckoutOrder } from "@/lib/checkout/session";
import { getSiteUrl, sendEmail } from "@/lib/email/smtp";
import { publishInvitationsForOrder } from "@/lib/actions/invitation";
import { sendPublishedEmail } from "@/lib/actions/order";
import { buildPaymentReference } from "@/lib/slug";

export async function createPayment(orderId: string) {
  await assertCheckoutOrder(orderId);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { invitations: { take: 1 } },
  });
  if (!order) throw new Error("Không tìm thấy đơn hàng");
  if (order.status === "published" || order.status === "paid") {
    throw new Error("Đơn hàng đã thanh toán.");
  }

  const inviteSlug = order.invitations[0]?.slug;
  if (!inviteSlug) {
    throw new Error("Vui lòng tạo bản xem trước trước khi thanh toán.");
  }
  const sepayRef = buildPaymentReference(inviteSlug);

  const payment = await prisma.payment.upsert({
    where: { orderId },
    create: {
      orderId,
      amount: order.totalAmount,
      status: "pending",
      sepayRef,
    },
    update: {
      amount: order.totalAmount,
      status: "pending",
      sepayRef,
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "pending_payment" },
  });

  return payment;
}

export async function getPaymentStatus(orderId: string) {
  await assertCheckoutOrder(orderId);

  const payment = await prisma.payment.findUnique({
    where: { orderId },
    include: {
      order: { include: { invitations: true } },
    },
  });
  if (!payment) return { status: "not_found" as const };

  return {
    status: payment.status,
    invitations: payment.order.invitations.map((inv) => ({
      id: inv.id,
      slug: inv.slug,
      status: inv.status,
    })),
  };
}

export async function confirmPayment(orderId: string) {
  const payment = await prisma.payment.findUnique({ where: { orderId } });
  if (!payment) throw new Error("Không tìm thấy thanh toán");
  if (payment.status === "paid") return { alreadyPaid: true };

  await prisma.payment.update({
    where: { orderId },
    data: { status: "paid", paidAt: new Date() },
  });

  await publishInvitationsForOrder(orderId);
  await sendPublishedEmail(orderId);
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
