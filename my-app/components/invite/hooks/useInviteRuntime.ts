"use client";

import AOS from "aos";
import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ChangeEvent } from "react";
import { useGuestName } from "@/components/invite/hooks/useGuestName";
import type {
  CoverState,
  DerivedInviteData,
  InviteData,
  Wish,
} from "@/lib/invite/types";

const COVER_PANEL_MS = 820;

type UseInviteRuntimeOptions = {
  slug: string;
  data: InviteData;
  derived: DerivedInviteData;
  aosOffset?: number;
  showWishAlert?: boolean;
};

function unlockDocumentScroll() {
  document.documentElement.classList.remove("invite-cover-locked");
  document.body.classList.remove("invite-cover-locked");
}

function lockDocumentScroll() {
  document.documentElement.classList.add("invite-cover-locked");
  document.body.classList.add("invite-cover-locked");
}

function resetDocumentScrollStyles() {
  document.documentElement.classList.remove("invite-cover-locked");
  document.body.classList.remove("invite-cover-locked");
  document.body.style.position = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
}

export function useInviteRuntime({
  slug,
  data,
  derived,
  aosOffset = 0,
  showWishAlert = true,
}: UseInviteRuntimeOptions) {
  const guestName = useGuestName();

  const [coverState, setCoverState] = useState<CoverState>("closed");
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string | null>(null);
  const [isContentReady, setIsContentReady] = useState(false);

  const coverOpenedRef = useRef(false);
  const aosReadyRef = useRef(false);
  const appRootRef = useRef<HTMLElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);
  const coverGateRef = useRef<HTMLDivElement>(null);

  const initPageAnimations = useCallback(() => {
    if (aosReadyRef.current) return;
    aosReadyRef.current = true;

    AOS.init({
      once: true,
      mirror: false,
      duration: 700,
      offset: aosOffset,
      easing: "ease-out-cubic",
    });
  }, [aosOffset]);

  const playContentAnimations = useCallback(() => {
    setIsContentReady(true);
    initPageAnimations();
    window.requestAnimationFrame(() => AOS.refresh());
  }, [initPageAnimations]);

  const openCover = useCallback(() => {
    if (coverOpenedRef.current) return;
    coverOpenedRef.current = true;

    coverGateRef.current?.blur();
    window.scrollTo(0, 0);
    playContentAnimations();
    setCoverState("opening");

    window.setTimeout(() => {
      setCoverState("opened");
      scopeRef.current?.classList.remove("cover-locked");
      unlockDocumentScroll();
      coverGateRef.current?.blur();
      appRootRef.current?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }, COVER_PANEL_MS);
  }, [playContentAnimations]);

  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    function showPage(root: HTMLDivElement) {
      root.classList.add("fonts-ready");
    }

    if (!document.fonts?.ready) {
      showPage(scope);
    } else {
      const timeout = window.setTimeout(() => showPage(scope), 5000);
      document.fonts.ready.then(() => {
        window.clearTimeout(timeout);
        showPage(scope);
      });
    }

    scope.classList.add("cover-locked");
    lockDocumentScroll();

    return () => {
      scope.classList.remove("fonts-ready", "cover-locked");
      scope.style.overflow = "";
      resetDocumentScrollStyles();
    };
  }, []);

  useEffect(() => {
    if (!isContentReady) return;

    try {
      const stored = JSON.parse(
        localStorage.getItem(derived.wishStorageKey) || "[]",
      ) as Wish[];
      setWishes([...stored].reverse());
      window.requestAnimationFrame(() => AOS.refresh());
    } catch {
      setWishes([]);
    }
  }, [isContentReady, derived.wishStorageKey]);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    scope.style.overflow = isGiftModalOpen ? "hidden" : "";
  }, [isGiftModalOpen]);

  useEffect(() => {
    if (!isGiftModalOpen) return;

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setIsGiftModalOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isGiftModalOpen]);

  const handleCoverKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCover();
    }
  };

  const handleQrUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setQrPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleWishSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const wish: Wish = {
      name: String(formData.get("name") ?? ""),
      message: String(formData.get("message") ?? ""),
      attend: String(formData.get("attend") ?? ""),
      createdAt: new Date().toISOString(),
    };

    const stored = JSON.parse(
      localStorage.getItem(derived.wishStorageKey) || "[]",
    ) as Wish[];
    stored.push(wish);
    localStorage.setItem(derived.wishStorageKey, JSON.stringify(stored));

    setWishes((current) => [wish, ...current]);
    event.currentTarget.reset();
    setQrPreviewUrl(null);
    window.requestAnimationFrame(() => AOS.refresh());

    try {
      await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          notifyEmail: data.wishNotificationEmail,
          wish: {
            name: wish.name,
            message: wish.message,
            attend: wish.attend,
          },
        }),
      });
    } catch {
      // Demo vẫn lưu local khi API chưa sẵn sàng
    }

    if (showWishAlert) {
      window.alert("Cảm ơn bạn đã gửi lời chúc!");
    }
  };

  const coverGateClassName = [
    "cover-gate",
    coverState === "opening" ? "is-opening" : "",
    coverState === "opened" ? "is-opened" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const isCoverInteractive = coverState === "closed";

  return {
    guestName,
    scopeRef,
    appRootRef,
    coverGateRef,
    isContentReady,
    coverState,
    isCoverInteractive,
    coverGateClassName,
    openCover,
    handleCoverKeyDown,
    isGiftModalOpen,
    openGiftModal: () => setIsGiftModalOpen(true),
    closeGiftModal: () => setIsGiftModalOpen(false),
    wishes,
    qrPreviewUrl,
    handleQrUploadChange,
    handleWishSubmit,
  };
}

export type UseInviteRuntimeReturn = ReturnType<typeof useInviteRuntime>;
