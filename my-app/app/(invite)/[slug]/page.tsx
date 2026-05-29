import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import InviteTemplateRenderer from "@/components/invite/InviteTemplateRenderer";
import { deriveInviteData } from "@/lib/invite/derive";
import { getInviteData } from "@/lib/invite/get-invite-data";
import {
  getInviteTemplate,
  getInviteTemplateSlugs,
} from "@/lib/templates/registry";

type InvitePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getInviteTemplateSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: InvitePageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getInviteData(slug);
  if (!data) return {};

  const derived = deriveInviteData(data, slug);
  return {
    title: derived.metadataTitle,
    description: derived.metadataDescription,
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { slug } = await params;
  const template = getInviteTemplate(slug);
  const data = getInviteData(slug);

  if (!template || !data) {
    notFound();
  }

  const derived = deriveInviteData(data, slug);
  const { Component } = template;

  return (
    <Suspense fallback={null}>
      <InviteTemplateRenderer
        Component={Component}
        data={data}
        derived={derived}
        slug={slug}
      />
    </Suspense>
  );
}
