"use server";

import { prisma } from "@/lib/db/prisma";
import { setCheckoutOrderId } from "@/lib/checkout/session";
import { getSiteUrl, sendEmail } from "@/lib/email/smtp";
import { calculateTotalAmount, type PackageType } from "@/lib/pricing";
import { createOrderSchema } from "@/lib/validation/invite";

export async function createOrder(input: {
  email: string;
  packageType: PackageType;
  guestNameService: boolean;
}) {
  const parsed = createOrderSchema.parse(input);
  const totalAmount = calculateTotalAmount(
    parsed.packageType,
    parsed.guestNameService,
  );

  const order = await prisma.order.create({
    data: {
      email: parsed.email,
      packageType: parsed.packageType,
      guestNameService: parsed.guestNameService,
      totalAmount,
      status: "draft",
    },
  });

  await setCheckoutOrderId(order.id);

  return {
    orderId: order.id,
    totalAmount: order.totalAmount,
  };
}

export async function updateOrderEmail(orderId: string, email: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { email },
  });
}

export async function updateOrderDraft(
  orderId: string,
  input: {
    email: string;
    packageType: PackageType;
    guestNameService: boolean;
  },
) {
  const totalAmount = calculateTotalAmount(
    input.packageType,
    input.guestNameService,
  );

  await prisma.order.update({
    where: { id: orderId },
    data: {
      email: input.email,
      packageType: input.packageType,
      guestNameService: input.guestNameService,
      totalAmount,
    },
  });
}

export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { invitations: true, payment: true },
  });
}

export async function sendPublishedEmail(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { invitations: true },
  });
  if (!order) return;

  const siteUrl = getSiteUrl();
  const links = order.invitations
    .filter((inv) => inv.status === "active")
    .map((inv) => `<li><a href="${siteUrl}/${inv.slug}">${siteUrl}/${inv.slug}</a></li>`)
    .join("");

  const guestLinkUrl = order.guestNameService ? `${siteUrl}/tao-thiep-ten-rieng` : null;

  await sendEmail({
    to: order.email,
    subject: "Thiệp cưới chính thức của bạn — GoatWedding",
    html: `
      <h2>Thanh toán thành công!</h2>
      <p>Liên kết thiệp chính thức của bạn:</p>
      <ul>${links}</ul>
      ${
        guestLinkUrl
          ? `<p>Tạo liên kết mời riêng từng khách: <a href="${guestLinkUrl}">${guestLinkUrl}</a></p>`
          : ""
      }
      <p>Sau khi nhận liên kết, thiệp không thể chỉnh sửa thêm.</p>
    `,
  });
}
