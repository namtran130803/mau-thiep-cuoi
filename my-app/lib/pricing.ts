export type PackageType = "single" | "dual_same" | "dual_diff";

export type PackageInfo = {
  id: PackageType;
  name: string;
  description: string;
  price: number;
  features: string[];
};

export const GUEST_NAME_SERVICE_PRICE = 1000;

export const GUEST_NAME_WITHOUT_LABEL = "Thiệp không dùng tên riêng từng khách mời";
export const GUEST_NAME_WITH_LABEL = "Thiệp dùng tên riêng từng khách mời";

export const GUEST_NAME_WITHOUT_DESC =
  "Một liên kết thiệp chung, không hiển thị phần kính mời tên riêng.";
export const GUEST_NAME_WITH_DESC =
  "Có thể tạo liên kết riêng hiển thị tên từng khách mời trên thiệp.";

export const GUEST_NAME_LINK_PAGE = "/tao-thiep-ten-rieng";

export const PACKAGES: PackageInfo[] = [
  {
    id: "single",
    name: "Một thiệp cưới",
    description: "Phù hợp khi bạn chỉ cần một liên kết thiệp duy nhất.",
    price: 2000,
    features: [
      "1 mẫu thiệp",
      "1 liên kết thiệp chính thức",
      "Bộ ảnh & mục lời chúc",
      "Mã QR chuyển khoản mừng cưới",
    ],
  },
  {
    id: "dual_same",
    name: "Hai thiệp chung mẫu",
    description: "Hai liên kết thiệp cùng giao diện — nhà trai & nhà gái.",
    price: 3000,
    features: [
      "2 liên kết thiệp",
      "Cùng một mẫu thiết kế",
      "Thông tin từng thiệp cấu hình riêng",
      "Bộ ảnh & mục lời chúc",
    ],
  },
  {
    id: "dual_diff",
    name: "Hai thiệp khác mẫu",
    description: "Nhà trai và nhà gái dùng hai phong cách thiệp khác nhau.",
    price: 4000,
    features: [
      "2 liên kết thiệp",
      "2 mẫu thiết kế khác nhau",
      "Thông tin từng thiệp cấu hình riêng",
      "Bộ ảnh & mục lời chúc",
    ],
  },
];

export function getPackageInfo(packageType: PackageType): PackageInfo {
  const pkg = PACKAGES.find((item) => item.id === packageType);
  if (!pkg) throw new Error(`Unknown package: ${packageType}`);
  return pkg;
}

export function calculateTotalAmount(
  packageType: PackageType,
  guestNameService: boolean,
): number {
  const base = getPackageInfo(packageType).price;
  return base + (guestNameService ? GUEST_NAME_SERVICE_PRICE : 0);
}

export function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
