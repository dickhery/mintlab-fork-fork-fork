import { c as createLucideIcon, j as jsxRuntimeExports, B as Button, o as ue } from "./index-BiU-kY3M.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode);
function copyWithSelectionFallback(text) {
  if (typeof document === "undefined" || !document.body) return false;
  const textArea = document.createElement("textarea");
  const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.opacity = "0";
  textArea.style.pointerEvents = "none";
  document.body.appendChild(textArea);
  try {
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textArea.remove();
    activeElement == null ? void 0 : activeElement.focus();
  }
}
async function copyTextToClipboard(text) {
  var _a;
  if (typeof navigator !== "undefined" && globalThis.isSecureContext && ((_a = navigator.clipboard) == null ? void 0 : _a.writeText)) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
    }
  }
  return copyWithSelectionFallback(text);
}
function ShareLinkButton({
  url,
  label = "Copy link",
  className,
  "data-ocid": dataOcid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      type: "button",
      size: "sm",
      variant: "outline",
      className: className ?? "h-7 gap-1.5 text-xs",
      onClick: async (event) => {
        event.stopPropagation();
        const copied = await copyTextToClipboard(url);
        if (copied) {
          ue.success("Link copied to clipboard");
        } else {
          ue.error("Could not copy link");
        }
      },
      "data-ocid": dataOcid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3.5 w-3.5" }),
        label
      ]
    }
  );
}
const __vite_import_meta_env__ = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": false };
const DEFAULT_SHARE_IMAGE = "https://richardhery.com/mintlab-link-preview.png";
function envString(key) {
  const value = __vite_import_meta_env__[key];
  return value && value !== "undefined" ? value : void 0;
}
function envSharePreviewOrigin() {
  return envString("VITE_SHARE_PREVIEW_ORIGIN");
}
function envBackendCanisterId() {
  for (const key of [
    "VITE_BACKEND_CANISTER_ID",
    "VITE_CANISTER_ID_BACKEND",
    "CANISTER_ID_BACKEND"
  ]) {
    const value = envString(key);
    if (value) return value;
  }
  return void 0;
}
function appOrigin() {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return "";
}
function sharePreviewOrigin() {
  const configured = envSharePreviewOrigin();
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  const backendId = envBackendCanisterId();
  if (backendId) {
    return `https://${backendId}.raw.icp0.io`;
  }
  return appOrigin();
}
function appPageUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${appOrigin()}${normalized}`;
}
function listingSharePath(listingId) {
  return `/marketplace/listing/${listingId.toString()}`;
}
function listingShareUrl(listingId) {
  return `${sharePreviewOrigin()}${listingSharePath(listingId)}`;
}
function nftSharePath(collectionId, tokenId) {
  const encodedTokenId = encodeURIComponent(tokenId);
  return `/nft/${collectionId.toString()}/${encodedTokenId}`;
}
function nftShareUrl(collectionId, tokenId) {
  return `${sharePreviewOrigin()}${nftSharePath(collectionId, tokenId)}`;
}
export {
  DEFAULT_SHARE_IMAGE as D,
  ShareLinkButton as S,
  appPageUrl as a,
  listingShareUrl as b,
  copyTextToClipboard as c,
  nftSharePath as d,
  listingSharePath as l,
  nftShareUrl as n
};
