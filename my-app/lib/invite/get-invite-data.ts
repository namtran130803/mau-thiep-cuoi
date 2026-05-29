import { demoInviteData } from "@/data/demo";
import type { InviteData } from "@/lib/invite/types";
import { getInviteTemplate } from "@/lib/templates/registry";

export function getInviteData(slug: string): InviteData | undefined {
  if (!getInviteTemplate(slug)) return undefined;
  return demoInviteData;
}
