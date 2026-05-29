"use client";

import { useSearchParams } from "next/navigation";

export function useGuestName(defaultName = "Quý khách") {
  const searchParams = useSearchParams();
  const guestParam = searchParams.get("guest") || searchParams.get("to");

  if (!guestParam) return defaultName;
  return decodeURIComponent(guestParam.replace(/\+/g, " "));
}
