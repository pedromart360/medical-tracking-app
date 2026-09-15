import { anos } from "@/lib/data";

export function Timeline({
  onClick,
  action,
  activeIndex,
}: {
  onClick?: () => void;
  action?: React.ReactNode;
  activeIndex?: number;
}) {
  const dots = Array.from({ length: 48 });

  return (
    <div className="flex items-center gap-4">
      <div
        onClick={onClick}
        className={`flex-1 rounded-[2rem] bg-card px-8 pb-3 pt-4 ${onClick ? "cursor-pointer" : ""}`}
      >
        <div className="flex justify-around text-[11px] tracking-wide text-muted-foreground">
          {anos.map((a) => (
            <span key={a}>{a}</span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          {dots.map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-colors ${
                i === activeIndex
                  ? "size-2.5 bg-foreground"
                  : i % 6 === 0
                    ? "size-2.5 bg-border"
                    : "size-1.5 bg-border"
              }`}
            />
          ))}
        </div>
        <div className="mt-2 flex items-end justify-between">
          {dots.map((_, i) => (
            <span
              key={i}
              className={`w-px bg-border ${i % 3 === 0 ? "h-2.5" : "h-1.5"}`}
            />
          ))}
        </div>
      </div>
      {action}
    </div>
  );
}
