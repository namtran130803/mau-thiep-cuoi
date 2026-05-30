"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Copy,
  CreditCard,
  Eye,
  ExternalLink,
  Pencil,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import BankAccountFields from "@/components/site/BankAccountFields";
import ImageUploadField from "@/components/site/ImageUploadField";
import { restoreCheckoutSession } from "@/lib/actions/checkout";
import { getInvitationById, saveInvitation } from "@/lib/actions/invitation";
import { createOrder, updateOrderDraft } from "@/lib/actions/order";
import {
  getCheckoutSessionInvitations,
  loadCheckoutSession,
  saveCheckoutSession,
} from "@/lib/checkout/client-session";
import { createEmptyInviteFormData } from "@/lib/form/default-invite-data";
import {
  PACKAGE_STORAGE_KEY,
  WIZARD_STORAGE_KEY,
  readLocalJson,
  writeLocalJson,
} from "@/lib/storage/local";
import {
  GUEST_NAME_SERVICE_PRICE,
  PACKAGES,
  formatVnd,
  type PackageType,
} from "@/lib/pricing";
import { listInviteTemplates } from "@/lib/templates/registry";
import type { InviteFormData } from "@/lib/validation/invite";

const STEPS = ["Gói & mẫu", "Tiệc cưới", "Gia đình", "Ảnh thiệp", "Tài khoản"];
const SLOT_LABELS = ["Thiệp 1", "Thiệp 2"] as const;

type InviteSlot = {
  label: string;
  templateSlug: string;
  formData: InviteFormData;
  invitationId?: string;
  demoUrl?: string;
};

type LegacyWizardDraft = {
  packageType: PackageType;
  guestNameService: boolean;
  templateSlug: string;
  formData: InviteFormData;
};

type WizardDraft = {
  packageType: PackageType;
  guestNameService: boolean;
  activeSlotIndex: number;
  orderEmail: string;
  slots: InviteSlot[];
  sepayRef?: string;
};

type InviteWizardProps = {
  initialDraft?: Partial<WizardDraft & LegacyWizardDraft>;
  queryOverrides?: Partial<Pick<WizardDraft, "packageType">> & {
    templateSlug?: string;
  };
};

function isDualPackage(packageType: PackageType): boolean {
  return packageType !== "single";
}

function getSlotCount(packageType: PackageType): number {
  return isDualPackage(packageType) ? 2 : 1;
}

function cloneFormData(data: InviteFormData): InviteFormData {
  return structuredClone(data);
}

function createSlot(
  index: number,
  templateSlug: string,
  formData: InviteFormData = createEmptyInviteFormData(),
): InviteSlot {
  return {
    label: SLOT_LABELS[index] ?? `Thiệp ${index + 1}`,
    templateSlug,
    formData,
  };
}

function normalizeSlotsForPackage(
  packageType: PackageType,
  slots: InviteSlot[],
  fallbackTemplate: string,
): InviteSlot[] {
  const count = getSlotCount(packageType);
  const first =
    slots[0] ??
    createSlot(0, fallbackTemplate, createEmptyInviteFormData());
  const normalized: InviteSlot[] = [
    {
      ...first,
      label: SLOT_LABELS[0],
      templateSlug: first.templateSlug || fallbackTemplate,
      formData: cloneFormData(first.formData),
    },
  ];

  if (count === 2) {
    const source = slots[1] ?? first;
    normalized.push({
      ...source,
      label: SLOT_LABELS[1],
      templateSlug:
        packageType === "dual_same"
          ? normalized[0].templateSlug
          : source.templateSlug || normalized[0].templateSlug,
      formData: cloneFormData(source.formData),
      invitationId: slots[1]?.invitationId,
      demoUrl: slots[1]?.demoUrl,
    });
  }

  return normalized;
}

function createInitialSlots(
  initialDraft: InviteWizardProps["initialDraft"],
  fallbackTemplate: string,
): InviteSlot[] {
  if (initialDraft?.slots?.length) {
    return initialDraft.slots;
  }

  return [
    createSlot(
      0,
      initialDraft?.templateSlug ?? fallbackTemplate,
      initialDraft?.formData ?? createEmptyInviteFormData(),
    ),
  ];
}

function resolveTemplateForSlot(
  packageType: PackageType,
  slots: InviteSlot[],
  slotIndex: number,
): string {
  return packageType === "dual_same"
    ? slots[0]?.templateSlug
    : slots[slotIndex]?.templateSlug;
}

