import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { especialidades, especialidadeSlug, medicosPorEspecialidade } from "@/lib/data";
import medicosImg from "@/assets/medicos.jpg";

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
  /* 4 linhas, rolagem lateral: distribui as especialidades em colunas de 4 */
  const colunas: string[][] = [];
  for (let i = 0; i < especialidades.length; i += 4) colunas.push(especialidades.slice(i, i + 4));

  return (
    <PageShell label="" title="Médicos" backTo="/">
      <div className="-mx-1 overflow-x-auto px-1 pb-2">
        <div className="flex w-max gap-[clamp(0.75rem,1.4vw,1.25rem)]">
          {colunas.map((coluna, c) => (
            <div key={c} className="flex w-[clamp(15rem,24vw,21rem)] flex-col gap-[clamp(0.625rem,1.2vw,1rem)]">
              {coluna.map((e) => (
                <Link key={e} to="/medicos/$esp" params={{ esp: especialidadeSlug(e) }}>
                  <div className="flex items-center justify-between gap-2 rounded-[clamp(1.25rem,2vw,2rem)] bg-muted py-[clamp(0.375rem,0.8vw,0.75rem)] pl-[clamp(1rem,1.8vw,1.75rem)] pr-[clamp(0.375rem,0.7vw,0.625rem)] transition-colors hover:bg-border">
                    <span className="min-w-0 flex-1 truncate text-[clamp(0.875rem,1.3vw,1.25rem)]">{e}</span>
                    <span className="shrink-0 text-[clamp(0.625rem,0.9vw,0.8125rem)] text-muted-foreground">
                      {medicosPorEspecialidade(especialidadeSlug(e)).length}
                    </span>
                    <img
                      src={medicosImg}
                      alt=""
                      loading="lazy"
                      className="size-[clamp(2rem,3.4vw,3.25rem)] shrink-0 rounded-full object-cover"
                    />
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
