export type FamilySide = {
  fatherName: string;
  motherName: string;
  address: string;
};

export type InviteVenue = {
  name: string;
  address: string;
  mapUrl?: string;
};

/** Ảnh theo từng section — số lượng cố định theo mẫu thiệp 1 */
export type InviteImages = {
  hero: string;
  invitation: [string, string, string];
  family: [string, string];
  gallery: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
  thankYou: string;
};

export type BankAccount = {
  /** Mã BIN ngân hàng (VietQR), ví dụ MB: 970422 */
  bankBin: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  /** Nội dung chuyển khoản mặc định trên QR */
  transferNote?: string;
};

/** Dữ liệu gốc — người dùng nhập / chọn từ form tạo thiệp */
export type InviteData = {
  brideName: string;
  groomName: string;
  /** ISO datetime từ input datetime-local, ví dụ 2027-10-23T17:30 */
  weddingAt: string;
  groomFamily: FamilySide;
  brideFamily: FamilySide;
  venue: InviteVenue;
  images: InviteImages;
  bankAccount: BankAccount;
  wishNotificationEmail: string;
};

export type CalendarCell =
  | { kind: "blank" }
  | { kind: "day"; day: number; isWeddingDay: boolean };

/** Trường tính toán từ InviteData — template chỉ render, không tự suy luận */
export type DerivedInviteData = {
  coupleDisplay: string;
  metadataTitle: string;
  metadataDescription: string;
  weekdayLabel: string;
  day: number;
  monthYearLabel: string;
  timeLabel: string;
  lunarLabel: string;
  calendarMonthLabel: string;
  calendarYear: number;
  calendarAriaLabel: string;
  calendarCells: CalendarCell[];
  vietQrUrl: string;
  mapUrl: string;
  galleryItems: { src: string; alt: string }[];
  groomPhotoAlt: string;
  bridePhotoAlt: string;
  heroPhotoAlt: string;
  thankYouPhotoAlt: string;
  invitationPhotoAlts: [string, string, string];
  wishStorageKey: string;
};

export type InviteTemplateProps = {
  data: InviteData;
  derived: DerivedInviteData;
  slug: string;
  showGuestInvite?: boolean;
};

export type Wish = {
  name: string;
  message: string;
  attend: string;
  createdAt: string;
};

export type CoverState = "closed" | "opening" | "opened";
