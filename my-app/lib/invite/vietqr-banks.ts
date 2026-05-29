import type { BankOption } from "@/lib/invite/banks";

const VIETQR_BANKS_URL = "https://api.vietqr.io/v2/banks";

type VietQrBankRecord = {
  code: string;
  name: string;
  bin: string;
  shortName?: string;
  short_name?: string;
  transferSupported?: number;
  isTransfer?: number;
};

type VietQrBanksResponse = {
  code: string;
  data?: VietQrBankRecord[];
};

function mapBank(record: VietQrBankRecord): BankOption {
  const shortName = record.short_name ?? record.shortName ?? record.code;
  return {
    bin: record.bin,
    code: record.code,
    name: shortName,
    fullName: record.name,
  };
}

export async function fetchVietQrBanks(): Promise<BankOption[]> {
  const res = await fetch(VIETQR_BANKS_URL, {
    next: { revalidate: 86_400 },
  });

  if (!res.ok) {
    throw new Error(`VietQR banks API failed: ${res.status}`);
  }

  const payload = (await res.json()) as VietQrBanksResponse;
  if (payload.code !== "00" || !Array.isArray(payload.data)) {
    throw new Error("VietQR banks API returned invalid data");
  }

  return payload.data
    .filter((bank) => bank.bin && bank.transferSupported === 1 && bank.isTransfer === 1)
    .map(mapBank)
    .sort((a, b) => a.name.localeCompare(b.name, "vi"));
}