function buildCheckoutInvitations(slots: InviteSlot[]) {
  return slots
    .filter((slot) => slot.invitationId && slot.demoUrl)
    .map((slot) => ({
      invitationId: slot.invitationId as string,
      demoUrl: slot.demoUrl as string,
      label: slot.label,
    }));
}

function getFirstMissingSlotIndex(slots: InviteSlot[]): number {
  return slots.findIndex((slot) => !slot.demoUrl);
}

function getCompletedCount(slots: InviteSlot[]): number {
  return slots.filter((slot) => Boolean(slot.demoUrl)).length;
}

function validateSlotStep(
  slot: InviteSlot,
  step: number,
  orderEmail: string,
): string | null {
  const formData = slot.formData;

  switch (step) {
    case 0:
      if (!slot.templateSlug) return "Vui lòng chọn mẫu thiệp";
      return null;
    case 1:
      if (!formData.groomName.trim()) return "Vui lòng nhập tên chú rể";
      if (!formData.brideName.trim()) return "Vui lòng nhập tên cô dâu";
      if (!formData.weddingAt) return "Vui lòng chọn thời gian";
      if (!formData.venue.name.trim()) return "Vui lòng nhập địa điểm";
      if (!formData.venue.address.trim())
        return "Vui lòng nhập địa chỉ tiệc cưới";
      return null;
    case 2:
      if (!formData.groomFamily.fatherName.trim())
        return "Vui lòng nhập tên bố nhà trai";
      if (!formData.groomFamily.motherName.trim())
        return "Vui lòng nhập tên mẹ nhà trai";
      if (!formData.groomFamily.address.trim())
        return "Vui lòng nhập địa chỉ nhà trai";
      if (!formData.brideFamily.fatherName.trim())
        return "Vui lòng nhập tên bố nhà gái";
      if (!formData.brideFamily.motherName.trim())
        return "Vui lòng nhập tên mẹ nhà gái";
      if (!formData.brideFamily.address.trim())
        return "Vui lòng nhập địa chỉ nhà gái";
      return null;
    case 3:
      if (!formData.images.hero) return "Vui lòng tải lên ảnh bìa";
      if (!formData.images.thankYou) return "Vui lòng tải lên ảnh kết thiệp";
      return null;
    case 4:
      if (!formData.bankAccount.accountNumber.trim())
        return "Vui lòng nhập số tài khoản";
      if (!formData.bankAccount.accountName.trim())
        return "Vui lòng nhập tên chủ tài khoản";
      if (!formData.bankAccount.bankBin.trim())
        return "Vui lòng chọn ngân hàng";
      if (!orderEmail.trim()) return "Vui lòng nhập email nhận link chính thức";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderEmail))
        return "Email không hợp lệ";
      return null;
    default:
      return null;
  }
}

function validateTemplateStep(
  packageType: PackageType,
  slots: InviteSlot[],
): string | null {
  if (!slots[0]?.templateSlug) return "Vui lòng chọn mẫu thiệp";
  if (packageType === "dual_diff" && !slots[1]?.templateSlug) {
    return "Vui lòng chọn mẫu cho thiệp 2";
  }
  return null;
}

function getSlotStatus(slot: InviteSlot, isActive: boolean): string {
  if (slot.demoUrl) return "Đã tạo xem trước";
  return isActive ? "Đang sửa" : "Còn thiếu";
}

function getSlotStatusClass(slot: InviteSlot, isActive: boolean): string {
  if (slot.demoUrl) return " is-done";
  return isActive ? " is-editing" : "";
}

function getLegacyDraftSlots(
  draft: WizardDraft | LegacyWizardDraft | null,
): InviteSlot[] | null {
  if (!draft) return null;
  if ("slots" in draft && Array.isArray(draft.slots)) return draft.slots;
  if ("templateSlug" in draft && "formData" in draft) {
    return [createSlot(0, draft.templateSlug, draft.formData)];
  }
  return null;
}

