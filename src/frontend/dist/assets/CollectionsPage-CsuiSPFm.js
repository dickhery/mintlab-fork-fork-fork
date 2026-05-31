import { r as reactExports, n as useComposedRefs, j as jsxRuntimeExports, i as Primitive, q as Presence, l as createContextScope, k as composeEventHandlers, p as useCallbackRef, I as useLayoutEffect2, a as cn, b as useBackend, u as useAuth, d as useAdmin, e as useQueryClient, f as useQuery, J as AnimatePresence, m as motion, B as Button, g as ue, K as CircleDollarSign, X, M as Grid3x3, P as Principal, T as TermsAgreementNotice, t as LoadingSpinner } from "./index-BRQzfS48.js";
import { A as AppCanisterTopUpDialog, i as isLowCyclesError, L as LoaderCircle, P as Plus } from "./AppCanisterTopUpDialog-7nGNo5D6.js";
import { r as recommendedCollectionCreationTopUpCycles, S as Switch, C as CollectionCreationDiagnosticsPanel, T as Trash2 } from "./switch-D74UKO-m.js";
import { c as collectionMetaMap, a as collectionTrustStatus, i as isMintlabVerifiedCollection, C as COMMUNITY_COLLECTION_NOTICE, T as Tag, P as PaymentConfirmationDialog, F as Flag, b as collectionTrustLabel, d as collectionTrustDescription, e as collectionTrustBadgeClass, D as DividendBalanceBadge, Z as ZoomableMediaImage } from "./ZoomableMediaImage-DAWJ9axu.js";
import { E as EmptyState, a as getNFTTokenLabel, g as getNFTDisplayName, c as getNFTVisibleAttributes, M as MediaImage, b as getNFTDisplayTokenId } from "./nft-display-RiwTJD0W.js";
import { H as HelpCallout, a as HelpTooltip } from "./HelpCallout-CEdy3SaW.js";
import { B as Badge } from "./badge-CAQTzjT8.js";
import { S as Skeleton, C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./skeleton-DTNcXC1h.js";
import { u as useMutation, R as RefreshCw, L as Label, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./index-Cj-qz8fT.js";
import { I as Input } from "./input-CL8teu4y.js";
import { u as useDirection } from "./index-CrXfphKL.js";
import { f as clamp, L as Layers, E as ExternalLink, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, T as Textarea, I as Info, C as Check } from "./textarea-BRcMLthH.js";
import { S as Sparkles, u as useInfiniteQuery, c as compressModerationImage } from "./imageUtils-BQwOAm6j.js";
import { r as resolveImageUrl, I as ImageOff } from "./media-C3Z_66Ob.js";
import { A as ArrowLeft } from "./arrow-left-CbxeoPHH.js";
import { C as Copy } from "./copy-CheQflEX.js";
import { S as Search } from "./search-CirJCN1T.js";
import { S as ShieldCheck } from "./shield-check-Bsi1yGgc.js";
import "./icp-BXjZNIYq.js";
import "./arrow-right-DO-eoWHP.js";
function useStateMachine(initialState, machine) {
  return reactExports.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}
var SCROLL_AREA_NAME = "ScrollArea";
var [createScrollAreaContext] = createContextScope(SCROLL_AREA_NAME);
var [ScrollAreaProvider, useScrollAreaContext] = createScrollAreaContext(SCROLL_AREA_NAME);
var ScrollArea$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeScrollArea,
      type = "hover",
      dir,
      scrollHideDelay = 600,
      ...scrollAreaProps
    } = props;
    const [scrollArea, setScrollArea] = reactExports.useState(null);
    const [viewport, setViewport] = reactExports.useState(null);
    const [content, setContent] = reactExports.useState(null);
    const [scrollbarX, setScrollbarX] = reactExports.useState(null);
    const [scrollbarY, setScrollbarY] = reactExports.useState(null);
    const [cornerWidth, setCornerWidth] = reactExports.useState(0);
    const [cornerHeight, setCornerHeight] = reactExports.useState(0);
    const [scrollbarXEnabled, setScrollbarXEnabled] = reactExports.useState(false);
    const [scrollbarYEnabled, setScrollbarYEnabled] = reactExports.useState(false);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setScrollArea(node));
    const direction = useDirection(dir);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaProvider,
      {
        scope: __scopeScrollArea,
        type,
        dir: direction,
        scrollHideDelay,
        scrollArea,
        viewport,
        onViewportChange: setViewport,
        content,
        onContentChange: setContent,
        scrollbarX,
        onScrollbarXChange: setScrollbarX,
        scrollbarXEnabled,
        onScrollbarXEnabledChange: setScrollbarXEnabled,
        scrollbarY,
        onScrollbarYChange: setScrollbarY,
        scrollbarYEnabled,
        onScrollbarYEnabledChange: setScrollbarYEnabled,
        onCornerWidthChange: setCornerWidth,
        onCornerHeightChange: setCornerHeight,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            ...scrollAreaProps,
            ref: composedRefs,
            style: {
              position: "relative",
              // Pass corner sizes as CSS vars to reduce re-renders of context consumers
              ["--radix-scroll-area-corner-width"]: cornerWidth + "px",
              ["--radix-scroll-area-corner-height"]: cornerHeight + "px",
              ...props.style
            }
          }
        )
      }
    );
  }
);
ScrollArea$1.displayName = SCROLL_AREA_NAME;
var VIEWPORT_NAME = "ScrollAreaViewport";
var ScrollAreaViewport = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, children, nonce, ...viewportProps } = props;
    const context = useScrollAreaContext(VIEWPORT_NAME, __scopeScrollArea);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`
          },
          nonce
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-radix-scroll-area-viewport": "",
          ...viewportProps,
          ref: composedRefs,
          style: {
            /**
             * We don't support `visible` because the intention is to have at least one scrollbar
             * if this component is used and `visible` will behave like `auto` in that case
             * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#description
             *
             * We don't handle `auto` because the intention is for the native implementation
             * to be hidden if using this component. We just want to ensure the node is scrollable
             * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
             * the browser from having to work out whether to render native scrollbars or not,
             * we tell it to with the intention of hiding them in CSS.
             */
            overflowX: context.scrollbarXEnabled ? "scroll" : "hidden",
            overflowY: context.scrollbarYEnabled ? "scroll" : "hidden",
            ...props.style
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: context.onContentChange, style: { minWidth: "100%", display: "table" }, children })
        }
      )
    ] });
  }
);
ScrollAreaViewport.displayName = VIEWPORT_NAME;
var SCROLLBAR_NAME = "ScrollAreaScrollbar";
var ScrollAreaScrollbar = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
    const isHorizontal = props.orientation === "horizontal";
    reactExports.useEffect(() => {
      isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
      return () => {
        isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
      };
    }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);
    return context.type === "hover" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarHover, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "scroll" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarScroll, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "auto" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarAuto, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "always" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarVisible, { ...scrollbarProps, ref: forwardedRef }) : null;
  }
);
ScrollAreaScrollbar.displayName = SCROLLBAR_NAME;
var ScrollAreaScrollbarHover = reactExports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const scrollArea = context.scrollArea;
    let hideTimer = 0;
    if (scrollArea) {
      const handlePointerEnter = () => {
        window.clearTimeout(hideTimer);
        setVisible(true);
      };
      const handlePointerLeave = () => {
        hideTimer = window.setTimeout(() => setVisible(false), context.scrollHideDelay);
      };
      scrollArea.addEventListener("pointerenter", handlePointerEnter);
      scrollArea.addEventListener("pointerleave", handlePointerLeave);
      return () => {
        window.clearTimeout(hideTimer);
        scrollArea.removeEventListener("pointerenter", handlePointerEnter);
        scrollArea.removeEventListener("pointerleave", handlePointerLeave);
      };
    }
  }, [context.scrollArea, context.scrollHideDelay]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarAuto,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarScroll = reactExports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const isHorizontal = props.orientation === "horizontal";
  const debounceScrollEnd = useDebounceCallback(() => send("SCROLL_END"), 100);
  const [state, send] = useStateMachine("hidden", {
    hidden: {
      SCROLL: "scrolling"
    },
    scrolling: {
      SCROLL_END: "idle",
      POINTER_ENTER: "interacting"
    },
    interacting: {
      SCROLL: "interacting",
      POINTER_LEAVE: "idle"
    },
    idle: {
      HIDE: "hidden",
      SCROLL: "scrolling",
      POINTER_ENTER: "interacting"
    }
  });
  reactExports.useEffect(() => {
    if (state === "idle") {
      const hideTimer = window.setTimeout(() => send("HIDE"), context.scrollHideDelay);
      return () => window.clearTimeout(hideTimer);
    }
  }, [state, context.scrollHideDelay, send]);
  reactExports.useEffect(() => {
    const viewport = context.viewport;
    const scrollDirection = isHorizontal ? "scrollLeft" : "scrollTop";
    if (viewport) {
      let prevScrollPos = viewport[scrollDirection];
      const handleScroll = () => {
        const scrollPos = viewport[scrollDirection];
        const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
        if (hasScrollInDirectionChanged) {
          send("SCROLL");
          debounceScrollEnd();
        }
        prevScrollPos = scrollPos;
      };
      viewport.addEventListener("scroll", handleScroll);
      return () => viewport.removeEventListener("scroll", handleScroll);
    }
  }, [context.viewport, isHorizontal, send, debounceScrollEnd]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || state !== "hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarVisible,
    {
      "data-state": state === "hidden" ? "hidden" : "visible",
      ...scrollbarProps,
      ref: forwardedRef,
      onPointerEnter: composeEventHandlers(props.onPointerEnter, () => send("POINTER_ENTER")),
      onPointerLeave: composeEventHandlers(props.onPointerLeave, () => send("POINTER_LEAVE"))
    }
  ) });
});
var ScrollAreaScrollbarAuto = reactExports.forwardRef((props, forwardedRef) => {
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const { forceMount, ...scrollbarProps } = props;
  const [visible, setVisible] = reactExports.useState(false);
  const isHorizontal = props.orientation === "horizontal";
  const handleResize = useDebounceCallback(() => {
    if (context.viewport) {
      const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
      const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
      setVisible(isHorizontal ? isOverflowX : isOverflowY);
    }
  }, 10);
  useResizeObserver(context.viewport, handleResize);
  useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarVisible,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarVisible = reactExports.forwardRef((props, forwardedRef) => {
  const { orientation = "vertical", ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const thumbRef = reactExports.useRef(null);
  const pointerOffsetRef = reactExports.useRef(0);
  const [sizes, setSizes] = reactExports.useState({
    content: 0,
    viewport: 0,
    scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 }
  });
  const thumbRatio = getThumbRatio(sizes.viewport, sizes.content);
  const commonProps = {
    ...scrollbarProps,
    sizes,
    onSizesChange: setSizes,
    hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
    onThumbChange: (thumb) => thumbRef.current = thumb,
    onThumbPointerUp: () => pointerOffsetRef.current = 0,
    onThumbPointerDown: (pointerPos) => pointerOffsetRef.current = pointerPos
  };
  function getScrollPosition(pointerPos, dir) {
    return getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes, dir);
  }
  if (orientation === "horizontal") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarX,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollLeft;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes, context.dir);
            thumbRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollLeft = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) {
            context.viewport.scrollLeft = getScrollPosition(pointerPos, context.dir);
          }
        }
      }
    );
  }
  if (orientation === "vertical") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarY,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollTop;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes);
            thumbRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollTop = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) context.viewport.scrollTop = getScrollPosition(pointerPos);
        }
      }
    );
  }
  return null;
});
var ScrollAreaScrollbarX = reactExports.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = reactExports.useState();
  const ref = reactExports.useRef(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarXChange);
  reactExports.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "horizontal",
      ...scrollbarProps,
      ref: composeRefs,
      sizes,
      style: {
        bottom: 0,
        left: context.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
        right: context.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
        ["--radix-scroll-area-thumb-width"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.x),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.x),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollLeft + event.deltaX;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollWidth,
            viewport: context.viewport.offsetWidth,
            scrollbar: {
              size: ref.current.clientWidth,
              paddingStart: toInt(computedStyle.paddingLeft),
              paddingEnd: toInt(computedStyle.paddingRight)
            }
          });
        }
      }
    }
  );
});
var ScrollAreaScrollbarY = reactExports.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = reactExports.useState();
  const ref = reactExports.useRef(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarYChange);
  reactExports.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "vertical",
      ...scrollbarProps,
      ref: composeRefs,
      sizes,
      style: {
        top: 0,
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: "var(--radix-scroll-area-corner-height)",
        ["--radix-scroll-area-thumb-height"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.y),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.y),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollTop + event.deltaY;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollHeight,
            viewport: context.viewport.offsetHeight,
            scrollbar: {
              size: ref.current.clientHeight,
              paddingStart: toInt(computedStyle.paddingTop),
              paddingEnd: toInt(computedStyle.paddingBottom)
            }
          });
        }
      }
    }
  );
});
var [ScrollbarProvider, useScrollbarContext] = createScrollAreaContext(SCROLLBAR_NAME);
var ScrollAreaScrollbarImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeScrollArea,
    sizes,
    hasThumb,
    onThumbChange,
    onThumbPointerUp,
    onThumbPointerDown,
    onThumbPositionChange,
    onDragScroll,
    onWheelScroll,
    onResize,
    ...scrollbarProps
  } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, __scopeScrollArea);
  const [scrollbar, setScrollbar] = reactExports.useState(null);
  const composeRefs = useComposedRefs(forwardedRef, (node) => setScrollbar(node));
  const rectRef = reactExports.useRef(null);
  const prevWebkitUserSelectRef = reactExports.useRef("");
  const viewport = context.viewport;
  const maxScrollPos = sizes.content - sizes.viewport;
  const handleWheelScroll = useCallbackRef(onWheelScroll);
  const handleThumbPositionChange = useCallbackRef(onThumbPositionChange);
  const handleResize = useDebounceCallback(onResize, 10);
  function handleDragScroll(event) {
    if (rectRef.current) {
      const x = event.clientX - rectRef.current.left;
      const y = event.clientY - rectRef.current.top;
      onDragScroll({ x, y });
    }
  }
  reactExports.useEffect(() => {
    const handleWheel = (event) => {
      const element = event.target;
      const isScrollbarWheel = scrollbar == null ? void 0 : scrollbar.contains(element);
      if (isScrollbarWheel) handleWheelScroll(event, maxScrollPos);
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel, { passive: false });
  }, [viewport, scrollbar, maxScrollPos, handleWheelScroll]);
  reactExports.useEffect(handleThumbPositionChange, [sizes, handleThumbPositionChange]);
  useResizeObserver(scrollbar, handleResize);
  useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollbarProvider,
    {
      scope: __scopeScrollArea,
      scrollbar,
      hasThumb,
      onThumbChange: useCallbackRef(onThumbChange),
      onThumbPointerUp: useCallbackRef(onThumbPointerUp),
      onThumbPositionChange: handleThumbPositionChange,
      onThumbPointerDown: useCallbackRef(onThumbPointerDown),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          ...scrollbarProps,
          ref: composeRefs,
          style: { position: "absolute", ...scrollbarProps.style },
          onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
            const mainPointer = 0;
            if (event.button === mainPointer) {
              const element = event.target;
              element.setPointerCapture(event.pointerId);
              rectRef.current = scrollbar.getBoundingClientRect();
              prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
              document.body.style.webkitUserSelect = "none";
              if (context.viewport) context.viewport.style.scrollBehavior = "auto";
              handleDragScroll(event);
            }
          }),
          onPointerMove: composeEventHandlers(props.onPointerMove, handleDragScroll),
          onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
            const element = event.target;
            if (element.hasPointerCapture(event.pointerId)) {
              element.releasePointerCapture(event.pointerId);
            }
            document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
            if (context.viewport) context.viewport.style.scrollBehavior = "";
            rectRef.current = null;
          })
        }
      )
    }
  );
});
var THUMB_NAME = "ScrollAreaThumb";
var ScrollAreaThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...thumbProps } = props;
    const scrollbarContext = useScrollbarContext(THUMB_NAME, props.__scopeScrollArea);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || scrollbarContext.hasThumb, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumbImpl, { ref: forwardedRef, ...thumbProps }) });
  }
);
var ScrollAreaThumbImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, style, ...thumbProps } = props;
    const scrollAreaContext = useScrollAreaContext(THUMB_NAME, __scopeScrollArea);
    const scrollbarContext = useScrollbarContext(THUMB_NAME, __scopeScrollArea);
    const { onThumbPositionChange } = scrollbarContext;
    const composedRef = useComposedRefs(
      forwardedRef,
      (node) => scrollbarContext.onThumbChange(node)
    );
    const removeUnlinkedScrollListenerRef = reactExports.useRef(void 0);
    const debounceScrollEnd = useDebounceCallback(() => {
      if (removeUnlinkedScrollListenerRef.current) {
        removeUnlinkedScrollListenerRef.current();
        removeUnlinkedScrollListenerRef.current = void 0;
      }
    }, 100);
    reactExports.useEffect(() => {
      const viewport = scrollAreaContext.viewport;
      if (viewport) {
        const handleScroll = () => {
          debounceScrollEnd();
          if (!removeUnlinkedScrollListenerRef.current) {
            const listener = addUnlinkedScrollListener(viewport, onThumbPositionChange);
            removeUnlinkedScrollListenerRef.current = listener;
            onThumbPositionChange();
          }
        };
        onThumbPositionChange();
        viewport.addEventListener("scroll", handleScroll);
        return () => viewport.removeEventListener("scroll", handleScroll);
      }
    }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": scrollbarContext.hasThumb ? "visible" : "hidden",
        ...thumbProps,
        ref: composedRef,
        style: {
          width: "var(--radix-scroll-area-thumb-width)",
          height: "var(--radix-scroll-area-thumb-height)",
          ...style
        },
        onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, (event) => {
          const thumb = event.target;
          const thumbRect = thumb.getBoundingClientRect();
          const x = event.clientX - thumbRect.left;
          const y = event.clientY - thumbRect.top;
          scrollbarContext.onThumbPointerDown({ x, y });
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, scrollbarContext.onThumbPointerUp)
      }
    );
  }
);
ScrollAreaThumb.displayName = THUMB_NAME;
var CORNER_NAME = "ScrollAreaCorner";
var ScrollAreaCorner = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useScrollAreaContext(CORNER_NAME, props.__scopeScrollArea);
    const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
    const hasCorner = context.type !== "scroll" && hasBothScrollbarsVisible;
    return hasCorner ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaCornerImpl, { ...props, ref: forwardedRef }) : null;
  }
);
ScrollAreaCorner.displayName = CORNER_NAME;
var ScrollAreaCornerImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeScrollArea, ...cornerProps } = props;
  const context = useScrollAreaContext(CORNER_NAME, __scopeScrollArea);
  const [width, setWidth] = reactExports.useState(0);
  const [height, setHeight] = reactExports.useState(0);
  const hasSize = Boolean(width && height);
  useResizeObserver(context.scrollbarX, () => {
    var _a;
    const height2 = ((_a = context.scrollbarX) == null ? void 0 : _a.offsetHeight) || 0;
    context.onCornerHeightChange(height2);
    setHeight(height2);
  });
  useResizeObserver(context.scrollbarY, () => {
    var _a;
    const width2 = ((_a = context.scrollbarY) == null ? void 0 : _a.offsetWidth) || 0;
    context.onCornerWidthChange(width2);
    setWidth(width2);
  });
  return hasSize ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      ...cornerProps,
      ref: forwardedRef,
      style: {
        width,
        height,
        position: "absolute",
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: 0,
        ...props.style
      }
    }
  ) : null;
});
function toInt(value) {
  return value ? parseInt(value, 10) : 0;
}
function getThumbRatio(viewportSize, contentSize) {
  const ratio = viewportSize / contentSize;
  return isNaN(ratio) ? 0 : ratio;
}
function getThumbSize(sizes) {
  const ratio = getThumbRatio(sizes.viewport, sizes.content);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
  return Math.max(thumbSize, 18);
}
function getScrollPositionFromPointer(pointerPos, pointerOffset, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const thumbCenter = thumbSizePx / 2;
  const offset = pointerOffset || thumbCenter;
  const thumbOffsetFromEnd = thumbSizePx - offset;
  const minPointerPos = sizes.scrollbar.paddingStart + offset;
  const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
  const maxScrollPos = sizes.content - sizes.viewport;
  const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const interpolate = linearScale([minPointerPos, maxPointerPos], scrollRange);
  return interpolate(pointerPos);
}
function getThumbOffsetFromScroll(scrollPos, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const scrollbar = sizes.scrollbar.size - scrollbarPadding;
  const maxScrollPos = sizes.content - sizes.viewport;
  const maxThumbPos = scrollbar - thumbSizePx;
  const scrollClampRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const scrollWithoutMomentum = clamp(scrollPos, scrollClampRange);
  const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
  return interpolate(scrollWithoutMomentum);
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
  return scrollPos > 0 && scrollPos < maxScrollPos;
}
var addUnlinkedScrollListener = (node, handler = () => {
}) => {
  let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
  let rAF = 0;
  (function loop() {
    const position = { left: node.scrollLeft, top: node.scrollTop };
    const isHorizontalScroll = prevPosition.left !== position.left;
    const isVerticalScroll = prevPosition.top !== position.top;
    if (isHorizontalScroll || isVerticalScroll) handler();
    prevPosition = position;
    rAF = window.requestAnimationFrame(loop);
  })();
  return () => window.cancelAnimationFrame(rAF);
};
function useDebounceCallback(callback, delay) {
  const handleCallback = useCallbackRef(callback);
  const debounceTimerRef = reactExports.useRef(0);
  reactExports.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
  return reactExports.useCallback(() => {
    window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(handleCallback, delay);
  }, [handleCallback, delay]);
}
function useResizeObserver(element, onResize) {
  const handleResize = useCallbackRef(onResize);
  useLayoutEffect2(() => {
    let rAF = 0;
    if (element) {
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}
var Root = ScrollArea$1;
var Viewport = ScrollAreaViewport;
var Corner = ScrollAreaCorner;
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    }
  );
}
function standardLabel(standard) {
  if (standard.__kind__ === "EXT") return "EXT";
  if (standard.__kind__ === "DIP721") return "DIP721";
  if (standard.__kind__ === "ICRC7") return "ICRC-7";
  return standard.Other ?? "Other";
}
function nftKey(collectionId, tokenId) {
  return `${collectionId.toString()}:${tokenId}`;
}
const E8S = 100000000n;
const MAX_ON_CHAIN_IMAGE_CHARS = 19e5;
const MODERATION_IMAGE_ACCEPT = "image/png,image/jpeg";
const COLLECTION_CREATION_REPAIR_GRACE_MS = 3 * 60 * 1e3;
const ON_CHAIN_IMAGE_SIZE_MESSAGE = "Uploaded image is too large for on-chain storage";
const COLLECTIONS_PAGE_SIZE = 50n;
const COLLECTIONS_LISTING_PAGE_SIZE = 25n;
const DEFAULT_COLLECTION_NFT_PAGE_SIZE = 24n;
const RICH_COLLECTION_NFT_PAGE_SIZE = 8n;
function formatICP(e8s) {
  const whole = e8s / E8S;
  const fraction = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}
function formatCycles(cycles) {
  const trillion = 1000000000000n;
  if (cycles < trillion) return cycles.toString();
  const hundredths = cycles * 100n / trillion;
  const whole = hundredths / 100n;
  const fraction = (hundredths % 100n).toString().padStart(2, "0");
  return `${whole}.${fraction}T`;
}
function isRepairableCollectionCreationRequest(request) {
  if (request.status === "Installed") return false;
  if (request.status === "Failed" || request.lastError) return true;
  const updatedAtMs = Number(request.updatedAt / 1000000n);
  return Date.now() - updatedAtMs > COLLECTION_CREATION_REPAIR_GRACE_MS;
}
function accountIdToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function makeStandard(value) {
  if (value === "EXT") return { __kind__: "EXT", EXT: null };
  if (value === "DIP721") return { __kind__: "DIP721", DIP721: null };
  return { __kind__: "ICRC7", ICRC7: null };
}
function collectionNFTPageSize(collection) {
  if (collection.kind === "Minted" || collection.standard.__kind__ === "ICRC7") {
    return RICH_COLLECTION_NFT_PAGE_SIZE;
  }
  return DEFAULT_COLLECTION_NFT_PAGE_SIZE;
}
function parseOptionalNat(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) {
    throw new Error("Enter whole numbers only for browse settings");
  }
  return BigInt(trimmed);
}
function parseCyclesInput(value) {
  const trimmed = value.trim().replace(/_/g, "");
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return null;
  return BigInt(trimmed);
}
function buildBrowseInfo(_standard, totalSupply, tokenIndexOffset) {
  const parsedTotalSupply = parseOptionalNat(totalSupply);
  const parsedTokenIndexOffset = parseOptionalNat(tokenIndexOffset);
  if (parsedTotalSupply == null && parsedTokenIndexOffset == null) {
    return null;
  }
  return {
    totalSupply: parsedTotalSupply,
    tokenIndexOffset: parsedTokenIndexOffset
  };
}
function browseCoverageLabel(stats) {
  if (stats.coverage === "Full") {
    return `${stats.totalCount.toString()} NFT${stats.totalCount === 1n ? "" : "s"}`;
  }
  return `${stats.visibleCount.toString()} indexed`;
}
function isValidPrincipal(value) {
  try {
    Principal.fromText(value);
    return true;
  } catch {
    return false;
  }
}
function extractError(err) {
  if (err instanceof Error) return err.message || "Something went wrong";
  if (typeof err === "string") return err;
  return "Something went wrong";
}
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read image file"));
      }
    };
    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.readAsDataURL(file);
  });
}
async function readImageFileAsDataUrl(file, maxChars = MAX_ON_CHAIN_IMAGE_CHARS, sizeMessage = ON_CHAIN_IMAGE_SIZE_MESSAGE) {
  if (!isSupportedModerationImageFile(file)) {
    throw new Error("Choose a JPG or PNG image");
  }
  const dataUrl = await readFileAsDataUrl(file);
  if (dataUrl.length > maxChars) {
    throw new Error(sizeMessage);
  }
  return dataUrl;
}
function isSupportedModerationImageFile(file) {
  return file.type === "image/png" || file.type === "image/jpeg" || /\.(png|jpe?g)$/i.test(file.name);
}
function CopyField({ label, value, ocid }) {
  const [copied, setCopied] = reactExports.useState(false);
  function handleCopy() {
    void navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
    ue.success(`${label} copied`);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-muted/40 border border-border rounded-lg px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-foreground truncate flex-1 min-w-0", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "icon",
          variant: "ghost",
          className: "shrink-0 h-7 w-7 text-muted-foreground hover:text-foreground",
          onClick: handleCopy,
          "aria-label": `Copy ${label}`,
          "data-ocid": ocid,
          children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" })
        }
      )
    ] })
  ] });
}
const defaultImportValues = {
  name: "",
  symbol: "",
  description: "",
  canisterId: "",
  standard: "EXT",
  imageUrl: "",
  totalSupply: "",
  tokenIndexOffset: ""
};
function ImportCollectionCard({
  onImported
}) {
  const { actor } = useBackend();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [values, setValues] = reactExports.useState(defaultImportValues);
  const [imageDataUrl, setImageDataUrl] = reactExports.useState("");
  const [imageFileName, setImageFileName] = reactExports.useState("");
  const [imageFileInputKey, setImageFileInputKey] = reactExports.useState(0);
  const importMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      if (!isAuthenticated) throw new Error("Sign in to import a collection");
      if (!values.name.trim()) throw new Error("Collection name is required");
      if (!values.symbol.trim())
        throw new Error("Collection symbol is required");
      if (!values.description.trim())
        throw new Error("Collection description is required");
      if (!isValidPrincipal(values.canisterId.trim())) {
        throw new Error("Enter a valid collection canister ID");
      }
      const collectionImage = (imageDataUrl || values.imageUrl).trim();
      if (!collectionImage) {
        throw new Error("Upload a collection image or add an image URL");
      }
      if (collectionImage.length > MAX_ON_CHAIN_IMAGE_CHARS) {
        throw new Error("Collection image is too large for on-chain storage");
      }
      return actor.addCollection(
        values.name.trim(),
        values.description.trim(),
        Principal.fromText(values.canisterId.trim()),
        makeStandard(values.standard),
        collectionImage,
        values.symbol.trim().toUpperCase(),
        buildBrowseInfo(
          values.standard,
          values.totalSupply,
          values.tokenIndexOffset
        )
      );
    },
    onSuccess: (collection) => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      ue.success(
        `${collection.name} is now available to everyone in Mintlab`
      );
      setValues(defaultImportValues);
      setImageDataUrl("");
      setImageFileName("");
      setImageFileInputKey((current) => current + 1);
      onImported(collection);
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  function updateField(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
  }
  function updateImageUrl(value) {
    if (imageDataUrl) {
      setImageFileInputKey((current) => current + 1);
    }
    setImageDataUrl("");
    setImageFileName("");
    updateField("imageUrl", value);
  }
  async function handleImportImageFile(file) {
    if (!file) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      const compressed = await compressModerationImage(dataUrl);
      setImageDataUrl(compressed);
      setImageFileName(file.name);
      updateField("imageUrl", "");
    } catch (err) {
      ue.error(extractError(err));
    }
  }
  const selectedImage = imageDataUrl || values.imageUrl;
  const imagePreviewUrl = resolveImageUrl(selectedImage);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 text-accent" }),
        "Import an ICP NFT Collection"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-sm", children: "Add a supported collection from another ICP app or website. Once it is added, the collection appears in Mintlab for every user." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "What you need" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1", children: "Paste the collection canister ID, choose the NFT standard, and add the display details you want Mintlab to show. EXT, DIP721, and ICRC-7 collections are supported. Add the collection size when the collection does not provide a reliable token list." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "import-name", children: "Collection name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "import-name",
              value: values.name,
              onChange: (event) => updateField("name", event.target.value),
              placeholder: "e.g. Motoko Mugs",
              "data-ocid": "collections.import.name_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "import-symbol", children: "Symbol" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "import-symbol",
              value: values.symbol,
              onChange: (event) => updateField("symbol", event.target.value.toUpperCase()),
              placeholder: "e.g. MUG",
              "data-ocid": "collections.import.symbol_input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "import-description", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "import-description",
            rows: 3,
            value: values.description,
            onChange: (event) => updateField("description", event.target.value),
            placeholder: "Tell collectors what this collection is about…",
            "data-ocid": "collections.import.description_textarea"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "import-canister", children: "Collection canister ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "import-canister",
              className: "font-mono text-sm",
              value: values.canisterId,
              onChange: (event) => updateField("canisterId", event.target.value),
              placeholder: "ryjl3-tyaaa-aaaaa-aaaba-cai",
              "data-ocid": "collections.import.canister_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "import-standard", children: "NFT standard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: values.standard,
              onValueChange: (value) => updateField("standard", value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    id: "import-standard",
                    "data-ocid": "collections.import.standard_select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "EXT", children: "EXT" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "DIP721", children: "DIP721" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ICRC7", children: "ICRC-7" })
                ] })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "import-supply", children: "Collection size" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "import-supply",
              inputMode: "numeric",
              value: values.totalSupply,
              onChange: (event) => updateField("totalSupply", event.target.value),
              placeholder: "e.g. 1000",
              "data-ocid": "collections.import.total_supply_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Recommended when the collection does not provide a reliable token list." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "import-offset", children: "First token index" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "import-offset",
              inputMode: "numeric",
              value: values.tokenIndexOffset,
              onChange: (event) => updateField("tokenIndexOffset", event.target.value),
              placeholder: "Default: 0",
              "data-ocid": "collections.import.token_offset_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Use 1 if token IDs start at 1 instead of 0." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "import-image-file", children: "Collection image" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "import-image-file",
                type: "file",
                accept: MODERATION_IMAGE_ACCEPT,
                onChange: (event) => {
                  var _a;
                  return void handleImportImageFile(((_a = event.target.files) == null ? void 0 : _a[0]) ?? null);
                },
                "data-ocid": "collections.import.image_file_input"
              },
              imageFileInputKey
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: imageFileName || "Choose an image from this device" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "import-image",
                className: "text-xs text-muted-foreground",
                children: "Or image URL"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "import-image",
                value: values.imageUrl,
                onChange: (event) => updateImageUrl(event.target.value),
                placeholder: "https://… or ipfs://…",
                "data-ocid": "collections.import.image_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0", children: imagePreviewUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: imagePreviewUrl,
              alt: "Collection preview",
              className: "w-full h-full object-cover"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "w-5 h-5 text-muted-foreground" }) })
        ] })
      ] }),
      !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground", children: "Sign in with Internet Identity to import a collection into the shared Mintlab directory." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TermsAgreementNotice, { actionLabel: "adding this external collection" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => importMutation.mutate(),
          disabled: importMutation.isPending || !isAuthenticated,
          className: "gap-2",
          "data-ocid": "collections.import.submit_button",
          children: importMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
            "Importing…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Add Collection"
          ] })
        }
      ) })
    ] })
  ] });
}
function CreateCollectionCard({
  mintConfig,
  moderationConfig,
  onCreated
}) {
  const { actor } = useBackend();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = reactExports.useState("");
  const [symbol, setSymbol] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [imageDataUrl, setImageDataUrl] = reactExports.useState("");
  const [imageFileName, setImageFileName] = reactExports.useState("");
  const [dividendsEnabled, setDividendsEnabled] = reactExports.useState(false);
  const [confirmCreateOpen, setConfirmCreateOpen] = reactExports.useState(false);
  const [cycleTopUpReason, setCycleTopUpReason] = reactExports.useState(null);
  const { data: creationQuote } = useQuery({
    queryKey: [
      "collectionCreationQuote",
      (mintConfig == null ? void 0 : mintConfig.collectionCanisterCycles.toString()) ?? "none",
      (mintConfig == null ? void 0 : mintConfig.collectionCreationPriceE8s.toString()) ?? "none",
      (mintConfig == null ? void 0 : mintConfig.collectionCreationPrimaryPayoutBasisPoints.toString()) ?? "none",
      (mintConfig == null ? void 0 : mintConfig.collectionCreationSecondaryPayoutBasisPoints.toString()) ?? "none"
    ],
    queryFn: async () => {
      if (!actor || !mintConfig) return null;
      return actor.quoteCollectionCreationCost(
        mintConfig.collectionCanisterCycles,
        mintConfig.collectionCreationPriceE8s,
        mintConfig.collectionCreationPrimaryPayoutBasisPoints,
        mintConfig.collectionCreationSecondaryPayoutBasisPoints
      );
    },
    enabled: !!actor && !!mintConfig,
    staleTime: 6e4
  });
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      if (!isAuthenticated) throw new Error("Sign in to create a collection");
      if (!(mintConfig == null ? void 0 : mintConfig.collectionCreationEnabled)) {
        throw new Error("Collection creation is currently disabled");
      }
      if (!mintConfig.collectionCanisterWasmUploaded) {
        throw new Error("Collection canister creation is not ready yet");
      }
      if (!name.trim()) throw new Error("Collection name is required");
      if (!symbol.trim()) throw new Error("Collection symbol is required");
      if (!description.trim())
        throw new Error("Collection description is required");
      if (!imageDataUrl) throw new Error("Upload a collection image");
      const result = await actor.createUserCollection(
        name.trim(),
        description.trim(),
        symbol.trim().toUpperCase(),
        imageDataUrl,
        dividendsEnabled
      );
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (receipt) => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({
        queryKey: ["myCreatedCollections"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCreationRequests"]
      });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      ue.success(
        `${receipt.collection.name} created at ICP block ${receipt.paymentBlock.toString()}`
      );
      setName("");
      setSymbol("");
      setDescription("");
      setImageDataUrl("");
      setImageFileName("");
      setDividendsEnabled(false);
      onCreated(receipt.collection);
    },
    onError: (err) => {
      const message = extractError(err);
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCreationRequests"]
      });
      if (isLowCyclesError(message)) {
        setCycleTopUpReason(message);
        return;
      }
      ue.error(message);
    }
  });
  async function handleImageFile(file) {
    if (!file) {
      setImageDataUrl("");
      setImageFileName("");
      return;
    }
    try {
      const dataUrl = await readImageFileAsDataUrl(
        file,
        MAX_ON_CHAIN_IMAGE_CHARS,
        ON_CHAIN_IMAGE_SIZE_MESSAGE
      );
      const compressed = await compressModerationImage(dataUrl);
      setImageDataUrl(compressed);
      setImageFileName(file.name);
    } catch (err) {
      ue.error(extractError(err));
    }
  }
  function openCreateConfirmation() {
    try {
      if (!actor) throw new Error("Backend not connected");
      if (!isAuthenticated) throw new Error("Sign in to create a collection");
      if (!(mintConfig == null ? void 0 : mintConfig.collectionCreationEnabled)) {
        throw new Error("Collection creation is currently disabled");
      }
      if (!mintConfig.collectionCanisterWasmUploaded) {
        throw new Error("Collection canister creation is not ready yet");
      }
      if (!creationQuote) {
        throw new Error("Collection creation quote is still loading");
      }
      if (!name.trim()) throw new Error("Collection name is required");
      if (!symbol.trim()) throw new Error("Collection symbol is required");
      if (!description.trim())
        throw new Error("Collection description is required");
      if (!imageDataUrl) throw new Error("Upload a collection image");
      setConfirmCreateOpen(true);
    } catch (err) {
      ue.error(extractError(err));
    }
  }
  const collectionReview = {
    name: name.trim() || "Not set",
    symbol: symbol.trim().toUpperCase() || "Not set",
    description: description.trim() || "Not set",
    imageLabel: imageFileName || "Uploaded collection image",
    imagePreviewUrl: resolveImageUrl(imageDataUrl),
    standard: "ICRC-7",
    controllers: "You and Mintlab",
    dividendsLabel: dividendsEnabled ? "Enabled" : "Disabled",
    dividendsDetail: dividendsEnabled ? "A dedicated ICP dividend address will be created for this collection." : "No dedicated dividend account will be created. Choose Make Changes if you meant to enable dividends."
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-accent" }),
          "Create Your Mintlab Collection"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-sm", children: "Pay the admin-set collection fee from your in-app ICP balance, launch your own collection, then mint, list, and transfer NFTs however you want." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        !mintConfig ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground", children: "The admin has not configured collection creation yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm text-muted-foreground", children: [
          "Creation fee:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
            formatICP(mintConfig.collectionCreationPriceE8s),
            " ICP"
          ] }),
          ".",
          " ",
          creationQuote ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            formatICP(creationQuote.cycleCostE8s),
            " ICP is converted into",
            " ",
            formatCycles(creationQuote.totalCyclesToConvert),
            " cycles. Mintlab attaches those cycles to the IC canister creation call so the new collection canister receives about",
            " ",
            formatCycles(creationQuote.collectionCanisterCycles),
            " after the IC creation fee, and the remaining",
            " ",
            formatICP(creationQuote.adminPayoutE8s),
            " ICP is split across the configured payout account",
            creationQuote.adminSecondaryPayoutE8s > 0n ? "s" : "",
            ". Ledger fees bring the total debit to",
            " ",
            formatICP(creationQuote.totalUserDebitE8s),
            " ICP."
          ] }) : "Part of the fee is converted into cycles for the new collection canister and the remainder goes to the admin payout account."
        ] }),
        (moderationConfig == null ? void 0 : moderationConfig.enabled) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground", children: moderationConfig.userMessage }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "create-name", children: "Collection name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "create-name",
              value: name,
              onChange: (event) => setName(event.target.value),
              placeholder: "e.g. Studio Zero",
              "data-ocid": "collections.create.name_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "create-symbol", children: "Symbol" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "create-symbol",
                value: symbol,
                onChange: (event) => setSymbol(event.target.value.toUpperCase()),
                placeholder: "e.g. ST0",
                "data-ocid": "collections.create.symbol_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "create-image", children: "Collection image" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "create-image",
                type: "file",
                accept: MODERATION_IMAGE_ACCEPT,
                onChange: (event) => {
                  var _a;
                  return void handleImageFile(((_a = event.target.files) == null ? void 0 : _a[0]) ?? null);
                },
                "data-ocid": "collections.create.image_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: imageFileName || ((moderationConfig == null ? void 0 : moderationConfig.enabled) ? "Choose a JPG or PNG under about 1 MB" : "Choose an image from this device") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "create-description", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "create-description",
              rows: 3,
              value: description,
              onChange: (event) => setDescription(event.target.value),
              placeholder: "Describe your collection for everyone browsing Mintlab…",
              "data-ocid": "collections.create.description_textarea"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground", children: "Your collection gets its own ICRC-7 canister controlled by you and Mintlab. You can copy the canister ID from the collection card and wallet views." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 rounded-xl border border-border bg-muted/20 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "create-dividends",
                className: "flex items-center gap-2 text-sm font-medium text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDollarSign, { className: "w-4 h-4 text-accent" }),
                  "Enable collection dividends",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(HelpTooltip, { children: "Dividends create a dedicated ICP address for this collection. Deposits can be checked from the collection browser and claimed by current NFT holders from Dividends." })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Creates a dedicated ICP address for this collection so deposits can be split evenly across its NFTs." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: "create-dividends",
              checked: dividendsEnabled,
              onCheckedChange: setDividendsEnabled,
              "data-ocid": "collections.create.dividends_switch"
            }
          )
        ] }),
        !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground", children: "Sign in with Internet Identity to create a collection." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TermsAgreementNotice, { actionLabel: "creating this collection" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: openCreateConfirmation,
            disabled: createMutation.isPending || !isAuthenticated || !(mintConfig == null ? void 0 : mintConfig.collectionCreationEnabled) || !(mintConfig == null ? void 0 : mintConfig.collectionCanisterWasmUploaded) || !creationQuote,
            className: "gap-2",
            "data-ocid": "collections.create.submit_button",
            children: createMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
              "Creating…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
              "Create Collection"
            ] })
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      PaymentConfirmationDialog,
      {
        open: confirmCreateOpen,
        onOpenChange: setConfirmCreateOpen,
        title: "Review Collection Settings",
        description: (moderationConfig == null ? void 0 : moderationConfig.enabled) ? "Review the settings below. Payment starts only after you choose Confirm Settings and Pay, and Mintlab checks the uploaded image before any ICP is transferred." : "Review the settings below. Payment starts only after you choose Confirm Settings and Pay, then Mintlab debits your in-app ICP balance and creates your collection canister.",
        cancelLabel: "Make Changes",
        lines: [
          {
            label: "Payment source",
            value: "In-app ICP balance"
          },
          {
            label: "Dividend setup",
            value: collectionReview.dividendsLabel,
            helper: dividendsEnabled ? "Creates a dedicated ICP dividend address." : "No dedicated dividend account will be created."
          },
          {
            label: "Collection fee",
            value: `${formatICP((mintConfig == null ? void 0 : mintConfig.collectionCreationPriceE8s) ?? 0n)} ICP`
          },
          {
            label: "Converted to cycles",
            value: creationQuote ? `${formatICP(creationQuote.cycleCostE8s)} ICP` : "Loading"
          },
          {
            label: "New canister cycles after fee",
            value: creationQuote ? formatCycles(creationQuote.collectionCanisterCycles) : "Loading"
          },
          {
            label: "Payout remainder",
            value: creationQuote ? `${formatICP(creationQuote.adminPayoutE8s)} ICP` : "Loading"
          },
          {
            label: "Ledger fees",
            value: creationQuote ? `${formatICP(
              creationQuote.cycleTransferFeeE8s + creationQuote.adminPayoutFeeE8s
            )} ICP` : "Loading"
          },
          {
            label: "Total debit",
            value: creationQuote ? `${formatICP(creationQuote.totalUserDebitE8s)} ICP` : "Loading"
          }
        ],
        confirmLabel: "Confirm Settings and Pay",
        isPending: createMutation.isPending,
        onConfirm: () => {
          setConfirmCreateOpen(false);
          createMutation.mutate();
        },
        ocid: "collections.create.payment_dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg border border-accent/20 bg-accent/10 p-3 text-xs leading-relaxed text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Choose Make Changes to edit the collection setup. Confirm Settings and Pay authorizes the payment using exactly the settings shown here." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "space-y-3 rounded-lg border border-border bg-muted/20 p-3",
              "data-ocid": "collections.create.settings_review",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background", children: collectionReview.imagePreviewUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: collectionReview.imagePreviewUrl,
                      alt: "Collection preview",
                      className: "h-full w-full object-cover"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "h-5 w-5 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "Collection settings" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 truncate font-display text-base font-semibold text-foreground", children: collectionReview.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 break-words text-xs text-muted-foreground", children: collectionReview.imageLabel })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "grid grid-cols-1 gap-2 text-sm sm:grid-cols-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Symbol" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-mono text-foreground", children: collectionReview.symbol })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "NFT standard" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-mono text-foreground", children: collectionReview.standard })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Controllers" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-foreground", children: collectionReview.controllers })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Dividends" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-medium text-foreground", children: collectionReview.dividendsLabel })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border/70 bg-background/50 p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "Description" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-h-24 overflow-y-auto whitespace-pre-wrap break-words text-sm text-foreground", children: collectionReview.description })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `rounded-md border p-3 text-xs leading-relaxed ${dividendsEnabled ? "border-accent/25 bg-accent/10 text-muted-foreground" : "border-amber-500/25 bg-amber-500/10 text-muted-foreground"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                        "Dividends ",
                        collectionReview.dividendsLabel.toLowerCase(),
                        "."
                      ] }),
                      " ",
                      collectionReview.dividendsDetail
                    ]
                  }
                )
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppCanisterTopUpDialog,
      {
        open: cycleTopUpReason != null,
        reason: cycleTopUpReason,
        onOpenChange: (open) => {
          if (!open) setCycleTopUpReason(null);
        },
        onSuccess: () => createMutation.mutate()
      }
    )
  ] });
}
function CollectionCard({
  collection,
  trustStatus,
  browseStats,
  cycleStatus,
  index,
  isCreatorCollection,
  canManageCollection,
  isMainAppCollection,
  onClick,
  onTopUp,
  onUpgrade,
  onRetryInstall,
  onManageControllers,
  onReport,
  isUpgrading = false,
  isRetryingInstall = false
}) {
  var _a;
  const coverage = (browseStats == null ? void 0 : browseStats.coverage) ?? "Partial";
  const countLabel = browseStats ? browseCoverageLabel(browseStats) : "Loading…";
  const dividendsEnabled = ((_a = collection.dividendConfig) == null ? void 0 : _a.enabled) === true;
  const moduleMissing = (cycleStatus == null ? void 0 : cycleStatus.moduleInstalled) === false;
  const wasmActionPending = moduleMissing ? isRetryingInstall : isUpgrading;
  const imageUrl = resolveImageUrl(collection.imageUrl);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay: index * 0.07 },
      whileHover: { y: -4, scale: 1.01 },
      className: "group nft-card-glow cursor-pointer rounded-2xl border border-border bg-card overflow-hidden hover:border-accent/40 transition-smooth",
      onClick,
      "data-ocid": `collections.collection.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-video overflow-hidden bg-muted relative", children: [
          imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: imageUrl,
              alt: collection.name,
              className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
              loading: "lazy"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-10 h-10 text-muted-foreground/30" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute top-2 right-2 bg-card/80 backdrop-blur-sm border border-border/60 text-foreground font-mono text-xs", children: standardLabel(collection.standard) }),
          onReport && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-card/85 text-muted-foreground opacity-0 shadow-sm backdrop-blur-sm transition-opacity hover:text-foreground group-hover:opacity-100 focus:opacity-100",
              title: "Report this collection",
              "aria-label": "Report this collection",
              onClick: (event) => {
                event.stopPropagation();
                onReport(collection);
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground truncate", children: collection.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: collection.symbol }),
                isCreatorCollection && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent/10 text-accent border border-accent/20 text-[10px]", children: "Created by You" }),
                !isCreatorCollection && canManageCollection && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent/10 text-accent border border-accent/20 text-[10px]", children: "Admin Managed" }),
                dividendsEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px]", children: "Dividends" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: `border text-[10px] ${collectionTrustBadgeClass(
                      trustStatus
                    )}`,
                    title: collectionTrustDescription(trustStatus, collection),
                    children: collectionTrustLabel(trustStatus, collection)
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "shrink-0 bg-accent/10 text-accent border border-accent/20 text-xs font-semibold",
                children: countLabel
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed", children: collection.description }),
          coverage === "Partial" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Showing indexed NFTs until full browse details are available." }),
          canManageCollection && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-muted/20 p-2 text-[11px] text-muted-foreground space-y-1", children: isMainAppCollection ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Wasm module" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: "App canister" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "OISY import" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: "Included" })
            ] })
          ] }) : cycleStatus ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cycle balance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: formatCycles(cycleStatus.cycles) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Wasm module" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: cycleStatus.moduleInstalled ? "Installed" : "Missing" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Controllers" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: cycleStatus.controllers.length })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cycle status loading…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "w-full gap-1.5 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/60 text-xs",
                onClick: (e) => {
                  e.stopPropagation();
                  onClick();
                },
                "data-ocid": `collections.browse_button.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "w-3.5 h-3.5" }),
                  "Browse Collection"
                ]
              }
            ),
            canManageCollection && !isMainAppCollection && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "secondary",
                  className: "gap-1.5 text-xs",
                  onClick: (e) => {
                    e.stopPropagation();
                    onTopUp == null ? void 0 : onTopUp(collection);
                  },
                  "data-ocid": `collections.top_up_button.${index + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                    "Top Up"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "gap-1.5 text-xs",
                  disabled: wasmActionPending,
                  onClick: (e) => {
                    e.stopPropagation();
                    if (moduleMissing) {
                      onRetryInstall == null ? void 0 : onRetryInstall(collection);
                    } else {
                      onUpgrade == null ? void 0 : onUpgrade(collection);
                    }
                  },
                  "data-ocid": `collections.upgrade_button.${index + 1}`,
                  children: [
                    wasmActionPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
                    moduleMissing ? "Install Wasm" : "Update Wasm"
                  ]
                }
              )
            ] }),
            canManageCollection && !isMainAppCollection && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "mt-2 w-full gap-1.5 text-xs",
                onClick: (e) => {
                  e.stopPropagation();
                  onManageControllers == null ? void 0 : onManageControllers(collection);
                },
                "data-ocid": `collections.controllers_button.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3.5 h-3.5" }),
                  "Controllers"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function CollectionTopUpDialog({
  collection,
  open,
  onClose
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [cyclesText, setCyclesText] = reactExports.useState("1000000000000");
  const cyclesToTopUp = reactExports.useMemo(
    () => parseCyclesInput(cyclesText),
    [cyclesText]
  );
  const { data: quote, isFetching: quoteLoading } = useQuery({
    queryKey: ["collectionCycleTopUpQuote", cyclesToTopUp == null ? void 0 : cyclesToTopUp.toString()],
    queryFn: async () => {
      if (!actor || cyclesToTopUp == null) return null;
      return actor.quoteCollectionCycleTopUp(cyclesToTopUp);
    },
    enabled: !!actor && open && cyclesToTopUp != null,
    staleTime: 6e4
  });
  const topUpMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      if (!collection) throw new Error("Select a collection first");
      if (cyclesToTopUp == null) throw new Error("Enter a valid cycles amount");
      const result = await actor.topUpCollectionCanisterCycles(
        collection.id,
        cyclesToTopUp
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (receipt) => {
      ue.success(
        `Added ${formatCycles(receipt.cyclesMinted)} cycles to ${(collection == null ? void 0 : collection.name) ?? "the collection"}`
      );
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"]
      });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      onClose();
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (value) => !value && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-md",
      "data-ocid": "collections.top_up.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Top Up Collection Cycles" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Confirm the ICP payment from your in-app account before cycles are minted directly into this collection canister." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/20 p-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Collection" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-right", children: (collection == null ? void 0 : collection.name) ?? "Collection" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Canister" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-right break-all", children: (collection == null ? void 0 : collection.canisterId.toString()) ?? "" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "collection-top-up-cycles", children: "Cycles to add" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "collection-top-up-cycles",
                value: cyclesText,
                onChange: (event) => setCyclesText(event.target.value),
                inputMode: "numeric",
                className: "font-mono",
                "data-ocid": "collections.top_up.cycles_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Minimum top-up is 100B cycles. The app will normalize very small amounts to that minimum." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-sm", children: cyclesToTopUp == null ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Enter a whole-number cycles amount." }) : quoteLoading || !quote ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Fetching quote…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Cycles requested" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: formatCycles(quote.cyclesToTopUp) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "ICP converted" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                formatICP(quote.cycleCostE8s),
                " ICP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Ledger fee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                formatICP(quote.ledgerFeeE8s),
                " ICP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 border-t border-border pt-2 font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total debit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                formatICP(quote.totalUserDebitE8s),
                " ICP"
              ] })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TermsAgreementNotice, { actionLabel: "confirming this collection cycle top-up" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "gap-2",
              disabled: topUpMutation.isPending || !collection || cyclesToTopUp == null || !quote,
              onClick: () => topUpMutation.mutate(),
              "data-ocid": "collections.top_up.confirm_button",
              children: [
                topUpMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                "Confirm Top Up"
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function NFTDetailModal({
  nft,
  collection,
  isListed = false,
  dividendE8s = 0n,
  open,
  onClose
}) {
  const { isAuthenticated, principal } = useAuth();
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const { data: inWallet, isLoading: walletCheckLoading } = useQuery({
    queryKey: [
      "isNFTInUserWallet",
      collection.id.toString(),
      nft.tokenId,
      principal == null ? void 0 : principal.toString()
    ],
    queryFn: async () => {
      if (!actor || !principal) return false;
      return actor.isNFTInUserWallet(collection.id, nft.tokenId, principal);
    },
    enabled: !!actor && isAuthenticated && !!principal && open
  });
  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const metadata = {
        name: nft.metadata.name,
        description: nft.metadata.description,
        imageUrl: nft.metadata.imageUrl,
        attributes: nft.metadata.attributes
      };
      return actor.registerNFT(collection.id, nft.tokenId, metadata);
    },
    onSuccess: () => {
      ue.success("NFT registered to your wallet!");
      queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      queryClient.invalidateQueries({
        queryKey: ["isNFTInUserWallet", collection.id.toString(), nft.tokenId]
      });
      onClose();
    },
    onError: (err) => {
      ue.error(err.message || "Failed to register NFT");
    }
  });
  const reportMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.reportNFT(
        collection.id,
        nft.tokenId,
        `Collections page report for ${getNFTTokenLabel(nft, collection)} in ${collection.name}`
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      ue.success("Report sent to Mintlab admins.");
      void queryClient.invalidateQueries({ queryKey: ["nftReportMetas"] });
      void queryClient.invalidateQueries({
        queryKey: ["collectionNFTPage", collection.id.toString()]
      });
      void queryClient.invalidateQueries({
        queryKey: ["activeListingDetails"]
      });
    },
    onError: (err) => {
      ue.error(`Report failed: ${extractError(err)}`);
    }
  });
  const nftName = getNFTDisplayName(nft, collection);
  const displayTokenId = getNFTDisplayTokenId(nft, collection);
  const visibleAttributes = getNFTVisibleAttributes(nft.metadata);
  const imageUrl = resolveImageUrl(nft.metadata.imageUrl, {
    canisterId: collection.canisterId.toString(),
    tokenId: nft.tokenId
  });
  const collectionImageUrl = resolveImageUrl(collection.imageUrl);
  const canisterId = collection.canisterId.toString();
  const canisterUrl = `https://dashboard.internetcomputer.org/canister/${canisterId}`;
  const ownsPreview = principal != null && nft.owner.toString() === principal.toString();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogContent,
    {
      className: "bg-card border-border w-[calc(100vw-2rem)] max-w-3xl max-h-[calc(100dvh-2rem)] p-0 overflow-hidden",
      "data-ocid": "collections.nft_detail.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex max-h-[calc(100dvh-2rem)] min-h-0 flex-col md:grid md:grid-cols-[minmax(0,0.95fr)_minmax(320px,1fr)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-[min(42vh,360px)] md:h-auto md:min-h-0 w-full overflow-hidden bg-muted relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ZoomableMediaImage,
            {
              src: nft.metadata.imageUrl,
              alt: nftName,
              assetCanisterId: collection.canisterId.toString(),
              tokenId: nft.tokenId,
              viewerTitle: nftName,
              buttonClassName: "h-full w-full",
              className: "w-full h-full object-contain",
              dataOcid: "collections.nft_detail.image_zoom_button",
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "w-14 h-14 text-muted-foreground/30" }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth",
              "aria-label": "Close",
              "data-ocid": "collections.nft_detail.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "min-h-0 flex-1 md:h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl text-foreground break-words", children: nftName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "font-mono text-xs bg-muted/60 text-muted-foreground border border-border/40",
                  children: getNFTTokenLabel(nft, collection)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "text-xs bg-accent/10 text-accent border border-accent/20",
                  children: standardLabel(collection.standard)
                }
              ),
              isListed && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs bg-amber-500/10 text-amber-700 border border-amber-500/20", children: "Listed on Market" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DividendBalanceBadge, { e8s: dividendE8s, size: "md" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  className: "h-7 gap-1.5 text-xs",
                  onClick: () => {
                    if (!isAuthenticated) {
                      ue("Sign in to report this NFT.");
                      return;
                    }
                    reportMutation.mutate();
                  },
                  disabled: reportMutation.isPending,
                  "data-ocid": "collections.nft_detail.report_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-3.5 w-3.5" }),
                    "Report"
                  ]
                }
              )
            ] })
          ] }),
          nft.metadata.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed break-words", children: nft.metadata.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2 border border-border/40", children: [
            collectionImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: collectionImageUrl,
                alt: collection.name,
                className: "w-6 h-6 rounded-full border border-border/50 object-cover shrink-0"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground font-medium truncate", children: collection.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground ml-auto shrink-0", children: collection.symbol })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3", children: [
            displayTokenId && /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "Display Token ID",
                value: displayTokenId,
                ocid: "collections.nft_detail.copy_display_token_id"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: displayTokenId ? "Canonical Token ID" : "Token ID",
                value: nft.tokenId,
                ocid: "collections.nft_detail.copy_token_id"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "Collection Canister",
                value: canisterId,
                ocid: "collections.nft_detail.copy_canister_id"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "Current Owner",
                value: nft.owner.toString(),
                ocid: "collections.nft_detail.copy_owner"
              }
            ),
            imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "NFT Media URL",
                value: imageUrl,
                ocid: "collections.nft_detail.copy_media_url"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              variant: "outline",
              size: "sm",
              className: "gap-2",
              "data-ocid": "collections.nft_detail.view_canister_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: canisterUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
                    "View Canister"
                  ]
                }
              )
            }
          ) }),
          visibleAttributes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3 h-3" }),
              " Attributes"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: visibleAttributes.map(([key, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-muted/40 border border-border/50 rounded-lg px-3 py-2 text-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide truncate", children: key }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mt-0.5 truncate", children: value })
                ]
              },
              `attr-detail-${key}-${value}`
            )) })
          ] }),
          isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "pt-2 border-t border-border/60",
              "data-ocid": "collections.nft_detail.register_section",
              children: walletCheckLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) }) : inWallet ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2.5",
                  "data-ocid": "collections.nft_detail.in_wallet_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-accent shrink-0" }),
                    "Already in your wallet"
                  ]
                }
              ) : !ownsPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground", children: "Sign in with the owner principal shown above to register this NFT into your Mintlab wallet." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth gap-2",
                  onClick: () => registerMutation.mutate(),
                  disabled: registerMutation.isPending,
                  "data-ocid": "collections.nft_detail.register_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
                    registerMutation.isPending ? "Registering…" : "Register to Wallet"
                  ]
                }
              )
            }
          )
        ] }) })
      ] })
    }
  ) });
}
function CollectionControllersDialog({
  collection,
  initialStatus,
  open,
  onClose
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [controllerInput, setControllerInput] = reactExports.useState("");
  const queryKey = [
    "collectionCanisterControllers",
    (collection == null ? void 0 : collection.id.toString()) ?? "none"
  ];
  const initialInfo = reactExports.useMemo(() => {
    if (!collection || !initialStatus) return null;
    return {
      collectionId: collection.id,
      canisterId: collection.canisterId,
      appCanisterId: initialStatus.appCanisterId,
      controllers: initialStatus.controllers
    };
  }, [collection, initialStatus]);
  const {
    data: fetchedInfo,
    isFetching,
    error
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!actor || !collection) return null;
      const result = await actor.getCollectionCanisterControllers(
        collection.id
      );
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    enabled: !!actor && !!collection && open,
    retry: false
  });
  const info = fetchedInfo ?? initialInfo;
  const appCanisterText = (info == null ? void 0 : info.appCanisterId.toString()) ?? "";
  const appControllerPresent = !!info && info.controllers.some(
    (controller) => controller.toString() === appCanisterText
  );
  const addMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      if (!collection) throw new Error("Select a collection first");
      const trimmed = controllerInput.trim();
      if (!isValidPrincipal(trimmed)) {
        throw new Error("Enter a valid controller principal");
      }
      const result = await actor.addCollectionCanisterController(
        collection.id,
        Principal.fromText(trimmed)
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (receipt) => {
      queryClient.setQueryData(queryKey, receipt);
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"]
      });
      setControllerInput("");
      ue.success("Controller added");
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const removeMutation = useMutation({
    mutationFn: async (controller) => {
      if (!actor) throw new Error("Backend not connected");
      if (!collection) throw new Error("Select a collection first");
      const result = await actor.removeCollectionCanisterController(
        collection.id,
        controller
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (receipt) => {
      queryClient.setQueryData(queryKey, receipt);
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"]
      });
      ue.success("Controller removed");
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  function copyPrincipal(value) {
    void navigator.clipboard.writeText(value);
    ue.success("Controller principal copied");
  }
  function removeController(controller) {
    if (!info) return;
    const controllerText = controller.toString();
    const isAppController = controllerText === appCanisterText;
    if (isAppController && !window.confirm(
      "Remove the Mintlab app controller? Mintlab may no longer be able to upgrade, top up, or read this collection canister after this change."
    )) {
      return;
    }
    removeMutation.mutate(controller);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (value) => !value && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-2xl",
      "data-ocid": "collections.controllers.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Collection Controllers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
            (collection == null ? void 0 : collection.name) ?? "Collection",
            " canister",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: (collection == null ? void 0 : collection.canisterId.toString()) ?? "" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          appControllerPresent && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-900", children: "Add your replacement controller before removing the Mintlab app controller. Once removed, controller management through Mintlab can stop working for this canister." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "collection-controller-principal", children: "Add controller principal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 sm:flex-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "collection-controller-principal",
                  value: controllerInput,
                  onChange: (event) => setControllerInput(event.target.value),
                  className: "font-mono text-sm",
                  placeholder: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                  "data-ocid": "collections.controllers.add_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "gap-2 sm:w-auto",
                  disabled: addMutation.isPending,
                  onClick: () => addMutation.mutate(),
                  "data-ocid": "collections.controllers.add_button",
                  children: [
                    addMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                    "Add"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Current controllers" }),
              isFetching && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Refreshing…" })
            ] }),
            !info && isFetching && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-muted/20 p-3 text-sm text-muted-foreground", children: "Loading controllers…" }),
            !info && error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive", children: extractError(error) }),
            info && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: info.controllers.map((controller, index) => {
              var _a;
              const controllerText = controller.toString();
              const isAppController = controllerText === appCanisterText;
              const removeDisabled = removeMutation.isPending || info.controllers.length <= 1;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col gap-2 rounded-lg border border-border bg-muted/20 p-3 sm:flex-row sm:items-center",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex flex-wrap items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-muted-foreground", children: [
                          "Controller ",
                          index + 1
                        ] }),
                        isAppController && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "border border-accent/20 bg-accent/10 text-accent", children: "Mintlab app" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "break-all font-mono text-sm text-foreground", children: controllerText })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "icon",
                          variant: "outline",
                          onClick: () => copyPrincipal(controllerText),
                          "aria-label": "Copy controller principal",
                          "data-ocid": `collections.controllers.copy.${index + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "icon",
                          variant: "outline",
                          disabled: removeDisabled,
                          onClick: () => removeController(controller),
                          "aria-label": "Remove controller",
                          "data-ocid": `collections.controllers.remove.${index + 1}`,
                          children: removeMutation.isPending && ((_a = removeMutation.variables) == null ? void 0 : _a.toString()) === controllerText ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                        }
                      )
                    ] })
                  ]
                },
                controllerText
              );
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Close" }) })
      ]
    }
  ) });
}
function NFTBrowser({
  collection,
  isCreatorCollection,
  onBack
}) {
  var _a;
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [attrFilter, setAttrFilter] = reactExports.useState(null);
  const [selectedNFT, setSelectedNFT] = reactExports.useState(null);
  const [directLookupNFT, setDirectLookupNFT] = reactExports.useState(
    null
  );
  const canisterId = collection.canisterId.toString();
  const canisterUrl = `https://dashboard.internetcomputer.org/canister/${canisterId}`;
  const dividendsEnabled = ((_a = collection.dividendConfig) == null ? void 0 : _a.enabled) === true;
  const {
    data: browsePages,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError: browsePageFailed,
    error: browsePageError,
    refetch: refetchBrowsePage
  } = useInfiniteQuery({
    queryKey: ["collectionNFTPage", collection.id.toString()],
    initialPageParam: null,
    queryFn: async ({ pageParam }) => {
      if (!actor) {
        return {
          nfts: [],
          totalCount: 0n,
          coverage: "Partial",
          note: "Mintlab is preparing this collection browser."
        };
      }
      return actor.getCollectionNFTPage(
        collection.id,
        pageParam,
        collectionNFTPageSize(collection)
      );
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? void 0,
    enabled: !!actor && !isFetching,
    retry: false,
    staleTime: 3e4
  });
  const { data: activeListingDetails = [] } = useQuery({
    queryKey: [
      "activeListingDetails",
      "collectionBrowser",
      collection.id.toString(),
      COLLECTIONS_LISTING_PAGE_SIZE.toString()
    ],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.getActiveListingDetailsPage(
        null,
        COLLECTIONS_LISTING_PAGE_SIZE
      );
      return page.details;
    },
    enabled: !!actor && !isFetching
  });
  const { data: dividendInfo } = useQuery({
    queryKey: ["collectionDividendInfo", collection.id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCollectionDividendInfo(collection.id);
    },
    enabled: !!actor && !isFetching && dividendsEnabled,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 3e4
  });
  const { data: dividendBalances = [] } = useQuery({
    queryKey: ["collectionDividendBalances", collection.id.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.refreshCollectionDividendBalances(collection.id);
    },
    enabled: !!actor && !isFetching && dividendsEnabled,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 3e4
  });
  const syncDividendsMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.syncCollectionDividends(collection.id);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (receipt) => {
      ue.success(
        receipt.distributedE8s > 0n ? `Distributed ${formatICP(receipt.distributedE8s)} ICP` : "No new dividends to distribute"
      );
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendInfo", collection.id.toString()]
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendBalances", collection.id.toString()]
      });
      void queryClient.invalidateQueries({ queryKey: ["myDividendNFTs"] });
      void queryClient.invalidateQueries({
        queryKey: ["marketplaceDividendBalances"]
      });
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const loadedNFTs = reactExports.useMemo(() => {
    if (!browsePages) return [];
    return browsePages.pages.flatMap((page) => page.nfts);
  }, [browsePages]);
  const browsableNFTs = reactExports.useMemo(() => {
    if (!directLookupNFT) return loadedNFTs;
    const alreadyLoaded = loadedNFTs.some(
      (nft) => nft.collectionId === directLookupNFT.collectionId && nft.tokenId === directLookupNFT.tokenId
    );
    return alreadyLoaded ? loadedNFTs : [directLookupNFT, ...loadedNFTs];
  }, [directLookupNFT, loadedNFTs]);
  const firstPage = browsePages == null ? void 0 : browsePages.pages[0];
  const totalCount = (firstPage == null ? void 0 : firstPage.totalCount) ?? BigInt(loadedNFTs.length);
  const coverage = (firstPage == null ? void 0 : firstPage.coverage) ?? "Partial";
  const browseNote = (firstPage == null ? void 0 : firstPage.note) ?? "Mintlab is showing the NFTs it has already loaded for this collection.";
  const listedNFTKeys = new Set(
    activeListingDetails.filter((detail) => detail.nft.collectionId === collection.id).map((detail) => nftKey(detail.nft.collectionId, detail.nft.tokenId))
  );
  const dividendBalanceMap = reactExports.useMemo(
    () => new Map(dividendBalances),
    [dividendBalances]
  );
  const tokenLookupMutation = useMutation({
    mutationFn: async (tokenId) => {
      if (!actor) throw new Error("Backend not connected");
      const trimmed = tokenId.trim();
      if (!trimmed) throw new Error("Enter a token ID to find");
      const result = await actor.lookupCollectionNFT(collection.id, trimmed);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      if (!result.ok) {
        throw new Error(`NFT #${trimmed} was not found in this collection`);
      }
      return result.ok;
    },
    onSuccess: (nft) => {
      setDirectLookupNFT(nft);
      setSelectedNFT(nft);
      ue.success(`Loaded ${getNFTTokenLabel(nft, collection)}`);
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const allAttributePairs = reactExports.useMemo(() => {
    const seen = /* @__PURE__ */ new Set();
    const pairs = [];
    for (const nft of browsableNFTs) {
      for (const [key, value] of nft.metadata.attributes) {
        const k = `${key}::${value}`;
        if (!seen.has(k)) {
          seen.add(k);
          pairs.push({ key, value });
        }
      }
    }
    return pairs.sort((a, b) => a.key.localeCompare(b.key));
  }, [browsableNFTs]);
  const filteredNFTs = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return browsableNFTs.filter((nft) => {
      if (q) {
        const nameMatch = getNFTDisplayName(nft, collection).toLowerCase().includes(q);
        const idMatch = nft.tokenId.toLowerCase().includes(q) || getNFTTokenLabel(nft, collection).toLowerCase().includes(q);
        if (!nameMatch && !idMatch) return false;
      }
      if (attrFilter) {
        const hasAttr = nft.metadata.attributes.some(
          ([k, v]) => k === attrFilter.key && v === attrFilter.value
        );
        if (!hasAttr) return false;
      }
      return true;
    });
  }, [browsableNFTs, search, attrFilter, collection]);
  const clearFilters = reactExports.useCallback(() => {
    setSearch("");
    setAttrFilter(null);
    setDirectLookupNFT(null);
  }, []);
  const [showSlowLoadNotice, setShowSlowLoadNotice] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!isLoading && !isFetchingNextPage) {
      setShowSlowLoadNotice(false);
      return;
    }
    setShowSlowLoadNotice(false);
    const timer = window.setTimeout(() => {
      setShowSlowLoadNotice(true);
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [isLoading, isFetchingNextPage]);
  const hasActiveFilter = search.trim() !== "" || attrFilter !== null;
  const hasSearchTerm = search.trim() !== "";
  const loadedCount = loadedNFTs.length;
  const fullyLoaded = BigInt(loadedCount) >= totalCount;
  const collectionImageUrl = resolveImageUrl(collection.imageUrl);
  const browsePageErrorMessage = browsePageFailed ? extractError(browsePageError) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "collections.nft_browser", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: onBack,
            className: "gap-1.5 text-muted-foreground hover:text-foreground -ml-2",
            "data-ocid": "collections.back_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
              "All Collections"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "/" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
          collectionImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: collectionImageUrl,
              alt: collection.name,
              className: "w-6 h-6 rounded-full border border-border/50 object-cover shrink-0"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground truncate", children: collection.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "secondary",
              className: "font-mono text-xs bg-muted/60 text-muted-foreground border border-border/40 shrink-0",
              children: standardLabel(collection.standard)
            }
          ),
          isCreatorCollection && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent/10 text-accent border border-accent/20 shrink-0", children: "Your Mintlab Collection" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "gap-1.5",
            onClick: () => {
              void navigator.clipboard.writeText(canisterId);
              ue.success("Collection canister copied");
            },
            "data-ocid": "collections.copy_canister_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" }),
              "Copy Canister ID"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            size: "sm",
            variant: "outline",
            className: "gap-1.5",
            "data-ocid": "collections.view_canister_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: canisterUrl, target: "_blank", rel: "noopener noreferrer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
              "View Canister"
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm text-muted-foreground", children: [
      browseNote,
      coverage === "Full" && !fullyLoaded && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block mt-1", children: "Load more to keep browsing the rest of the collection." })
    ] }),
    showSlowLoadNotice && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2.5 text-sm text-amber-800",
        "data-ocid": "collections.nft_browser.slow_loading_notice",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mt-0.5 h-4 w-4 shrink-0 animate-spin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "This imported collection is still loading. Some NFT canisters answer slowly, so this may take a few minutes." })
        ]
      }
    ),
    browsePageErrorMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col gap-3 rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-3 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between",
        "data-ocid": "collections.nft_browser.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: browsePageErrorMessage }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "gap-2 border-destructive/30 text-destructive hover:bg-destructive/10",
              onClick: () => {
                void refetchBrowsePage();
              },
              "data-ocid": "collections.nft_browser.retry_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
                "Retry"
              ]
            }
          )
        ]
      }
    ),
    dividendsEnabled && dividendInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3",
        "data-ocid": "collections.dividends.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-emerald-700 font-mono", children: "Collection Dividends" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Send ICP to this address, then check for deposits to split the new balance evenly across minted NFTs in this collection." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "gap-2 border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10",
                onClick: () => syncDividendsMutation.mutate(),
                disabled: syncDividendsMutation.isPending,
                "data-ocid": "collections.dividends.sync_button",
                children: [
                  syncDividendsMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDollarSign, { className: "w-4 h-4" }),
                  "Check Deposits"
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 items-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "Dividend ICP Address",
                value: accountIdToHex(dividendInfo.accountId),
                ocid: "collections.dividends.copy_account"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/50 bg-card/60 px-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground uppercase tracking-wide", children: "Pool" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono font-semibold text-foreground mt-0.5", children: [
                  formatICP(dividendInfo.balanceE8s),
                  " ICP"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/50 bg-card/60 px-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground uppercase tracking-wide", children: "Pending" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono font-semibold text-foreground mt-0.5", children: [
                  formatICP(dividendInfo.pendingE8s),
                  " ICP"
                ] })
              ] })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col sm:flex-row gap-3",
        "data-ocid": "collections.filters_bar",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Search loaded NFTs or enter a token ID…",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter" && search.trim()) {
                    tokenLookupMutation.mutate(search);
                  }
                },
                className: "pl-9 bg-card border-border focus:border-accent",
                "data-ocid": "collections.search_input"
              }
            ),
            search && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth",
                onClick: () => setSearch(""),
                "aria-label": "Clear search",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              className: "gap-2 whitespace-nowrap",
              onClick: () => tokenLookupMutation.mutate(search),
              disabled: !hasSearchTerm || tokenLookupMutation.isPending,
              "data-ocid": "collections.find_token_button",
              children: [
                tokenLookupMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4" }),
                "Find NFT"
              ]
            }
          ),
          allAttributePairs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: attrFilter ? `${attrFilter.key}::${attrFilter.value}` : "all",
              onValueChange: (val) => {
                if (val === "all") {
                  setAttrFilter(null);
                } else {
                  const [key, value] = val.split("::");
                  setAttrFilter({ key, value });
                }
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  SelectTrigger,
                  {
                    className: "w-full sm:w-56 bg-card border-border focus:border-accent",
                    "data-ocid": "collections.attribute_filter.select",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3.5 h-3.5 text-muted-foreground mr-1.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by attribute" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-card border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All attributes" }),
                  allAttributePairs.map(({ key, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: `${key}::${value}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                      key,
                      ":"
                    ] }),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: value })
                  ] }, `${key}::${value}`))
                ] })
              ]
            }
          ),
          hasActiveFilter && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: clearFilters,
              className: "gap-1.5 text-muted-foreground hover:text-foreground whitespace-nowrap",
              "data-ocid": "collections.clear_filters_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" }),
                "Clear"
              ]
            }
          )
        ]
      }
    ),
    !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Loaded ",
        loadedCount,
        " of ",
        totalCount.toString(),
        " NFT",
        totalCount === 1n ? "" : "s"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "secondary",
          className: coverage === "Full" ? "bg-accent/10 text-accent border border-accent/20 text-xs" : "bg-muted/60 text-muted-foreground border border-border/40 text-xs",
          children: coverage === "Full" ? "Full Browse" : "Indexed View"
        }
      ),
      hasActiveFilter && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "secondary",
          className: "bg-accent/10 text-accent border border-accent/20 text-xs",
          children: "Filtered"
        }
      ),
      directLookupNFT && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "secondary",
          className: "bg-accent/10 text-accent border border-accent/20 text-xs",
          children: "Direct lookup"
        }
      )
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3",
        "data-ocid": "collections.nft_browser.loading_state",
        children: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: "aspect-square rounded-xl"
          },
          `nft-skel-${k}`
        ))
      }
    ),
    !isLoading && filteredNFTs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: hasActiveFilter ? Search : Layers,
        title: hasActiveFilter ? "No matches found" : "No NFTs available to browse",
        description: hasActiveFilter ? "Try the direct NFT lookup for a token ID that has not been loaded yet, or clear the filters." : coverage === "Full" ? "Mintlab could not find any NFTs to show from this collection yet." : "Mintlab can only show the NFTs it has already indexed for this collection right now.",
        action: hasSearchTerm ? {
          label: tokenLookupMutation.isPending ? "Finding NFT..." : "Find NFT by ID",
          onClick: () => tokenLookupMutation.mutate(search),
          "data-ocid": "collections.empty.find_token_button"
        } : hasActiveFilter ? {
          label: "Clear filters",
          onClick: clearFilters,
          "data-ocid": "collections.empty.clear_button"
        } : void 0,
        "data-ocid": "collections.nft_browser.empty_state"
      }
    ),
    !isLoading && filteredNFTs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3",
        "data-ocid": "collections.nft_grid",
        children: filteredNFTs.map((nft, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          BrowseNFTCard,
          {
            nft,
            collection,
            isListed: listedNFTKeys.has(
              nftKey(nft.collectionId, nft.tokenId)
            ),
            dividendE8s: dividendBalanceMap.get(nft.tokenId) ?? 0n,
            index: i,
            onClick: () => setSelectedNFT(nft)
          },
          nftKey(nft.collectionId, nft.tokenId)
        ))
      }
    ),
    hasNextPage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "outline",
        className: "gap-2",
        onClick: () => fetchNextPage(),
        disabled: isFetchingNextPage,
        "data-ocid": "collections.load_more_button",
        children: isFetchingNextPage ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
          "Loading more…"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "w-4 h-4" }),
          "Load More NFTs"
        ] })
      }
    ) }),
    selectedNFT && /* @__PURE__ */ jsxRuntimeExports.jsx(
      NFTDetailModal,
      {
        nft: selectedNFT,
        collection,
        isListed: listedNFTKeys.has(
          nftKey(selectedNFT.collectionId, selectedNFT.tokenId)
        ),
        dividendE8s: dividendBalanceMap.get(selectedNFT.tokenId) ?? 0n,
        open: !!selectedNFT,
        onClose: () => setSelectedNFT(null)
      }
    )
  ] });
}
function BrowseNFTCard({
  nft,
  collection,
  isListed = false,
  dividendE8s = 0n,
  index,
  onClick
}) {
  const name = getNFTDisplayName(nft, collection);
  const tokenLabel = getNFTTokenLabel(nft, collection);
  const topAttrs = getNFTVisibleAttributes(nft.metadata).slice(0, 2);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.04 },
      whileHover: { y: -3, scale: 1.01 },
      className: "nft-card-glow group cursor-pointer rounded-xl border border-border bg-card overflow-hidden hover:border-accent/40 transition-smooth",
      onClick,
      "data-ocid": `collections.nft.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-square overflow-hidden bg-muted relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MediaImage,
            {
              src: nft.metadata.imageUrl,
              alt: name,
              assetCanisterId: collection.canisterId.toString(),
              tokenId: nft.tokenId,
              className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
              loading: "lazy",
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "w-8 h-8 text-muted-foreground/30" }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-foreground font-medium bg-card/80 backdrop-blur-sm rounded-full px-2.5 py-1 border border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3 h-3" }),
            " Details"
          ] }) }),
          isListed && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute top-2 left-2 bg-amber-500/10 text-amber-700 border border-amber-500/20 text-[10px]", children: "Listed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DividendBalanceBadge,
            {
              e8s: dividendE8s,
              compact: true,
              label: "Dividends",
              className: "absolute bottom-2 left-2 right-2 w-auto max-w-[calc(100%-1rem)] border-0 bg-emerald-600/95 text-white shadow-md"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-xs text-foreground truncate", children: name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: tokenLabel }),
          topAttrs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: topAttrs.map(([key, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "text-xs bg-muted/60 text-muted-foreground border border-border/40 px-1.5 py-0 font-normal",
              children: [
                key,
                ":",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium ml-0.5", children: value })
              ]
            },
            `card-attr-${key}-${value}`
          )) })
        ] })
      ]
    }
  );
}
function collectionCreationStatusLabel(status) {
  switch (status) {
    case "Started":
      return "Payment not sent";
    case "CyclePaymentSent":
      return "Payment saved";
    case "CyclesConverted":
      return "Cycles ready";
    case "CanisterCreated":
      return "Canister created";
    case "CollectionRegistered":
      return "Collection registered";
    case "Installed":
      return "Installed";
    case "Failed":
      return "Needs retry";
    case "AdminPayoutPending":
      return "Payout pending";
    case "AdminPayoutSent":
      return "Payout sent";
  }
}
function shortPrincipalText(value) {
  if (!value) return "Not created yet";
  const text = value.toString();
  if (text.length <= 18) return text;
  return `${text.slice(0, 10)}…${text.slice(-6)}`;
}
function PendingCollectionCreationCard({
  request,
  onRetry,
  onTopUp,
  isRetrying
}) {
  const { actor, isFetching } = useBackend();
  const { data: diagnosticsResult, isLoading: isDiagnosticsLoading } = useQuery(
    {
      queryKey: ["collectionCreationDiagnostics", request.id.toString()],
      queryFn: async () => {
        if (!actor)
          return { __kind__: "err", err: "Backend not connected" };
        return actor.getCollectionCreationDiagnostics(request.id);
      },
      enabled: !!actor && !isFetching,
      refetchInterval: 15e3
    }
  );
  const diagnostics = (diagnosticsResult == null ? void 0 : diagnosticsResult.__kind__) === "ok" ? diagnosticsResult.ok : null;
  const diagnosticsError = (diagnosticsResult == null ? void 0 : diagnosticsResult.__kind__) === "err" ? diagnosticsResult.err : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-amber-500/30 bg-background/70 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium text-foreground", children: request.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[11px]", children: request.symbol }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-amber-500/15 text-amber-700 hover:bg-amber-500/15 dark:text-amber-200", children: collectionCreationStatusLabel(request.status) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Request #",
            request.id.toString()
          ] }),
          request.cyclePaymentBlock != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "ICP block ",
            request.cyclePaymentBlock.toString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: shortPrincipalText(request.childCanisterId) })
        ] }),
        request.lastError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-700 dark:text-amber-200", children: request.lastError })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          onClick: onRetry,
          disabled: isRetrying || request.status === "Installed",
          className: "shrink-0 gap-2",
          "data-ocid": `collections.pending_creation.retry.${request.id.toString()}`,
          children: [
            isRetrying ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
            "Repair & Retry"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CollectionCreationDiagnosticsPanel,
      {
        diagnostics,
        error: diagnosticsError,
        isLoading: isDiagnosticsLoading,
        onTopUp
      }
    )
  ] }) });
}
function CollectionsPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, principalText } = useAuth();
  const { isAdmin } = useAdmin();
  const queryClient = useQueryClient();
  const [selectedCollection, setSelectedCollection] = reactExports.useState(null);
  const [topUpCollection, setTopUpCollection] = reactExports.useState(
    null
  );
  const [controllersCollection, setControllersCollection] = reactExports.useState(null);
  const [retryCycleTopUpReason, setRetryCycleTopUpReason] = reactExports.useState(null);
  const [retryTopUpInitialCycles, setRetryTopUpInitialCycles] = reactExports.useState(null);
  const [retryAfterTopUpRequestId, setRetryAfterTopUpRequestId] = reactExports.useState(null);
  const { data: collections, isLoading } = useQuery({
    queryKey: [
      "collections",
      "collectionsPage",
      COLLECTIONS_PAGE_SIZE.toString()
    ],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.listCollectionsPage(null, COLLECTIONS_PAGE_SIZE);
      return page.collections;
    },
    enabled: !!actor && !isFetching
  });
  const { data: collectionImportMetas = [] } = useQuery(
    {
      queryKey: ["collectionImportMetas", "collectionsPage"],
      queryFn: async () => {
        if (!actor) return [];
        const page = await actor.listCollectionImportMetasPage(null, 100n);
        return page.metas;
      },
      enabled: !!actor && !isFetching
    }
  );
  const { data: mintConfig } = useQuery({
    queryKey: ["mintConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMintConfig();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: moderationConfig } = useQuery({
    queryKey: ["moderationConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getModerationConfig();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: myCreatedCollections = [] } = useQuery({
    queryKey: ["myCreatedCollections", principalText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCreatedCollections();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: myCollectionCanisterStatuses = [] } = useQuery({
    queryKey: ["myCollectionCanisterStatuses", principalText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCollectionCanisterStatuses();
    },
    enabled: !!actor && !isFetching && isAuthenticated && myCreatedCollections.length > 0,
    staleTime: 12e4,
    refetchInterval: 3e5
  });
  const { data: pendingCreationRequests = [] } = useQuery({
    queryKey: ["myCollectionCreationRequests", principalText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCollectionCreationRequests();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 3e4,
    refetchInterval: 6e4
  });
  const visiblePendingCreationRequests = reactExports.useMemo(
    () => pendingCreationRequests.filter(isRepairableCollectionCreationRequest),
    [pendingCreationRequests]
  );
  const retryCreationMutation = useMutation({
    mutationFn: async (requestId) => {
      if (!actor) throw new Error("Backend not connected");
      const repair = await actor.repairCollectionCreationRequest(requestId);
      if (repair.__kind__ === "err") throw new Error(repair.err);
      const result = await actor.retryCollectionCreationRequest(requestId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (receipt) => {
      ue.success(`${receipt.collection.name} setup completed.`);
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCreationRequests"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["myCreatedCollections"]
      });
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["allCollectionBrowseStats"]
      });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
    },
    onError: (err, requestId) => {
      const message = extractError(err);
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCreationRequests"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionCreationDiagnostics"]
      });
      if (isLowCyclesError(message)) {
        setRetryCycleTopUpReason(message);
        setRetryTopUpInitialCycles(null);
        setRetryAfterTopUpRequestId(requestId);
        return;
      }
      ue.error(message);
    }
  });
  const upgradeMutation = useMutation({
    mutationFn: async (collection) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.upgradeCollectionCanister(collection.id);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (collection) => {
      ue.success(`${collection.name} canister updated.`);
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"]
      });
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const retryInstallMutation = useMutation({
    mutationFn: async (collection) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.retryInstallCollectionCanister(collection.id);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (collection) => {
      ue.success(`${collection.name} Wasm installed.`);
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["allCollectionBrowseStats"]
      });
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const browseStatsQuery = useQuery({
    queryKey: [
      "allCollectionBrowseStats",
      (collections == null ? void 0 : collections.map((c) => c.id.toString()).join(",")) ?? ""
    ],
    queryFn: async () => {
      if (!actor || !collections) return /* @__PURE__ */ new Map();
      const stats = /* @__PURE__ */ new Map();
      await Promise.all(
        collections.map(async (c) => {
          const result = await actor.getCollectionBrowseStats(c.id);
          stats.set(c.id.toString(), result);
        })
      );
      return stats;
    },
    enabled: !!actor && !isFetching && !!collections && collections.length > 0
  });
  const browseStats = browseStatsQuery.data ?? /* @__PURE__ */ new Map();
  const importMetaMap = collectionMetaMap(collectionImportMetas);
  const myCreatedCollectionIds = new Set(
    myCreatedCollections.map((collection) => collection.id.toString())
  );
  const canisterStatusMap = new Map(
    myCollectionCanisterStatuses.map((status) => [
      status.collectionId.toString(),
      status
    ])
  );
  const collectionEntries = (collections ?? []).map((collection) => ({
    collection,
    trustStatus: collectionTrustStatus(
      collection,
      importMetaMap.get(collection.id.toString())
    )
  }));
  const verifiedCollectionEntries = collectionEntries.filter(
    ({ collection }) => isMintlabVerifiedCollection(
      collection,
      importMetaMap.get(collection.id.toString())
    )
  );
  const communityCollectionEntries = collectionEntries.filter(
    ({ collection }) => !isMintlabVerifiedCollection(
      collection,
      importMetaMap.get(collection.id.toString())
    )
  );
  const reportCollectionMutation = useMutation({
    mutationFn: async (collection) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.reportCollection(
        collection.id,
        `Collections page report for ${collection.name}`
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      ue.success("Report sent to Mintlab admins.");
      void queryClient.invalidateQueries({
        queryKey: ["collectionImportMetas"]
      });
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: (err) => ue.error(`Report failed: ${err.message}`)
  });
  function handleReportCollection(collection) {
    if (!isAuthenticated) {
      ue("Sign in to report this collection.");
      return;
    }
    reportCollectionMutation.mutate(collection);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "px-4 md:px-8 py-8 max-w-7xl mx-auto",
      "data-ocid": "collections.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: selectedCollection ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 },
            transition: { duration: 0.25 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              NFTBrowser,
              {
                collection: selectedCollection,
                isCreatorCollection: myCreatedCollectionIds.has(
                  selectedCollection.id.toString()
                ),
                onBack: () => setSelectedCollection(null)
              }
            )
          },
          "browser"
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: 20 },
            transition: { duration: 0.25 },
            className: "space-y-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl md:text-3xl text-foreground", children: "Collections" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Discover community collections, import supported ICP NFT collections from elsewhere, and launch your own Mintlab collection after paying the admin-set setup fee." })
              ] }),
              !isLoading && !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-accent/20 bg-accent/5 p-4 text-sm text-muted-foreground", children: "Sign in to preview your NFTs, import collections into the shared directory, and create your own Mintlab collection." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                HelpCallout,
                {
                  title: "Collections are for setup and browsing",
                  sectionId: "collections",
                  actionLabel: "Collections guide",
                  ocid: "collections.help_callout",
                  children: "Import supported external canisters here, create your own collection canister here, then mint new NFTs from the Wallet page."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ImportCollectionCard,
                  {
                    onImported: (collection) => setSelectedCollection(collection)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CreateCollectionCard,
                  {
                    mintConfig: mintConfig ?? null,
                    moderationConfig: moderationConfig ?? null,
                    onCreated: (collection) => setSelectedCollection(collection)
                  }
                )
              ] }),
              isAuthenticated && visiblePendingCreationRequests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Collection setup pending" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "w-fit", children: visiblePendingCreationRequests.length })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Saved setup records continue from the last completed step and do not send the cycles payment again after an ICP block is recorded." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2", children: visiblePendingCreationRequests.map((request) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  PendingCollectionCreationCard,
                  {
                    request,
                    onRetry: () => retryCreationMutation.mutate(request.id),
                    onTopUp: (diagnostics) => {
                      setRetryCycleTopUpReason(
                        `The app backend needs more cycles before it can attach ${formatCycles(
                          diagnostics.createCallCycles
                        )} cycles to create the collection canister.`
                      );
                      setRetryTopUpInitialCycles(
                        recommendedCollectionCreationTopUpCycles(diagnostics)
                      );
                      setRetryAfterTopUpRequestId(request.id);
                    },
                    isRetrying: retryCreationMutation.isPending && retryCreationMutation.variables === request.id
                  },
                  request.id.toString()
                )) })
              ] }),
              isAuthenticated && myCreatedCollections.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-muted/20 p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Your Mintlab collections" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: myCreatedCollections.map((collection, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "gap-2",
                    onClick: () => setSelectedCollection(collection),
                    "data-ocid": `collections.my_collection.${index + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5" }),
                      collection.name
                    ]
                  },
                  collection.id.toString()
                )) })
              ] }),
              isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
                  "data-ocid": "collections.loading_state",
                  children: ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "rounded-2xl border border-border bg-card overflow-hidden",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-video w-full" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full mt-2" })
                        ] })
                      ]
                    },
                    `coll-skel-${k}`
                  ))
                }
              ),
              !isLoading && (collections ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                EmptyState,
                {
                  icon: Layers,
                  title: "No collections yet",
                  description: "Import the first supported ICP NFT collection or create your own Mintlab collection to get the shared directory started.",
                  "data-ocid": "collections.empty_state"
                }
              ),
              !isLoading && (collections ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", "data-ocid": "collections.grid", children: [
                verifiedCollectionEntries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: verifiedCollectionEntries.map(
                  ({ collection, trustStatus }, index) => {
                    var _a, _b, _c;
                    const isCreatorCollection = myCreatedCollectionIds.has(
                      collection.id.toString()
                    );
                    const isMainAppCollection = ((_a = mintConfig == null ? void 0 : mintConfig.collectionId) == null ? void 0 : _a.toString()) === collection.id.toString();
                    const canManageCollection = isCreatorCollection || isAdmin && collection.kind === "Minted";
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CollectionCard,
                      {
                        collection,
                        trustStatus,
                        browseStats: browseStats.get(
                          collection.id.toString()
                        ),
                        cycleStatus: canisterStatusMap.get(
                          collection.id.toString()
                        ),
                        index,
                        isCreatorCollection,
                        canManageCollection,
                        isMainAppCollection,
                        onClick: () => setSelectedCollection(collection),
                        onTopUp: setTopUpCollection,
                        onUpgrade: (target) => upgradeMutation.mutate(target),
                        onRetryInstall: (target) => retryInstallMutation.mutate(target),
                        onManageControllers: setControllersCollection,
                        onReport: handleReportCollection,
                        isUpgrading: upgradeMutation.isPending && ((_b = upgradeMutation.variables) == null ? void 0 : _b.id) === collection.id,
                        isRetryingInstall: retryInstallMutation.isPending && ((_c = retryInstallMutation.variables) == null ? void 0 : _c.id) === collection.id
                      },
                      collection.id.toString()
                    );
                  }
                ) }),
                communityCollectionEntries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-amber-500/30 bg-amber-500/10 p-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Unverified community collections" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: [
                      COMMUNITY_COLLECTION_NOTICE,
                      " Check canister IDs before buying or listing, and report suspected counterfeits or unsafe content."
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: communityCollectionEntries.map(
                    ({ collection, trustStatus }, index) => {
                      var _a, _b, _c;
                      const isCreatorCollection = myCreatedCollectionIds.has(
                        collection.id.toString()
                      );
                      const isMainAppCollection = ((_a = mintConfig == null ? void 0 : mintConfig.collectionId) == null ? void 0 : _a.toString()) === collection.id.toString();
                      const canManageCollection = isCreatorCollection || isAdmin && collection.kind === "Minted";
                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CollectionCard,
                        {
                          collection,
                          trustStatus,
                          browseStats: browseStats.get(
                            collection.id.toString()
                          ),
                          cycleStatus: canisterStatusMap.get(
                            collection.id.toString()
                          ),
                          index: verifiedCollectionEntries.length + index,
                          isCreatorCollection,
                          canManageCollection,
                          isMainAppCollection,
                          onClick: () => setSelectedCollection(collection),
                          onTopUp: setTopUpCollection,
                          onUpgrade: (target) => upgradeMutation.mutate(target),
                          onRetryInstall: (target) => retryInstallMutation.mutate(target),
                          onManageControllers: setControllersCollection,
                          onReport: handleReportCollection,
                          isUpgrading: upgradeMutation.isPending && ((_b = upgradeMutation.variables) == null ? void 0 : _b.id) === collection.id,
                          isRetryingInstall: retryInstallMutation.isPending && ((_c = retryInstallMutation.variables) == null ? void 0 : _c.id) === collection.id
                        },
                        collection.id.toString()
                      );
                    }
                  ) })
                ] })
              ] })
            ]
          },
          "grid"
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CollectionTopUpDialog,
          {
            collection: topUpCollection,
            open: topUpCollection != null,
            onClose: () => setTopUpCollection(null)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CollectionControllersDialog,
          {
            collection: controllersCollection,
            initialStatus: controllersCollection ? canisterStatusMap.get(controllersCollection.id.toString()) : void 0,
            open: controllersCollection != null,
            onClose: () => setControllersCollection(null)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AppCanisterTopUpDialog,
          {
            open: retryCycleTopUpReason != null,
            reason: retryCycleTopUpReason,
            onOpenChange: (open) => {
              if (!open) {
                setRetryCycleTopUpReason(null);
                setRetryTopUpInitialCycles(null);
                setRetryAfterTopUpRequestId(null);
              }
            },
            initialCycles: retryTopUpInitialCycles,
            onSuccess: () => {
              void queryClient.invalidateQueries({
                queryKey: ["collectionCreationDiagnostics"]
              });
              if (retryAfterTopUpRequestId != null) {
                retryCreationMutation.mutate(retryAfterTopUpRequestId);
              }
            }
          }
        )
      ]
    }
  );
}
export {
  CollectionsPage as default
};
