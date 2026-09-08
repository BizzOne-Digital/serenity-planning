"use client";

import { useState } from "react";

const FALLBACK = "/placeholder-image.svg";

function isSafeSrc(src?: string | null): boolean {
  if (!src) return false;
  if (src.startsWith("/uploads/")) return false; // legacy local uploads no longer exist
  if (src.startsWith("/api/uploads/")) return true;
  if (src.startsWith("https://")) return true;
  // Same-origin static assets under /public (e.g. /hero.png, /logo.png)
  if (src.startsWith("/") && !src.startsWith("//") && !src.includes("..")) return true;
  return false;
}

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
  alt: string;
}

export default function SafeImage({ src, alt, className, ...rest }: SafeImageProps) {
  const initial = isSafeSrc(src) ? (src as string) : FALLBACK;
  const [resolvedSrc, setResolvedSrc] = useState(initial);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (resolvedSrc !== FALLBACK) setResolvedSrc(FALLBACK);
      }}
      {...rest}
    />
  );
}
