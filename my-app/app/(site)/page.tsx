import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Check,
  ArrowRight,
  MessageCircle,
  ExternalLink,
  Mail,
  ShieldCheck,
  Zap,
  Gift,
} from "lucide-react";
import { listInviteTemplates } from "@/lib/templates/registry";
import CreateInviteLink from "@/components/site/CreateInviteLink";
import SiteContainer from "@/components/site/SiteContainer";
import { PACKAGES, formatVnd } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "GoatWedding — Thiệp cưới online đẹp, nhanh, dễ chia sẻ",
  description:
    "Tạo thiệp cưới online không cần đăng nhập. Chọn mẫu, nhập thông tin, xem trước và nhận liên kết thiệp chỉ trong vài bước.",
};

export default function HomePage() {
  const templates = listInviteTemplates();

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="hero">
        <SiteContainer>
          <div className="hero__eyebrow">
            <Sparkles size={12} />
            Thiệp cưới online
          </div>
          <h1 className="hero__title">
            Thiệp cưới đẹp,<br />
            <em>gửi đến từng người</em>
          </h1>
          <p className="hero__lead">
            Chọn mẫu, nhập thông tin, xem trước thiệp — nhận liên kết chính thức ngay sau khi thanh toán.
            Không cần đăng nhập.
          </p>
          <div className="hero__actions">
            <CreateInviteLink className="site-btn site-btn--primary site-btn--full">
              Tạo thiệp ngay
            </CreateInviteLink>
            <Link href="/mau-thiep" className="site-btn site-btn--ghost site-btn--full">
              Xem mẫu thiệp
            </Link>
          </div>
          <div className="hero__proof">
            <span className="hero__proof-item">
              <ShieldCheck size={13} />
              Xem trước miễn phí, chỉ trả khi ưng ý
            </span>
            <span className="hero__proof-item">
              <Zap size={13} />
              Nhận liên kết ngay sau thanh toán
            </span>
            <span className="hero__proof-item">
              <Gift size={13} />
              Không cần đăng nhập
            </span>
          </div>
        </SiteContainer>
      </section>

      {/* ── Template gallery ───────────────────────────────────────── */}
      <section className="section" id="templates">
        <SiteContainer>
          <div className="section__head">
            <p className="section__eyebrow">Mẫu thiệp</p>
            <h2 className="section__title">Chọn phong cách của bạn</h2>
            <p className="section__desc">4 mẫu thiệp đẹp, phù hợp mọi phong cách</p>
          </div>

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

          <div className="text-center mt-24">
            <Link href="/mau-thiep" className="site-btn site-btn--ghost">
              Xem tất cả mẫu
              <ArrowRight size={14} />
            </Link>
          </div>
        </SiteContainer>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section className="section section--ivory" id="how-it-works">
        <SiteContainer>
          <div className="section__head">
            <p className="section__eyebrow">Đơn giản</p>
            <h2 className="section__title">Chỉ 4 bước là xong</h2>
          </div>

          <div className="steps-list">
            {[
              { n: "1", title: "Chọn gói & loại thiệp", desc: "Chọn gói phù hợp, quyết định thiệp có hiển thị tên riêng khách mời không." },
              { n: "2", title: "Nhập thông tin", desc: "Điền tên cô dâu chú rể, ngày giờ, địa điểm, ảnh cưới." },
              { n: "3", title: "Xem trước", desc: "Tạo bản xem trước, chỉnh sửa thoải mái trước khi thanh toán." },
              { n: "4", title: "Thanh toán & nhận liên kết", desc: "Quét mã QR chuyển khoản, nhận liên kết thiệp qua email ngay." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="step-item">
                <div className="step-item__num">{n}</div>
                <div>
                  <div className="step-item__title">{title}</div>
                  <div className="step-item__desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-32">
            <CreateInviteLink className="site-btn site-btn--primary site-btn--full">
              Bắt đầu ngay
              <ArrowRight size={15} />
            </CreateInviteLink>
          </div>
        </SiteContainer>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────── */}
      <section className="section" id="pricing">
        <SiteContainer>
          <div className="section__head">
            <p className="section__eyebrow">Bảng giá</p>
            <h2 className="section__title">Rõ ràng, không phí ẩn</h2>
          </div>

          <div className="pricing-list">
            {PACKAGES.map((pkg, i) => (
              <article
                key={pkg.id}
                className={`pricing-card${i === 1 ? " pricing-card--featured" : ""}`}
              >
                {i === 1 && <span className="pricing-card__badge">Phổ biến</span>}
                <p className="pricing-card__name">{pkg.name}</p>
                <p className="pricing-card__desc">{pkg.description}</p>
                <p className="pricing-card__price">{formatVnd(pkg.price)}</p>
                <p className="pricing-card__note">Thanh toán một lần</p>
                <ul className="pricing-card__features">
                  {pkg.features.map((feature) => (
                    <li key={feature}>
                      <Check size={13} strokeWidth={3} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/tao-thiep?package=${pkg.id}`}
                  className={`site-btn ${i === 1 ? "site-btn--primary" : "site-btn--ghost"} site-btn--full`}
                >
                  Chọn gói này
                </Link>
              </article>
            ))}
          </div>
        </SiteContainer>
      </section>

      {/* ── Contact ──────────────────────────────────────────────── */}
      <section className="section section--wine" id="contact">
        <SiteContainer>
          <div className="section__head">
            <h2 className="section__title">Cần hỗ trợ?</h2>
            <p className="section__desc">Liên hệ chúng tôi — phản hồi nhanh trong giờ hành chính</p>
          </div>

          <div className="contact-links">
            <a href="https://zalo.me/" className="contact-link" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} />
              Chat Zalo hỗ trợ
            </a>
            <a href="https://facebook.com/" className="contact-link" target="_blank" rel="noopener noreferrer">
              <ExternalLink size={18} />
              Facebook GoatWedding
            </a>
            <a href="mailto:hello@goatwedding.vn" className="contact-link">
              <Mail size={18} />
              hello@goatwedding.vn
            </a>
          </div>

          <div className="text-center mt-8">
            <CreateInviteLink className="site-btn site-btn--gold site-btn--full">
              Tạo thiệp cưới ngay
              <ArrowRight size={15} />
            </CreateInviteLink>
          </div>
        </SiteContainer>
      </section>
    </>
  );
}
