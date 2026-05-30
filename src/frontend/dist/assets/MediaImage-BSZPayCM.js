import { c as createLucideIcon, j as jsxRuntimeExports, m as motion, B as Button, a as cn, r as reactExports } from "./index-DdFL7FDk.js";
import { r as resolveImageUrl, d as defaultICAssetUrls, a as resolveMetadataImageUrl } from "./media-nh9kRgln.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "8", cy: "8", r: "6", key: "3yglwk" }],
  ["path", { d: "M18.09 10.37A6 6 0 1 1 10.34 18", key: "t5s6rm" }],
  ["path", { d: "M7 6h1v4", key: "1obek4" }],
  ["path", { d: "m16.71 13.88.7.71-2.82 2.82", key: "1rbuyh" }]
];
const Coins = createLucideIcon("coins", __iconNode);
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  "data-ocid": dataOcid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-6 text-center",
        className
      ),
      "data-ocid": dataOcid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/60 border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-8 h-8 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-lg", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: description })
        ] }),
        action && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: action.onClick,
            className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth mt-2",
            "data-ocid": action["data-ocid"],
            children: action.label
          }
        )
      ]
    }
  );
}
function MediaImage({
  src,
  alt,
  assetCanisterId,
  tokenId,
  preferThumbnail,
  fallback = null,
  onError,
  ...props
}) {
  const mediaContext = reactExports.useMemo(
    () => ({
      canisterId: assetCanisterId,
      tokenId,
      preferThumbnail
    }),
    [assetCanisterId, tokenId, preferThumbnail]
  );
  const candidates = reactExports.useMemo(
    () => uniqueStrings([
      resolveImageUrl(src, mediaContext),
      ...defaultICAssetUrls(mediaContext)
    ]),
    [src, mediaContext]
  );
  const [currentSrc, setCurrentSrc] = reactExports.useState(
    () => candidates[0]
  );
  const [failed, setFailed] = reactExports.useState(() => candidates.length === 0);
  const triedMetadata = reactExports.useRef(false);
  const attemptedUrls = reactExports.useRef(/* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    triedMetadata.current = false;
    attemptedUrls.current = /* @__PURE__ */ new Set();
    const initialSrc = candidates[0];
    if (initialSrc) {
      attemptedUrls.current.add(initialSrc);
      setCurrentSrc(initialSrc);
      setFailed(false);
    } else {
      setCurrentSrc(void 0);
      setFailed(true);
    }
  }, [candidates]);
  function tryCandidate(url) {
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
  function handleError(event) {
    onError == null ? void 0 : onError(event);
    if (currentSrc) attemptedUrls.current.add(currentSrc);
    if (triedMetadata.current) {
      tryNextCandidate();
      return;
    }
    triedMetadata.current = true;
    void resolveMetadataImageUrl(src, void 0, mediaContext).then((metadataSrc) => {
      if (metadataSrc && !attemptedUrls.current.has(metadataSrc)) {
        tryCandidate(metadataSrc);
      } else {
        tryNextCandidate();
      }
    }).catch(() => {
      tryNextCandidate();
    });
  }
  if (!currentSrc || failed) return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: fallback });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { ...props, src: currentSrc, alt, onError: handleError });
}
function uniqueStrings(values) {
  const seen = /* @__PURE__ */ new Set();
  const unique = [];
  for (const value of values) {
    if (value && !seen.has(value)) {
      seen.add(value);
      unique.push(value);
    }
  }
  return unique;
}
export {
  Coins as C,
  EmptyState as E,
  MediaImage as M
};
