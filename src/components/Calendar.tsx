import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { anos, marcadores, meses, registrosDoDia } from "@/lib/data";
import { Timeline } from "@/components/Timeline";

const TOTAL = anos.length * 12;
const semana = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export function CalendarOverlay({ onClose }: { onClose: () => void }) {
  // pos = índice do ponto na linha do tempo (anos exibidos do mais recente ao mais antigo)
  const [pos, setPos] = useState(0);
  const [dia, setDia] = useState<string | null>(null);

  const anoIndex = Math.floor(pos / 12);
  const mesIndex = pos % 12;
  const mes = meses[mesIndex] as string;
  const ano = anos[anoIndex] as number;
  const dias = new Date(ano, mesIndex + 1, 0).getDate();
  const offset = new Date(ano, mesIndex, 1).getDay();
  const badges = marcadores[mes] ?? {};

  // índice cronológico: 0 = Janeiro do ano mais antigo ... TOTAL-1 = Dezembro do mais recente
  const cron = (anos.length - 1 - anoIndex) * 12 + mesIndex;

  const ir = (delta: number) => {
    const alvo = Math.min(TOTAL - 1, Math.max(0, cron + delta));
    const ai = anos.length - 1 - Math.floor(alvo / 12);
    setPos(ai * 12 + (alvo % 12));
  };

  const seta =
    "flex size-[clamp(2.25rem,3.4vw,2.75rem)] items-center justify-center rounded-full bg-card text-foreground shadow-[0_2px_10px_-4px_rgba(0,0,0,0.25)] transition-colors hover:bg-background disabled:opacity-25 disabled:shadow-none";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/10 p-[clamp(0.5rem,3vw,3rem)] backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[95vh] w-full max-w-[1120px] flex-col gap-[clamp(0.5rem,2vw,1.25rem)] rounded-[clamp(1.5rem,3vw,2.5rem)] bg-card p-[clamp(0.75rem,2vw,1.5rem)] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]"
      >
        <div className="flex shrink-0 items-center justify-center">
          <div className="h-1 w-16 rounded-full bg-border" />
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-[clamp(0.75rem,2vw,1.5rem)] flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

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
              <div className="mx-auto flex w-full max-w-[min(100%,640px)] flex-col overflow-y-auto rounded-[clamp(1rem,2.4vw,1.75rem)] bg-muted p-[clamp(1rem,3vw,2rem)]">
                <h2 className="text-center text-[clamp(1.25rem,2.6vw,2rem)] font-medium">
                  {dia}
                </h2>
                <div className="mt-6 space-y-2">
                  {registrosDoDia.map((r) => (
                    <div
                      key={r.titulo}
                      className="flex items-center justify-between gap-4 rounded-full bg-card px-[clamp(1rem,2vw,1.5rem)] py-3 text-[clamp(0.8125rem,1.4vw,1rem)]"
                    >
                      <span className="truncate">{r.titulo}</span>
                      <span className="shrink-0 text-muted-foreground">
                        {r.categoria}
                      </span>
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
                    className="size-[clamp(1.25rem,2.2vw,1.75rem)]"
                    strokeWidth={2.5}
                  />
                </button>

                <div className="flex max-h-full min-w-0 flex-1 flex-col overflow-y-auto rounded-[clamp(1rem,2.4vw,1.75rem)] bg-muted px-[clamp(0.75rem,3vw,3rem)] py-[clamp(1rem,2.5vw,2rem)]">
                  <h2 className="flex items-baseline justify-center gap-2 text-center text-[clamp(1.5rem,3vw,2.5rem)] font-medium lowercase">
                    {mes}
                    <span className="text-[0.4em] tracking-wide text-muted-foreground">
                      {ano}
                    </span>
                  </h2>

                  <div className="mx-auto mt-[clamp(1rem,2.4vw,2rem)] w-full max-w-[min(100%,62vh)]">
                    <div className="grid grid-cols-7 gap-[2.5%] px-[1%] text-center text-[clamp(0.5rem,1vw,0.75rem)] uppercase tracking-[0.12em] text-muted-foreground">
                      {semana.map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                    </div>

                    <div className="mt-[clamp(0.5rem,1.2vw,0.875rem)] grid grid-cols-7 gap-[2.5%]">
                      {Array.from({ length: offset }).map((_, i) => (
                        <span key={`v${i}`} className="aspect-square" />
                      ))}
                      {Array.from({ length: dias }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() =>
                            setDia(
                              `${String(i + 1).padStart(2, "0")}/${String(mesIndex + 1).padStart(2, "0")}/${ano}`,
                            )
                          }
                          className="relative flex aspect-square items-center justify-center rounded-full bg-card text-[clamp(0.625rem,1.3vw,1.125rem)] text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                        >
                          {String(i + 1).padStart(2, "0")}
                          {badges[i] ? (
                            <span className="absolute -top-[12%] -right-[6%] flex size-[clamp(0.95rem,2vw,1.75rem)] items-center justify-center rounded-full bg-foreground text-[clamp(0.4rem,0.85vw,0.6875rem)] font-medium text-background">
                              +{badges[i]}
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  aria-label="Próximo mês"
                  disabled={cron === TOTAL - 1}
                  onClick={() => ir(1)}
                  className={`hidden sm:flex ${seta}`}
                >
                  <ChevronRight
                    className="size-[clamp(1.25rem,2.2vw,1.75rem)]"
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
                  <ChevronLeft className="size-5" strokeWidth={2.5} />
                </button>
                <button
                  aria-label="Próximo mês"
                  disabled={cron === TOTAL - 1}
                  onClick={() => ir(1)}
                  className={seta}
                >
                  <ChevronRight className="size-5" strokeWidth={2.5} />
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
