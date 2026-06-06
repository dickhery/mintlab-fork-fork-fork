import { TERMS_VERSION } from "@/content/terms";

export function isCurrentTermsVersion(version: string | null | undefined) {
  return version === TERMS_VERSION;
}
