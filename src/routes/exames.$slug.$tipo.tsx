import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { resultadosExame, tiposPorCategoria } from "@/lib/data";

export const Route = createFileRoute("/exames/$slug/$tipo")({
  head: () => ({
    meta: [
      { title: "Resultados de exames — Ana Carolina" },
      { name: "description", content: "Resultados arquivados do tipo de exame selecionado." },
      { property: "og:title", content: "Resultados de exames — Ana Carolina" },
      { property: "og:description", content: "Resultados arquivados por data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Resultados,
});

function Resultados() {
  const { slug, tipo } = Route.useParams();
  const nome = tiposPorCategoria[slug]?.find((t) => t.slug === tipo)?.nome ?? "Resultados";
  const itens = resultadosExame[tipo] ?? [];

  return (
    <PageShell label="Exames" title={nome} backTo="/exames">
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-5">
        {itens.map((r, i) => (
          <div key={i}>
            <div className="aspect-[3/4] rounded-[1rem] bg-gradient-to-br from-muted via-card to-border" />
            <p className="mt-2 text-sm">{r.nome}</p>
            <p className="text-xs text-muted-foreground">{r.data}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
