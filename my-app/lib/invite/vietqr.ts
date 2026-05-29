import type { BankAccount } from "@/lib/invite/types";

export function buildVietQrUrl(account: BankAccount): string {
  const addInfo = account.transferNote ?? "Mung cuoi";
  const params = new URLSearchParams({
    addInfo,
    accountName: account.accountName,
  });

  return `https://img.vietqr.io/image/${account.bankBin}-${account.accountNumber}-qr_only.png?${params.toString()}`;
}
