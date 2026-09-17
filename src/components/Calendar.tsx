import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { marcadores, meses, registrosDoDia } from "@/lib/data";
import { Timeline } from "@/components/Timeline";

export function CalendarOverlay({ onClose }: { onClose: () => void }) {
  const [mesIndex, setMesIndex] = useState(0);
  const [dia, setDia] = useState<string | null>(null);
  const mes = meses[mesIndex] as string;
  const dias = 30 + (mesIndex % 2 === 0 ? 1 : 0) - (mesIndex === 1 ? 3 : 0);
  const badges = marcadores[mes] ?? {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[clamp(0.75rem,3vw,3rem)]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[95vh] w-full max-w-[1120px] flex-col gap-[clamp(0.75rem,2vw,1.5rem)] rounded-[clamp(1.5rem,3vw,2.5rem)] bg-card p-[clamp(0.75rem,2vw,1.5rem)] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]"
      >
        <div className="mx-auto h-1 w-16 shrink-0 rounded-full bg-border" />

        <div className="relative flex min-h-0 flex-1 items-center">
          {dia ? (
            <>
              <button
                onClick={() => setDia(null)}
                className="absolute left-0 top-0 z-10 flex size-9 items-center justify-center rounded-full bg-border text-muted-foreground transition-colors hover:bg-muted-foreground/30"
              >
                <ChevronLeft className="size-4" />
              </button>
              <div className="mx-auto flex h-full w-[70%] flex-col overflow-y-auto rounded-[clamp(1rem,2.4vw,1.75rem)] bg-muted p-[clamp(1rem,3vw,2rem)]">
                <h2 className="text-center text-[clamp(1.25rem,2.6vw,2rem)] font-medium">
                  {dia}
                </h2>
                <div className="mt-8 space-y-5">
                  {registrosDoDia.map((r) => (
                    <div
                      key={r.titulo}
                      className="flex items-center justify-between text-[clamp(0.875rem,1.4vw,1.125rem)] text-muted-foreground"
                    >
                      <span>{r.titulo}</span>
                      <span>{r.categoria}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <button
                aria-label="Mês anterior"
                onClick={() =>
                  setMesIndex((i) => (i + meses.length - 1) % meses.length)
                }
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 text-foreground transition-transform hover:-translate-x-0.5 hover:-translate-y-1/2"
              >
                <ChevronLeft className="size-[clamp(1.5rem,2.6vw,2rem)]" strokeWidth={2.5} />
              </button>

              <div className="mx-[clamp(1.75rem,4vw,3.5rem)] flex max-h-full w-full flex-col overflow-y-auto rounded-[clamp(1rem,2.4vw,1.75rem)] bg-muted px-[clamp(0.75rem,3vw,3rem)] py-[clamp(1rem,3vw,2.5rem)]">
                <h2 className="text-center text-[clamp(1.5rem,3vw,2.5rem)] font-medium">
                  {mes}
                </h2>
                <div className="mt-[clamp(1.5rem,3vw,2.5rem)] grid grid-cols-7 gap-[clamp(0.35rem,1.2vw,1rem)]">
                  {Array.from({ length: dias }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setDia(
                          `${String(i + 1).padStart(2, "0")}/${String(mesIndex + 1).padStart(2, "0")}`,
                        )
                      }
                      className="relative flex aspect-square items-center justify-center rounded-full bg-card text-[clamp(0.5rem,1.05vw,0.9375rem)] text-muted-foreground transition-colors hover:bg-background"
                    >
                      {String(i + 1).padStart(2, "0")}/
                      {String(mesIndex + 1).padStart(2, "0")}
                      {badges[i] ? (
                        <span className="absolute -top-[18%] right-[6%] flex size-[clamp(1.25rem,2.4vw,2.25rem)] items-center justify-center rounded-full bg-foreground text-[clamp(0.5rem,0.9vw,0.75rem)] font-medium text-background">
                          +{badges[i]}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              <button
                aria-label="Próximo mês"
                onClick={() => setMesIndex((i) => (i + 1) % meses.length)}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 text-foreground transition-transform hover:translate-x-0.5 hover:-translate-y-1/2"
              >
                <ChevronRight className="size-[clamp(1.5rem,2.6vw,2rem)]" strokeWidth={2.5} />
              </button>
            </>
          )}
        </div>

        <div className="shrink-0 px-[clamp(0.25rem,1.5vw,1rem)]">
          <Timeline activeIndex={12} />
        </div>
      </div>
    </div>
  );
}
