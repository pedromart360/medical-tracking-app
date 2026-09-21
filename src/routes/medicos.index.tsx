import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { especialidades } from "@/lib/data";
import medicos from "@/assets/medicos.jpg";

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");

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
  return (
    <PageShell label="" title="Médicos" backTo="/">
      <div className="grid max-w-[840px] grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {especialidades.map((e) => (
          <Link key={e} to="/medicos/$esp" params={{ esp: slugify(e) }}>
            <div className="flex items-center justify-between gap-2 rounded-[1.5rem] bg-muted py-3 pl-6 pr-3 text-base transition-colors hover:bg-card">
              <span className="truncate">{e}</span>
              <img src={medicos} alt="" loading="lazy" className="size-9 shrink-0 rounded-full object-cover" />
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
