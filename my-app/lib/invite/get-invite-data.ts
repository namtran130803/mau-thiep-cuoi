import { demoInviteData } from "@/data/demo";
import { withPrisma } from "@/lib/db/prisma";
import type { InviteData } from "@/lib/invite/types";
import { getInviteTemplate } from "@/lib/templates/registry";

export async function getInviteDataFromDb(slug: string): Promise<InviteData | undefined> {
  return withPrisma(async (prisma) => {
    const invitation = await prisma.invitation.findUnique({ where: { slug } });
    if (!invitation || invitation.status !== "active") return undefined;
    return invitation.data as InviteData;
  }, undefined);
}

export function getDemoInviteData(slug: string): InviteData | undefined {
  if (!getInviteTemplate(slug)) return undefined;
  return demoInviteData;
}

export async function getInviteData(slug: string): Promise<InviteData | undefined> {
  const fromDb = await getInviteDataFromDb(slug);
  if (fromDb) return fromDb;
  return getDemoInviteData(slug);
}

export async function resolveInvitePage(slug: string) {
  const fromDb = await withPrisma(async (prisma) => {
    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      include: { order: true },
    });

    if (!invitation || invitation.status !== "active") {
      return null;
    }

    const template = getInviteTemplate(invitation.templateSlug);
    if (!template) return null;

    return {
      template,
      data: invitation.data as InviteData,
      slug: invitation.slug,
      guestNameService: invitation.order.guestNameService,
    };
  }, null);

  if (fromDb) return fromDb;

  const template = getInviteTemplate(slug);
  if (!template) return null;

  return {
    template,
    data: demoInviteData,
    slug,
    guestNameService: false,
  };
}
