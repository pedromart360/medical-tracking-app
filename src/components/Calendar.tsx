import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { marcadores, meses, registrosDoDia } from "@/lib/data";

export function CalendarOverlay({ onClose }: { onClose: () => void }) {
  const [mesIndex, setMesIndex] = useState(0);
  const [dia, setDia] = useState<string | null>(null);
  const mes = meses[mesIndex];
  const dias = 30 + (mesIndex % 2 === 0 ? 1 : 0) - (mesIndex === 1 ? 3 : 0);
  const badges = marcadores[mes] ?? {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-[92vh] w-full max-w-[1100px] flex-col rounded-[2.5rem] bg-card p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]"
      >
        <div className="mx-auto h-1 w-16 rounded-full bg-border" />

        {dia ? (
          <>
            <button
              onClick={() => setDia(null)}
              className="absolute left-6 top-9 flex size-9 items-center justify-center rounded-full bg-border text-muted-foreground transition-colors hover:bg-muted-foreground/30"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="mx-auto mt-6 flex h-full w-[62%] flex-col rounded-[1.75rem] bg-muted p-8">
              <h2 className="text-center text-3xl font-medium">{dia}</h2>
              <div className="mt-10 space-y-5">
                {registrosDoDia.map((r) => (
                  <div
                    key={r.titulo}
                    className="flex items-center justify-between text-lg text-muted-foreground"
                  >
                    <span>{r.titulo}</span>
                    <span>{r.categoria}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="mt-4 flex flex-1 items-center gap-4">
            <button
              onClick={() => setMesIndex((i) => (i + meses.length - 1) % meses.length)}
              className="text-foreground/80 transition-transform hover:-translate-x-0.5"
            >
              <ChevronRight className="size-8 rotate-180" strokeWidth={2.5} />
            </button>

            <div className="flex h-full flex-1 flex-col rounded-[1.75rem] bg-muted p-8">
              <h2 className="text-center text-3xl font-medium">{mes}</h2>
              <div className="mt-8 grid grid-cols-7 gap-x-4 gap-y-5">
                {Array.from({ length: dias }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setDia(`${String(i + 1).padStart(2, "0")}/${String(mesIndex + 1).padStart(2, "0")}`)}
                    className="relative flex aspect-square items-center justify-center rounded-full bg-card text-sm text-muted-foreground transition-colors hover:bg-background"
                  >
                    {String(i + 1).padStart(2, "0")}/{String(mesIndex + 1).padStart(2, "0")}
                    {badges[i] ? (
                      <span className="absolute -top-3 right-2 flex size-8 items-center justify-center rounded-full bg-foreground text-[11px] font-medium text-background">
                        +{badges[i]}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMesIndex((i) => (i + 1) % meses.length)}
              className="text-foreground/80 transition-transform hover:translate-x-0.5"
            >
              <ChevronRight className="size-8" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
