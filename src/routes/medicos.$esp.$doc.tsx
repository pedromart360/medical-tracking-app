import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { especialidades, examesSolicitados, medicos, remediosPrescritos } from "@/lib/data";
import medicosImg from "@/assets/medicos.jpg";
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

const datas = Array.from({ length: 14 }, (_, i) => `${String((i % 28) + 1).padStart(2, "0")}/03`);

function MedicoDetalhe() {
  const { esp, doc } = Route.useParams();
  const medico = medicos.find((m) => m.id === doc) ?? medicos[0];
  if (!medico) return null;
  const nomeEsp =
    especialidades.find(
      (e) =>
        e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-") === esp,
    ) ?? "Médicos";
  const [dia, setDia] = useState<string | null>(null);

  return (
    <PageShell label="Médicos" title={nomeEsp} backTo={`/medicos/${esp}`}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5">
          {dia ? (
            <div className="rounded-[1.75rem] bg-muted p-6">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setDia(null)}
                  variant="secondary"
                  size="icon"
                  className="size-7 rounded-full"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <h2 className="text-xl font-medium">{dia}</h2>
              </div>

              <p className="mt-6 text-sm">Laudos emitidos</p>
              <div className="mt-2 flex gap-2">
                {["laudo 1", "laudo 2"].map((l) => (
                  <span key={l} className="rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground">
                    {l}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-sm">Exames solicitados</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["eletrocardiograma", "esforço", "eletromicrocardiograma"].map((l) => (
                  <span key={l} className="rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground">
                    {l}
                  </span>
                ))}
              </div>

              <div className="mt-6 rounded-[1.25rem] bg-card p-4">
                <p className="text-xs text-muted-foreground">Resumo</p>
                <textarea
                  placeholder="Escreva aqui um resumo da consulta..."
                  className="mt-1 h-24 w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
          ) : (
            <div className="rounded-[1.75rem] bg-muted p-6">
              <div className="flex items-center gap-5">
                <img src={medicosImg} alt={medico.nome} loading="lazy" className="size-24 rounded-full object-cover" />
                <div>
                  <p className="text-xl font-medium leading-tight">{medico.nome}</p>
                  <p className="text-sm text-muted-foreground">{medico.especialidade}</p>
                </div>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{medico.bio}</p>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Lista titulo="Remédios prescritos:" itens={remediosPrescritos} />
            <Lista titulo="Exames solicitados:" itens={examesSolicitados} />
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-muted p-6">
          <div className="flex items-center justify-between text-sm">
            <span>Consultas:</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              2026 <ChevronRight className="size-3" />
            </span>
          </div>
          <div className="mt-5 grid grid-cols-5 gap-3">
            {datas.map((d, i) => (
              <Button
                key={i}
                onClick={() => setDia(d)}
                variant="ghost"
                className={`aspect-square h-auto rounded-full p-0 text-xs ${
                  dia === d ? "bg-foreground text-background" : "bg-card text-muted-foreground hover:bg-border"
                }`}
              >
                {d}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Lista({ titulo, itens }: { titulo: string; itens: { nome: string; data: string }[] }) {
  return (
    <div className="rounded-[1.5rem] bg-muted p-5">
      <p className="text-sm">{titulo}</p>
      <div className="mt-4 space-y-2">
        {itens.map((r) => (
          <div key={r.nome} className="flex justify-between text-xs text-muted-foreground">
            <span>{r.nome}</span>
            <span>{r.data}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
