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
  Users,
  UserRound,
  Sparkles,
} from "lucide-react";
import BankAccountFields from "@/components/site/BankAccountFields";
import ImageUploadField from "@/components/site/ImageUploadField";
import { createOrder, updateOrderDraft } from "@/lib/actions/order";
import { restoreCheckoutSession } from "@/lib/actions/checkout";
import { getInvitationById, saveInvitation } from "@/lib/actions/invitation";
import {
  loadCheckoutSession,
  saveCheckoutSession,
} from "@/lib/checkout/client-session";
import {
  PACKAGE_STORAGE_KEY,
  WIZARD_STORAGE_KEY,
  readLocalJson,
  writeLocalJson,
} from "@/lib/storage/local";
import { createEmptyInviteFormData } from "@/lib/form/default-invite-data";
import { listInviteTemplates } from "@/lib/templates/registry";
import { PACKAGES, GUEST_NAME_SERVICE_PRICE, formatVnd, type PackageType } from "@/lib/pricing";
import type { InviteFormData } from "@/lib/validation/invite";

const STEPS = [
  "Gói & mẫu",
  "Tiệc cưới",
  "Gia đình",
  "Ảnh thiệp",
  "Tài khoản",
];

type WizardDraft = {
  packageType: PackageType;
  guestNameService: boolean;
  templateSlug: string;
  formData: InviteFormData;
};

type InviteWizardProps = {
  initialDraft?: Partial<WizardDraft>;
  queryOverrides?: Partial<Pick<WizardDraft, "packageType" | "templateSlug">>;
};

function loadDraft(): WizardDraft | null {
  return readLocalJson<WizardDraft>(WIZARD_STORAGE_KEY);
}

function saveDraft(draft: WizardDraft) {
  writeLocalJson(WIZARD_STORAGE_KEY, draft);
}

type SavedMeta = {
  packageType: PackageType;
  guestNameService: boolean;
  templateSlug: string;
};

function applyQueryOverrides(
  overrides: InviteWizardProps["queryOverrides"],
  apply: {
    setPackageType: (value: PackageType) => void;
    setTemplateSlug: (value: string) => void;
  },
) {
  if (overrides?.packageType) apply.setPackageType(overrides.packageType);
  if (overrides?.templateSlug) apply.setTemplateSlug(overrides.templateSlug);
}

