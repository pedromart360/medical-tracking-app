import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { areasMedicas, exameCategorias, resultadosExame, tiposPorCategoria } from "@/lib/data";
import exames from "@/assets/exames.jpg";
import medicos from "@/assets/medicos.jpg";
import body from "@/assets/body.png";

export const Route = createFileRoute("/exames/$slug/")({
  head: () => ({
    meta: [
      { title: "Categoria de exames — Ana Carolina" },
      { name: "description", content: "Áreas médicas e tipos de exames da categoria selecionada." },
      { property: "og:title", content: "Categoria de exames — Ana Carolina" },
      { property: "og:description", content: "Áreas médicas e tipos de exames." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Categoria,
});

function Categoria() {
  const { slug } = Route.useParams();
  const nome = exameCategorias.find((c) => c.slug === slug)?.nome ?? "Exames";
  const tipos = tiposPorCategoria[slug] ?? [];
  const comCorpo = slug === "de-imagem";

  return (
    <PageShell label="Exames" title={nome} backTo="/exames">
      <div className={comCorpo ? "grid gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]" : ""}>
        {comCorpo && (
          <img src={body} alt="Corpo" loading="lazy" className="mx-auto h-[360px] w-auto object-contain md:h-[420px]" />
        )}
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl">Áreas médicas</h2>
            <div className="mt-4 flex max-h-28 flex-nowrap gap-3 overflow-x-auto pb-2">
              {areasMedicas.map((a) => (
                <span
                  key={a}
                  className="flex shrink-0 items-center gap-3 rounded-full bg-card py-2 pl-2 pr-5 text-sm"
                >
                  <img src={medicos} alt="" loading="lazy" className="size-8 rounded-full object-cover" />
                  {a}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl">Tipos de exames</h2>
            <div className="mt-4 flex max-h-28 flex-nowrap gap-3 overflow-x-auto pb-2">
              {tipos.map((t) => {
                const clicavel = Boolean(resultadosExame[t.slug]);
                const chip = (
                  <span className="flex shrink-0 items-center gap-3 rounded-full bg-card py-2 pl-2 pr-5 text-sm transition-colors hover:bg-muted">
                    <img src={exames} alt="" loading="lazy" className="size-8 rounded-full object-cover" />
                    {t.nome}
                  </span>
                );
                return clicavel ? (
                  <Link key={t.slug} to="/exames/$slug/$tipo" params={{ slug, tipo: t.slug }}>
                    {chip}
                  </Link>
                ) : <span key={t.slug}>{chip}</span>;
              })}
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
