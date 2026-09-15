import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { especialidades, medicos as listaMedicos } from "@/lib/data";
import medicosImg from "@/assets/medicos.jpg";

export const Route = createFileRoute("/medicos/$esp/")({
  head: () => ({
    meta: [
      { title: "Especialidade — Ana Carolina" },
      { name: "description", content: "Médicos da especialidade selecionada." },
      { property: "og:title", content: "Especialidade — Ana Carolina" },
      { property: "og:description", content: "Médicos da especialidade selecionada." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Especialidade,
});

function Especialidade() {
  const { esp } = Route.useParams();
  const nome =
    especialidades.find(
      (e) =>
        e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-") === esp,
    ) ?? "Especialidade";

  return (
    <PageShell label="Médicos" title={nome} backTo="/medicos">
      <div className="flex flex-wrap gap-10">
        {listaMedicos.map((m) => (
          <Link key={m.id} to="/medicos/$esp/$doc" params={{ esp, doc: m.id }} className="w-[150px] text-center">
            <img
              src={medicosImg}
              alt={m.nome}
              loading="lazy"
              className="size-[130px] rounded-full object-cover transition-transform hover:scale-105"
            />
            <p className="mt-3 text-sm font-medium leading-tight">{m.nome}</p>
            <p className="text-xs text-muted-foreground">{m.especialidade}</p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
