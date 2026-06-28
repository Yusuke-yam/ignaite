"use client";

import Image from "next/image";
import { type CSSProperties, useState } from "react";

type SafeImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: "eager" | "lazy";
};

export function SafeImage({
  src,
  alt,
  width,
  height,
  className = "",
  loading,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const normalizedSrc =
    src.startsWith("/") || /^[a-z][a-z\d+.-]*:/i.test(src) ? src : `/${src}`;

  if (failed) {
    const fallbackStyle = {
      "--safe-image-width": `${width}px`,
      "--safe-image-ratio": `${width} / ${height}`,
    } as CSSProperties;

    return (
      <span
        role={alt ? "img" : undefined}
        aria-label={alt ? `${alt}を表示できません` : undefined}
        aria-hidden={alt ? undefined : true}
        data-safe-image=""
        data-safe-image-fallback=""
        className={className}
        style={fallbackStyle}
      />
    );
  }

  return (
    <Image
      src={normalizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-safe-image=""
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
}
