"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import CreateInviteLink from "@/components/site/CreateInviteLink";
import SiteContainer from "@/components/site/SiteContainer";

export default function SiteHeader() {
  const pathname = usePathname();

  if (pathname.startsWith("/demo/")) {
    return null;
  }

  return (
    <header className="site-header">
      <SiteContainer className="site-container--flush">
        <div className="site-header__inner">
          <Link href="/" className="site-logo" aria-label="GoatWedding – Trang chủ">
            <span className="site-logo__name">GoatWedding</span>
          </Link>

          <CreateInviteLink className="site-btn site-btn--primary site-btn--sm">
            <Sparkles size={12} />
            Tạo thiệp
          </CreateInviteLink>
        </div>
      </SiteContainer>
    </header>
  );
}
