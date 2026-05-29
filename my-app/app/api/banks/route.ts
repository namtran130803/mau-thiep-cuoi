import { NextResponse } from "next/server";
import { fetchVietQrBanks } from "@/lib/invite/vietqr-banks";

export async function GET() {
  try {
    const banks = await fetchVietQrBanks();
    return NextResponse.json({ banks });
  } catch (error) {
    console.error("[banks]", error);
    return NextResponse.json(
      { error: "Không tải được danh sách ngân hàng" },
      { status: 502 },
    );
  }
}
