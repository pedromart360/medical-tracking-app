import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { anos, marcadores, meses, registrosDoDia } from "@/lib/data";
import { Timeline } from "@/components/Timeline";

const TOTAL = anos.length * 12;

export function CalendarOverlay({ onClose }: { onClose: () => void }) {
  // pos = índice do ponto na linha do tempo (anos exibidos do mais recente ao mais antigo)
  const [pos, setPos] = useState(0);
  const [dia, setDia] = useState<string | null>(null);

  const anoIndex = Math.floor(pos / 12);
  const mesIndex = pos % 12;
  const mes = meses[mesIndex] as string;
  const ano = anos[anoIndex] as number;
  const dias = new Date(ano, mesIndex + 1, 0).getDate();
  const badges = marcadores[mes] ?? {};

  // índice cronológico: 0 = Janeiro do ano mais antigo ... TOTAL-1 = Dezembro do mais recente
  const cron = (anos.length - 1 - anoIndex) * 12 + mesIndex;

  const ir = (delta: number) => {
    const alvo = Math.min(TOTAL - 1, Math.max(0, cron + delta));
    const ai = anos.length - 1 - Math.floor(alvo / 12);
    setPos(ai * 12 + (alvo % 12));
  };

  const seta =
    "flex size-[clamp(2rem,3.4vw,2.75rem)] items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted disabled:opacity-30";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[clamp(0.5rem,3vw,3rem)]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[95vh] w-full max-w-[1120px] flex-col gap-[clamp(0.5rem,2vw,1.5rem)] rounded-[clamp(1.5rem,3vw,2.5rem)] bg-card p-[clamp(0.75rem,2vw,1.5rem)] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]"
      >
        <div className="mx-auto h-1 w-16 shrink-0 rounded-full bg-border" />

        <div className="flex min-h-0 flex-1 flex-col">
          {dia ? (
            <div className="relative flex min-h-0 flex-1">
              <button
                onClick={() => setDia(null)}
                aria-label="Voltar"
                className="absolute left-0 top-0 z-10 flex size-9 items-center justify-center rounded-full bg-border text-muted-foreground transition-colors hover:bg-muted-foreground/30"
              >
                <ChevronLeft className="size-4" />
              </button>
              <div className="mx-auto flex w-full max-w-[70%] flex-col overflow-y-auto rounded-[clamp(1rem,2.4vw,1.75rem)] bg-muted p-[clamp(1rem,3vw,2rem)]">
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
            </div>
          ) : (
            <>
              <div className="flex min-h-0 flex-1 items-center gap-[clamp(0.25rem,1.5vw,1rem)]">
                <button
                  aria-label="Mês anterior"
                  disabled={cron === 0}
                  onClick={() => ir(-1)}
                  className={`hidden sm:flex ${seta}`}
                >
                  <ChevronLeft
                    className="size-[clamp(1.5rem,2.6vw,2rem)]"
                    strokeWidth={2.5}
                  />
                </button>

                <div className="flex max-h-full min-w-0 flex-1 flex-col overflow-y-auto rounded-[clamp(1rem,2.4vw,1.75rem)] bg-muted px-[clamp(0.75rem,3vw,3rem)] py-[clamp(1rem,3vw,2.5rem)]">
                  <h2 className="flex items-baseline justify-center gap-2 text-center text-[clamp(1.5rem,3vw,2.5rem)] font-medium">
                    {mes}
                    <span className="text-[0.45em] text-muted-foreground">
                      {ano}
                    </span>
                  </h2>
                  <div className="mt-[clamp(1.25rem,3vw,2.5rem)] grid grid-cols-7 gap-[2.5%]">
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
                          <span className="absolute -top-[18%] right-[6%] flex size-[clamp(1.1rem,2.4vw,2.25rem)] items-center justify-center rounded-full bg-foreground text-[clamp(0.45rem,0.9vw,0.75rem)] font-medium text-background">
                            +{badges[i]}
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  aria-label="Próximo mês"
                  disabled={cron === TOTAL - 1}
                  onClick={() => ir(1)}
                  className={`hidden sm:flex ${seta}`}
                >
                  <ChevronRight
                    className="size-[clamp(1.5rem,2.6vw,2rem)]"
                    strokeWidth={2.5}
                  />
                </button>
              </div>

              <div className="mt-3 flex shrink-0 items-center justify-center gap-6 sm:hidden">
                <button
                  aria-label="Mês anterior"
                  disabled={cron === 0}
                  onClick={() => ir(-1)}
                  className={seta}
                >
                  <ChevronLeft className="size-6" strokeWidth={2.5} />
                </button>
                <button
                  aria-label="Próximo mês"
                  disabled={cron === TOTAL - 1}
                  onClick={() => ir(1)}
                  className={seta}
                >
                  <ChevronRight className="size-6" strokeWidth={2.5} />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="shrink-0 px-[clamp(0.25rem,1.5vw,1rem)]">
          <Timeline activeIndex={pos} onSelect={setPos} />
        </div>
      </div>
    </div>
  );
}
