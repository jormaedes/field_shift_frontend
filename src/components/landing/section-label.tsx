export function SectionLabel({
  children,
  tone = "light",
}: {
  children: string;
  tone?: "light" | "onSage" | "dark";
}) {
  const text =
    tone === "dark"
      ? "text-sage-200/80"
      : tone === "onSage"
        ? "text-solo-900"
        : "text-solo-600";

  const line =
    tone === "dark"
      ? "bg-solo-200"
      : tone === "onSage"
        ? "bg-solo-900"
        : "bg-solo-600";

  return (
    <p
      className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] ${text}`}
    >
      <span aria-hidden className={`h-px w-7 ${line}`} />
      {children}
    </p>
  );
}
