import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { FotoMedico } from "@/components/FotoMedico";
import { nomeEspecialidadePorSlug } from "@/lib/data";
import { useProntuario } from "@/lib/adicionados";

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
  const nome = nomeEspecialidadePorSlug(esp) ?? "Especialidade";
  const { medicos } = useProntuario();
  const lista = medicos.filter((m) => m.especialidadeSlug === esp);

  return (
    <PageShell label="Médicos" title={nome} backTo="/medicos">
      {lista.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum médico cadastrado nesta especialidade.</p>
      ) : (
        <div className="flex flex-wrap gap-[clamp(1rem,3vw,3rem)]">
          {lista.map((m) => (
            <Link
              key={m.id}
              to="/medicos/$esp/$doc"
              params={{ esp, doc: m.id }}
              className="w-[clamp(6rem,12vw,10rem)] text-center"
            >
              <FotoMedico
                nome={m.nome}
                className="mx-auto size-[clamp(5.5rem,11vw,9rem)] transition-transform hover:scale-105"
              />
              <p className="mt-[clamp(0.5rem,1vw,0.875rem)] text-[clamp(0.75rem,1.1vw,1rem)] font-medium leading-tight">
                {m.nome}
              </p>
              <p className="text-[clamp(0.625rem,0.9vw,0.8125rem)] text-muted-foreground">{m.cargo}</p>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
