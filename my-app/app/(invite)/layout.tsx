import type { ReactNode } from "react";
import "./invite.css";
import "@/templates/thiep-cuoi-1/styles.css";
import "@/templates/thiep-cuoi-2/styles.css";
import "@/templates/thiep-cuoi-3/styles.css";
import "@/templates/thiep-cuoi-4/styles.css";

export default function InviteLayout({ children }: { children: ReactNode }) {
  return <div className="invite-layout">{children}</div>;
}
