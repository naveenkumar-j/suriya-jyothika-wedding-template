import { useState } from "react";
import Poster from "./Poster.jsx";

export default function SmartImage({ src, alt, width, height, seed = 1, variant, eager = false, className = "", imgClassName = "" }) {
  const [failed, setFailed] = useState(false);
  const ratio = `${width} / ${height}`;

  if (failed || !src) {
    return (
      <div className={`overflow-hidden ${className}`} style={{ aspectRatio: ratio }}>
        <Poster seed={seed} variant={variant} width={width} height={height} alt={alt} className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`} style={{ aspectRatio: ratio }}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
