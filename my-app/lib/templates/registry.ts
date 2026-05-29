import ThiepCuoi1Template from "@/templates/thiep-cuoi-1/Template";
import ThiepCuoi2Template from "@/templates/thiep-cuoi-2/Template";
import ThiepCuoi3Template from "@/templates/thiep-cuoi-3/Template";
import ThiepCuoi4Template from "@/templates/thiep-cuoi-4/Template";
import { thiepCuoi1Config } from "@/templates/thiep-cuoi-1/config";
import { thiepCuoi2Config } from "@/templates/thiep-cuoi-2/config";
import { thiepCuoi3Config } from "@/templates/thiep-cuoi-3/config";
import { thiepCuoi4Config } from "@/templates/thiep-cuoi-4/config";
import type { InviteTemplateEntry } from "@/lib/templates/types";

export const inviteTemplates = {
  [thiepCuoi1Config.slug]: {
    ...thiepCuoi1Config,
    Component: ThiepCuoi1Template,
  },
  [thiepCuoi2Config.slug]: {
    ...thiepCuoi2Config,
    Component: ThiepCuoi2Template,
  },
  [thiepCuoi3Config.slug]: {
    ...thiepCuoi3Config,
    Component: ThiepCuoi3Template,
  },
  [thiepCuoi4Config.slug]: {
    ...thiepCuoi4Config,
    Component: ThiepCuoi4Template,
  },
} satisfies Record<string, InviteTemplateEntry>;

export type InviteTemplateSlug = keyof typeof inviteTemplates;

export function getInviteTemplate(slug: string): InviteTemplateEntry | undefined {
  return inviteTemplates[slug as InviteTemplateSlug];
}

export function listInviteTemplates(): InviteTemplateEntry[] {
  return Object.values(inviteTemplates);
}

export function getInviteTemplateSlugs(): InviteTemplateSlug[] {
  return Object.keys(inviteTemplates) as InviteTemplateSlug[];
}
