import amlich from "amlich";
import { buildVietQrUrl } from "@/lib/invite/vietqr";
import type {
  CalendarCell,
  DerivedInviteData,
  InviteData,
} from "@/lib/invite/types";

const WEEKDAYS = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
] as const;

const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"] as const;
const CHI = [
  "Tý",
  "Sửu",
  "Dần",
  "Mão",
  "Thìn",
  "Tỵ",
  "Ngọ",
  "Mùi",
  "Thân",
  "Dậu",
  "Tuất",
  "Hợi",
] as const;

const VN_MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
] as const;

function getCanChiYear(year: number): string {
  const can = CAN[(year + 6) % 10];
  const chi = CHI[(year + 8) % 12];
  return `${can} ${chi}`;
}

function buildCalendarCells(
  year: number,
  month: number,
  weddingDay: number,
): CalendarCell[] {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const mondayFirstOffset = firstWeekday === 0 ? 6 : firstWeekday - 1;
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: CalendarCell[] = [];

  for (let i = 0; i < mondayFirstOffset; i += 1) {
    cells.push({ kind: "blank" });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      kind: "day",
      day,
      isWeddingDay: day === weddingDay,
    });
  }

  return cells;
}

function formatLunarLabel(date: Date): string {
  const [lunarDay, lunarMonth, lunarYear] = amlich.convertSolar2Lunar(
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear(),
    7,
  );

  const lunarMonthText = String(lunarMonth).padStart(2, "0");
  return `Tức ngày ${lunarDay} tháng ${lunarMonthText} năm ${getCanChiYear(lunarYear)}`;
}

function buildMapUrl(data: InviteData): string {
  if (data.venue.mapUrl) return data.venue.mapUrl;

  const query = `${data.venue.name} ${data.venue.address}`.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function deriveInviteData(data: InviteData, slug: string): DerivedInviteData {
  const weddingDate = new Date(data.weddingAt);
  const day = weddingDate.getDate();
  const month = weddingDate.getMonth() + 1;
  const year = weddingDate.getFullYear();
  const hours = String(weddingDate.getHours()).padStart(2, "0");
  const minutes = String(weddingDate.getMinutes()).padStart(2, "0");

  const coupleDisplay = `${data.brideName} & ${data.groomName}`;

  return {
    coupleDisplay,
    metadataTitle: `Thiệp mời cưới - ${coupleDisplay}`,
    metadataDescription: `Thiệp mời cưới trực tuyến của ${coupleDisplay}`,
    weekdayLabel: WEEKDAYS[weddingDate.getDay()],
    day,
    monthYearLabel: `${String(month).padStart(2, "0")}.${year}`,
    timeLabel: `Vào lúc ${hours}:${minutes}`,
    lunarLabel: formatLunarLabel(weddingDate),
    calendarMonthLabel: VN_MONTHS[month - 1],
    calendarYear: year,
    calendarAriaLabel: `Lịch ${VN_MONTHS[month - 1].toLowerCase()} năm ${year}`,
    calendarCells: buildCalendarCells(year, month, day),
    vietQrUrl: buildVietQrUrl(data.bankAccount),
    mapUrl: buildMapUrl(data),
    galleryItems: data.images.gallery.map((src, index) => ({
      src,
      alt: `Ảnh cưới ${index + 1} — ${coupleDisplay}`,
    })),
    groomPhotoAlt: `Chú rể ${data.groomName}`,
    bridePhotoAlt: `Cô dâu ${data.brideName}`,
    heroPhotoAlt: `Ảnh cưới ${coupleDisplay}`,
    thankYouPhotoAlt: `Ảnh kết thiệp ${coupleDisplay}`,
    invitationPhotoAlts: [
      `Ảnh thư mời 1 — ${coupleDisplay}`,
      `Ảnh thư mời 2 — ${coupleDisplay}`,
      `Ảnh thư mời 3 — ${coupleDisplay}`,
    ],
    wishStorageKey: `wedding_wishes_${slug}`,
  };
}

export function createInviteMetadata(data: InviteData) {
  const derived = deriveInviteData(data, "preview");
  return {
    title: derived.metadataTitle,
    description: derived.metadataDescription,
  };
}
