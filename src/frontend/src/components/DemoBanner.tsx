import { ShieldAlert } from "lucide-react";

export function DemoBanner() {
  return (
    <div
      className="w-full bg-accent/20 border-b border-accent/30 py-2 px-4 flex items-center justify-center gap-2"
      role="banner"
      aria-label="Demo disclaimer"
      data-ocid="demo.banner"
    >
      <ShieldAlert className="w-3.5 h-3.5 text-accent flex-shrink-0" />
      <span className="text-accent font-display font-semibold text-xs tracking-widest uppercase">
        DEMO – NO REAL TRANSACTIONS
      </span>
      <ShieldAlert className="w-3.5 h-3.5 text-accent flex-shrink-0" />
    </div>
  );
}
