import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { areasMedicas, exameCategorias, resultadosExame, tiposPorCategoria } from "@/lib/data";
import exames from "@/assets/exames.jpg";
import medicos from "@/assets/medicos.jpg";

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

const chipClass =
  "flex h-[clamp(3rem,6.6vw,5.5rem)] shrink-0 items-center gap-[clamp(0.5rem,1.1vw,0.9375rem)] rounded-full bg-muted py-[3px] pl-[3px] pr-[clamp(1rem,2.9vw,2.5rem)] text-[clamp(0.8125rem,1.45vw,1.25rem)] transition-colors";

const chipImg = "size-[clamp(2.625rem,5.9vw,5rem)] shrink-0 rounded-full object-cover";

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[clamp(1.375rem,2.9vw,2.5rem)] font-medium leading-none tracking-tight">{titulo}</h2>
      <div className="mt-[clamp(1rem,2.9vw,2.5rem)] flex flex-nowrap gap-[clamp(0.625rem,1.5vw,1.25rem)] overflow-x-auto pb-[clamp(0.5rem,1vw,0.75rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
      <div className="relative h-px w-full bg-border">
        <span className="absolute left-0 top-0 h-px w-[12%] bg-muted-foreground/60" />
      </div>
    </section>
  );
}

function Categoria() {
  const { slug } = Route.useParams();
  const nome = exameCategorias.find((c) => c.slug === slug)?.nome ?? "Exames";
  const tipos = tiposPorCategoria[slug] ?? [];

  return (
    <PageShell label="Exames" title={nome} backTo="/exames">
      <div className="flex h-full flex-col justify-center gap-[clamp(1.25rem,3.2vw,2.75rem)]">
        <Secao titulo="Áreas médicas">
          {areasMedicas.map((a) => (
            <span key={a} className={chipClass}>
              <img src={medicos} alt="" loading="lazy" className={chipImg} />
              {a}
            </span>
          ))}
        </Secao>

        <Secao titulo="Tipos de exames">
          {tipos.map((t) => {
            const clicavel = Boolean(resultadosExame[t.slug]);
            const chip = (
              <span className={`${chipClass} ${clicavel ? "hover:bg-border" : ""}`}>
                <img src={exames} alt="" loading="lazy" className={chipImg} />
                {t.nome}
              </span>
            );
            return clicavel ? (
              <Link key={t.slug} to="/exames/$slug/$tipo" params={{ slug, tipo: t.slug }} className="shrink-0">
                {chip}
              </Link>
            ) : (
              <span key={t.slug} className="shrink-0">
                {chip}
              </span>
            );
          })}
        </Secao>
      </div>
    </PageShell>
  );
}
