"use client";

import { useState } from "react";
import Image from "next/image";

const FALLBACK = "/placeholder-image.svg";

function isSafeSrc(src?: string | null): boolean {
  if (!src) return false;
  if (src.startsWith("/uploads/")) return false; // legacy local uploads no longer exist
  if (src.startsWith("/api/uploads/")) return true;
  if (src.startsWith("https://")) return true;
  // Same-origin static assets under /public (e.g. /hero.jpg, /logo.png)
  if (src.startsWith("/") && !src.startsWith("//") && !src.includes("..")) return true;
  return false;
}

/** Static files in /public go through the Next.js optimizer (AVIF/WebP + srcset). */
function isOptimizable(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("/api/") && !src.endsWith(".svg");
}

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> {
  src?: string | null;
  alt: string;
  /** Intrinsic width/height. When given, the image renders via next/image with a responsive srcset. */
  width?: number;
  height?: number;
  /** Rendered width hint for the srcset, e.g. "(min-width: 1024px) 33vw, 100vw". */
  sizes?: string;
  priority?: boolean;
}

export default function SafeImage({ src, alt, className, width, height, sizes, priority, ...rest }: SafeImageProps) {
  const initial = isSafeSrc(src) ? (src as string) : FALLBACK;
  const [resolvedSrc, setResolvedSrc] = useState(initial);
  const onError = () => {
    if (resolvedSrc !== FALLBACK) setResolvedSrc(FALLBACK);
  };

  if (width && height) {
    return (
      <Image
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        unoptimized={!isOptimizable(resolvedSrc)}
        className={className}
        onError={onError}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={resolvedSrc} alt={alt} className={className} loading="lazy" onError={onError} {...rest} />
  );
}
