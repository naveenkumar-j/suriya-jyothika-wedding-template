export default function OrnamentDivider({ className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-14 bg-[linear-gradient(90deg,transparent,var(--color-gold))] sm:w-20" />
      <span className="text-[1.05rem] leading-none text-[var(--color-gold)]">{"❖"}</span>
      <span className="h-px w-14 bg-[linear-gradient(90deg,var(--color-gold),transparent)] sm:w-20" />
    </div>
  );
}
