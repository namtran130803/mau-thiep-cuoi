const VIET_MAP: Record<string, string> = {
  à: "a",
  á: "a",
  ả: "a",
  ã: "a",
  ạ: "a",
  ă: "a",
  ằ: "a",
  ắ: "a",
  ẳ: "a",
  ẵ: "a",
  ặ: "a",
  â: "a",
  ầ: "a",
  ấ: "a",
  ẩ: "a",
  ẫ: "a",
  ậ: "a",
  è: "e",
  é: "e",
  ẻ: "e",
  ẽ: "e",
  ẹ: "e",
  ê: "e",
  ề: "e",
  ế: "e",
  ể: "e",
  ễ: "e",
  ệ: "e",
  ì: "i",
  í: "i",
  ỉ: "i",
  ĩ: "i",
  ị: "i",
  ò: "o",
  ó: "o",
  ỏ: "o",
  õ: "o",
  ọ: "o",
  ô: "o",
  ồ: "o",
  ố: "o",
  ổ: "o",
  ỗ: "o",
  ộ: "o",
  ơ: "o",
  ờ: "o",
  ớ: "o",
  ở: "o",
  ỡ: "o",
  ợ: "o",
  ù: "u",
  ú: "u",
  ủ: "u",
  ũ: "u",
  ụ: "u",
  ư: "u",
  ừ: "u",
  ứ: "u",
  ử: "u",
  ữ: "u",
  ự: "u",
  ỳ: "y",
  ý: "y",
  ỷ: "y",
  ỹ: "y",
  ỵ: "y",
  đ: "d",
};

function removeDiacritics(value: string): string {
  return value
    .toLowerCase()
    .split("")
    .map((char) => VIET_MAP[char] ?? char)
    .join("");
}

export function slugify(value: string): string {
  return removeDiacritics(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function slugifyName(value: string): string {
  return removeDiacritics(value)
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^-+|-+$/g, "");
}

export function buildInviteSlug(groomName: string, brideName: string): string {
  const groom = slugifyName(groomName) || "chu-re";
  const bride = slugifyName(brideName) || "co-dau";
  return `${groom}-${bride}`;
}

export function buildPaymentReference(orderId: string): string {
  const cleanId = orderId.replace(/\D/g, "");
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000).toString();
  return `GW${cleanId}${randomDigits}`;
}
