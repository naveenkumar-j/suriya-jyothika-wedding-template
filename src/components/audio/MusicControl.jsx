import { motion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { wedding } from "../../data/weddingData.js";

export default function MusicControl() {
  const { playing, toggleMusic } = useApp();

  return (
    <motion.button
      type="button"
      onClick={toggleMusic}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="fixed right-5 bottom-5 z-[65] flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--color-champagne)] bg-[var(--color-ivory)] text-[var(--color-charcoal)] shadow-[0_10px_30px_-16px_rgba(43,38,34,0.5)] transition-colors hover:border-[var(--color-gold)] sm:right-8 sm:bottom-8"
      aria-pressed={playing}
      aria-label={playing ? `Pause ${wedding.audio.label}` : `Play ${wedding.audio.label}`}
      title={wedding.audio.label}
    >
      {playing && (
        <span
          className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-[var(--color-gold)] opacity-40"
          aria-hidden="true"
          style={{ animationDuration: "2.8s" }}
        />
      )}
      {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
      <span className="sr-only">{playing ? "Sound on" : "Sound off"}</span>
    </motion.button>
  );
}
