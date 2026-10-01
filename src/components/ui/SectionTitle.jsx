import OrnamentDivider from "./OrnamentDivider.jsx";

export default function SectionTitle({ id, title, subtitle, className = "" }) {
  return (
    <header className={`text-center ${className}`}>
      <h2 id={id} className="section-title">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-xl text-[1.05rem] italic text-[var(--color-brown)]">{subtitle}</p>
      )}
      <OrnamentDivider className="mt-7" />
    </header>
  );
}
