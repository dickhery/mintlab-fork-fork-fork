import { Maximize2, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import type {
  CSSProperties,
  ImgHTMLAttributes,
  PointerEvent,
  ReactNode,
  WheelEvent,
} from "react";
import { useEffect, useRef, useState } from "react";

import { MediaImage } from "@/components/MediaImage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Point = {
  x: number;
  y: number;
};

interface ZoomableMediaImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  src?: string | null;
  alt: string;
  assetCanisterId?: string | null;
  tokenId?: string | null;
  preferThumbnail?: boolean;
  fallback?: ReactNode;
  buttonClassName?: string;
  viewerTitle?: string;
  dataOcid?: string;
}

const MIN_SCALE = 1;
const MAX_SCALE = 6;
const SCALE_STEP = 0.35;

function clampScale(value: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

function pointFromEvent(event: PointerEvent<HTMLDivElement>): Point {
  return { x: event.clientX, y: event.clientY };
}

function distanceBetween(first: Point, second: Point): number {
  const dx = first.x - second.x;
  const dy = first.y - second.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function ZoomableMediaImage({
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
}: ZoomableMediaImageProps) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(MIN_SCALE);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });

  const activePointers = useRef<Map<number, Point>>(new Map());
  const dragStart = useRef<{ point: Point; pan: Point } | null>(null);
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);
  const panRef = useRef(pan);
  const resetKey = open
    ? `${src ?? ""}|${assetCanisterId ?? ""}|${tokenId ?? ""}`
    : "";

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  useEffect(() => {
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

  function updateScale(nextScale: number) {
    const clamped = clampScale(nextScale);
    setScale(clamped);

    if (clamped <= MIN_SCALE) {
      setPan({ x: 0, y: 0 });
    }
  }

  function zoomBy(amount: number) {
    setScale((current) => {
      const next = clampScale(current + amount);
      if (next <= MIN_SCALE) setPan({ x: 0, y: 0 });
      return next;
    });
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
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

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const point = pointFromEvent(event);
    activePointers.current.set(event.pointerId, point);

    const points = Array.from(activePointers.current.values());
    if (points.length >= 2) {
      pinchStart.current = {
        distance: distanceBetween(points[0], points[1]),
        scale,
      };
      dragStart.current = null;
      return;
    }

    if (scale > MIN_SCALE) {
      dragStart.current = { point, pan: panRef.current };
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
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
      y: dragStart.current.pan.y + point.y - dragStart.current.point.y,
    });
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
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
        pan: panRef.current,
      };
    } else {
      dragStart.current = null;
    }
  }

  const transformStyle: CSSProperties = {
    transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
    transformOrigin: "center center",
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          "group relative block overflow-hidden border-0 bg-transparent p-0 text-left",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          buttonClassName,
        )}
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
        aria-label={`Open ${alt} full screen`}
        data-ocid={dataOcid}
      >
        <MediaImage
          src={src}
          alt={alt}
          assetCanisterId={assetCanisterId}
          tokenId={tokenId}
          preferThumbnail={preferThumbnail}
          fallback={fallback}
          className={className}
          {...imageProps}
        />

        <span className="pointer-events-none absolute bottom-2 right-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/85 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="z-[70] flex h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden border-border bg-background/95 p-0 shadow-2xl sm:max-w-none"
          data-ocid={`${dataOcid ?? "nft.image"}.viewer_dialog`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-border bg-card/95 p-3">
            <DialogHeader className="min-w-0 flex-1 gap-0 text-left">
              <DialogTitle className="truncate font-display text-sm text-foreground">
                {viewerTitle ?? alt}
              </DialogTitle>
            </DialogHeader>

            <div className="flex shrink-0 items-center gap-1.5">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() => zoomBy(-SCALE_STEP)}
                disabled={scale <= MIN_SCALE}
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" aria-hidden="true" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() => zoomBy(SCALE_STEP)}
                disabled={scale >= MAX_SCALE}
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" aria-hidden="true" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={resetView}
                aria-label="Reset zoom"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setOpen(false)}
                aria-label="Close image viewer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div
            className="relative min-h-0 flex-1 overflow-hidden bg-black/90"
            style={{ touchAction: "none" }}
            onWheel={handleWheel}
            onDoubleClick={handleDoubleClick}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur-sm hover:bg-black/85 hover:text-white focus-visible:ring-white/70"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                setOpen(false);
              }}
              aria-label="Close expanded image"
              data-ocid={`${dataOcid ?? "nft.image"}.viewer_close_button`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>

            <MediaImage
              src={src}
              alt={alt}
              assetCanisterId={assetCanisterId}
              tokenId={tokenId}
              preferThumbnail={preferThumbnail}
              fallback={fallback}
              draggable={false}
              className={cn(
                "h-full w-full select-none object-contain will-change-transform",
                scale > MIN_SCALE
                  ? "cursor-grab active:cursor-grabbing"
                  : "cursor-zoom-in",
              )}
              style={transformStyle}
            />

            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {Math.round(scale * 100)}%
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
