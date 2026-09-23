import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ArquivosExames } from "@/components/ArquivosExames";
import { areaSlug, areasMedicas, arquivosPorArea } from "@/lib/data";

export const Route = createFileRoute("/exames/$slug/area/$area")({
  head: () => ({
    meta: [
      { title: "Exames por área médica — Ana Carolina" },
      { name: "description", content: "Arquivos de exames filtrados pela área médica escolhida." },
      { property: "og:title", content: "Exames por área médica — Ana Carolina" },
      { property: "og:description", content: "Escolha um exame para ver a ficha completa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PorArea,
});

function PorArea() {
  const { slug, area } = Route.useParams();
  const nome = areasMedicas.find((a) => areaSlug(a) === area) ?? "Área médica";
  const itens = arquivosPorArea(slug, area);

  return (
    <PageShell label="Médicos" title={nome} backTo="/exames">
      <ArquivosExames itens={itens} />
    </PageShell>
  );
}
