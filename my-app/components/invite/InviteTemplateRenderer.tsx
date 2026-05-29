"use client";

import type { InviteTemplateProps } from "@/lib/invite/types";
import type { ComponentType } from "react";

type InviteTemplateRendererProps = InviteTemplateProps & {
  Component: ComponentType<InviteTemplateProps>;
};

export default function InviteTemplateRenderer({
  Component,
  data,
  derived,
  slug,
}: InviteTemplateRendererProps) {
  return <Component data={data} derived={derived} slug={slug} />;
}
