export const WIZARD_STORAGE_KEY = "goatwedding_wizard";
export const PACKAGE_STORAGE_KEY = "goatwedding_package";

export function readLocalJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    let raw = localStorage.getItem(key);
    if (!raw) {
      raw = sessionStorage.getItem(key);
      if (raw) {
        localStorage.setItem(key, raw);
        sessionStorage.removeItem(key);
      }
    }
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeLocalJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocalJson(key: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}
