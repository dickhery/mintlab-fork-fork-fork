import type { TermsAcceptanceStatus } from "@/backend-client";
import { isCurrentTermsVersion } from "@/lib/terms";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import { useBackend } from "./use-backend";

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Could not update terms acceptance";
}

export function useTermsAcceptance() {
  const { actor } = useBackend();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [status, setStatus] = useState<TermsAcceptanceStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!isAuthenticated || !actor) {
      setStatus(null);
      setIsChecking(false);
      setError(null);
      return;
    }

    setIsChecking(true);
    setError(null);
    actor
      .getMyTermsAcceptanceStatus()
      .then((nextStatus) => {
        if (!cancelled) {
          setStatus(nextStatus);
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setStatus(null);
          setError(errorMessage(loadError));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsChecking(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [actor, isAuthenticated]);

  const acceptTerms = useCallback(async () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    if (!actor) {
      return;
    }

    setIsAccepting(true);
    setError(null);
    try {
      const nextStatus = await actor.acceptCurrentTerms();
      setStatus(nextStatus);
    } catch (acceptError) {
      setError(errorMessage(acceptError));
    } finally {
      setIsAccepting(false);
    }
  }, [actor, isAuthenticated, login]);

  const accepted =
    status?.acceptedCurrent === true &&
    isCurrentTermsVersion(status.currentVersion);

  return {
    accepted,
    acceptTerms,
    error,
    isAuthenticated,
    isAuthLoading: isLoading,
    isAccepting,
    isBackendReady: actor != null,
    isChecking,
    login,
    status,
  };
}
