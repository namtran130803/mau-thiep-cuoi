import Link from "next/link";
import { notFound } from "next/navigation";
import PaymentClient from "@/components/site/PaymentClient";
import SiteContainer from "@/components/site/SiteContainer";
import { prisma } from "@/lib/db/prisma";
import { formatDbId } from "@/lib/db/id";

type PaymentPageProps = {
  params: Promise<{ ref: string }>;
};

type AdminTransferInfo = {
  accountName: string;
  accountNumber: string;
  bank: string;
  content: string;
};

function getRequiredEnv(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function buildSepayQrUrl(amount: number, info: AdminTransferInfo): string {
  const params = new URLSearchParams({
    bank: info.bank,
    acc: info.accountNumber,
    amount: String(amount),
    des: info.content,
    template: "qronly",
  });
  return `https://qr.sepay.vn/img?${params.toString()}`;
}

export default async function ThanhToanPage({ params }: PaymentPageProps) {
  const { ref } = await params;
  if (!ref.startsWith("GW")) notFound();

  const order = await prisma.order.findUnique({
    where: { sepayRef: ref },
    include: { invitations: true, payment: true },
  });

  if (!order) notFound();
  const orderIdText = formatDbId(order.id);
  const sepayRef = order.sepayRef ?? ref;

  if (order.status === "published" || order.status === "paid") {
    return (
      <div className="page-body">
        <SiteContainer>
          <div className="payment-success-wrap">
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "#22863a" }}>
              Đơn hàng đã thanh toán
            </p>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
              Thiệp đã xuất bản và không thể chỉnh sửa thêm.
            </p>
            <ul className="payment-links-list">
              {order.invitations.filter((inv) => inv.status === "active").map((inv, index) => (
                <li key={formatDbId(inv.id)} className="payment-link-item">
                  <Link href={`/${inv.slug}`}>
                    {inv.label?.trim() || `Thiệp ${index + 1}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </SiteContainer>
      </div>
    );
  }

  if (!order.invitations.some((invitation) => invitation.status === "demo")) notFound();

  const adminTransferInfo: AdminTransferInfo = {
    accountName: getRequiredEnv("SEPAY_ACCOUNT_NAME"),
    accountNumber: getRequiredEnv("SEPAY_ACCOUNT_NUMBER"),
    bank: getRequiredEnv("SEPAY_BANK"),
    content: sepayRef,
  };
  const sepayQrUrl = buildSepayQrUrl(order.totalAmount, adminTransferInfo);

  return (
    <>
      <div className="page-top">
        <SiteContainer>
          <p className="page-top__eyebrow">Bước cuối cùng</p>
          <h1 className="page-top__title">Thanh toán để nhận thiệp</h1>
        </SiteContainer>
      </div>
      <div className="page-body page-body--fill">
        <SiteContainer>
          <PaymentClient
            orderId={orderIdText}
            amount={order.totalAmount}
            sepayRef={sepayRef}
            adminTransferInfo={adminTransferInfo}
            sepayQrUrl={sepayQrUrl}
            initialInvitations={order.invitations.map((inv) => ({
              id: formatDbId(inv.id),
              label: inv.label,
              slug: inv.slug,
              status: inv.status,
            }))}
          />
        </SiteContainer>
      </div>
    </>
  );
}
