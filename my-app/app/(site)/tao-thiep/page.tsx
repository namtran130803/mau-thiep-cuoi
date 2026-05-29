import { Suspense } from "react";
import SiteContainer from "@/components/site/SiteContainer";
import TaoThiepContent from "./TaoThiepContent";

export default function TaoThiepPage() {
  return (
    <Suspense
      fallback={
        <div className="page-body page-body--fill">
          <SiteContainer className="site-container--panel site-container--fill">
            <div className="loading-state">Đang tải...</div>
          </SiteContainer>
        </div>
      }
    >
      <TaoThiepContent />
    </Suspense>
  );
}
