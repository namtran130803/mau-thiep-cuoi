import type { ReactNode } from "react";
import "./invite.css";

export default function InviteLayout({ children }: { children: ReactNode }) {
  return <div className="invite-layout">{children}</div>;
}
