"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import InviteWizard from "@/components/site/InviteWizard";
import SiteContainer from "@/components/site/SiteContainer";
import { restoreCheckoutSession } from "@/lib/actions/checkout";
import {
  loadCheckoutSession,
  saveCheckoutSession,
} from "@/lib/checkout/client-session";
import { listInviteTemplates } from "@/lib/templates/registry";
import { PACKAGES, type PackageType } from "@/lib/pricing";
import {
  PACKAGE_STORAGE_KEY,
  WIZARD_STORAGE_KEY,
  readLocalJson,
  writeLocalJson,
} from "@/lib/storage/local";

type PackageSession = {
  packageType: PackageType;
  guestNameService: boolean;
};

type WizardSeed = PackageSession & {
  templateSlug: string;
};

function resolvePackageFromQuery(value: string | null): PackageType | null {
  if (!value) return null;
  return PACKAGES.some((pkg) => pkg.id === value) ? (value as PackageType) : null;
}

function resolveTemplateFromQuery(
  value: string | null,
  templates: ReturnType<typeof listInviteTemplates>,
): string | null {
  if (!value) return null;
  return templates.some((template) => template.slug === value) ? value : null;
}

function mergeSeed(
  base: Partial<WizardSeed> | null,
  queryPackage: PackageType | null,
  queryTemplate: string | null,
  fallbackTemplate: string,
): WizardSeed {
  return {
    packageType: queryPackage ?? base?.packageType ?? "single",
    guestNameService: base?.guestNameService ?? false,
    templateSlug: queryTemplate ?? base?.templateSlug ?? fallbackTemplate,
  };
}

export default function TaoThiepContent() {
  const searchParams = useSearchParams();
  const templates = useMemo(() => listInviteTemplates(), []);
  const fallbackTemplate = templates[0]?.slug ?? "thiep-cuoi-1";

  const packageFromQuery = resolvePackageFromQuery(searchParams.get("package"));
  const templateFromQuery = resolveTemplateFromQuery(
    searchParams.get("template"),
    templates,
  );

  const queryOverrides = useMemo(
    () => ({
      ...(packageFromQuery ? { packageType: packageFromQuery } : {}),
      ...(templateFromQuery ? { templateSlug: templateFromQuery } : {}),
    }),
    [packageFromQuery, templateFromQuery],
  );

  const [initialDraft, setInitialDraft] = useState<WizardSeed | null>(null);

  useEffect(() => {
    async function init() {
      const checkout = loadCheckoutSession();
      if (checkout) {
        setInitialDraft(
          mergeSeed(null, packageFromQuery, templateFromQuery, fallbackTemplate),
        );
        return;
      }

      const restored = await restoreCheckoutSession();
      if (restored) {
        if (restored.hasDemo && restored.invitations.length > 0) {
          saveCheckoutSession({
            orderId: restored.orderId,
            invitations: restored.invitations.map((invitation) => ({
              invitationId: invitation.invitationId,
              demoUrl: invitation.demoUrl,
              label: invitation.label,
            })),
          });
        }
        writeLocalJson(PACKAGE_STORAGE_KEY, {
          packageType: restored.packageType,
          guestNameService: restored.guestNameService,
        });
        setInitialDraft(
          mergeSeed(
            {
              packageType: restored.packageType,
              guestNameService: restored.guestNameService,
              templateSlug: restored.templateSlug ?? fallbackTemplate,
            },
            packageFromQuery,
            templateFromQuery,
            fallbackTemplate,
          ),
        );
        return;
      }

      const packageSession = readLocalJson<PackageSession>(PACKAGE_STORAGE_KEY);
      const wizardDraft = readLocalJson<WizardSeed>(WIZARD_STORAGE_KEY);

      setInitialDraft(
        mergeSeed(
          wizardDraft ?? packageSession,
          packageFromQuery,
          templateFromQuery,
          fallbackTemplate,
        ),
      );
    }

    void init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!initialDraft) {
    return (
      <div className="page-body page-body--fill create-invite-page">
        <SiteContainer>
          <div className="loading-state">Đang tải...</div>
        </SiteContainer>
      </div>
    );
  }

  return (
    <div className="page-body page-body--fill create-invite-page">
      <SiteContainer>
        <InviteWizard
          initialDraft={initialDraft}
          queryOverrides={Object.keys(queryOverrides).length > 0 ? queryOverrides : undefined}
        />
      </SiteContainer>
    </div>
  );
}
