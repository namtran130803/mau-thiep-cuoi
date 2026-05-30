import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SiteContainer from "@/components/site/SiteContainer";
import { listInviteTemplates } from "@/lib/templates/registry";

export const metadata: Metadata = {
  title: "Mẫu thiệp cưới online — GoatWedding",
  description:
    "Xem tất cả mẫu thiệp cưới online đẹp. Chọn phong cách phù hợp và bắt đầu tạo thiệp của bạn.",
};

export default function MauThiepPage() {
  const templates = listInviteTemplates();

  return (
    <>
      <div className="page-top">
        <SiteContainer>
          <p className="page-top__eyebrow">Bộ sưu tập</p>
          <h1 className="page-top__title">Mẫu thiệp cưới</h1>
          <p className="page-top__desc">
            Xem trước với dữ liệu mẫu. Thích mẫu nào thì bắt đầu tạo ngay.
          </p>
        </SiteContainer>
      </div>

      <div className="page-body page-body--fill">
        <SiteContainer>
          <div className="template-grid">
            {templates.map((template, i) => (
              <article key={template.slug} className="template-card">
                <Link href={`/${template.slug}`} className="template-card__img">
                  <Image
                    src={`/${template.slug}.png`}
                    alt={template.label}
                    fill
                    sizes="(max-width: 430px) 50vw, 195px"
                    style={{ objectFit: "cover", objectPosition: "top center" }}
                    unoptimized
                  />
                  <div className="template-card__num">Mẫu {i + 1}</div>
                </Link>
                <div className="template-card__foot">
                  <Link
                    href={`/tao-thiep?template=${template.slug}`}
                    className="site-btn site-btn--primary site-btn--full"
                  >
                    Tạo thiệp
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </SiteContainer>
      </div>
    </>
  );
}
