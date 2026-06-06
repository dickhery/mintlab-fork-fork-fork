import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useCallback } from "react";

export interface UseAuthReturn {
  principal: Principal | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  principalText: string | null;
}

export function useAuth(): UseAuthReturn {
  const {
    identity,
    isAuthenticated: rawIsAuthenticated,
    isInitializing,
    isLoggingIn,
    login,
    clear,
  } = useInternetIdentity();

  const rawPrincipal = identity ? identity.getPrincipal() : null;
  const rawPrincipalText = rawPrincipal ? rawPrincipal.toString() : null;
  const hasAuthenticatedPrincipal =
    rawIsAuthenticated &&
    rawPrincipal !== null &&
    rawPrincipalText !== "2vxsx-fae" &&
    !rawPrincipal.isAnonymous();
  const principal = hasAuthenticatedPrincipal ? rawPrincipal : null;
  const principalText = principal ? principal.toString() : null;

  const logout = useCallback(() => {
    clear();
  }, [clear]);

  return {
    principal,
    isAuthenticated: hasAuthenticatedPrincipal,
    isLoading: isInitializing || isLoggingIn,
    login,
    logout,
    principalText,
  };
}
