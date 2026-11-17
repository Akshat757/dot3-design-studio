import Link from "next/link";

// Text wordmark with the three-dot motif until the client's vector logo arrives.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`} aria-label="DOT THREE Design Studio, home">
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className="bg-accent/80 size-2 rounded-full" />
        ))}
      </span>
      <span className="display text-xl tracking-[0.25em] uppercase">Dot Three</span>
    </Link>
  );
}
