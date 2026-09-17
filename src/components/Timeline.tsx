import { anos } from "@/lib/data";

export function Timeline({
  onClick,
  action,
  activeIndex,
  onSelect,
}: {
  onClick?: () => void;
  action?: React.ReactNode;
  activeIndex?: number;
  onSelect?: (index: number) => void;
}) {
  const dots = Array.from({ length: anos.length * 12 });

  return (
    <div className="flex items-center gap-[clamp(0.5rem,1.5vw,1rem)]">
      <div
        onClick={onClick}
        className={`min-w-0 flex-1 rounded-[clamp(1rem,2.4vw,2rem)] bg-card px-[clamp(1rem,2.4vw,2rem)] pb-3 pt-4 ${onClick ? "cursor-pointer" : ""}`}
      >
        <div className="flex justify-around text-[clamp(0.5625rem,0.9vw,0.6875rem)] tracking-wide text-muted-foreground">
          {anos.map((a) => (
            <span key={a}>{a}</span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          {dots.map((_, i) => {
            const dot = (
              <span
                className={`block rounded-full transition-colors ${
                  i === activeIndex
                    ? "size-2.5 bg-foreground"
                    : i % 6 === 0
                      ? "size-2.5 bg-border"
                      : "size-1.5 bg-border"
                }`}
              />
            );

            return onSelect ? (
              <button
                key={i}
                type="button"
                aria-label={`Mês ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(i);
                }}
                className="flex items-center justify-center py-1"
              >
                {dot}
              </button>
            ) : (
              <span key={i} className="flex items-center justify-center">
                {dot}
              </span>
            );
          })}
        </div>
        <div className="mt-2 flex items-end justify-between">
          {dots.map((_, i) => (
            <span
              key={i}
              className={`w-px bg-border ${i % 3 === 0 ? "h-2.5" : "h-1.5"} ${
                i % 3 === 0 ? "" : "hidden sm:block"
              }`}
            />
          ))}
        </div>
      </div>
      {action}
    </div>
  );
}