export default function InviteWizard({
  initialDraft,
  queryOverrides,
}: InviteWizardProps) {
  const templates = useMemo(() => listInviteTemplates(), []);
  const fallbackTemplate = templates[0]?.slug ?? "thiep-cuoi-1";
  const initialPackageType = initialDraft?.packageType ?? "single";
  const initialSlots = normalizeSlotsForPackage(
    initialPackageType,
    createInitialSlots(initialDraft, fallbackTemplate),
    fallbackTemplate,
  );

  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [activeSlotIndex, setActiveSlotIndex] = useState(
    initialDraft?.activeSlotIndex ?? 0,
  );
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [sepayRef, setSepayRef] = useState("");
  const [copied, setCopied] = useState("");
  const [toast, setToast] = useState("");

  const [packageType, setPackageType] = useState<PackageType>(
    initialPackageType,
  );
  const [guestNameService, setGuestNameService] = useState(
    initialDraft?.guestNameService ?? false,
  );
  const [slots, setSlots] = useState<InviteSlot[]>(initialSlots);
  const [orderEmail, setOrderEmail] = useState(
    initialDraft?.orderEmail ??
      initialSlots[0]?.formData.wishNotificationEmail ??
      "",
  );

  const activeSlot = slots[activeSlotIndex] ?? slots[0];
  const activeSlotNumber = activeSlotIndex + 1;
  const isDual = isDualPackage(packageType);
  const completedCount = getCompletedCount(slots);
  const canPay = completedCount >= getSlotCount(packageType);
  const progressPct = ((step + 1) / STEPS.length) * 100;

  useEffect(() => {
    async function hydrate() {
      const draft = readLocalJson<WizardDraft | LegacyWizardDraft>(
        WIZARD_STORAGE_KEY,
      );
      let nextPackageType = draft?.packageType ?? packageType;
      let nextGuestNameService = draft?.guestNameService ?? guestNameService;
      let nextSlots =
        getLegacyDraftSlots(draft) ??
        normalizeSlotsForPackage(packageType, slots, fallbackTemplate);
      const nextActiveSlotIndex =
        "activeSlotIndex" in (draft ?? {})
          ? (draft as WizardDraft).activeSlotIndex
          : activeSlotIndex;
      let nextOrderEmail =
        ("orderEmail" in (draft ?? {}) ? (draft as WizardDraft).orderEmail : "") ||
        nextSlots[0]?.formData.wishNotificationEmail ||
        orderEmail;
      let nextOrderId = orderId;
      let nextSepayRef = draft && "sepayRef" in draft ? draft.sepayRef ?? "" : "";

      const checkout = loadCheckoutSession();
      const restored = await restoreCheckoutSession();

      if (restored) {
        nextOrderId = restored.orderId;
        nextPackageType = restored.packageType;
        nextGuestNameService = restored.guestNameService;
        nextOrderEmail = restored.email;

        if (restored.invitations.length > 0) {
          nextSlots = restored.invitations.map((invitation, index) => ({
            label: invitation.label || SLOT_LABELS[index] || `Thiệp ${index + 1}`,
            templateSlug: invitation.templateSlug,
            formData: invitation.formData as InviteFormData,
            invitationId: invitation.invitationId,
            demoUrl: invitation.demoUrl,
          }));
          saveCheckoutSession({
            orderId: restored.orderId,
            invitations: buildCheckoutInvitations(nextSlots),
          });
        }
      } else if (checkout) {
        const checkoutInvitations = getCheckoutSessionInvitations(checkout);
        const invitationRecords = await Promise.all(
          checkoutInvitations.map((invitation) =>
            getInvitationById(invitation.invitationId),
          ),
        );
        const records = invitationRecords.filter(Boolean);

        if (records.length > 0) {
          nextOrderId = checkout.orderId;
          const firstOrder = records[0]?.order;
          if (firstOrder) {
            nextPackageType = firstOrder.packageType as PackageType;
            nextGuestNameService = firstOrder.guestNameService;
            nextOrderEmail = firstOrder.email;
          }
          nextSlots = records.map((record, index) => ({
            label: record?.label || SLOT_LABELS[index] || `Thiệp ${index + 1}`,
            templateSlug: record?.templateSlug || fallbackTemplate,
            formData: record?.data as InviteFormData,
            invitationId: record?.id,
            demoUrl: record ? `/demo/${record.slug}` : undefined,
          }));
        }
      }

      if (queryOverrides?.packageType) {
        nextPackageType = queryOverrides.packageType;
      }
      if (queryOverrides?.templateSlug) {
        nextSlots = nextSlots.map((slot, index) => ({
          ...slot,
          templateSlug:
            nextPackageType === "dual_diff" && index > 0
              ? slot.templateSlug || queryOverrides.templateSlug || fallbackTemplate
              : queryOverrides.templateSlug || fallbackTemplate,
        }));
      }

      const normalizedSlots = normalizeSlotsForPackage(
        nextPackageType,
        nextSlots,
        fallbackTemplate,
      );

      setOrderId(nextOrderId);
      setSepayRef(nextSepayRef);
      setPackageType(nextPackageType);
      setGuestNameService(nextGuestNameService);
      setSlots(normalizedSlots);
      setActiveSlotIndex(
        Math.min(nextActiveSlotIndex, normalizedSlots.length - 1),
      );
      setOrderEmail(nextOrderEmail);
      setHydrated(true);
    }

    void hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeLocalJson(WIZARD_STORAGE_KEY, {
      packageType,
      guestNameService,
      activeSlotIndex,
      orderEmail,
      slots,
      sepayRef: sepayRef || undefined,
    } satisfies WizardDraft);
  }, [activeSlotIndex, guestNameService, hydrated, orderEmail, packageType, sepayRef, slots]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function showToast(message: string) {
    setToast(message);
  }

  function updateSlot(slotIndex: number, update: (slot: InviteSlot) => InviteSlot) {
    setSlots((current) => {
      const next = current.map((slot, index) =>
        index === slotIndex ? update(slot) : slot,
      );
      return packageType === "dual_same"
        ? next.map((slot) => ({ ...slot, templateSlug: next[0].templateSlug }))
        : next;
    });
  }

  function updateActiveFormField<K extends keyof InviteFormData>(
    key: K,
    value: InviteFormData[K],
  ) {
    updateSlot(activeSlotIndex, (slot) => ({
      ...slot,
      formData: { ...slot.formData, [key]: value },
    }));
  }

  function handlePackageChange(nextPackageType: PackageType) {
    setPackageType(nextPackageType);
    setSlots((current) =>
      normalizeSlotsForPackage(nextPackageType, current, fallbackTemplate),
    );
    setActiveSlotIndex((current) =>
      Math.min(current, getSlotCount(nextPackageType) - 1),
    );
    writeLocalJson(PACKAGE_STORAGE_KEY, {
      packageType: nextPackageType,
      guestNameService,
    });
  }

  function handleTemplateChange(value: string, slotIndex = activeSlotIndex) {
    if (packageType !== "dual_diff") {
      setSlots((current) =>
        current.map((slot) => ({ ...slot, templateSlug: value })),
      );
      return;
    }

    updateSlot(slotIndex, (slot) => ({ ...slot, templateSlug: value }));
  }

  function goNext() {
    const err =
      step === 0
        ? validateTemplateStep(packageType, slots)
        : validateSlotStep(activeSlot, step, orderEmail);
    if (err) {
      showToast(err);
      return;
    }
    if (step === 0) setActiveSlotIndex(0);
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editSlot(slotIndex: number) {
    setActiveSlotIndex(slotIndex);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToPayment() {
    if (!canPay) {
      showToast("Vui lòng tạo bản xem trước cho cả 2 thiệp trước khi thanh toán.");
    }
  }

  async function copyLink(demoUrl: string, key: string) {
    await navigator.clipboard.writeText(`${window.location.origin}${demoUrl}`);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 2000);
  }

  async function handleSubmit() {
    const err = validateSlotStep(activeSlot, step, orderEmail);
    if (err) {
      showToast(err);
      return;
    }

    setSubmitting(true);
    const isUpdate = Boolean(activeSlot.invitationId);

    try {
      let currentOrderId = orderId;
      if (!currentOrderId) {
        const order = await createOrder({
          email: orderEmail,
          packageType,
          guestNameService,
        });
        currentOrderId = order.orderId;
        setOrderId(currentOrderId);
        setSepayRef(order.sepayRef);
      } else {
        await updateOrderDraft(currentOrderId, {
          email: orderEmail,
          packageType,
          guestNameService,
        });
      }

      const formDataForSave = {
        ...activeSlot.formData,
        wishNotificationEmail:
          activeSlot.formData.wishNotificationEmail || orderEmail,
      };
      const result = await saveInvitation({
        orderId: currentOrderId,
        label: activeSlot.label,
        templateSlug: resolveTemplateForSlot(
          packageType,
          slots,
          activeSlotIndex,
        ),
        invitationId: activeSlot.invitationId,
        data: formDataForSave,
      });

      const nextSlots = slots.map((slot, index) =>
        index === activeSlotIndex
          ? {
              ...slot,
              formData: formDataForSave,
              invitationId: result.invitationId,
              demoUrl: result.demoUrl,
            }
          : slot,
      );
      setSlots(nextSlots);
      writeLocalJson(PACKAGE_STORAGE_KEY, {
        packageType,
        guestNameService,
      });
      saveCheckoutSession({
        orderId: currentOrderId,
        invitations: buildCheckoutInvitations(nextSlots),
      });

      const missingSlotIndex = getFirstMissingSlotIndex(nextSlots);
      if (isDual && missingSlotIndex >= 0) {
        setActiveSlotIndex(missingSlotIndex);
        setStep(1);
        showToast(`Đã tạo xem trước ${activeSlot.label}. Tiếp tục chỉnh ${nextSlots[missingSlotIndex].label}.`);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      showToast(isUpdate ? "Đã cập nhật bản xem trước" : "Đã tạo bản xem trước");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Lưu thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  if (!activeSlot) return null;

  return (
    <div className="wizard">
      {slots.some((slot) => slot.demoUrl) && (
        <div className="wdemo-card">
          <div className="wdemo-card__head">
            <span className="wdemo-card__badge">
              <Sparkles size={12} />
              Bản xem trước
            </span>
            <p className="wdemo-card__title">
              {isDual ? `${completedCount}/2 thiệp đã sẵn sàng` : "Thiệp của bạn đã sẵn sàng"}
            </p>
            <p className="wdemo-card__desc">
              Xem lại, chỉnh sửa thêm hoặc thanh toán để nhận liên kết chính thức.
            </p>
          </div>

          {isDual ? (
            <div className="wdemo-list">
              {slots.map((slot, index) => (
                <div key={slot.label} className="wdemo-item">
                  <div className="wdemo-item__meta">
                    <span className="wdemo-item__name">{slot.label}</span>
                    <span className={`wdemo-item__status${slot.demoUrl ? " is-done" : ""}`}>
                      {slot.demoUrl ? "Đã tạo" : "Còn thiếu"}
                    </span>
                  </div>
                  <div className="wdemo-item__actions">
                    {slot.demoUrl ? (
                      <>
                        <a
                          href={slot.demoUrl}
                          className="site-btn site-btn--primary site-btn--sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye size={13} />
                          Xem
                        </a>
                        <button
                          type="button"
                          className="site-btn site-btn--ghost site-btn--sm"
                          onClick={() => copyLink(slot.demoUrl as string, slot.label)}
                        >
                          {copied === slot.label ? <Check size={13} /> : <Copy size={13} />}
                          {copied === slot.label ? "Đã sao chép" : "Sao chép"}
                        </button>
                      </>
                    ) : null}
                    <button
                      type="button"
                      className="site-btn site-btn--ghost site-btn--sm"
                      onClick={() => editSlot(index)}
                    >
                      <Pencil size={13} />
                      Sửa
                    </button>
                  </div>
                </div>
              ))}
              {canPay && sepayRef ? (
                <Link
                  href={`/thanh-toan/${sepayRef}`}
                  className="site-btn site-btn--green site-btn--full"
                >
                  <CreditCard size={14} />
                  Thanh toán
                </Link>
              ) : (
                <button
                  type="button"
                  className="site-btn site-btn--green site-btn--full"
                  onClick={goToPayment}
                >
                  <CreditCard size={14} />
                  Thanh toán
                </button>
              )}
            </div>
          ) : (
            <div className="wdemo-card__actions">
              <a
                href={slots[0].demoUrl}
                className="site-btn site-btn--primary site-btn--full"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Eye size={15} />
                Mở xem trước
              </a>
              <div className="wdemo-card__secondary">
                <button
                  type="button"
                  className="site-btn site-btn--ghost site-btn--full"
                  onClick={() => copyLink(slots[0].demoUrl as string, slots[0].label)}
                >
                  {copied === slots[0].label ? <Check size={14} /> : <Copy size={14} />}
                  {copied === slots[0].label ? "Đã sao chép" : "Sao chép liên kết"}
                </button>
                <Link
                  href={`/thanh-toan/${sepayRef}`}
                  className="site-btn site-btn--green site-btn--full"
                >
                  <CreditCard size={14} />
                  Thanh toán
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {isDual && step > 0 && (
        <div className="wslot-tabs">
          {slots.map((slot, index) => {
            const isActive = activeSlotIndex === index;
            return (
              <button
                key={slot.label}
                type="button"
                className={`wslot-tab${isActive ? " is-active" : ""}`}
                onClick={() => setActiveSlotIndex(index)}
              >
                <span className="wslot-tab__name">Thiệp {index + 1}</span>
                <span className={`wslot-tab__status${getSlotStatusClass(slot, isActive)}`}>
                  {getSlotStatus(slot, isActive)}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            className="site-btn site-btn--ghost site-btn--sm"
            style={{ gridColumn: "1 / -1", width: "100%", backgroundColor: "#fff" }}
            onClick={() => {
              setSlots((current) => {
                const next = [...current];
                if (next[1]) {
                  next[1] = { ...next[1], formData: cloneFormData(next[0].formData) };
                }
                return next;
              });
              showToast("Đã đồng bộ nội dung thiệp 1 sang thiệp 2");
            }}
          >
            <Copy size={12} strokeWidth={2.5} />
            Đồng bộ từ thiệp 1
          </button>
        </div>
      )}

      <div className="wstep-title">
        <h2 className="wstep-title__text">
          {STEPS[step]}
          {isDual && step > 0 ? ` - Thiệp ${activeSlotNumber}` : ""}
        </h2>
        <span className="wstep-title__counter">
          {step + 1} / {STEPS.length}
        </span>
      </div>

      <div className="wizard-panel">
        {step === 0 && (
          <div className="form-stack">
            <div className="wcard">
              <p className="wcard__title">Gói dịch vụ</p>
              <div className="wpkg-list">
                {PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    className={`wpkg-item${packageType === pkg.id ? " is-active" : ""}`}
                    onClick={() => handlePackageChange(pkg.id)}
                  >
                    <span className="wpkg-item__radio">
                      <span className="wpkg-item__dot" />
                    </span>
                    <span className="wpkg-item__name">{pkg.name}</span>
                    <span className="wpkg-item__price">
                      {formatVnd(pkg.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="wcard">
              <p className="wcard__title">Mẫu thiệp</p>
              {packageType === "dual_diff" ? (
                <div className="form-stack">
                  {slots.map((slot, index) => (
                    <label key={slot.label} className="field">
                      <span className="field__label">Mẫu thiệp {index + 1}</span>
                      <select
                        value={slot.templateSlug}
                        onChange={(e) => handleTemplateChange(e.target.value, index)}
                      >
                        {templates.map((template, templateIndex) => (
                          <option key={template.slug} value={template.slug}>
                            Mẫu {templateIndex + 1}
                          </option>
                        ))}
                      </select>
                      <a
                        href={`/${slot.templateSlug}`}
                        className="wcard__preview-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={12} />
                        Xem thử mẫu thiệp {index + 1}
                      </a>
                    </label>
                  ))}
                </div>
              ) : (
                <label className="field">
                  <span className="field__label">
                    {packageType === "dual_same" ? "Mẫu dùng chung cho 2 thiệp" : "Chọn mẫu"}
                  </span>
                  <select
                    value={resolveTemplateForSlot(packageType, slots, 0)}
                    onChange={(e) => handleTemplateChange(e.target.value, 0)}
                  >
                    {templates.map((template, index) => (
                      <option key={template.slug} value={template.slug}>
                        Mẫu {index + 1}
                      </option>
                    ))}
                  </select>
                  <a
                    href={`/${resolveTemplateForSlot(packageType, slots, 0)}`}
                    className="wcard__preview-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={12} />
                    Xem thử mẫu này
                  </a>
                </label>
              )}
            </div>

            <div className="wcard">
              <p className="wcard__title">Tên riêng</p>
              <div className="wguest-list">
                <button
                  type="button"
                  className={`wguest-item${!guestNameService ? " is-active" : ""}`}
                  onClick={() => setGuestNameService(false)}
                >
                  <span className="wguest-item__radio">
                    <span className="wguest-item__dot" />
                  </span>
                  <Users size={18} className="wguest-item__icon" strokeWidth={1.6} />
                  <span className="wguest-item__name">Thiệp chung</span>
                  <span className="wguest-item__price">Miễn phí</span>
                </button>
                <button
                  type="button"
                  className={`wguest-item${guestNameService ? " is-active" : ""}`}
                  onClick={() => setGuestNameService(true)}
                >
                  <span className="wguest-item__radio">
                    <span className="wguest-item__dot" />
                  </span>
                  <UserRound size={18} className="wguest-item__icon" strokeWidth={1.6} />
                  <span className="wguest-item__name">Tên riêng</span>
                  <span className="wguest-item__price">
                    +{formatVnd(GUEST_NAME_SERVICE_PRICE)}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="form-stack">
            <div className="wcard">
              <p className="wcard__title">Cô dâu & Chú rể</p>
              <div className="form-row">
                <label className="field">
                  <span className="field__label">Chú rể</span>
                  <input
                    value={activeSlot.formData.groomName}
                    onChange={(e) => updateActiveFormField("groomName", e.target.value)}
                    placeholder="Trọng Nam"
                  />
                </label>
                <label className="field">
                  <span className="field__label">Cô dâu</span>
                  <input
                    value={activeSlot.formData.brideName}
                    onChange={(e) => updateActiveFormField("brideName", e.target.value)}
                    placeholder="Bích Ngọc"
                  />
                </label>
              </div>
            </div>

            <div className="wcard">
              <p className="wcard__title">Thời gian & Địa điểm</p>
              <div className="form-stack">
                <label className="field">
                  <span className="field__label">Ngày giờ tổ chức</span>
                  <input
                    type="datetime-local"
                    value={activeSlot.formData.weddingAt}
                    onChange={(e) => updateActiveFormField("weddingAt", e.target.value)}
                  />
                </label>
                <label className="field">
                  <span className="field__label">Tên địa điểm</span>
                  <input
                    value={activeSlot.formData.venue.name}
                    onChange={(e) =>
                      updateActiveFormField("venue", {
                        ...activeSlot.formData.venue,
                        name: e.target.value,
                      })
                    }
                    placeholder="Nhà hàng Tiệc Cưới ABC"
                  />
                </label>
                <label className="field">
                  <span className="field__label">Địa chỉ tiệc cưới</span>
                  <textarea
                    rows={2}
                    value={activeSlot.formData.venue.address}
                    onChange={(e) =>
                      updateActiveFormField("venue", {
                        ...activeSlot.formData.venue,
                        address: e.target.value,
                      })
                    }
                    placeholder="Số nhà, đường, quận, thành phố"
                  />
                </label>
                <label className="field">
                  <span className="field__label">
                    Liên kết Google Maps{" "}
                    <span style={{ fontWeight: 400, color: "var(--muted)" }}>
                      (tuỳ chọn)
                    </span>
                  </span>
                  <input
                    value={activeSlot.formData.venue.mapUrl ?? ""}
                    onChange={(e) =>
                      updateActiveFormField("venue", {
                        ...activeSlot.formData.venue,
                        mapUrl: e.target.value,
                      })
                    }
                    placeholder="https://maps.google.com/..."
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-stack">
            <div className="wcard">
              <p className="wcard__title">Nhà trai</p>
              <div className="form-row">
                <label className="field">
                  <span className="field__label">Tên bố</span>
                  <input
                    value={activeSlot.formData.groomFamily.fatherName}
                    onChange={(e) =>
                      updateActiveFormField("groomFamily", {
                        ...activeSlot.formData.groomFamily,
                        fatherName: e.target.value,
                      })
                    }
                  />
                </label>
                <label className="field">
                  <span className="field__label">Tên mẹ</span>
                  <input
                    value={activeSlot.formData.groomFamily.motherName}
                    onChange={(e) =>
                      updateActiveFormField("groomFamily", {
                        ...activeSlot.formData.groomFamily,
                        motherName: e.target.value,
                      })
                    }
                  />
                </label>
              </div>
              <label className="field">
                <span className="field__label">Địa chỉ</span>
                <textarea
                  rows={2}
                  value={activeSlot.formData.groomFamily.address}
                  onChange={(e) =>
                    updateActiveFormField("groomFamily", {
                      ...activeSlot.formData.groomFamily,
                      address: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div className="wcard">
              <p className="wcard__title">Nhà gái</p>
              <div className="form-row">
                <label className="field">
                  <span className="field__label">Tên bố</span>
                  <input
                    value={activeSlot.formData.brideFamily.fatherName}
                    onChange={(e) =>
                      updateActiveFormField("brideFamily", {
                        ...activeSlot.formData.brideFamily,
                        fatherName: e.target.value,
                      })
                    }
                  />
                </label>
                <label className="field">
                  <span className="field__label">Tên mẹ</span>
                  <input
                    value={activeSlot.formData.brideFamily.motherName}
                    onChange={(e) =>
                      updateActiveFormField("brideFamily", {
                        ...activeSlot.formData.brideFamily,
                        motherName: e.target.value,
                      })
                    }
                  />
                </label>
              </div>
              <label className="field">
                <span className="field__label">Địa chỉ</span>
                <textarea
                  rows={2}
                  value={activeSlot.formData.brideFamily.address}
                  onChange={(e) =>
                    updateActiveFormField("brideFamily", {
                      ...activeSlot.formData.brideFamily,
                      address: e.target.value,
                    })
                  }
                />
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-stack">
            <div className="wcard">
              <p className="wcard__title">Ảnh bìa & kết thiệp</p>
              <div className="form-row">
                <ImageUploadField
                  label="Ảnh bìa"
                  value={activeSlot.formData.images.hero}
                  onChange={(url) =>
                    updateActiveFormField("images", {
                      ...activeSlot.formData.images,
                      hero: url,
                    })
                  }
                />
                <ImageUploadField
                  label="Ảnh kết thiệp"
                  value={activeSlot.formData.images.thankYou}
                  onChange={(url) =>
                    updateActiveFormField("images", {
                      ...activeSlot.formData.images,
                      thankYou: url,
                    })
                  }
                />
              </div>
            </div>

            <div className="wcard">
              <p className="wcard__title">Ảnh thư mời (3 ảnh)</p>
              <div className="form-row" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                {activeSlot.formData.images.invitation.map((url, index) => (
                  <ImageUploadField
                    key={`inv-${activeSlotIndex}-${index}`}
                    label={`${index + 1}`}
                    value={url}
                    onChange={(nextUrl) => {
                      const invitation = [...activeSlot.formData.images.invitation] as [string, string, string];
                      invitation[index] = nextUrl;
                      updateActiveFormField("images", {
                        ...activeSlot.formData.images,
                        invitation,
                      });
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="wcard">
              <p className="wcard__title">Ảnh gia đình (2 ảnh)</p>
              <div className="form-row">
                {activeSlot.formData.images.family.map((url, index) => (
                  <ImageUploadField
                    key={`fam-${activeSlotIndex}-${index}`}
                    label={`${index + 1}`}
                    value={url}
                    onChange={(nextUrl) => {
                      const family = [...activeSlot.formData.images.family] as [string, string];
                      family[index] = nextUrl;
                      updateActiveFormField("images", {
                        ...activeSlot.formData.images,
                        family,
                      });
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="wcard">
              <p className="wcard__title">Bộ ảnh cưới (10 ảnh)</p>
              <div className="form-row" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
                {activeSlot.formData.images.gallery.map((url, index) => (
                  <ImageUploadField
                    key={`gal-${activeSlotIndex}-${index}`}
                    label={`${index + 1}`}
                    value={url}
                    onChange={(nextUrl) => {
                      const gallery = [...activeSlot.formData.images.gallery] as InviteFormData["images"]["gallery"];
                      gallery[index] = nextUrl;
                      updateActiveFormField("images", {
                        ...activeSlot.formData.images,
                        gallery,
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-stack">
            <div className="wcard">
              <p className="wcard__title">Chuyển khoản mừng cưới</p>
              <BankAccountFields
                value={activeSlot.formData.bankAccount}
                onChange={(bankAccount) =>
                  updateActiveFormField("bankAccount", bankAccount)
                }
              />
            </div>

            <div className="wcard">
              <p className="wcard__title">Email nhận link chính thức</p>
              <label className="field">
                <span className="field__label">Email</span>
                <input
                  type="email"
                  value={orderEmail}
                  onChange={(e) => {
                    setOrderEmail(e.target.value);
                    updateActiveFormField("wishNotificationEmail", e.target.value);
                  }}
                  placeholder="ten@example.com"
                />
                <span className="field__hint">
                  Sau khi thanh toán, hệ thống sẽ gửi toàn bộ link thiệp chính thức về email này.
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="wizard-actions">
        <div className="wizard-progress">
          <div
            className="wizard-progress__fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="wizard-actions__inner">
          {step > 0 ? (
            <button type="button" className="site-btn site-btn--ghost" onClick={goBack}>
              <ChevronLeft size={15} />
              Quay lại
            </button>
          ) : (
            <span />
          )}

          {step < STEPS.length - 1 ? (
            <button type="button" className="site-btn site-btn--primary" onClick={goNext}>
              Tiếp theo
              <ArrowRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              className="site-btn site-btn--primary"
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                "Đang lưu..."
              ) : activeSlot.invitationId ? (
                `Cập nhật thiệp ${activeSlotNumber}`
              ) : (
                <>
                  <Eye size={14} />
                  Tạo xem trước thiệp {activeSlotNumber}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {toast && (
        <div className="site-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
