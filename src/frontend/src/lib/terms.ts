import { TERMS_VERSION } from "@/content/terms";

const TERMS_STORAGE_KEY = "mintlab.terms.acceptance";

export interface TermsAcceptanceRecord {
  version: string;
  acceptedAt: string;
}

export function getTermsAcceptance(): TermsAcceptanceRecord | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(TERMS_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<TermsAcceptanceRecord>;
    if (
      typeof parsed.version !== "string" ||
      typeof parsed.acceptedAt !== "string"
    ) {
      return null;
    }
    return {
      version: parsed.version,
      acceptedAt: parsed.acceptedAt,
    };
  } catch {
    return null;
  }
}

export function hasAcceptedCurrentTerms(): boolean {
  return getTermsAcceptance()?.version === TERMS_VERSION;
}

export function acceptCurrentTerms(): TermsAcceptanceRecord {
  const record = {
    version: TERMS_VERSION,
    acceptedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(TERMS_STORAGE_KEY, JSON.stringify(record));
  }

  return record;
}
