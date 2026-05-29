"use client";

import "aos/dist/aos.css";
import CoverGate from "@/components/invite/CoverGate";
import GiftModal from "@/components/invite/GiftModal";
import {
  useInviteRuntime,
  type UseInviteRuntimeReturn,
} from "@/components/invite/hooks/useInviteRuntime";
import type { InviteTemplateProps } from "@/lib/invite/types";
import { createContext, useContext, type ReactNode } from "react";

const InviteRuntimeContext = createContext<UseInviteRuntimeReturn | null>(null);

export function useInvitePage() {
  const context = useContext(InviteRuntimeContext);
  if (!context) {
    throw new Error("useInvitePage must be used within InviteShell");
  }
  return context;
}

type InviteShellProps = InviteTemplateProps & {
  scopeClass: string;
  aosOffset?: number;
  showWishAlert?: boolean;
  qrBoxClassName?: string;
  children: ReactNode;
};

export default function InviteShell({
  scopeClass,
  aosOffset = 0,
  showWishAlert = true,
  showGuestInvite = true,
  qrBoxClassName = "gift-qr",
  data,
  derived,
  slug,
  children,
}: InviteShellProps) {
  const runtime = useInviteRuntime({
    slug,
    data,
    derived,
    aosOffset,
    showWishAlert,
    showGuestInvite,
  });

  return (
    <InviteRuntimeContext.Provider value={runtime}>
      <div ref={runtime.scopeRef} className={scopeClass}>
        <main
          ref={runtime.appRootRef}
          tabIndex={-1}
          className={`app${runtime.isContentReady ? " is-content-ready" : ""}`}
        >
          <CoverGate
            coverGateRef={runtime.coverGateRef}
            className={runtime.coverGateClassName}
            isInteractive={runtime.isCoverInteractive}
            coverState={runtime.coverState}
            onOpen={runtime.openCover}
            onKeyDown={runtime.handleCoverKeyDown}
            brideName={data.brideName}
            groomName={data.groomName}
          />
          {children}
        </main>

        <GiftModal
          isOpen={runtime.isGiftModalOpen}
          onClose={runtime.closeGiftModal}
          vietQrUrl={derived.vietQrUrl}
          bankAccount={data.bankAccount}
          qrBoxClassName={qrBoxClassName}
        />
      </div>
    </InviteRuntimeContext.Provider>
  );
}
