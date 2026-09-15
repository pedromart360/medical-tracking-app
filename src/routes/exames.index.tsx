import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { exameCategorias, tiposPorCategoria } from "@/lib/data";
import exames from "@/assets/exames.jpg";

export const Route = createFileRoute("/exames/")({
  head: () => ({
    meta: [
      { title: "Exames — Ana Carolina" },
      { name: "description", content: "Categorias de exames: laboratoriais, de imagem, gráficos e mais." },
      { property: "og:title", content: "Exames — Ana Carolina" },
      { property: "og:description", content: "Categorias de exames do prontuário de Ana Carolina." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Exames,
});

function Exames() {
  return (
    <PageShell label="" title="Exames" backTo="/">
      <div className="grid max-w-[720px] grid-cols-2 gap-x-5 gap-y-4">
        {exameCategorias.map((c) => {
          const temDetalhe = Boolean(tiposPorCategoria[c.slug]);
          const conteudo = (
            <div className="flex items-center justify-between rounded-[1.5rem] bg-card py-3 pl-6 pr-3 text-base transition-colors hover:bg-muted">
              <span>{c.nome}</span>
              <img src={exames} alt="" loading="lazy" className="size-9 rounded-full object-cover" />
            </div>
          );
          return temDetalhe ? (
            <Link key={c.slug} to="/exames/$slug" params={{ slug: c.slug }}>
              {conteudo}
            </Link>
          ) : (
            <div key={c.slug}>{conteudo}</div>
          );
        })}
      </div>
    </PageShell>
  );
}
