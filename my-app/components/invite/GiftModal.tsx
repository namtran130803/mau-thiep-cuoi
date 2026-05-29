import type { BankAccount } from "@/lib/invite/types";

type GiftModalProps = {
  isOpen: boolean;
  onClose: () => void;
  vietQrUrl: string;
  bankAccount: BankAccount;
  qrBoxClassName?: string;
};

export default function GiftModal({
  isOpen,
  onClose,
  vietQrUrl,
  bankAccount,
  qrBoxClassName = "gift-qr",
}: GiftModalProps) {
  return (
    <div
      className={`modal${isOpen ? " is-open" : ""}`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-label="Thông tin mừng cưới"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <button className="modal-close" type="button" aria-label="Đóng" onClick={onClose}>
          ×
        </button>
        <div className="section-title modal-title-sm">Mừng Cưới</div>
        <p className="modal-lead">
          Cảm ơn quý khách đã gửi gắm tình cảm và lời chúc tốt đẹp trong ngày vui của hai gia
          đình.
        </p>

        <div className={qrBoxClassName}>
          <img src={vietQrUrl} alt="Mã VietQR mừng cưới" />
        </div>

        <div className="gift-account">
          <strong>{bankAccount.accountName}</strong>
          <span>{bankAccount.accountNumber}</span>
          <span>{bankAccount.bankName}</span>
        </div>
      </div>
    </div>
  );
}
