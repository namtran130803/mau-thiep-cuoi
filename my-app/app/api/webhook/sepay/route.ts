import { NextResponse } from "next/server";
import { confirmPayment } from "@/lib/actions/payment";
import { prisma } from "@/lib/db/prisma";

type SepayWebhookPayload = {
  id?: number;
  code?: string;
  transferAmount?: number;
  amount?: number;
  content?: string;
  referenceCode?: string;
  description?: string;
  transactionContent?: string;
  transaction_content?: string;
  transferContent?: string;
  transfer_content?: string;
};

function extractSepayRef(payload: SepayWebhookPayload): string | null {
  const text = [
    payload.content,
    payload.description,
    payload.referenceCode,
    payload.transactionContent,
    payload.transaction_content,
    payload.transferContent,
    payload.transfer_content,
    payload.code,
  ]
    .filter(Boolean)
    .join(" ");
  // Matches the bank-safe payment reference, e.g. gwtrongnambichngoc.
  const match = text.match(/gw[a-z0-9]+/i);
  return match?.[0] ?? null;
}

export async function POST(request: Request) {
  const apiKey = process.env.SEPAY_WEBHOOK_API_KEY;
  if (apiKey) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Apikey ${apiKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const payload = (await request.json()) as SepayWebhookPayload;
  const ref = extractSepayRef(payload);

  if (!ref) {
    console.warn("[sepay:webhook] missing ref", payload);
    return NextResponse.json({ error: "Không tìm thấy mã tham chiếu" }, { status: 400 });
  }

  const payment = await prisma.payment.findFirst({ where: { sepayRef: ref } });
  if (!payment) {
    return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
  }

  try {
    await confirmPayment(payment.orderId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[sepay:webhook]", error);
    return NextResponse.json({ error: "Xử lý thất bại" }, { status: 500 });
  }
}
