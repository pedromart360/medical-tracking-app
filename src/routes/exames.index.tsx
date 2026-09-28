import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, cardLista, cardListaImg, cardListaTexto } from "@/components/PageShell";
import { exameCategorias, tiposPorCategoria } from "@/lib/data";
import { imgCategoriaExame } from "@/lib/imagens";

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
      <div className="grid grid-cols-1 gap-[clamp(0.625rem,1.4vw,1.125rem)] sm:grid-cols-2">
        {exameCategorias.map((c) => {
          const temDetalhe = Boolean(tiposPorCategoria[c.slug]);
          const conteudo = (
            <div className={cardLista}>
              <span className={cardListaTexto}>{c.nome}</span>
              <img src={imgCategoriaExame(c.slug)} alt="" loading="lazy" className={cardListaImg} />
            </div>
          );
          return temDetalhe ? (
            <Link key={c.slug} to="/exames/$slug" params={{ slug: c.slug }} className="block">
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
