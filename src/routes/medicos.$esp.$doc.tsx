import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { FotoMedico } from "@/components/FotoMedico";
import { DocumentoViewer, type DocumentoAberto } from "@/components/DocumentoViewer";
import { ExameModal, type ExameDetalhe } from "@/components/ExameModal";
import { acharMedico, medicosPorEspecialidade, nomeEspecialidadePorSlug, type Consulta } from "@/lib/data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/medicos/$esp/$doc")({
  head: () => ({
    meta: [
      { title: "Médico — Ana Carolina" },
      { name: "description", content: "Consultas, remédios prescritos e exames solicitados pelo médico." },
      { property: "og:title", content: "Médico — Ana Carolina" },
      { property: "og:description", content: "Consultas e prescrições do médico." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MedicoDetalhe,
});

const POR_QUADRO = 10;

function MedicoDetalhe() {
  const { esp, doc } = Route.useParams();
  const nomeEsp = nomeEspecialidadePorSlug(esp) ?? "Médicos";
  const medico = acharMedico(esp, doc) ?? medicosPorEspecialidade(esp)[0];

  const anosDisponiveis = useMemo(
    () => (medico ? [...new Set(medico.consultas.map((c) => c.ano))].sort((a, b) => b - a) : []),
    [medico],
  );

  const [anoIdx, setAnoIdx] = useState(0);
  const [consulta, setConsulta] = useState<Consulta | null>(null);
  const [documento, setDocumento] = useState<DocumentoAberto | null>(null);
  const [exame, setExame] = useState<ExameDetalhe | null>(null);

  if (!medico) {
    return (
      <PageShell label="Médicos" title={nomeEsp} backTo={`/medicos/${esp}`}>
        <p className="text-sm text-muted-foreground">Médico não encontrado.</p>
      </PageShell>
    );
  }

  const ano = anosDisponiveis[anoIdx] ?? anosDisponiveis[0];
  const doAno = medico.consultas.filter((c) => c.ano === ano);
  const quadros: Consulta[][] = [];
  for (let i = 0; i < doAno.length; i += POR_QUADRO) quadros.push(doAno.slice(i, i + POR_QUADRO));

  return (
    <PageShell label="Médicos" title={nomeEsp} backTo={`/medicos/${esp}`}>
      <div className="grid gap-[clamp(0.75rem,1.4vw,1.25rem)] lg:grid-cols-2">
        {/* Superior esquerdo: perfil ou consulta selecionada */}
        {consulta ? (
          <div className="rounded-[clamp(1.25rem,2vw,1.75rem)] bg-muted p-[clamp(1rem,1.8vw,1.75rem)]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setConsulta(null)}
                aria-label="Fechar consulta"
                className="flex size-[clamp(1.5rem,2.2vw,2rem)] shrink-0 items-center justify-center rounded-full bg-border text-muted-foreground transition-colors hover:bg-muted-foreground/30"
              >
                <X className="size-[55%]" />
              </button>
              <div className="min-w-0">
                <p className="text-[clamp(1.125rem,1.8vw,1.625rem)] font-medium leading-none">{consulta.data}</p>
                <p className="truncate text-[clamp(0.625rem,0.9vw,0.8125rem)] text-muted-foreground">
                  {medico.nome} · {consulta.local}
                </p>
              </div>
            </div>

            <p className="mt-[clamp(0.875rem,1.6vw,1.5rem)] text-[clamp(0.75rem,1vw,0.9375rem)]">Laudos emitidos</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {consulta.laudos.map((l) => (
                <Chip
                  key={l.id}
                  onClick={() =>
                    setDocumento({
                      titulo: l.titulo,
                      paginas: l.paginas,
                      medico: medico.nome,
                      crm: medico.crm,
                      data: consulta.data,
                      local: consulta.local,
                    })
                  }
                >
                  {l.titulo}
                </Chip>
              ))}
            </div>

            <p className="mt-[clamp(0.875rem,1.6vw,1.5rem)] text-[clamp(0.75rem,1vw,0.9375rem)]">Exames solicitados</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {consulta.exames.length === 0 ? (
                <span className="text-[clamp(0.6875rem,0.9vw,0.8125rem)] text-muted-foreground">
                  Nenhum exame solicitado nesta consulta.
                </span>
              ) : (
                consulta.exames.map((e, i) => (
                  <Chip
                    key={`${e.nome}-${i}`}
                    onClick={() =>
                      setExame({
                        nome: e.nome,
                        pedidoPor: medico.nome,
                        data: consulta.data,
                        local: consulta.local,
                        midia: e.midia,
                      })
                    }
                  >
                    {e.nome}
                  </Chip>
                ))
              )}
            </div>

            <div className="mt-[clamp(0.875rem,1.6vw,1.5rem)] rounded-[clamp(0.875rem,1.4vw,1.25rem)] bg-card p-[clamp(0.75rem,1.2vw,1rem)]">
              <p className="text-[clamp(0.625rem,0.9vw,0.8125rem)] text-muted-foreground">Resumo</p>
              <textarea
                defaultValue={consulta.resumo}
                key={consulta.id}
                placeholder="Escreva aqui um resumo da consulta..."
                className="mt-1 h-[clamp(4rem,7vw,6rem)] w-full resize-none bg-transparent text-[clamp(0.6875rem,0.95vw,0.875rem)] leading-relaxed outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        ) : (
          <div className="rounded-[clamp(1.25rem,2vw,1.75rem)] bg-muted p-[clamp(1rem,1.8vw,1.75rem)]">
            <div className="flex items-center gap-[clamp(0.75rem,1.4vw,1.25rem)]">
              <FotoMedico nome={medico.nome} className="size-[clamp(4rem,7vw,6rem)]" />
              <div className="min-w-0">
                <p className="text-[clamp(1rem,1.7vw,1.5rem)] font-medium leading-tight">{medico.nome}</p>
                <p className="text-[clamp(0.6875rem,1vw,0.9375rem)] text-muted-foreground">{medico.cargo}</p>
                <p className="text-[clamp(0.625rem,0.85vw,0.8125rem)] text-muted-foreground">{medico.crm}</p>
              </div>
            </div>
            <p className="mt-[clamp(0.875rem,1.4vw,1.25rem)] text-[clamp(0.6875rem,0.95vw,0.875rem)] leading-relaxed text-muted-foreground">
              {medico.bio}
            </p>
          </div>
        )}

        {/* Superior direito: consultas por ano */}
        <div className="rounded-[clamp(1.25rem,2vw,1.75rem)] bg-muted p-[clamp(1rem,1.8vw,1.75rem)]">
          <div className="flex items-center justify-between gap-3 text-[clamp(0.75rem,1vw,0.9375rem)]">
            <span>Consultas:</span>
            <span className="flex items-center gap-1">
              <button
                onClick={() => setAnoIdx((i) => Math.min(anosDisponiveis.length - 1, i + 1))}
                disabled={anoIdx >= anosDisponiveis.length - 1}
                aria-label="Ano anterior"
                className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-card disabled:opacity-25"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="w-10 text-center">{ano}</span>
              <button
                onClick={() => setAnoIdx((i) => Math.max(0, i - 1))}
                disabled={anoIdx === 0}
                aria-label="Próximo ano"
                className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-card disabled:opacity-25"
              >
                <ChevronRight className="size-4" />
              </button>
            </span>
          </div>

          <div className="mt-[clamp(0.75rem,1.4vw,1.25rem)] space-y-[clamp(0.625rem,1vw,0.875rem)]">
            {quadros.map((quadro, q) => (
              <div key={q} className="grid grid-cols-5 gap-[clamp(0.375rem,0.8vw,0.75rem)]">
                {quadro.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setConsulta(c)}
                    className={`flex aspect-square items-center justify-center rounded-full text-[clamp(0.5rem,0.85vw,0.75rem)] transition-colors ${
                      consulta?.id === c.id
                        ? "bg-foreground text-background"
                        : "bg-card text-muted-foreground hover:bg-border"
                    }`}
                  >
                    {c.dia}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Inferiores */}
        <Lista
          titulo="Remédios prescritos:"
          itens={consulta ? medico.remedios.filter((r) => r.consultaId === consulta.id) : medico.remedios}
          vazio="Nenhum remédio prescrito nesta consulta."
        />
        <Lista
          titulo="Lista de exames:"
          itens={medico.examesSolicitados}
          className={consulta ? "opacity-45" : ""}
          onItemClick={(item) => {
            const midia = medico.consultas.flatMap((c) => c.exames).find((e) => e.nome === item.nome)?.midia;
            setExame({ nome: item.nome, pedidoPor: medico.nome, data: item.data, local: medico.consultas.find((c) => c.data === item.data)?.local ?? "Não informado", ...(midia ? { midia } : {}) });
          }}
        />
      </div>

      {documento && <DocumentoViewer doc={documento} onClose={() => setDocumento(null)} />}
      {exame && <ExameModal exame={exame} onClose={() => setExame(null)} />}
    </PageShell>
  );
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="h-auto rounded-full bg-foreground px-[clamp(0.75rem,1.2vw,1.125rem)] py-[clamp(0.25rem,0.5vw,0.4375rem)] text-[clamp(0.625rem,0.85vw,0.8125rem)] font-normal text-background hover:opacity-90"
    >
      {children}
    </Button>
  );
}

function Lista({ titulo, itens, vazio, className = "", onItemClick }: {
  titulo: string;
  itens: { nome: string; data: string }[];
  vazio?: string;
  className?: string;
  onItemClick?: (item: { nome: string; data: string }) => void;
}) {
  return (
    <div className={`rounded-[clamp(1.25rem,2vw,1.75rem)] bg-muted p-[clamp(1rem,1.8vw,1.75rem)] transition-opacity ${className}`}>
      <p className="text-[clamp(0.75rem,1vw,0.9375rem)]">{titulo}</p>
      <div className="mt-[clamp(0.625rem,1.2vw,1rem)] max-h-[clamp(7rem,14vw,11rem)] space-y-2 overflow-y-auto pr-1">
        {itens.length === 0 && <p className="text-sm text-muted-foreground">{vazio}</p>}
        {itens.map((r, i) => onItemClick ? (
          <Button
            key={`${r.nome}-${i}`}
            type="button"
            variant="ghost"
            onClick={() => onItemClick(r)}
            className="flex h-auto w-full min-w-0 justify-between gap-3 rounded-none p-0 text-left text-[clamp(0.6875rem,0.95vw,0.875rem)] font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <span className="min-w-0 truncate">{r.nome}</span>
            <span className="shrink-0">{r.data}</span>
          </Button>
        ) : (
          <div key={`${r.nome}-${i}`} className="flex justify-between gap-3 text-[clamp(0.6875rem,0.95vw,0.875rem)] text-muted-foreground">
            <span className="truncate">{r.nome}</span>
            <span className="shrink-0">{r.data}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
