import { c as createLucideIcon, j as jsxRuntimeExports, i as LoadingSpinner, r as reactExports, a as cn, B as Button, X } from "./index-99MVlzyu.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./index-CZdQSH2O.js";
import { M as MediaImage } from "./MediaImage-BXyAjG5I.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./index-NhX6xnRw.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "m21 3-7 7", key: "1l2asr" }],
  ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
  ["path", { d: "M9 21H3v-6", key: "wtvkvv" }]
];
const Maximize2 = createLucideIcon("maximize-2", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
      key: "vktsd0"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
];
const Tag = createLucideIcon("tag", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
  ["line", { x1: "11", x2: "11", y1: "8", y2: "14", key: "1vmskp" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
];
const ZoomIn = createLucideIcon("zoom-in", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
];
const ZoomOut = createLucideIcon("zoom-out", __iconNode);
function PaymentConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  lines,
  confirmLabel = "Confirm Payment",
  isPending = false,
  onConfirm,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-border", "data-ocid": ocid, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-sm", children: lines.map((line) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start justify-between gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            line.label,
            line.helper && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] leading-snug text-muted-foreground/80", children: line.helper })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground text-right", children: line.value })
        ]
      },
      line.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "border-border", disabled: isPending, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AlertDialogAction,
        {
          className: "bg-accent text-accent-foreground hover:bg-accent/90",
          disabled: isPending,
          onClick: onConfirm,
          children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : confirmLabel
        }
      )
    ] })
  ] }) });
}
const MIN_SCALE = 1;
const MAX_SCALE = 6;
const SCALE_STEP = 0.35;
function clampScale(value) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}
function pointFromEvent(event) {
  return { x: event.clientX, y: event.clientY };
}
function distanceBetween(first, second) {
  const dx = first.x - second.x;
  const dy = first.y - second.y;
  return Math.sqrt(dx * dx + dy * dy);
}
function ZoomableMediaImage({
  src,
  alt,
  assetCanisterId,
  tokenId,
  preferThumbnail,
  fallback,
  buttonClassName,
  viewerTitle,
  dataOcid,
  className,
  ...imageProps
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [scale, setScale] = reactExports.useState(MIN_SCALE);
  const [pan, setPan] = reactExports.useState({ x: 0, y: 0 });
  const activePointers = reactExports.useRef(/* @__PURE__ */ new Map());
  const dragStart = reactExports.useRef(null);
  const pinchStart = reactExports.useRef(null);
  const panRef = reactExports.useRef(pan);
  const resetKey = open ? `${src ?? ""}|${assetCanisterId ?? ""}|${tokenId ?? ""}` : "";
  reactExports.useEffect(() => {
    panRef.current = pan;
  }, [pan]);
  reactExports.useEffect(() => {
    if (!resetKey) return;
    setScale(MIN_SCALE);
    setPan({ x: 0, y: 0 });
    activePointers.current.clear();
    dragStart.current = null;
    pinchStart.current = null;
  }, [resetKey]);
  function resetView() {
    setScale(MIN_SCALE);
    setPan({ x: 0, y: 0 });
    activePointers.current.clear();
    dragStart.current = null;
    pinchStart.current = null;
  }
  function updateScale(nextScale) {
    const clamped = clampScale(nextScale);
    setScale(clamped);
    if (clamped <= MIN_SCALE) {
      setPan({ x: 0, y: 0 });
    }
  }
  function zoomBy(amount) {
    setScale((current) => {
      const next = clampScale(current + amount);
      if (next <= MIN_SCALE) setPan({ x: 0, y: 0 });
      return next;
    });
  }
  function handleWheel(event) {
    event.preventDefault();
    zoomBy(event.deltaY < 0 ? SCALE_STEP : -SCALE_STEP);
  }
  function handleDoubleClick() {
    if (scale > MIN_SCALE) {
      resetView();
      return;
    }
    updateScale(2.25);
  }
  function handlePointerDown(event) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointFromEvent(event);
    activePointers.current.set(event.pointerId, point);
    const points = Array.from(activePointers.current.values());
    if (points.length >= 2) {
      pinchStart.current = {
        distance: distanceBetween(points[0], points[1]),
        scale
      };
      dragStart.current = null;
      return;
    }
    if (scale > MIN_SCALE) {
      dragStart.current = { point, pan: panRef.current };
    }
  }
  function handlePointerMove(event) {
    if (!activePointers.current.has(event.pointerId)) return;
    const point = pointFromEvent(event);
    activePointers.current.set(event.pointerId, point);
    const points = Array.from(activePointers.current.values());
    if (points.length >= 2 && pinchStart.current) {
      const currentDistance = distanceBetween(points[0], points[1]);
      const ratio = currentDistance / pinchStart.current.distance;
      updateScale(pinchStart.current.scale * ratio);
      return;
    }
    if (!dragStart.current || scale <= MIN_SCALE) return;
    setPan({
      x: dragStart.current.pan.x + point.x - dragStart.current.point.x,
      y: dragStart.current.pan.y + point.y - dragStart.current.point.y
    });
  }
  function handlePointerUp(event) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    activePointers.current.delete(event.pointerId);
    if (activePointers.current.size < 2) {
      pinchStart.current = null;
    }
    if (activePointers.current.size === 1 && scale > MIN_SCALE) {
      const remainingPoint = Array.from(activePointers.current.values())[0];
      dragStart.current = {
        point: remainingPoint,
        pan: panRef.current
      };
    } else {
      dragStart.current = null;
    }
  }
  const transformStyle = {
    transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
    transformOrigin: "center center"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: cn(
          "group relative block overflow-hidden border-0 bg-transparent p-0 text-left",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          buttonClassName
        ),
        onClick: (event) => {
          event.stopPropagation();
          setOpen(true);
        },
        "aria-label": `Open ${alt} full screen`,
        "data-ocid": dataOcid,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MediaImage,
            {
              src,
              alt,
              assetCanisterId,
              tokenId,
              preferThumbnail,
              fallback,
              className,
              ...imageProps
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute bottom-2 right-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/85 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "h-4 w-4", "aria-hidden": "true" }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        showCloseButton: false,
        className: "z-[70] flex h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden border-border bg-background/95 p-0 shadow-2xl sm:max-w-none",
        "data-ocid": `${dataOcid ?? "nft.image"}.viewer_dialog`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 border-b border-border bg-card/95 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "min-w-0 flex-1 gap-0 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "truncate font-display text-sm text-foreground", children: viewerTitle ?? alt }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "icon",
                  variant: "outline",
                  className: "h-8 w-8",
                  onClick: () => zoomBy(-SCALE_STEP),
                  disabled: scale <= MIN_SCALE,
                  "aria-label": "Zoom out",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomOut, { className: "h-4 w-4", "aria-hidden": "true" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "icon",
                  variant: "outline",
                  className: "h-8 w-8",
                  onClick: () => zoomBy(SCALE_STEP),
                  disabled: scale >= MAX_SCALE,
                  "aria-label": "Zoom in",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "h-4 w-4", "aria-hidden": "true" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "icon",
                  variant: "outline",
                  className: "h-8 w-8",
                  onClick: resetView,
                  "aria-label": "Reset zoom",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4", "aria-hidden": "true" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "icon",
                  variant: "ghost",
                  className: "h-8 w-8",
                  onClick: () => setOpen(false),
                  "aria-label": "Close image viewer",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4", "aria-hidden": "true" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative min-h-0 flex-1 overflow-hidden bg-black/90",
              style: { touchAction: "none" },
              onWheel: handleWheel,
              onDoubleClick: handleDoubleClick,
              onPointerDown: handlePointerDown,
              onPointerMove: handlePointerMove,
              onPointerUp: handlePointerUp,
              onPointerCancel: handlePointerUp,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "absolute top-3 right-3 z-20 h-9 w-9 rounded-full border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur-sm hover:bg-black/85 hover:text-white focus-visible:ring-white/70",
                    onPointerDown: (event) => event.stopPropagation(),
                    onClick: (event) => {
                      event.stopPropagation();
                      setOpen(false);
                    },
                    "aria-label": "Close expanded image",
                    "data-ocid": `${dataOcid ?? "nft.image"}.viewer_close_button`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4", "aria-hidden": "true" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MediaImage,
                  {
                    src,
                    alt,
                    assetCanisterId,
                    tokenId,
                    preferThumbnail,
                    fallback,
                    draggable: false,
                    className: cn(
                      "h-full w-full select-none object-contain will-change-transform",
                      scale > MIN_SCALE ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
                    ),
                    style: transformStyle
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm", children: [
                  Math.round(scale * 100),
                  "%"
                ] })
              ]
            }
          )
        ]
      }
    ) })
  ] });
}
export {
  PaymentConfirmationDialog as P,
  Tag as T,
  ZoomableMediaImage as Z
};
