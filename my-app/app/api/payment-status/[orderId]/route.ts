import { NextResponse } from "next/server";
import { getPaymentStatus } from "@/lib/actions/payment";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { orderId } = await context.params;

  try {
    const result = await getPaymentStatus(orderId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        status: "forbidden",
        error: error instanceof Error ? error.message : "Không có quyền truy cập",
      },
      { status: 403 },
    );
  }
}