export default function InviteWizard({ initialDraft, queryOverrides }: InviteWizardProps) {
  const templates = useMemo(() => listInviteTemplates(), []);

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [invitationId, setInvitationId] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");

  const [packageType, setPackageType] = useState<PackageType>(
    initialDraft?.packageType ?? "single",
  );
  const [guestNameService, setGuestNameService] = useState(
    initialDraft?.guestNameService ?? false,
  );
  const [templateSlug, setTemplateSlug] = useState(
    initialDraft?.templateSlug ?? templates[0]?.slug ?? "thiep-cuoi-1",
  );
  const [formData, setFormData] = useState<InviteFormData>(
    initialDraft?.formData ?? createEmptyInviteFormData(),
  );
  const [savedMeta, setSavedMeta] = useState<SavedMeta | null>(null);

  useEffect(() => {
    async function hydrate() {
      let checkout = loadCheckoutSession();

      if (!checkout) {
        const restored = await restoreCheckoutSession();
        if (restored?.hasDemo && restored.invitationId && restored.demoUrl) {
          checkout = {
            orderId: restored.orderId,
            invitationId: restored.invitationId,
            demoUrl: restored.demoUrl,
          };
          saveCheckoutSession(checkout);
        } else if (restored) {
          setOrderId(restored.orderId);
          setPackageType(restored.packageType);
          setGuestNameService(restored.guestNameService);
          const nextTemplateSlug = restored.templateSlug ?? templates[0]?.slug ?? "thiep-cuoi-1";
          const nextFormData = (restored.formData as InviteFormData | null) ?? createEmptyInviteFormData();
          if (restored.templateSlug) setTemplateSlug(restored.templateSlug);
          if (restored.formData) setFormData(restored.formData as InviteFormData);
          saveDraft({
            packageType: restored.packageType,
            guestNameService: restored.guestNameService,
            templateSlug: nextTemplateSlug,
            formData: nextFormData,
          });
          writeLocalJson(PACKAGE_STORAGE_KEY, {
            packageType: restored.packageType,
            guestNameService: restored.guestNameService,
          });
        }
      }

      const draft = loadDraft();

      if (checkout) {
        setOrderId(checkout.orderId);
        setInvitationId(checkout.invitationId);
        setDemoUrl(checkout.demoUrl);
        setIsComplete(true);
        try {
          const invitation = await getInvitationById(checkout.invitationId);
          if (invitation?.data) {
            const meta: SavedMeta = {
              packageType: invitation.order.packageType as PackageType,
              guestNameService: invitation.order.guestNameService,
              templateSlug: invitation.templateSlug,
            };
            setFormData(invitation.data as InviteFormData);
            setPackageType(meta.packageType);
            setGuestNameService(meta.guestNameService);
            setTemplateSlug(meta.templateSlug);
            setSavedMeta(meta);
            saveDraft({
              ...meta,
              formData: invitation.data as InviteFormData,
            });
          } else if (draft) {
            setSavedMeta({
              packageType: draft.packageType,
              guestNameService: draft.guestNameService,
              templateSlug: draft.templateSlug,
            });
            setPackageType(draft.packageType);
            setGuestNameService(draft.guestNameService);
            setTemplateSlug(draft.templateSlug);
            setFormData(draft.formData);
          }
        } catch {
          if (draft) {
            setSavedMeta({
              packageType: draft.packageType,
              guestNameService: draft.guestNameService,
              templateSlug: draft.templateSlug,
            });
            setPackageType(draft.packageType);
            setGuestNameService(draft.guestNameService);
            setTemplateSlug(draft.templateSlug);
            setFormData(draft.formData);
          }
        }
      } else if (draft) {
        setPackageType(draft.packageType);
        setGuestNameService(draft.guestNameService);
        setTemplateSlug(draft.templateSlug);
        setFormData(draft.formData);
      }

      applyQueryOverrides(queryOverrides, { setPackageType, setTemplateSlug });
    }

    void hydrate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const meta = isComplete && savedMeta
      ? savedMeta
      : { packageType, guestNameService, templateSlug };

    saveDraft({
      packageType: meta.packageType,
      guestNameService: meta.guestNameService,
      templateSlug: meta.templateSlug,
      formData,
    });
  }, [packageType, guestNameService, templateSlug, formData, isComplete, savedMeta]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function showToast(message: string) {
    setToast(message);
  }

  function updateField<K extends keyof InviteFormData>(key: K, value: InviteFormData[K]) {
    setFormData((c) => ({ ...c, [key]: value }));
  }

  function validateStep(s: number): string | null {
    switch (s) {
      case 0:
        if (!templateSlug) return "Vui lòng chọn mẫu thiệp";
        return null;
      case 1:
        if (!formData.groomName.trim()) return "Vui lòng nhập tên chú rể";
        if (!formData.brideName.trim()) return "Vui lòng nhập tên cô dâu";
        if (!formData.weddingAt) return "Vui lòng chọn thời gian";
        if (!formData.venue.name.trim()) return "Vui lòng nhập địa điểm";
        if (!formData.venue.address.trim()) return "Vui lòng nhập địa chỉ tiệc cưới";
        return null;
      case 2:
        if (!formData.groomFamily.fatherName.trim()) return "Vui lòng nhập tên bố nhà trai";
        if (!formData.groomFamily.motherName.trim()) return "Vui lòng nhập tên mẹ nhà trai";
        if (!formData.groomFamily.address.trim()) return "Vui lòng nhập địa chỉ nhà trai";
        if (!formData.brideFamily.fatherName.trim()) return "Vui lòng nhập tên bố nhà gái";
        if (!formData.brideFamily.motherName.trim()) return "Vui lòng nhập tên mẹ nhà gái";
        if (!formData.brideFamily.address.trim()) return "Vui lòng nhập địa chỉ nhà gái";
        return null;
      case 3:
        if (!formData.images.hero) return "Vui lòng tải lên ảnh bìa";
        if (!formData.images.thankYou) return "Vui lòng tải lên ảnh kết thiệp";
        return null;
      case 4:
        if (!formData.bankAccount.accountNumber.trim()) return "Vui lòng nhập số tài khoản";
        if (!formData.bankAccount.accountName.trim()) return "Vui lòng nhập tên chủ tài khoản";
        if (!formData.bankAccount.bankBin.trim()) return "Vui lòng chọn ngân hàng";
        if (!formData.wishNotificationEmail.trim()) return "Vui lòng nhập email";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.wishNotificationEmail))
          return "Email không hợp lệ";
        return null;
      default:
        return null;
    }
  }

  function goNext() {
    const err = validateStep(step);
    if (err) { setError(err); return; }
    setError("");
    setStep((c) => Math.min(c + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setError("");
    setStep((c) => Math.max(c - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    const err = validateStep(step);
    if (err) { setError(err); return; }
    setSubmitting(true);
    setError("");
    const isUpdate = Boolean(invitationId);
    try {
      let currentOrderId = orderId;
      if (!currentOrderId) {
        const order = await createOrder({
          email: formData.wishNotificationEmail,
          packageType,
          guestNameService,
        });
        currentOrderId = order.orderId;
        setOrderId(currentOrderId);
      } else {
        await updateOrderDraft(currentOrderId, {
          email: formData.wishNotificationEmail,
          packageType,
          guestNameService,
        });
      }
      const result = await saveInvitation({
        orderId: currentOrderId,
        templateSlug,
        invitationId: invitationId || undefined,
        data: formData,
      });
      setInvitationId(result.invitationId);
      setDemoUrl(result.demoUrl);
      const nextMeta: SavedMeta = { packageType, guestNameService, templateSlug };
      setSavedMeta(nextMeta);
      saveDraft({ ...nextMeta, formData });
      writeLocalJson(PACKAGE_STORAGE_KEY, {
        packageType,
        guestNameService,
      });
      saveCheckoutSession({
        orderId: currentOrderId,
        invitationId: result.invitationId,
        demoUrl: result.demoUrl,
      });
      setIsComplete(true);
      if (isUpdate) showToast("Đã cập nhật bản xem trước");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lưu thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}${demoUrl}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const progressPct = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="wizard">
      {isComplete && demoUrl && orderId && (
        <div className="wdemo-card">
          <div className="wdemo-card__head">
            <span className="wdemo-card__badge">
              <Sparkles size={12} />
              Bản xem trước
            </span>
            <p className="wdemo-card__title">Thiệp của bạn đã sẵn sàng</p>
            <p className="wdemo-card__desc">
              Xem lại, chỉnh sửa thêm hoặc thanh toán để nhận liên kết chính thức.
            </p>
          </div>
          <div className="wdemo-card__actions">
            <a
              href={demoUrl}
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
                onClick={copyLink}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Đã sao chép" : "Sao chép liên kết"}
              </button>
              <Link
                href={`/thanh-toan/${orderId}`}
                className="site-btn site-btn--green site-btn--full"
              >
                <CreditCard size={14} />
                Thanh toán
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Step title ── */}
      <div className="wstep-title">
        <h2 className="wstep-title__text">{STEPS[step]}</h2>
        <span className="wstep-title__counter">{step + 1} / {STEPS.length}</span>
      </div>

      {/* ── Panel ── */}
      <div className="wizard-panel">

        {/* BƯỚC 1 — Gói & mẫu */}
        {step === 0 && (
          <div className="form-stack">
            {/* Mẫu thiệp */}
            <div className="wcard">
              <p className="wcard__title">Mẫu thiệp</p>
              <label className="field">
                <span className="field__label">Chọn mẫu</span>
                <select value={templateSlug} onChange={(e) => setTemplateSlug(e.target.value)}>
                  {templates.map((t, i) => (
                    <option key={t.slug} value={t.slug}>Mẫu {i + 1}</option>
                  ))}
                </select>
              </label>
              <a
                href={`/${templateSlug}`}
                className="wcard__preview-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={12} />
                Xem thử mẫu này
              </a>
            </div>

            {/* Gói dịch vụ */}
            <div className="wcard">
              <p className="wcard__title">Gói dịch vụ</p>
              <div className="wpkg-list">
                {PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    className={`wpkg-item${packageType === pkg.id ? " is-active" : ""}`}
                    onClick={() => setPackageType(pkg.id)}
                  >
                    <span className="wpkg-item__radio">
                      <span className="wpkg-item__dot" />
                    </span>
                    <span className="wpkg-item__name">{pkg.name}</span>
                    <span className="wpkg-item__price">{formatVnd(pkg.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tên riêng khách mời */}
            <div className="wcard">
              <p className="wcard__title">Tên riêng khách mời</p>
              <div className="wguest-opts">
                <button
                  type="button"
                  className={`wguest-opt${!guestNameService ? " is-active" : ""}`}
                  onClick={() => setGuestNameService(false)}
                >
                  <Users size={20} className="wguest-opt__icon" strokeWidth={1.5} />
                  <span className="wguest-opt__label">Thiệp chung</span>
                  <span className="wguest-opt__price">Miễn phí</span>
                </button>
                <button
                  type="button"
                  className={`wguest-opt${guestNameService ? " is-active" : ""}`}
                  onClick={() => setGuestNameService(true)}
                >
                  <UserRound size={20} className="wguest-opt__icon" strokeWidth={1.5} />
                  <span className="wguest-opt__label">Tên riêng</span>
                  <span className="wguest-opt__price">+{formatVnd(GUEST_NAME_SERVICE_PRICE)}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BƯỚC 2 — Thông tin cưới */}
        {step === 1 && (
          <div className="form-stack">
            <div className="wcard">
              <p className="wcard__title">Cô dâu & Chú rể</p>
              <div className="form-row">
                <label className="field">
                  <span className="field__label">Chú rể</span>
                  <input
                    value={formData.groomName}
                    onChange={(e) => updateField("groomName", e.target.value)}
                    placeholder="Trọng Nam"
                  />
                </label>
                <label className="field">
                  <span className="field__label">Cô dâu</span>
                  <input
                    value={formData.brideName}
                    onChange={(e) => updateField("brideName", e.target.value)}
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
                    value={formData.weddingAt}
                    onChange={(e) => updateField("weddingAt", e.target.value)}
                  />
                </label>
                <label className="field">
                  <span className="field__label">Tên địa điểm</span>
                  <input
                    value={formData.venue.name}
                    onChange={(e) => updateField("venue", { ...formData.venue, name: e.target.value })}
                    placeholder="Nhà hàng Tiệc Cưới ABC"
                  />
                </label>
                <label className="field">
                  <span className="field__label">Địa chỉ tiệc cưới</span>
                  <textarea
                    rows={2}
                    value={formData.venue.address}
                    onChange={(e) => updateField("venue", { ...formData.venue, address: e.target.value })}
                    placeholder="Số nhà, đường, quận, thành phố"
                  />
                </label>
                <label className="field">
                  <span className="field__label">Liên kết Google Maps <span style={{ fontWeight: 400, color: "var(--muted)" }}>(tuỳ chọn)</span></span>
                  <input
                    value={formData.venue.mapUrl ?? ""}
                    onChange={(e) => updateField("venue", { ...formData.venue, mapUrl: e.target.value })}
                    placeholder="https://maps.google.com/..."
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* BƯỚC 3 — Gia đình & ảnh */}
        {step === 2 && (
          <div className="form-stack">
            <div className="wcard">
              <p className="wcard__title">Nhà trai</p>
              <div className="form-row">
                <label className="field">
                  <span className="field__label">Tên bố</span>
                  <input
                    value={formData.groomFamily.fatherName}
                    onChange={(e) => updateField("groomFamily", { ...formData.groomFamily, fatherName: e.target.value })}
                  />
                </label>
                <label className="field">
                  <span className="field__label">Tên mẹ</span>
                  <input
                    value={formData.groomFamily.motherName}
                    onChange={(e) => updateField("groomFamily", { ...formData.groomFamily, motherName: e.target.value })}
                  />
                </label>
              </div>
              <label className="field">
                <span className="field__label">Địa chỉ</span>
                <textarea
                  rows={2}
                  value={formData.groomFamily.address}
                  onChange={(e) => updateField("groomFamily", { ...formData.groomFamily, address: e.target.value })}
                />
              </label>
            </div>

            <div className="wcard">
              <p className="wcard__title">Nhà gái</p>
              <div className="form-row">
                <label className="field">
                  <span className="field__label">Tên bố</span>
                  <input
                    value={formData.brideFamily.fatherName}
                    onChange={(e) => updateField("brideFamily", { ...formData.brideFamily, fatherName: e.target.value })}
                  />
                </label>
                <label className="field">
                  <span className="field__label">Tên mẹ</span>
                  <input
                    value={formData.brideFamily.motherName}
                    onChange={(e) => updateField("brideFamily", { ...formData.brideFamily, motherName: e.target.value })}
                  />
                </label>
              </div>
              <label className="field">
                <span className="field__label">Địa chỉ</span>
                <textarea
                  rows={2}
                  value={formData.brideFamily.address}
                  onChange={(e) => updateField("brideFamily", { ...formData.brideFamily, address: e.target.value })}
                />
              </label>
            </div>

          </div>
        )}

        {/* BƯỚC 4 — Ảnh thiệp */}
        {step === 3 && (
          <div className="form-stack">
            <div className="wcard">
              <p className="wcard__title">Ảnh bìa & kết thiệp</p>
              <div className="form-row">
                <ImageUploadField
                  label="Ảnh bìa"
                  value={formData.images.hero}
                  onChange={(url) => updateField("images", { ...formData.images, hero: url })}
                />
                <ImageUploadField
                  label="Ảnh kết thiệp"
                  value={formData.images.thankYou}
                  onChange={(url) => updateField("images", { ...formData.images, thankYou: url })}
                />
              </div>
            </div>

            <div className="wcard">
              <p className="wcard__title">Ảnh thư mời (3 ảnh)</p>
              <div className="form-row" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                {formData.images.invitation.map((url, index) => (
                  <ImageUploadField
                    key={`inv-${index}`}
                    label={`${index + 1}`}
                    value={url}
                    onChange={(nextUrl) => {
                      const inv = [...formData.images.invitation] as [string, string, string];
                      inv[index] = nextUrl;
                      updateField("images", { ...formData.images, invitation: inv });
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="wcard">
              <p className="wcard__title">Ảnh gia đình (2 ảnh)</p>
              <div className="form-row">
                {formData.images.family.map((url, index) => (
                  <ImageUploadField
                    key={`fam-${index}`}
                    label={`${index + 1}`}
                    value={url}
                    onChange={(nextUrl) => {
                      const fam = [...formData.images.family] as [string, string];
                      fam[index] = nextUrl;
                      updateField("images", { ...formData.images, family: fam });
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="wcard">
              <p className="wcard__title">Bộ ảnh cưới (10 ảnh)</p>
              <div className="form-row" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
                {formData.images.gallery.map((url, index) => (
                  <ImageUploadField
                    key={`gal-${index}`}
                    label={`${index + 1}`}
                    value={url}
                    onChange={(nextUrl) => {
                      const gallery = [...formData.images.gallery] as InviteFormData["images"]["gallery"];
                      gallery[index] = nextUrl;
                      updateField("images", { ...formData.images, gallery });
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BƯỚC 5 — Tài khoản & email */}
        {step === 4 && (
          <div className="form-stack">
            <div className="wcard">
              <p className="wcard__title">Chuyển khoản mừng cưới</p>
              <BankAccountFields
                value={formData.bankAccount}
                onChange={(bankAccount) => updateField("bankAccount", bankAccount)}
              />
            </div>

            <div className="wcard">
              <p className="wcard__title">Email nhận thiệp</p>
              <label className="field">
                <span className="field__label">Email</span>
                <input
                  type="email"  
                  value={formData.wishNotificationEmail}
                  onChange={(e) => updateField("wishNotificationEmail", e.target.value)}
                  placeholder="ten@example.com"
                />
                <span className="field__hint">
                  Liên kết thiệp chính thức và lời chúc của khách sẽ gửi về email này sau khi thanh toán.
                </span>
              </label>
            </div>
          </div>
        )}

        {error && <p className="form-error-bar">{error}</p>}
        <div style={{ height: 20 }} />
      </div>

      {/* ── Sticky actions ── */}
      <div className="wizard-actions">
        <div className="wizard-progress">
          <div className="wizard-progress__fill" style={{ width: `${progressPct}%` }} />
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
              {submitting
                ? "Đang lưu..."
                : invitationId
                  ? "Cập nhật"
                  : (
                    <>
                      <Eye size={14} />
                      Tạo bản xem trước
                    </>
                  )}
            </button>
          )}
        </div>
      </div>

      {toast && (
        <div className="site-toast" role="status">
          <Check size={15} strokeWidth={3} />
          {toast}
        </div>
      )}
    </div>
  );
}
