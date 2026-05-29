import type { InviteData } from "@/lib/invite/types";

const U = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Dữ liệu demo dùng chung cho mọi mẫu thiệp (chỉ khác layout/style). */
export const demoInviteData: InviteData = {
  brideName: "Bích Ngọc",
  groomName: "Trọng Nam",
  weddingAt: "2027-10-23T17:30",
  groomFamily: {
    fatherName: "Ông Nguyễn Văn Hùng",
    motherName: "Bà Trần Thị Lan",
    address: "Thôn Đông, xã An Khánh,\nHoài Đức, Hà Nội",
  },
  brideFamily: {
    fatherName: "Ông Phạm Văn Minh",
    motherName: "Bà Lê Thị Hương",
    address: "Số 18, phố Trần Hưng Đạo,\nHoàn Kiếm, Hà Nội",
  },
  venue: {
    name: "Trung tâm tiệc cưới Sen Việt",
    address: "Số 88 đường Láng Hạ, quận Đống Đa, Hà Nội",
  },
  images: {
    hero: U("1523438885200-e635ba2c371e"),
    invitation: [
      U("1522673607200-164d1b6ce486", 500),
      U("1519741497674-611481863552", 500),
      U("1529634806980-85c3dd6d34ac", 500),
    ],
    family: [U("1537633552985-df8429e8048b", 600), U("1519741497674-611481863552", 600)],
    gallery: [
      U("1529634806980-85c3dd6d34ac", 500),
      U("1522673607200-164d1b6ce486", 500),
      U("1511285560929-80b456fea0bc", 500),
      U("1519225421980-715cb0215aed", 500),
      U("1494955870715-979ca4f13bf0", 500),
      U("1460978812857-470ed1c77af0", 500),
      U("1505932794465-147d1f1b2c97", 500),
      U("1545232979-8bf68ee9b1af", 500),
      U("1509610973147-232dfea52a97", 500),
      U("1494774157365-9e04c6720e47", 500),
    ],
    thankYou: U("1494774157365-9e04c6720e47"),
  },
  bankAccount: {
    bankBin: "970422",
    accountNumber: "0886138003",
    accountName: "TRAN TRONG NAM",
    bankName: "MB - Ngân hàng TMCP Quân đội",
    transferNote: "Ten khach moi gui loi chuc",
  },
  wishNotificationEmail: "demo@example.com",
};
