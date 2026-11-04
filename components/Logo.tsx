import { ChartNoAxesColumn } from "lucide-react";
import { cn } from "@/utils/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl bg-gold-gradient text-navy-900 shadow-gold",
        className,
      )}
    >
      <ChartNoAxesColumn className="h-5 w-5" strokeWidth={2.6} aria-hidden />
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoMark className="h-9 w-9 rounded-[10px]" />
      <span className="font-heading text-base font-bold tracking-[0.3em] text-white">ARLE</span>
    </div>
  );
}
