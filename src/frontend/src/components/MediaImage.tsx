import {
  defaultICAssetUrls,
  resolveImageUrl,
  resolveMetadataImageUrl,
} from "@/lib/media";
import type { ImgHTMLAttributes, ReactNode, SyntheticEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

interface MediaImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  src?: string | null;
  alt: string;
  assetCanisterId?: string | null;
  tokenId?: string | null;
  preferThumbnail?: boolean;
  fallback?: ReactNode;
}

export function MediaImage({
  src,
  alt,
  assetCanisterId,
  tokenId,
  preferThumbnail,
  fallback = null,
  onError,
  ...props
}: MediaImageProps) {
  const mediaContext = useMemo(
    () => ({
      canisterId: assetCanisterId,
      tokenId,
      preferThumbnail,
    }),
    [assetCanisterId, tokenId, preferThumbnail],
  );
  const candidates = useMemo(
    () =>
      uniqueStrings([
        resolveImageUrl(src, mediaContext),
        ...defaultICAssetUrls(mediaContext),
      ]),
    [src, mediaContext],
  );
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(
    () => candidates[0],
  );
  const [failed, setFailed] = useState(() => candidates.length === 0);
  const triedMetadata = useRef(false);
  const attemptedUrls = useRef<Set<string>>(new Set());

  useEffect(() => {
    triedMetadata.current = false;
    attemptedUrls.current = new Set();
    const initialSrc = candidates[0];
    if (initialSrc) {
      attemptedUrls.current.add(initialSrc);
      setCurrentSrc(initialSrc);
      setFailed(false);
    } else {
      setCurrentSrc(undefined);
      setFailed(true);
    }
  }, [candidates]);

  function tryCandidate(url: string) {
    attemptedUrls.current.add(url);
    setCurrentSrc(url);
    setFailed(false);
  }

  function tryNextCandidate() {
    const next = candidates.find((candidate) => {
      return !attemptedUrls.current.has(candidate);
    });
    if (next) {
      tryCandidate(next);
      return;
    }
    setFailed(true);
  }

  function handleError(event: SyntheticEvent<HTMLImageElement, Event>) {
    onError?.(event);
    if (currentSrc) attemptedUrls.current.add(currentSrc);

    if (triedMetadata.current) {
      tryNextCandidate();
      return;
    }

    triedMetadata.current = true;
    void resolveMetadataImageUrl(src, undefined, mediaContext)
      .then((metadataSrc) => {
        if (metadataSrc && !attemptedUrls.current.has(metadataSrc)) {
          tryCandidate(metadataSrc);
        } else {
          tryNextCandidate();
        }
      })
      .catch(() => {
        tryNextCandidate();
      });
  }

  if (!currentSrc || failed) return <>{fallback}</>;

  return <img {...props} src={currentSrc} alt={alt} onError={handleError} />;
}

function uniqueStrings(values: Array<string | undefined>): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const value of values) {
    if (value && !seen.has(value)) {
      seen.add(value);
      unique.push(value);
    }
  }
  return unique;
}
