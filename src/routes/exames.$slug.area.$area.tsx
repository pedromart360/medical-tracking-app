import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ArquivosExames } from "@/components/ArquivosExames";
import { areaSlug, areasMedicas } from "@/lib/data";
import { useProntuario } from "@/lib/adicionados";

export const Route = createFileRoute("/exames/$slug/area/$area")({
  head: () => ({
    meta: [
      { title: "Exames por área médica — Lyna" },
      { name: "description", content: "Arquivos de exames filtrados pela área médica escolhida." },
      { property: "og:title", content: "Exames por área médica — Lyna" },
      { property: "og:description", content: "Escolha um exame para ver a ficha completa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PorArea,
});

function PorArea() {
  const { slug, area } = Route.useParams();
  const { arquivos } = useProntuario();
  const nome =
    areasMedicas.find((a) => areaSlug(a) === area) ??
    arquivos.find((a) => areaSlug(a.areaMedica) === area)?.areaMedica ??
    "Área médica";
  const itens = arquivos
    .filter((a) => a.categoriaSlug === slug && areaSlug(a.areaMedica) === area)
    .sort((a, b) => b.ano - a.ano);

  return (
    <PageShell label="Médicos" title={nome} backTo="/exames">
      <ArquivosExames itens={itens} />
    </PageShell>
  );
}
