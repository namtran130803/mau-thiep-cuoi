import { notFound } from "next/navigation";
import { Suspense } from "react";
import DemoBanner from "@/components/site/DemoBanner";
import InviteTemplateRenderer from "@/components/invite/InviteTemplateRenderer";
import { getInvitationById, getInvitationBySlug } from "@/lib/actions/invitation";
import { getCheckoutOrderId } from "@/lib/checkout/session";
import { deriveInviteData } from "@/lib/invite/derive";
import { getInviteTemplate } from "@/lib/templates/registry";
import type { InviteData } from "@/lib/invite/types";

type DemoPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DemoPage({ params }: DemoPageProps) {
  const { id } = await params;
  const invitation = await getInvitationBySlug(id) ?? await getInvitationById(id);

  if (!invitation) {
    notFound();
  }

  if (!invitation.order) {
    notFound();
  }

  const template = getInviteTemplate(invitation.templateSlug);
  if (!template) {
    notFound();
  }

  const data = invitation.data as InviteData;
  const derived = deriveInviteData(data, invitation.slug);
  const { Component } = template;
  const checkoutOrderId = await getCheckoutOrderId();
  const payUrl = checkoutOrderId === invitation.orderId
    ? `/thanh-toan/${checkoutOrderId}`
    : null;

  return (
    <>
      <DemoBanner payUrl={payUrl} />
      <Suspense fallback={null}>
        <InviteTemplateRenderer
          Component={Component}
          data={data}
          derived={derived}
          slug={invitation.slug}
          showGuestInvite={invitation.order.guestNameService}
        />
      </Suspense>
    </>
  );
}
