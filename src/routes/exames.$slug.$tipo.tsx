import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ArquivosExames } from "@/components/ArquivosExames";
import { arquivosPorTipo, tiposPorCategoria } from "@/lib/data";

export const Route = createFileRoute("/exames/$slug/$tipo")({
  head: () => ({
    meta: [
      { title: "Arquivos de exames — Ana Carolina" },
      { name: "description", content: "Arquivos de exames organizados por tipo e por ano." },
      { property: "og:title", content: "Arquivos de exames — Ana Carolina" },
      { property: "og:description", content: "Escolha um exame para ver a ficha completa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Resultados,
});

function Resultados() {
  const { slug, tipo } = Route.useParams();
  const nome = tiposPorCategoria[slug]?.find((t) => t.slug === tipo)?.nome ?? "Resultados";
  const itens = arquivosPorTipo(slug, tipo);

  return (
    <PageShell label="Exames" title={nome} backTo="/exames">
      <ArquivosExames itens={itens} />
    </PageShell>
  );
}
