import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { sendWishEmail } from "@/lib/actions/payment";

type WishPayload = {
  slug: string;
  notifyEmail?: string;
  wish: {
    name: string;
    message: string;
    attend: string;
  };
};

export async function POST(request: Request) {
  const body = (await request.json()) as WishPayload;

  if (!body.slug || !body.wish?.name) {
    return NextResponse.json({ error: "Thiếu dữ liệu lời chúc" }, { status: 400 });
  }

  const invitation = await prisma.invitation.findUnique({
    where: { slug: body.slug },
  });

  if (!invitation) {
    return NextResponse.json({ error: "Không tìm thấy thiệp" }, { status: 404 });
  }

  await prisma.wish.create({
    data: {
      invitationId: invitation.id,
      name: body.wish.name,
      message: body.wish.message,
      attend: body.wish.attend,
    },
  });

  try {
    await sendWishEmail({
      slug: body.slug,
      wish: body.wish,
    });
  } catch (error) {
    console.error("[wishes:email]", error);
  }

  return NextResponse.json({ ok: true });
}
