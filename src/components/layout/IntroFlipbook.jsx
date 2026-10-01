import { useEffect } from "react";
import { motion } from "motion/react";
import { useFrameSequence } from "../../hooks/useFrameSequence.js";

export default function IntroFlipbook({ frames, fps, alt, onDone }) {
  const { index, isDone } = useFrameSequence({ frames, fps });

  useEffect(() => {
    if (isDone) onDone();
  }, [isDone, onDone]);

  return (
    <motion.div
      className="absolute inset-0"
      role="img"
      aria-label={alt}
      data-frame-index={index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {frames.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          width={576}
          height={1024}
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}
    </motion.div>
  );
}
