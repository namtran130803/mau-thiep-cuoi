"use client";

import { useSearchParams } from "next/navigation";

export function useGuestName(defaultName = "Quý khách", enabled = true) {
  const searchParams = useSearchParams();
  const guestParam = searchParams.get("guest") || searchParams.get("to");

  if (guestParam) {
    return decodeURIComponent(guestParam.replace(/\+/g, " "));
  }

  if (!enabled) return "";
  return defaultName;
}
