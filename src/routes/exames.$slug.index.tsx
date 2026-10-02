import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { areaSlug, areasMedicas, exameCategorias, tiposPorCategoria } from "@/lib/data";
import { mesclarPontos, useProntuario } from "@/lib/adicionados";
import { BodyFigure } from "@/components/BodyFigure";
import { imgEspecialidade, imgTipoExame } from "@/lib/imagens";
import { HorizontalScroll } from "@/components/HorizontalScroll";

export const Route = createFileRoute("/exames/$slug/")({
  head: () => ({
    meta: [
      { title: "Categoria de exames — Lyna" },
      { name: "description", content: "Áreas médicas e tipos de exames da categoria selecionada." },
      { property: "og:title", content: "Categoria de exames — Lyna" },
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
    <section className="min-w-0">
      <h2 className="py-[0.08em] text-[clamp(1.375rem,2.9vw,2.5rem)] font-medium leading-[1.18] tracking-tight">{titulo}</h2>
      <HorizontalScroll indicator className="mt-[clamp(1rem,2.9vw,2.5rem)] pb-[clamp(0.5rem,1vw,0.75rem)]">
        <div className="flex w-max min-w-full flex-nowrap gap-[clamp(0.625rem,1.5vw,1.25rem)] pr-2">{children}</div>
      </HorizontalScroll>
    </section>
  );
}

function Categoria() {
  const { slug } = Route.useParams();
  const nome = exameCategorias.find((c) => c.slug === slug)?.nome ?? "Exames";
  const tipos = tiposPorCategoria[slug] ?? [];
  const { arquivos } = useProntuario();
  const pontos = mesclarPontos(slug, arquivos);

    const areas = areasMedicas;

  const secoes = (
    <div className="flex h-full min-w-0 flex-col justify-center gap-[clamp(1.25rem,3.2vw,2.75rem)]">
      {areas.length > 0 && (
        <Secao titulo="Áreas médicas">
          {areas.map((a) => (
            <Link
              key={a}
              to="/exames/$slug/area/$area"
              params={{ slug, area: areaSlug(a) }}
              className="shrink-0"
            >
              <span className={`${chipClass} hover:bg-border`}>
                <img src={imgEspecialidade(a)} alt="" loading="lazy" className={chipImg} />
                {a}
              </span>
            </Link>
          ))}
        </Secao>
      )}

      <Secao titulo="Tipos de exames">
        {tipos.map((t) => (
          <Link key={t.slug} to="/exames/$slug/$tipo" params={{ slug, tipo: t.slug }} className="shrink-0">
            <span className={`${chipClass} hover:bg-border`}>
              <img src={imgTipoExame(slug, t.slug)} alt="" loading="lazy" className={chipImg} />
              {t.nome}
            </span>
          </Link>
        ))}
      </Secao>
    </div>
  );

  return (
    <PageShell label="Exames" title={nome} backTo="/exames">
      {pontos ? (
        <div className="grid h-full gap-[clamp(1rem,2.4vw,2rem)] lg:grid-cols-[minmax(0,42%)_minmax(0,1fr)]">
          <BodyFigure pontos={pontos} />
          {secoes}
        </div>
      ) : (
        secoes
      )}
    </PageShell>
  );
}
