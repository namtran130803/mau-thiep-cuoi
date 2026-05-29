import type { ElementType, ReactNode } from "react";

type SiteContainerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

export default function SiteContainer({
  children,
  className = "",
  as: Tag = "div",
}: SiteContainerProps) {
  const classes = className ? `site-container ${className}` : "site-container";
  return <Tag className={classes}>{children}</Tag>;
}
