"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, PartyPopper, AlertCircle, Loader } from "lucide-react";
import { reclaimCheckoutSession } from "@/lib/actions/checkout";
import { createPayment } from "@/lib/actions/payment";
import {
  clearCheckoutSession,
  loadCheckoutSession,
} from "@/lib/checkout/client-session";
import { formatVnd } from "@/lib/pricing";
import { WIZARD_STORAGE_KEY, removeLocalJson } from "@/lib/storage/local";

type PaymentClientProps = {
  orderId: string;
  amount: number;
  adminTransferInfo: {
    accountName: string;
    accountNumber: string;
    bank: string;
    content: string;
  };
  sepayQrUrl: string;
  initialInvitations: Array<{ id: string; slug: string; status: string }>;
};

export default function PaymentClient({
  orderId,
  amount,
  adminTransferInfo,
  sepayQrUrl,
  initialInvitations,
}: PaymentClientProps) {
  const [initState, setInitState] = useState<"loading" | "error" | "ready">("loading");
  const [initError, setInitError] = useState("");
  const [status, setStatus] = useState<"pending" | "paid" | "not_found" | "forbidden">("pending");
  const [invitations, setInvitations] = useState(initialInvitations);
  const [copied, setCopied] = useState("");

  // Step 1: reclaim cookie session then create payment
  useEffect(() => {
    let active = true;

    async function initPayment() {
      try {
        const session = loadCheckoutSession();
        if (session?.orderId === orderId && session.invitationId) {
          await reclaimCheckoutSession({
            orderId: session.orderId,
            invitationId: session.invitationId,
          });
        }
        await createPayment(orderId);
        if (active) setInitState("ready");
      } catch (e) {
        if (!active) return;
        setInitError(e instanceof Error ? e.message : "Phiên đặt hàng không hợp lệ.");
        setInitState("error");
      }
    }

    void initPayment();
    return () => { active = false; };
  }, [orderId]);

  // Step 2: poll status
  useEffect(() => {
    if (initState !== "ready") return;
    let active = true;

    async function poll() {
      try {
        const res = await fetch(`/api/payment-status/${orderId}`);
        const result = (await res.json()) as {
          status: string;
          invitations?: Array<{ id: string; slug: string; status: string }>;
        };

        if (!active) return;

        if (res.status === 403 || result.status === "forbidden") {
          setStatus("forbidden");
          return;
        }
        if (result.status === "paid") {
          clearCheckoutSession();
          removeLocalJson(WIZARD_STORAGE_KEY);
          setStatus("paid");
          if (result.invitations) setInvitations(result.invitations);
          return;
        }
        if (result.status === "not_found") {
          setStatus("not_found");
          return;
        }
      } catch {
        // keep polling
      }
      if (active) window.setTimeout(poll, 3000);
    }

    poll();
    return () => { active = false; };
  }, [orderId, initState]);

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 2000);
  }

  // Loading
  if (initState === "loading") {
    return (
      <div className="payment-wrap" style={{ alignItems: "center", justifyContent: "center" }}>
        <Loader size={32} strokeWidth={1.5} style={{ color: "var(--muted)", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Đang khởi tạo thanh toán...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Error
  if (initState === "error") {
    return (
      <div className="error-state">
        <AlertCircle size={40} strokeWidth={1.2} />
        <p className="error-state__title">Lỗi thanh toán</p>
        <p className="error-state__desc">{initError}</p>
        <Link href="/tao-thiep" className="site-btn site-btn--primary">
          Quay lại tạo thiệp
        </Link>
      </div>
    );
  }

  // Forbidden (wrong device)
  if (status === "forbidden") {
    return (
      <div className="error-state">
        <AlertCircle size={40} strokeWidth={1.2} />
        <p className="error-state__title">Không thể thanh toán</p>
        <p className="error-state__desc">
          Vui lòng thanh toán trên thiết bị đã tạo thiệp.
        </p>
        <Link href="/tao-thiep" className="site-btn site-btn--primary">
          Quay lại tạo thiệp
        </Link>
      </div>
    );
  }

  // Success
  if (status === "paid") {
    return (
      <div className="payment-success-wrap">
        <div className="payment-success-icon">
          <PartyPopper size={32} strokeWidth={1.5} />
        </div>
        <p className="payment-success-title">Thanh toán thành công!</p>
        <p className="payment-success-desc">
          Thiệp chính thức đã kích hoạt. Liên kết đã gửi qua email.
        </p>
        <ul className="payment-links-list">
          {invitations.map((inv) => (
            <li key={inv.id} className="payment-link-item">
              <a href={`/${inv.slug}`}>
                {typeof window !== "undefined" ? window.location.origin : ""}/{inv.slug}
              </a>
              <button
                type="button"
                className="site-btn site-btn--ghost site-btn--sm"
                style={{ flexShrink: 0 }}
                onClick={() =>
                  copyText(`${window.location.origin}/${inv.slug}`, inv.id)
                }
              >
                {copied === inv.id ? <Check size={13} /> : <Copy size={13} />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Pending — show QR
  return (
    <div className="payment-wrap">
      {/* Amount */}
      <div className="payment-amount-card">
        <p className="payment-amount-label">Số tiền thanh toán</p>
        <p className="payment-amount-value">{formatVnd(amount)}</p>
      </div>

      {/* QR */}
      <div className="payment-qr-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={sepayQrUrl} alt="QR thanh toán" />
        <p className="payment-hint">
          Hệ thống tự xác nhận sau vài giây. <br />
          Vui lòng không đóng trang.
        </p>
      </div>

      {/* Admin transfer info */}
      <div className="payment-transfer-info" aria-label="Thông tin chuyển khoản cho admin">
        <div className="payment-transfer-line">
          <span className="payment-transfer-label">Tên tài khoản</span>
          <span className="payment-transfer-value">{adminTransferInfo.accountName}</span>
        </div>
        <div className="payment-transfer-line">
          <span className="payment-transfer-label">Số tài khoản</span>
          <span className="payment-transfer-value">{adminTransferInfo.accountNumber}</span>
        </div>
        <div className="payment-transfer-line">
          <span className="payment-transfer-label">Ngân hàng</span>
          <span className="payment-transfer-value">{adminTransferInfo.bank}</span>
        </div>
        <div className="payment-transfer-line">
          <span className="payment-transfer-label">Nội dung</span>
          <span className="payment-transfer-value">{adminTransferInfo.content}</span>
        </div>
      </div>

      
    </div>
  );
}
