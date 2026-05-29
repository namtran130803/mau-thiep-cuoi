import Link from "next/link";
import { notFound } from "next/navigation";
import PaymentClient from "@/components/site/PaymentClient";
import SiteContainer from "@/components/site/SiteContainer";
import { getOrderById } from "@/lib/actions/order";
import { buildPaymentReference } from "@/lib/slug";

type PaymentPageProps = {
  params: Promise<{ orderId: string }>;
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
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) notFound();

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
            {order.invitations[0] && (
              <Link href={`/${order.invitations[0].slug}`} className="site-btn site-btn--primary">
                Mở thiệp chính thức
              </Link>
            )}
          </div>
        </SiteContainer>
      </div>
    );
  }

  const inviteSlug = order.invitations[0]?.slug;
  if (!inviteSlug) notFound();

  const transferContent = buildPaymentReference(inviteSlug);
  const adminTransferInfo: AdminTransferInfo = {
    accountName: getRequiredEnv("SEPAY_ACCOUNT_NAME"),
    accountNumber: getRequiredEnv("SEPAY_ACCOUNT_NUMBER"),
    bank: getRequiredEnv("SEPAY_BANK"),
    content: transferContent,
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
            orderId={order.id}
            amount={order.totalAmount}
            adminTransferInfo={adminTransferInfo}
            sepayQrUrl={sepayQrUrl}
            initialInvitations={order.invitations.map((inv) => ({
              id: inv.id,
              slug: inv.slug,
              status: inv.status,
            }))}
          />
        </SiteContainer>
      </div>
    </>
  );
}
