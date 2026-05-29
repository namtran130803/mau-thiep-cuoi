import type { Metadata } from "next";
import GuestLinkGenerator from "@/components/site/GuestLinkGenerator";
import SiteContainer from "@/components/site/SiteContainer";
import { GUEST_NAME_WITH_LABEL } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Tạo thiệp tên riêng — GoatWedding",
  description: "Tạo liên kết thiệp cưới có tên riêng cho từng khách mời",
};

export default function TaoThiepTenRiengPage() {
  return (
    <>
      <div className="page-top">
        <SiteContainer>
          <p className="page-top__eyebrow">Cá nhân hóa</p>
          <h1 className="page-top__title">Tạo thiệp tên riêng</h1>
          <p className="page-top__desc">
            Dành cho {GUEST_NAME_WITH_LABEL.toLowerCase()}. Nhập liên kết thiệp và tên khách mời
            để tạo liên kết cá nhân hoá.
          </p>
        </SiteContainer>
      </div>
      <div className="page-body page-body--fill">
        <SiteContainer>
          <GuestLinkGenerator />
        </SiteContainer>
      </div>
    </>
  );
}
