import SiteContainer from "@/components/site/SiteContainer";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <SiteContainer>
        <p className="site-footer__brand">GoatWedding</p>
        <p className="site-footer__desc">
          Tạo thiệp cưới online đẹp, nhanh chóng và dễ chia sẻ qua Zalo,
          Facebook, Messenger. Không cần đăng nhập.
        </p>
        <p className="site-footer__copy">
          © {new Date().getFullYear()} GoatWedding — Mọi quyền được bảo lưu.
        </p>
      </SiteContainer>
    </footer>
  );
}
