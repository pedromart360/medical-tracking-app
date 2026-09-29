import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, cardLista, cardListaImg, cardListaTexto } from "@/components/PageShell";
import { especialidades, especialidadeSlug } from "@/lib/data";
import { useProntuario } from "@/lib/adicionados";
import { imgEspecialidade } from "@/lib/imagens";
import { HorizontalScroll } from "@/components/HorizontalScroll";

export const Route = createFileRoute("/medicos/")({
  head: () => ({
    meta: [
      { title: "Médicos — Ana Carolina" },
      { name: "description", content: "Especialidades e médicos que acompanham Ana Carolina." },
      { property: "og:title", content: "Médicos — Ana Carolina" },
      { property: "og:description", content: "Especialidades médicas do prontuário." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Medicos,
});

function Medicos() {
  const { medicos } = useProntuario();
  /* 4 linhas, rolagem lateral: distribui as especialidades em colunas de 4 */
  const colunas: string[][] = [];
  for (let i = 0; i < especialidades.length; i += 4) colunas.push(especialidades.slice(i, i + 4));

  return (
    <PageShell label="" title="Médicos" backTo="/">
      <HorizontalScroll className="pb-2">
        <div className="flex w-max gap-[clamp(0.75rem,1.4vw,1.25rem)]">
          {colunas.map((coluna, c) => (
            <div key={c} className="flex w-[clamp(15rem,24vw,21.25rem)] flex-col gap-[clamp(0.625rem,1.3vw,1.125rem)]">
              {coluna.map((e) => (
                <Link key={e} to="/medicos/$esp" params={{ esp: especialidadeSlug(e) }}>
                  <div className={cardLista}>
                    <span className={cardListaTexto}>{e}</span>
                    <span className="shrink-0 text-[clamp(0.625rem,0.9vw,0.8125rem)] text-muted-foreground">
                      {medicos.filter((m) => m.especialidadeSlug === especialidadeSlug(e)).length}
                    </span>
                    <img src={imgEspecialidade(e)} alt="" loading="lazy" className={cardListaImg} />
                  </div>

                </Link>
              ))}
            </div>
          ))}
        </div>
      </HorizontalScroll>
    </PageShell>
  );
}
