import type { BankAccount } from "@/lib/invite/types";

export type BankOption = {
  bin: string;
  code: string;
  /** Tên hiển thị ngắn (short name). */
  name: string;
  /** Tên đầy đủ từ VietQR (nếu có). */
  fullName?: string;
};

const DEFAULT_BANK_BIN =
  process.env.SEPAY_BANK_BIN?.trim() ||
  process.env.VIETQR_DEFAULT_BANK_BIN?.trim() ||
  "970422";

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function resolveBankBin(
  account: Pick<BankAccount, "bankBin" | "bankName">,
): string {
  const explicitBin = account.bankBin?.trim();
  if (explicitBin) return explicitBin;

  const bankName = normalizeText(account.bankName ?? "");
  if (!bankName) return DEFAULT_BANK_BIN;

  if (/\bmb\b|mbbank|quan doi|military/.test(bankName)) return "970422";
  if (/vietcombank|vcb/.test(bankName)) return "970436";
  if (/vietinbank|icb/.test(bankName)) return "970415";
  if (/techcombank|tcb/.test(bankName)) return "970407";
  if (/bidv/.test(bankName)) return "970418";
  if (/agribank|vba/.test(bankName)) return "970405";
  if (/acb/.test(bankName)) return "970416";
  if (/vpbank|vpb/.test(bankName)) return "970432";

  return DEFAULT_BANK_BIN;
}

export function resolveBankName(
  account: Pick<BankAccount, "bankBin" | "bankName">,
): string {
  return account.bankName?.trim() ?? "";
}
