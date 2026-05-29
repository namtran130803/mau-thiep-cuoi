import type { Metadata } from "next";
import type { ComponentType } from "react";
import type { InviteTemplateProps } from "@/lib/invite/types";

export type InviteTemplateConfig = {
  slug: string;
  title: string;
  description: string;
  label: string;
  couple?: string;
  metadata: Metadata;
};

export type InviteTemplateEntry = InviteTemplateConfig & {
  Component: ComponentType<InviteTemplateProps>;
};
