import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { DocumentoViewer, type DocumentoAberto } from "@/components/DocumentoViewer";
import { anos, patient, type DoencaRegistro } from "@/lib/data";
import { useProntuario } from "@/lib/adicionados";

export const Route = createFileRoute("/doencas")({
  head: () => ({
    meta: [
      { title: "Doenças — Ana Carolina" },
      { name: "description", content: "Histórico de doenças, diagnósticos e tratamentos vinculados." },
      { property: "og:title", content: "Doenças — Ana Carolina" },
      { property: "og:description", content: "Histórico de doenças e internações." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Doencas,
});

const POR_COLUNA = 8;

function useObservacao(id: string | undefined) {
  const [texto, setTexto] = useState("");

  useEffect(() => {
    if (!id) return;
    setTexto(localStorage.getItem(`obs-doenca-${id}`) ?? "");
  }, [id]);

  const salvar = (valor: string) => {
    setTexto(valor);
    if (id) localStorage.setItem(`obs-doenca-${id}`, valor);
  };

  return { texto, salvar };
}

function Doencas() {
  const { doencas, tratamentos } = useProntuario();
  const [anoIdx, setAnoIdx] = useState(0);
  const [busca, setBusca] = useState("");
  const [selId, setSelId] = useState<string | null>(null);
  const [documento, setDocumento] = useState<DocumentoAberto | null>(null);
  const [verTratamento, setVerTratamento] = useState<string | null>(null);

  const ano = anos[anoIdx]!;
  const termo = busca.trim().toLowerCase();
  const acharTratamento = (id: string) => tratamentos.find((t) => t.id === id);

  const lista = useMemo(() => {
    const base = termo ? doencas : doencas.filter((d) => d.ano === ano);
    if (!termo) return base;
    return base.filter((d) => {
      const trat = tratamentos.find((t) => t.id === d.tratamentoId);
      return (
        d.nome.toLowerCase().includes(termo) ||
        d.data.includes(termo) ||
        d.percebidaPor.nome.toLowerCase().includes(termo) ||
        (trat?.nome ?? "").toLowerCase().includes(termo) ||
        (trat?.categoria ?? "").toLowerCase().includes(termo)
      );
    });
  }, [doencas, tratamentos, ano, termo]);

  const colunas: DoencaRegistro[][] = [];
  for (let i = 0; i < lista.length; i += POR_COLUNA) colunas.push(lista.slice(i, i + POR_COLUNA));

  const item = lista.find((d) => d.id === selId) ?? null;
  const tratamento = item ? acharTratamento(item.tratamentoId) : undefined;
  const { texto, salvar } = useObservacao(item?.id);
  const resumo = verTratamento ? acharTratamento(verTratamento) : undefined;

  return (
    <PageShell label="" title="Doenças" backTo="/">
      <div className="grid gap-[clamp(0.75rem,1.4vw,1.25rem)] md:grid-cols-2">
        {/* Histórico */}
        <div className="flex min-h-0 flex-col rounded-[clamp(1.25rem,2vw,1.75rem)] bg-muted p-[clamp(1rem,1.8vw,1.75rem)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[clamp(0.9375rem,1.4vw,1.375rem)] font-medium">Histórico</p>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Ano anterior"
                disabled={!!termo || anoIdx >= anos.length - 1}
                onClick={() => setAnoIdx((i) => Math.min(anos.length - 1, i + 1))}
                className="size-7 rounded-full text-muted-foreground hover:bg-border"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="min-w-[3ch] text-center text-[clamp(0.75rem,1vw,0.9375rem)]">
                {termo ? "todos" : ano}
              </span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Próximo ano"
                disabled={!!termo || anoIdx <= 0}
                onClick={() => setAnoIdx((i) => Math.max(0, i - 1))}
                className="size-7 rounded-full text-muted-foreground hover:bg-border"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="relative mt-[clamp(0.75rem,1.4vw,1.25rem)]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Pesquisar doença"
              placeholder="Pesquisar doença..."
              className="h-10 w-full rounded-full bg-card pl-9 pr-9 text-[clamp(0.75rem,1vw,0.875rem)] outline-none placeholder:text-muted-foreground"
            />
            {busca && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Limpar pesquisa"
                onClick={() => setBusca("")}
                className="absolute right-1.5 top-1/2 size-7 -translate-y-1/2 rounded-full text-muted-foreground hover:bg-border"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>

          <div className="-mx-1 mt-[clamp(0.75rem,1.4vw,1.25rem)] flex gap-[clamp(0.75rem,1.6vw,1.5rem)] overflow-x-auto px-1 pb-2">
            {colunas.length === 0 && (
              <p className="text-[clamp(0.75rem,1vw,0.875rem)] text-muted-foreground">
                Nenhuma doença encontrada.
              </p>
            )}
            {colunas.map((coluna, ci) => (
              <div key={ci} className="min-w-[clamp(15rem,20vw,19rem)] flex-1 space-y-0.5">
                {coluna.map((d) => {
                  const ativo = item?.id === d.id;
                  return (
                    <Button
                      key={d.id}
                      variant="ghost"
                      onClick={() => setSelId(ativo ? null : d.id)}
                      className={`h-auto w-full justify-between gap-4 rounded-[0.875rem] px-3 py-2 text-[clamp(0.75rem,1vw,0.9375rem)] font-normal hover:bg-border ${
                        ativo ? "text-foreground underline underline-offset-4" : "text-muted-foreground"
                      }`}
                    >
                      <span className="truncate">{d.nome}</span>
                      <span className="shrink-0 tabular-nums">{d.data}</span>
                    </Button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Detalhe da doença */}
        <div className="rounded-[clamp(1.25rem,2vw,1.75rem)] bg-muted p-[clamp(1rem,1.8vw,1.75rem)]">
          {item ? (
            <>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Fechar doença"
                  onClick={() => setSelId(null)}
                  className="size-[clamp(1.5rem,2.2vw,2rem)] shrink-0 rounded-full bg-border text-muted-foreground hover:bg-muted-foreground/30"
                >
                  <X className="size-[55%]" />
                </Button>
                <p className="min-w-0 flex-1 truncate text-[clamp(1.125rem,1.8vw,1.625rem)] font-medium leading-none">
                  {item.nome}
                </p>
                <span className="shrink-0 text-[clamp(0.6875rem,0.95vw,0.875rem)] tabular-nums text-muted-foreground">
                  {item.data}
                </span>
              </div>

              <div className="mt-[clamp(0.875rem,1.6vw,1.5rem)] rounded-[clamp(1rem,1.6vw,1.5rem)] bg-card p-[clamp(0.875rem,1.5vw,1.5rem)]">
                <p className="text-[clamp(0.8125rem,1.1vw,1rem)]">Dados da doença</p>
                <dl className="mt-3 space-y-1.5 text-[clamp(0.6875rem,0.95vw,0.875rem)] text-muted-foreground">
                  <div className="flex gap-2">
                    <dt className="shrink-0">Percebida por:</dt>
                    <dd className="min-w-0">
                      {item.percebidaPor.medicoId ? (
                        <Link
                          to="/medicos/$esp/$doc"
                          params={{ esp: item.percebidaPor.espSlug, doc: item.percebidaPor.medicoId }}
                          className="truncate text-foreground underline underline-offset-4"
                        >
                          {item.percebidaPor.nome}
                        </Link>
                      ) : (
                        <span className="truncate text-foreground">{item.percebidaPor.nome}</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="shrink-0">Data da descoberta:</dt>
                    <dd className="tabular-nums">{item.data}</dd>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <dt className="shrink-0">Tratamento:</dt>
                    <dd>
                      {tratamento ? (
                        <Button
                          variant="ghost"
                          onClick={() => setVerTratamento(tratamento.id)}
                          className="h-auto rounded-full bg-border px-3 py-1 text-[clamp(0.6875rem,0.95vw,0.8125rem)] font-normal capitalize text-foreground hover:bg-muted-foreground/25"
                        >
                          {tratamento.categoria} · {tratamento.nome}
                        </Button>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-[clamp(0.75rem,1.3vw,1.25rem)] flex flex-wrap gap-2">
                {item.documentos.map((d) => (
                  <Button
                    key={d.id}
                    onClick={() =>
                      setDocumento({
                        titulo: d.titulo,
                        paginas: d.paginas,
                        medico: item.percebidaPor.nome,
                        crm: "CRM/MG 00000",
                        data: item.data,
                        local: tratamento?.local ?? "—",
                      })
                    }
                    className="h-auto rounded-full bg-foreground px-[clamp(1.25rem,2.4vw,2.25rem)] py-2 text-[clamp(0.6875rem,0.95vw,0.875rem)] font-normal text-background hover:bg-foreground/85"
                  >
                    {d.titulo}
                  </Button>
                ))}
              </div>

              <div className="mt-[clamp(0.75rem,1.3vw,1.25rem)] rounded-[clamp(1rem,1.6vw,1.5rem)] border border-border p-[clamp(0.875rem,1.5vw,1.5rem)]">
                <p className="text-[clamp(0.8125rem,1.1vw,1rem)]">Observações</p>
                <textarea
                  value={texto}
                  onChange={(e) => salvar(e.target.value)}
                  aria-label="Observações sobre a doença"
                  placeholder="Escreva aqui suas observações sobre a doença..."
                  className="mt-2 h-[clamp(4rem,9vh,7rem)] w-full resize-none bg-transparent text-[clamp(0.6875rem,0.95vw,0.875rem)] outline-none placeholder:text-muted-foreground placeholder:underline placeholder:underline-offset-4"
                />
              </div>
            </>
          ) : (
            <p className="text-[clamp(0.75rem,1vw,0.9375rem)] text-muted-foreground">
              Selecione um item do histórico de {patient.nome.split(" ")[0]}.
            </p>
          )}
        </div>
      </div>

      {resumo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Tratamento ${resumo.nome}`}
          onClick={() => setVerTratamento(null)}
          className="fixed inset-0 z-[55] flex items-center justify-center bg-foreground/25 p-[clamp(0.75rem,3vw,2.5rem)] backdrop-blur-[3px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] rounded-[clamp(1.25rem,2.4vw,2rem)] bg-muted p-[clamp(1rem,2vw,1.75rem)] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Fechar resumo do tratamento"
                onClick={() => setVerTratamento(null)}
                className="size-8 shrink-0 rounded-full bg-border text-muted-foreground hover:bg-muted-foreground/30"
              >
                <X className="size-4" />
              </Button>
              <p className="min-w-0 flex-1 truncate text-[clamp(1rem,1.5vw,1.25rem)] font-medium">{resumo.nome}</p>
            </div>
            <dl className="mt-4 space-y-1.5 text-[clamp(0.6875rem,0.95vw,0.875rem)] text-muted-foreground">
              <div className="flex gap-2">
                <dt>Tipo:</dt>
                <dd className="capitalize text-foreground">{resumo.categoria}</dd>
              </div>
              <div className="flex gap-2">
                <dt>Período:</dt>
                <dd className="tabular-nums">{resumo.dataCompleta}</dd>
              </div>
              <div className="flex gap-2">
                <dt>Pedido por:</dt>
                <dd>{resumo.pedidoPor.nome}</dd>
              </div>
              <div className="flex gap-2">
                <dt>Realizado por:</dt>
                <dd>{resumo.realizadoPor}</dd>
              </div>
              <div className="flex gap-2">
                <dt>Local:</dt>
                <dd>{resumo.local}</dd>
              </div>
            </dl>
            <Link
              to="/tratamentos"
              onClick={() => setVerTratamento(null)}
              className="mt-5 flex h-10 w-full items-center justify-center rounded-full bg-foreground text-[clamp(0.6875rem,0.95vw,0.875rem)] text-background transition-opacity hover:opacity-85"
            >
              Ver na aba de tratamentos
            </Link>
          </div>
        </div>
      )}

      {documento && <DocumentoViewer doc={documento} onClose={() => setDocumento(null)} />}
    </PageShell>
  );
}
