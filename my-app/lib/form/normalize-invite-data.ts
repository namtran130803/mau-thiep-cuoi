import { resolveBankBin, resolveBankName } from "@/lib/invite/banks";
import type { InviteData } from "@/lib/invite/types";

function fillArray<T>(values: T[], length: number, fallback: T): T[] {
  const result = [...values];
  while (result.length < length) {
    result.push(fallback);
  }
  return result.slice(0, length);
}

export function normalizeInviteData(data: InviteData): InviteData {
  const hero = data.images.hero;
  const thankYou = data.images.thankYou || hero;

  const invitation = fillArray(data.images.invitation, 3, hero) as InviteData["images"]["invitation"];
  const family = fillArray(data.images.family, 2, hero) as InviteData["images"]["family"];
  const gallery = fillArray(
    data.images.gallery.map((item) => item || hero),
    10,
    hero,
  ) as InviteData["images"]["gallery"];

  return {
    ...data,
    venue: {
      ...data.venue,
      mapUrl: data.venue.mapUrl?.trim() || undefined,
    },
    bankAccount: {
      ...data.bankAccount,
      bankBin: resolveBankBin(data.bankAccount),
      bankName: resolveBankName(data.bankAccount),
      accountNumber: data.bankAccount.accountNumber.trim(),
      accountName: data.bankAccount.accountName.trim(),
      transferNote: data.bankAccount.transferNote?.trim() || "Mung cuoi",
    },
    images: {
      hero,
      invitation,
      family,
      gallery,
      thankYou,
    },
  };
}
