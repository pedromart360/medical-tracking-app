import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { anos, meses } from "@/lib/data";
import { useProntuario } from "@/lib/adicionados";
import {
  MODULOS,
  corModulo,
  nomeModulo,
  pontoModulo,
  useEventos,
  type EventoCalendario,
  type ModuloEvento,
} from "@/lib/eventos";
import { Timeline } from "@/components/Timeline";

const TOTAL = anos.length * 12;
const semana = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const pad = (v: number) => String(v).padStart(2, "0");

export function CalendarOverlay({
  onClose,
  modulo: moduloInicial = "todos",
}: {
  onClose: () => void;
  modulo?: ModuloEvento | "todos";
}) {
  // pos = índice do ponto na linha do tempo (anos exibidos do mais recente ao mais antigo)
  const [pos, setPos] = useState(0);
  const [dia, setDia] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<ModuloEvento | "todos">(moduloInicial);

  const prontuario = useProntuario();
  const eventos = useEventos(prontuario);

  const anoIndex = Math.floor(pos / 12);
  const mesIndex = pos % 12;
  const mes = meses[mesIndex] as string;
  const ano = anos[anoIndex] as number;
  const diasNoMes = new Date(ano, mesIndex + 1, 0).getDate();
  const offset = new Date(ano, mesIndex, 1).getDay();

  // índice cronológico: 0 = Janeiro do ano mais antigo ... TOTAL-1 = Dezembro do mais recente
  const cron = (anos.length - 1 - anoIndex) * 12 + mesIndex;

  const ir = (delta: number) => {
    const alvo = Math.min(TOTAL - 1, Math.max(0, cron + delta));
    const ai = anos.length - 1 - Math.floor(alvo / 12);
    setPos(ai * 12 + (alvo % 12));
    setDia(null);
  };

  const filtrar = (lista: EventoCalendario[]) =>
    filtro === "todos" ? lista : lista.filter((e) => e.modulo === filtro);

  const doDia = (data: string) => filtrar(eventos.get(data) ?? []);

  /* grade fixa de 6 semanas (42 células), independente do mês */
  const celulas = useMemo(() => {
    const lista: { data: string; numero: number; doMes: boolean }[] = [];
    const inicio = new Date(ano, mesIndex, 1 - offset);
    for (let i = 0; i < 42; i++) {
      const d = new Date(inicio);
      d.setDate(inicio.getDate() + i);
      lista.push({
        data: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
        numero: d.getDate(),
        doMes: d.getMonth() === mesIndex && d.getFullYear() === ano,
      });
    }
    return lista;
  }, [ano, mesIndex, offset, diasNoMes]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (dia) setDia(null);
        else onClose();
      }
      if (e.key === "ArrowLeft") ir(-1);
      if (e.key === "ArrowRight") ir(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const seta =
    "flex size-[clamp(2.25rem,3.4vw,3rem)] items-center justify-center rounded-full bg-card text-foreground shadow-[0_2px_10px_-4px_rgba(0,0,0,0.25)] transition-colors hover:bg-background disabled:opacity-25 disabled:shadow-none";

  const eventosDoDia = dia ? doDia(dia) : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/10 p-[clamp(0.5rem,3vw,2.5rem)] backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Calendário do prontuário"
        className="relative flex max-h-[95vh] w-full max-w-[1200px] flex-col gap-[clamp(0.75rem,1.8vw,1.5rem)] rounded-[clamp(1.5rem,3vw,2.5rem)] bg-card p-[clamp(1rem,2.2vw,2rem)] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]"
      >
        {/* cabeçalho com filtros por módulo */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {MODULOS.map((m) => (
              <button
                key={m.id}
                onClick={() => setFiltro(m.id)}
                className={`h-[clamp(2rem,2.6vw,2.5rem)] rounded-full px-[clamp(0.75rem,1.4vw,1.25rem)] text-[clamp(0.75rem,1.1vw,0.9375rem)] transition-colors ${
                  filtro === m.id
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-border"
                }`}
              >
                {m.nome}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
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
              <div className="mx-auto flex w-full max-w-[min(100%,720px)] flex-col overflow-y-auto rounded-[clamp(1rem,2.4vw,1.75rem)] bg-muted p-[clamp(1rem,3vw,2.25rem)]">
                <h2 className="text-center text-[clamp(1.25rem,2.6vw,2rem)] font-medium">{dia}</h2>
                <div className="mt-6 space-y-2.5">
                  {eventosDoDia.length === 0 ? (
                    <p className="py-10 text-center text-muted-foreground">
                      Nenhum registro neste dia.
                    </p>
                  ) : (
                    eventosDoDia.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between gap-4 rounded-full bg-card px-[clamp(1rem,2vw,1.75rem)] py-3.5 text-[clamp(0.8125rem,1.4vw,1rem)]"
                      >
                        <span className="min-w-0 flex-1 truncate">
                          {r.titulo}
                          <span className="ml-2 text-muted-foreground">{r.detalhe}</span>
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-[0.75em] ${corModulo[r.modulo]}`}
                        >
                          {nomeModulo[r.modulo]}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex min-h-0 flex-1 items-center gap-[clamp(0.5rem,1.8vw,1.5rem)]">
                <button
                  aria-label="Mês anterior"
                  disabled={cron === 0}
                  onClick={() => ir(-1)}
                  className={`hidden sm:flex ${seta}`}
                >
                  <ChevronLeft className="size-[clamp(1.25rem,2.2vw,1.75rem)]" strokeWidth={2.5} />
                </button>

                <div className="flex max-h-full min-w-0 flex-1 flex-col overflow-y-auto px-[clamp(0.25rem,1.5vw,1.5rem)] py-[clamp(0.5rem,1.4vw,1rem)]">
                  <h2 className="flex items-baseline justify-center gap-2 text-center text-[clamp(1.375rem,4vw,2.25rem)] font-normal lowercase">
                    {mes}
                    <span className="text-[0.45em] tracking-wide text-muted-foreground">{ano}</span>
                  </h2>

                  <div className="mx-auto mt-[clamp(1.5rem,3.4vw,2.75rem)] w-full max-w-[min(100%,58vh)]">
                    <div className="grid grid-cols-7 gap-x-[1.5%] text-center text-[clamp(0.5rem,1.5vw,0.8125rem)] uppercase tracking-[0.1em] text-muted-foreground/70">
                      {semana.map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                    </div>

                    <div className="mt-[clamp(0.875rem,2.2vw,1.75rem)] grid grid-cols-7 gap-x-[1.5%] gap-y-[clamp(0.375rem,1.4vw,1rem)]">
                      {celulas.map((c) => {
                        const lista = c.doMes ? doDia(c.data) : [];
                        const pontos = lista.slice(0, 4);
                        const extra = lista.length - pontos.length;
                        return (
                          <button
                            key={c.data}
                            onClick={() => setDia(c.data)}
                            className="group flex aspect-[1/0.95] flex-col items-center justify-center gap-[12%] rounded-2xl transition-colors hover:bg-muted/70"
                          >
                            <span
                              className={`text-[clamp(0.75rem,2.2vw,1.25rem)] font-normal leading-none ${
                                c.doMes ? "text-foreground" : "text-muted-foreground/30"
                              }`}
                            >
                              {pad(c.numero)}
                            </span>
                            <span className="flex h-[clamp(0.25rem,0.7vw,0.4375rem)] items-center justify-center gap-[0.2em]">
                              {pontos.map((e) => (
                                <span
                                  key={e.id}
                                  className={`size-[clamp(0.25rem,0.7vw,0.4375rem)] rounded-full ${pontoModulo[e.modulo]}`}
                                />
                              ))}
                              {extra > 0 ? (
                                <span className="ml-[0.15em] text-[clamp(0.4375rem,1vw,0.625rem)] leading-none text-muted-foreground">
                                  +{extra}
                                </span>
                              ) : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  aria-label="Próximo mês"
                  disabled={cron === TOTAL - 1}
                  onClick={() => ir(1)}
                  className={`hidden sm:flex ${seta}`}
                >
                  <ChevronRight className="size-[clamp(1.25rem,2.2vw,1.75rem)]" strokeWidth={2.5} />
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
          <Timeline
            activeIndex={pos}
            onSelect={(i) => {
              setPos(i);
              setDia(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}
