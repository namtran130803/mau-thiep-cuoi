import type { ReactNode } from "react";
import "@/app/(invite)/invite.css";
import "./demo.css";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return <div className="invite-layout invite-layout--demo">{children}</div>;
}
