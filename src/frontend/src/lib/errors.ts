export const AUTHENTICATION_REQUIRED_MESSAGE =
  "You must be authenticated to do this.";

const AUTHENTICATION_ERROR_PATTERNS = [
  /anonymous caller not allowed/i,
  /anonymous principal/i,
  /you must be logged in/i,
  /must be logged in/i,
  /must be authenticated/i,
];

export function toUserFacingErrorMessage(
  message: string | null | undefined,
  fallback = "Something went wrong",
): string {
  const raw = message?.trim() || fallback;
  if (AUTHENTICATION_ERROR_PATTERNS.some((pattern) => pattern.test(raw))) {
    return AUTHENTICATION_REQUIRED_MESSAGE;
  }
  return raw;
}

export function getUserFacingErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (error instanceof Error) {
    return toUserFacingErrorMessage(error.message, fallback);
  }
  if (typeof error === "string") {
    return toUserFacingErrorMessage(error, fallback);
  }
  if (error !== null && typeof error === "object") {
    const obj = error as Record<string, unknown>;
    if (typeof obj.message === "string") {
      return toUserFacingErrorMessage(obj.message, fallback);
    }
    try {
      return toUserFacingErrorMessage(JSON.stringify(obj), fallback);
    } catch {
      return fallback;
    }
  }
  return toUserFacingErrorMessage(String(error ?? ""), fallback);
}

export function asUserFacingError(
  error: unknown,
  fallback = "Something went wrong",
): Error {
  return new Error(getUserFacingErrorMessage(error, fallback));
}
