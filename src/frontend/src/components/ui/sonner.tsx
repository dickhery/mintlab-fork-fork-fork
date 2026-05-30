"use client";

import { useTheme } from "next-themes";
import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const toastSurfaceStyle: CSSProperties = {
  background: "oklch(0.98 0 0 / 0.92)",
  border: "1px solid oklch(1 0 0 / 0.68)",
  boxShadow: "0 12px 32px oklch(0.05 0 0 / 0.18)",
  color: "oklch(0.08 0 0)",
  WebkitBackdropFilter: "blur(14px)",
  backdropFilter: "blur(14px)",
};

const Toaster = ({
  className,
  style,
  theme: themeOverride,
  toastOptions,
  ...props
}: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={(themeOverride ?? theme) as ToasterProps["theme"]}
      className={className ? `toaster group ${className}` : "toaster group"}
      style={
        {
          "--normal-bg": "oklch(0.98 0 0 / 0.92)",
          "--normal-text": "oklch(0.08 0 0)",
          "--normal-border": "oklch(1 0 0 / 0.68)",
          ...style,
        } as CSSProperties
      }
      toastOptions={{
        ...toastOptions,
        style: {
          ...toastSurfaceStyle,
          ...toastOptions?.style,
        },
        classNames: {
          description: "text-neutral-700",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
