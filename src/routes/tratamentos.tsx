import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { anos, tratamentoTipos, tratamentosPorCategoria, type TratamentoRegistro } from "@/lib/data";
import tratamentosImg from "@/assets/tratamentos.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tratamentos")({
  head: () => ({
    meta: [
      { title: "Tratamentos — Ana Carolina" },
      { name: "description", content: "Tratamentos domiciliares, hospitalares e medicamentosos com períodos." },
      { property: "og:title", content: "Tratamentos — Ana Carolina" },
      { property: "og:description", content: "Tratamentos e períodos de aplicação." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tratamentos,
});

const ordemDia = (d: string) => {
  const [dia, mes] = d.split("/");
  return Number(mes) * 100 + Number(dia);
};

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
  const [categoria, setCategoria] = useState<string | null>(null);
  const [ano, setAno] = useState(anos[0]!);
  const [busca, setBusca] = useState("");
  const [diaAberto, setDiaAberto] = useState<string | null>(null);
  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);

  const registros = useMemo(
    () => (categoria ? tratamentosPorCategoria(categoria, ano) : []),
    [categoria, ano],
  );

  const dias = useMemo(() => {
    const mapa = new Map<string, TratamentoRegistro[]>();
    for (const t of registros) {
      const dia = t.dias[0]!;
      mapa.set(dia, [...(mapa.get(dia) ?? []), t]);
    }
    return [...mapa.entries()].sort((a, b) => ordemDia(a[0]) - ordemDia(b[0]));
  }, [registros]);

  const combinam = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return null;
    return registros.filter((t) => t.nome.toLowerCase().includes(q));
  }, [busca, registros]);

  const doDia = diaAberto ? (dias.find(([d]) => d === diaAberto)?.[1] ?? []) : [];
  const selecionado = doDia.find((t) => t.id === selecionadoId) ?? doDia[0];
  const [resumo, setResumo] = useResumo(selecionado?.id);

  const diasAtivos = new Set(selecionado?.dias ?? []);
  const diasBusca = combinam ? new Set(combinam.flatMap((t) => t.dias)) : null;

  const fechar = () => {
    setDiaAberto(null);
    setSelecionadoId(null);
  };

  const trocarCategoria = (slug: string) => {
    setCategoria(slug);
    setBusca("");
    fechar();
  };

  const mudarAno = (delta: number) => {
    const i = anos.indexOf(ano);
    const proximo = anos[i + delta];
    if (proximo) {
      setAno(proximo);
      fechar();
    }
  };

  return (
    <PageShell label="" title="Tratamentos" backTo="/">
      <div className="grid gap-[clamp(1rem,2.5vw,2.5rem)] md:grid-cols-[minmax(0,36%)_minmax(0,1fr)]">
        {/* Coluna esquerda */}
        <div className="space-y-[clamp(0.625rem,1.4vw,1.25rem)]">
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
                    <dt>Pedido por:</dt>
                    <dd>
                      <Link
                        to="/medicos/$esp/$doc"
                        params={{ esp: selecionado.pedidoPor.espSlug, doc: selecionado.pedidoPor.medicoId }}
                        className="underline underline-offset-2 transition-colors hover:text-foreground"
                      >
                        {selecionado.pedidoPor.nome}
                      </Link>
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
                <label
                  htmlFor="resumo-tratamento"
                  className="text-[clamp(0.75rem,1.1vw,1rem)]"
                >
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
                  className={`h-auto w-full justify-between rounded-[clamp(1.25rem,2vw,2rem)] py-[clamp(0.5rem,1.1vw,1rem)] pl-[clamp(1rem,1.8vw,1.75rem)] pr-[clamp(0.5rem,1vw,1rem)] text-[clamp(0.875rem,1.5vw,1.375rem)] font-normal ${
                    categoria === t.slug
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "bg-muted hover:bg-border"
                  }`}
                >
                  <span>{t.nome}</span>
                  <img
                    src={tratamentosImg}
                    alt=""
                    loading="lazy"
                    className="size-[clamp(2.25rem,4.2vw,3.75rem)] rounded-full object-cover"
                  />
                </Button>
              ))}

              {categoria === "medicamentoso" && (
                <div className="flex items-center gap-2 rounded-full border border-border px-[clamp(1rem,1.8vw,1.75rem)] py-[clamp(0.375rem,0.8vw,0.625rem)]">
                  <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Pesquisar medicamento..."
                    aria-label="Pesquisar medicamento"
                    className="min-w-0 flex-1 bg-transparent py-1 text-[clamp(0.8125rem,1.2vw,1rem)] outline-none placeholder:text-muted-foreground"
                  />
                  <span className="flex size-[clamp(1.5rem,2.4vw,2.25rem)] shrink-0 items-center justify-center rounded-full bg-border text-muted-foreground">
                    <Search className="size-[50%]" />
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Coluna direita: período */}
        <div className="rounded-[clamp(1.25rem,2vw,2rem)] bg-muted p-[clamp(0.875rem,1.8vw,1.75rem)]">
          {!categoria ? (
            <p className="text-[clamp(0.75rem,1.1vw,1rem)] text-muted-foreground">
              Selecione um tipo de tratamento.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between text-[clamp(0.75rem,1.2vw,1.0625rem)]">
                <span>Período:</span>
                <span className="flex items-center gap-1">
                  <Button
                    onClick={() => mudarAno(1)}
                    disabled={anos.indexOf(ano) === anos.length - 1}
                    variant="ghost"
                    size="icon"
                    className="size-6 rounded-full text-muted-foreground disabled:opacity-25"
                    aria-label="Ano anterior"
                  >
                    <ChevronLeft className="size-3.5" />
                  </Button>
                  {ano}
                  <Button
                    onClick={() => mudarAno(-1)}
                    disabled={anos.indexOf(ano) === 0}
                    variant="ghost"
                    size="icon"
                    className="size-6 rounded-full text-muted-foreground disabled:opacity-25"
                    aria-label="Próximo ano"
                  >
                    <ChevronRight className="size-3.5" />
                  </Button>
                </span>
              </div>

              <div className="mt-[clamp(0.875rem,1.8vw,1.75rem)] grid grid-cols-4 gap-[clamp(0.375rem,1vw,0.875rem)] sm:grid-cols-6">
                {dias.map(([dia, itens]) => {
                  const ativo = diasAtivos.has(dia) || itens.some((t) => diasAtivos.has(t.dias[0]!));
                  const emCiclo = selecionado ? selecionado.dias.includes(dia) : false;
                  const apagado =
                    (selecionado && !emCiclo) || (diasBusca !== null && !diasBusca.has(dia));

                  return (
                    <div key={dia} className="relative">
                      {itens.length > 1 && (
                        <span className="absolute -top-[14%] left-1/2 z-10 flex size-[clamp(1rem,2vw,1.75rem)] items-center justify-center rounded-full bg-foreground text-[clamp(0.4375rem,0.85vw,0.6875rem)] font-medium text-background">
                          +{itens.length - 1}
                        </span>
                      )}
                      <Button
                        onClick={() => {
                          setDiaAberto(dia);
                          setSelecionadoId(itens[0]!.id);
                        }}
                        variant="ghost"
                        className={`flex aspect-square h-auto w-full items-center justify-center rounded-full p-0 text-[clamp(0.5625rem,1.1vw,1rem)] transition-opacity ${
                          emCiclo || ativo
                            ? "bg-foreground text-background hover:bg-foreground/90"
                            : "bg-card text-muted-foreground hover:bg-border"
                        } ${apagado ? "opacity-40" : ""}`}
                      >
                        {dia}
                      </Button>
                    </div>
                  );
                })}
                {dias.length === 0 && (
                  <p className="col-span-full text-[clamp(0.75rem,1.1vw,1rem)] text-muted-foreground">
                    Nenhum tratamento registrado em {ano}.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
