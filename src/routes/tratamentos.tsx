import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Search, X } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import {
  anos,
  meses,
  tratamentoTipos,
  type TratamentoRegistro,
} from "@/lib/data";
import { useProntuario } from "@/lib/adicionados";
import { exportarHistoricoPDF } from "@/lib/export-tratamentos";
import { imgTratamento } from "@/lib/imagens";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tratamentos")({
  head: () => ({
    meta: [
      { title: "Tratamentos — Lyna" },
      { name: "description", content: "Tratamentos domiciliares, hospitalares e medicamentosos com períodos." },
      { property: "og:title", content: "Tratamentos — Lyna" },
      { property: "og:description", content: "Tratamentos e períodos de aplicação." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tratamentos,
});

const pad = (v: number) => String(v).padStart(2, "0");
const semana = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const TOTAL_MESES = anos.length * 12;

function useResumo(id: string | undefined) {
  const [texto, setTexto] = useState("");

  useEffect(() => {
    if (!id) return;
    setTexto(localStorage.getItem(`resumo-tratamento-${id}`) ?? "");
  }, [id]);

  const salvar = (v: string) => {
    setTexto(v);
    if (id) localStorage.setItem(`resumo-tratamento-${id}`, v);
  };

  return [texto, salvar] as const;
}

function Tratamentos() {
  const { tratamentos } = useProntuario();
  const [categoria, setCategoria] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [anoIndex, setAnoIndex] = useState(0);
  const [mesIndex, setMesIndex] = useState(0);
  const [diaAberto, setDiaAberto] = useState<string | null>(null);
  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);
  const [gerando, setGerando] = useState(false);

  const ano = anos[anoIndex]!;
  const mesNome = meses[mesIndex]!;
  const diasNoMes = new Date(ano, mesIndex + 1, 0).getDate();
  const offset = new Date(ano, mesIndex, 1).getDay();

  // índice cronológico: 0 = janeiro do ano mais antigo
  const cron = (anos.length - 1 - anoIndex) * 12 + mesIndex;

  const fechar = () => {
    setDiaAberto(null);
    setSelecionadoId(null);
  };

  const irMes = (delta: number) => {
    const alvo = Math.min(TOTAL_MESES - 1, Math.max(0, cron + delta));
    setAnoIndex(anos.length - 1 - Math.floor(alvo / 12));
    setMesIndex(alvo % 12);
    fechar();
  };

  const registros = useMemo(
    () =>
      tratamentos.filter(
        (t) => t.ano === ano && (categoria === null || t.categoria === categoria),
      ),
    [tratamentos, ano, categoria],
  );

  const mapaDias = useMemo(() => {
    const mapa = new Map<string, TratamentoRegistro[]>();
    for (const t of registros) {
      for (const dia of t.dias) mapa.set(dia, [...(mapa.get(dia) ?? []), t]);
    }
    return mapa;
  }, [registros]);

  const combinam = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return null;
    return registros.filter((t) => t.nome.toLowerCase().includes(q));
  }, [busca, registros]);

  const diasBusca = combinam ? new Set(combinam.flatMap((t) => t.dias)) : null;

  const doDia = diaAberto ? (mapaDias.get(diaAberto) ?? []) : [];
  const selecionado = doDia.find((t) => t.id === selecionadoId) ?? doDia[0];
  const [resumo, setResumo] = useResumo(selecionado?.id);

  const trocarCategoria = (slug: string) => {
    setCategoria((atual) => (atual === slug ? null : slug));
    fechar();
  };

  const exportar = async () => {
    setGerando(true);
    try {
      await exportarHistoricoPDF(ano, tratamentos);
    } finally {
      setGerando(false);
    }
  };

  const nomeTipo = (slug: string) => tratamentoTipos.find((t) => t.slug === slug)?.nome ?? slug;

  return (
    <PageShell label="" title="Tratamentos" backTo="/">
      <div className="grid gap-[clamp(1rem,2.5vw,2.5rem)] md:grid-cols-[minmax(0,36%)_minmax(0,1fr)]">
        {/* Coluna esquerda */}
        <div className="space-y-[clamp(0.625rem,1.4vw,1.25rem)]">
          <div className="flex items-center gap-2 rounded-full border border-border px-[clamp(1rem,1.8vw,1.75rem)] py-[clamp(0.375rem,0.8vw,0.625rem)]">
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar tratamento..."
              aria-label="Pesquisar tratamento"
              className="min-w-0 flex-1 bg-transparent py-1 text-[clamp(0.8125rem,1.2vw,1rem)] outline-none placeholder:text-muted-foreground"
            />
            {busca ? (
              <Button
                onClick={() => setBusca("")}
                variant="ghost"
                size="icon"
                aria-label="Limpar pesquisa"
                className="size-[clamp(1.5rem,2.4vw,2.25rem)] shrink-0 rounded-full bg-border text-muted-foreground hover:bg-muted-foreground/30"
              >
                <X className="size-[50%]" />
              </Button>
            ) : (
              <span className="flex size-[clamp(1.5rem,2.4vw,2.25rem)] shrink-0 items-center justify-center rounded-full bg-border text-muted-foreground">
                <Search className="size-[50%]" />
              </span>
            )}
          </div>

          {selecionado ? (
            <div className="rounded-[clamp(1.25rem,2vw,2rem)] bg-muted p-[clamp(0.875rem,1.6vw,1.5rem)]">
              <div className="flex items-center gap-3">
                <Button
                  onClick={fechar}
                  variant="secondary"
                  size="icon"
                  className="size-[clamp(1.5rem,2.2vw,2rem)] shrink-0 rounded-full bg-border text-muted-foreground hover:bg-muted-foreground/30"
                  aria-label="Fechar tratamento"
                >
                  <X className="size-[55%]" />
                </Button>
                <h2 className="min-w-0 flex-1 truncate text-[clamp(1rem,1.7vw,1.5rem)] font-medium">
                  {selecionado.nome}
                </h2>
                <span className="shrink-0 text-[clamp(0.6875rem,1vw,0.875rem)] text-muted-foreground">
                  {selecionado.periodo}
                </span>
              </div>

              {doDia.length > 1 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {doDia.map((t) => (
                    <Button
                      key={t.id}
                      onClick={() => setSelecionadoId(t.id)}
                      variant="ghost"
                      className={`h-auto rounded-full px-3 py-1 text-[clamp(0.625rem,0.95vw,0.8125rem)] ${
                        t.id === selecionado.id
                          ? "bg-foreground text-background hover:bg-foreground/90"
                          : "bg-card hover:bg-border"
                      }`}
                    >
                      {t.nome}
                    </Button>
                  ))}
                </div>
              )}

              <div className="mt-[clamp(0.75rem,1.4vw,1.25rem)] rounded-[clamp(1rem,1.6vw,1.5rem)] bg-card p-[clamp(0.75rem,1.4vw,1.25rem)]">
                <p className="text-[clamp(0.75rem,1.1vw,1rem)]">Dados do tratamento</p>
                <dl className="mt-3 space-y-1.5 text-[clamp(0.6875rem,1vw,0.9375rem)] text-muted-foreground">
                  <div className="flex gap-2">
                    <dt>Tipo:</dt>
                    <dd>{nomeTipo(selecionado.categoria)}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt>Pedido por:</dt>
                    <dd>
                      {selecionado.pedidoPor.medicoId ? (
                        <Link
                          to="/medicos/$esp/$doc"
                          params={{ esp: selecionado.pedidoPor.espSlug, doc: selecionado.pedidoPor.medicoId }}
                          className="underline underline-offset-2 transition-colors hover:text-foreground"
                        >
                          {selecionado.pedidoPor.nome}
                        </Link>
                      ) : (
                        <span>{selecionado.pedidoPor.nome}</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt>Realizado na data:</dt>
                    <dd>{selecionado.dataCompleta}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt>Realizado por:</dt>
                    <dd>{selecionado.realizadoPor}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt>Local:</dt>
                    <dd>{selecionado.local}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-[clamp(0.625rem,1.2vw,1rem)] rounded-[clamp(1rem,1.6vw,1.5rem)] border border-border p-[clamp(0.75rem,1.4vw,1.25rem)]">
                <label htmlFor="resumo-tratamento" className="text-[clamp(0.75rem,1.1vw,1rem)]">
                  Resumo
                </label>
                <textarea
                  id="resumo-tratamento"
                  value={resumo}
                  onChange={(e) => setResumo(e.target.value)}
                  placeholder="Escreva aqui um resumo do tratamento..."
                  className="mt-2 h-[clamp(3.5rem,7vw,6rem)] w-full resize-none bg-transparent text-[clamp(0.6875rem,1vw,0.9375rem)] outline-none placeholder:text-muted-foreground placeholder:underline"
                />
              </div>
            </div>
          ) : (
            <>
              {tratamentoTipos.map((t) => (
                <Button
                  key={t.slug}
                  onClick={() => trocarCategoria(t.slug)}
                  variant="ghost"
                  className={`h-[clamp(3.25rem,5.2vw,4.5rem)] w-full justify-between gap-[clamp(0.5rem,1vw,0.875rem)] rounded-[clamp(1.25rem,2vw,2rem)] pl-[clamp(1rem,1.8vw,1.75rem)] pr-[clamp(0.375rem,0.7vw,0.625rem)] text-[clamp(0.875rem,1.3vw,1.25rem)] font-normal ${
                    categoria === t.slug
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "bg-muted hover:bg-border"
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate text-left leading-[1.3]">{t.nome}</span>
                  <img
                    src={imgTratamento(t.slug)}
                    alt=""
                    loading="lazy"
                    className="size-[clamp(2.25rem,3.6vw,3.5rem)] shrink-0 rounded-full object-cover"
                  />

                </Button>
              ))}

              {combinam && (
                <p className="px-2 text-[clamp(0.6875rem,1vw,0.875rem)] text-muted-foreground">
                  {combinam.length === 0
                    ? `Nenhum tratamento encontrado em ${ano}.`
                    : `${combinam.length} tratamento(s) encontrado(s) em ${ano}.`}
                </p>
              )}
            </>
          )}
        </div>

        {/* Coluna direita: calendário */}
        <div className="rounded-[clamp(1.25rem,2vw,2rem)] bg-muted p-[clamp(0.875rem,1.8vw,1.75rem)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1">
              <Button
                onClick={() => irMes(-1)}
                disabled={cron === 0}
                variant="ghost"
                size="icon"
                className="size-7 rounded-full text-muted-foreground disabled:opacity-25"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-[clamp(0.875rem,1.5vw,1.375rem)] font-medium lowercase">
                {mesNome}{" "}
                <span className="text-[0.7em] text-muted-foreground">{ano}</span>
              </span>
              <Button
                onClick={() => irMes(1)}
                disabled={cron === TOTAL_MESES - 1}
                variant="ghost"
                size="icon"
                className="size-7 rounded-full text-muted-foreground disabled:opacity-25"
                aria-label="Próximo mês"
              >
                <ChevronRight className="size-4" />
              </Button>
            </span>

            <Button
              onClick={exportar}
              disabled={gerando}
              variant="ghost"
              className="h-auto gap-2 rounded-full bg-card px-[clamp(0.75rem,1.2vw,1.125rem)] py-[clamp(0.3125rem,0.7vw,0.5rem)] text-[clamp(0.625rem,0.95vw,0.8125rem)] font-normal hover:bg-border"
            >
              <Download className="size-[1.1em]" />
              {gerando ? "Gerando..." : `Exportar histórico ${ano}`}
            </Button>
          </div>

          <div className="mt-[clamp(0.75rem,1.6vw,1.5rem)]">
            <div className="grid grid-cols-7 gap-[2%] px-[1%] text-center text-[clamp(0.5rem,1.1vw,0.75rem)] uppercase tracking-[0.06em] text-muted-foreground">
              {semana.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="mt-[clamp(0.375rem,1vw,0.75rem)] grid grid-cols-7 gap-[2.5%]">
              {Array.from({ length: offset }).map((_, i) => (
                <span key={`v${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: diasNoMes }).map((_, i) => {
                const numero = i + 1;
                const chave = `${pad(numero)}/${pad(mesIndex + 1)}`;
                const itens = mapaDias.get(chave) ?? [];
                const temRegistro = itens.length > 0;
                const emCiclo = selecionado ? selecionado.dias.includes(chave) : false;
                const apagado =
                  temRegistro &&
                  ((selecionado && !emCiclo) || (diasBusca !== null && !diasBusca.has(chave)));

                return (
                  <div key={chave} className="relative">
                    {temRegistro && (
                      <span className="absolute -top-[12%] left-1/2 z-10 flex size-[clamp(0.9375rem,1.9vw,1.625rem)] items-center justify-center rounded-full bg-foreground text-[clamp(0.4375rem,0.85vw,0.6875rem)] font-medium text-background">
                        +{itens.length}
                      </span>
                    )}
                    <Button
                      onClick={() => {
                        if (!temRegistro) return;
                        setDiaAberto(chave);
                        setSelecionadoId(itens[0]!.id);
                      }}
                      disabled={!temRegistro}
                      variant="ghost"
                      aria-label={`Dia ${numero}${temRegistro ? ` — ${itens.length} tratamento(s)` : ""}`}
                      className={`flex aspect-square h-auto w-full items-center justify-center rounded-full p-0 text-[clamp(0.5625rem,1.1vw,1rem)] transition-opacity disabled:opacity-100 ${
                        temRegistro
                          ? emCiclo
                            ? "bg-foreground text-background hover:bg-foreground/90"
                            : "bg-card text-foreground hover:bg-border"
                          : "bg-transparent text-muted-foreground/50"
                      } ${apagado ? "opacity-40" : ""}`}
                    >
                      {numero}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
