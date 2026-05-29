import { resolveBankBin } from "@/lib/invite/banks";
import type { BankAccount } from "@/lib/invite/types";

export function buildVietQrUrl(account: BankAccount): string {
  const bankId = resolveBankBin(account);
  const accountNumber = account.accountNumber.trim();
  const addInfo = (account.transferNote?.trim() || "Mung cuoi").slice(0, 50);
  const accountName = account.accountName.trim().slice(0, 50);

  const params = new URLSearchParams({
    addInfo,
    accountName,
  });

  return `https://img.vietqr.io/image/${bankId}-${accountNumber}-qr_only.png?${params.toString()}`;
}
