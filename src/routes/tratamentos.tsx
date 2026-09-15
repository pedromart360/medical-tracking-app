import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { tratamentoTipos, tratamentos } from "@/lib/data";
import tratamentosImg from "@/assets/tratamentos.jpg";

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

const datas = Array.from({ length: 18 }, (_, i) => `${String((i % 28) + 1).padStart(2, "0")}/03`);

function Tratamentos() {
  const [tipo, setTipo] = useState<string | null>(null);
  const [detalhe, setDetalhe] = useState<string | null>(null);
  const lista = tipo ? (tratamentos[tipo] ?? []) : [];
  const item = lista.find((t) => t.nome === detalhe);

  return (
    <PageShell label="" title="Tratamentos" backTo="/">
      <div className="grid grid-cols-[300px_1fr] gap-6">
        <div className="space-y-4">
          {tratamentoTipos.map((t) => (
            <button
              key={t.slug}
              onClick={() => {
                setTipo(t.slug);
                setDetalhe(null);
              }}
              className={`flex w-full items-center justify-between rounded-[1.5rem] py-3 pl-6 pr-3 text-base transition-colors ${
                tipo === t.slug ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
              }`}
            >
              <span>{t.nome}</span>
              <img src={tratamentosImg} alt="" loading="lazy" className="size-9 rounded-full object-cover" />
            </button>
          ))}

          {tipo && !detalhe && (
            <div className="space-y-3 pt-2">
              {lista.map((t) => (
                <button
                  key={t.nome}
                  onClick={() => setDetalhe(t.nome)}
                  className="w-full rounded-[1.25rem] bg-card px-5 py-3 text-left text-sm transition-colors hover:bg-muted"
                >
                  {t.nome}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[1.75rem] bg-card p-6">
          {!tipo ? (
            <p className="text-sm text-muted-foreground">Selecione um tipo de tratamento.</p>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  {detalhe && (
                    <button
                      onClick={() => setDetalhe(null)}
                      className="flex size-6 items-center justify-center rounded-full bg-border text-muted-foreground"
                    >
                      <ChevronLeft className="size-3" />
                    </button>
                  )}
                  {detalhe ?? "Período:"}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  2026 <ChevronRight className="size-3" />
                </span>
              </div>

              {detalhe && item && (
                <div className="mt-5 grid grid-cols-2 gap-5">
                  <div className="rounded-[1.25rem] bg-muted p-5 text-xs text-muted-foreground">
                    <p className="text-sm text-foreground">Dados do tratamento</p>
                    <div className="mt-3 space-y-1">
                      <p>Medicamento: {item.nome}</p>
                      <p>Início: {item.inicio}</p>
                      <p>Término: {item.fim}</p>
                      <p>Local: {item.local}</p>
                    </div>
                  </div>
                  <div className="rounded-[1.25rem] bg-muted p-5">
                    <p className="text-sm">Resumo</p>
                    <textarea
                      placeholder="Escreva aqui um resumo do tratamento..."
                      className="mt-2 h-24 w-full resize-none bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 grid grid-cols-6 gap-3">
                {datas.map((d, i) => (
                  <span
                    key={i}
                    className={`flex aspect-square items-center justify-center rounded-full text-xs ${
                      detalhe && i < 6
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
