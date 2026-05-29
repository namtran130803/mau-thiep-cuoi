import Link from "next/link";

export default function DemoBanner({ payUrl }: { payUrl: string | null }) {
  return (
    <div className="demo-banner demo-banner--top">
      <span className="demo-banner__text">
        Bản xem trước, chưa thanh toán
      </span>
      {payUrl && (
        <Link
          href={payUrl}
          className="site-btn site-btn--green site-btn--sm"
          style={{ flexShrink: 0 }}
        >
          Thanh toán
        </Link>
      )}
    </div>
  );
}
