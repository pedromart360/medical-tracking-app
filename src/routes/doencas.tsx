import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { doencas } from "@/lib/data";

export const Route = createFileRoute("/doencas")({
  head: () => ({
    meta: [
      { title: "Doenças — Ana Carolina" },
      { name: "description", content: "Histórico de doenças e internações com detalhes de tratamento." },
      { property: "og:title", content: "Doenças — Ana Carolina" },
      { property: "og:description", content: "Histórico de doenças e internações." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Doencas,
});

function Doencas() {
  const [sel, setSel] = useState<string | null>(null);
  const item = doencas.find((d) => d.nome === sel);

  return (
    <PageShell label="" title="Doenças" backTo="/">
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-[1.75rem] bg-card p-6">
          <p className="text-sm">Histórico</p>
          <div className="mt-5 space-y-1">
            {doencas.map((d) => (
              <button
                key={d.nome}
                onClick={() => setSel(d.nome)}
                className={`flex w-full justify-between rounded-[1rem] px-4 py-2.5 text-sm transition-colors ${
                  sel === d.nome ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <span>{d.nome}</span>
                <span>{d.data}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-card p-6">
          {item ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm">{item.nome}</p>
                <span className="text-xs text-muted-foreground">{item.data}</span>
              </div>
              <div className="mt-5 rounded-[1.25rem] bg-muted p-5 text-xs text-muted-foreground">
                <p className="text-sm text-foreground">Dados do tratamento</p>
                <div className="mt-3 space-y-1">
                  <p>Medicamento: Imunoglobulina</p>
                  <p>Início: {item.data}</p>
                  <p>Término: 02/07/2025</p>
                  <p>Local: Hospital Praia Grande</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground">
                    laudo
                  </span>
                  <span className="rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground">
                    receita
                  </span>
                </div>
              </div>
              <div className="mt-5 rounded-[1.25rem] bg-muted p-5">
                <p className="text-sm">Observação</p>
                <textarea
                  placeholder="Escreva aqui uma observação sobre a doença..."
                  className="mt-2 h-24 w-full resize-none bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Selecione um item do histórico.</p>
          )}
        </div>
      </div>
    </PageShell>
  );
}
