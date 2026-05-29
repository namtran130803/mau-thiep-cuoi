import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import InviteTemplateRenderer from "@/components/invite/InviteTemplateRenderer";
import { deriveInviteData } from "@/lib/invite/derive";
import { resolveInvitePage } from "@/lib/invite/get-invite-data";
import { getInviteTemplateSlugs } from "@/lib/templates/registry";

type InvitePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getInviteTemplateSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: InvitePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveInvitePage(slug);
  if (!resolved) return {};

  const derived = deriveInviteData(resolved.data, slug);
  return {
    title: derived.metadataTitle,
    description: derived.metadataDescription,
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { slug } = await params;
  const resolved = await resolveInvitePage(slug);

  if (!resolved) {
    notFound();
  }

  const derived = deriveInviteData(resolved.data, slug);
  const { Component } = resolved.template;

  return (
    <Suspense fallback={null}>
      <InviteTemplateRenderer
        Component={Component}
        data={resolved.data}
        derived={derived}
        slug={slug}
        showGuestInvite={resolved.guestNameService}
      />
    </Suspense>
  );
}
