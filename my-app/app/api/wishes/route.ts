import { NextResponse } from "next/server";

type WishPayload = {
  slug: string;
  notifyEmail: string;
  wish: {
    name: string;
    message: string;
    attend: string;
  };
};

export async function POST(request: Request) {
  const body = (await request.json()) as WishPayload;

  if (!body.slug || !body.notifyEmail || !body.wish?.name) {
    return NextResponse.json({ error: "Thiếu dữ liệu lời chúc" }, { status: 400 });
  }

  // TODO: gửi email tới body.notifyEmail (Resend, SendGrid, ...)
  console.info("[wishes]", {
    to: body.notifyEmail,
    slug: body.slug,
    wish: body.wish,
  });

  return NextResponse.json({ ok: true });
}
