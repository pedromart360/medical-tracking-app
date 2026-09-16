import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { patient } from "@/lib/data";
import { Timeline } from "@/components/Timeline";
import { CalendarOverlay } from "@/components/Calendar";
import { Avatar, railItems } from "@/components/PageShell";
import body from "@/assets/body.png";
import pasta from "@/assets/pasta.svg.asset.json";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ana Carolina — Prontuário digital" },
      {
        name: "description",
        content:
          "Prontuário visual de Ana Carolina: exames, médicos, tratamentos e doenças organizados em uma linha do tempo.",
      },
      { property: "og:title", content: "Ana Carolina — Prontuário digital" },
      {
        property: "og:description",
        content: "Exames, médicos, tratamentos e doenças em uma linha do tempo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [calendario, setCalendario] = useState(false);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1286px] flex-col px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1rem,2.5vw,2.5rem)]">
      <div className="grid flex-1 gap-[clamp(1rem,2.5vw,1.875rem)] md:grid-cols-[minmax(0,31%)_minmax(0,1fr)]">
        <div className="relative flex min-w-0 flex-col">
          <h1 className="truncate text-[clamp(2rem,4.4vw,3.5rem)] font-medium leading-none tracking-tight">
            {patient.nome}
          </h1>
          <div className="mt-2 flex w-full max-w-[380px] justify-between text-[clamp(0.75rem,1vw,0.875rem)] text-muted-foreground">
            <span>{patient.sexo}</span>
            <span>{patient.idade}</span>
          </div>
          <img
            src={body}
            alt="Ilustração do corpo da paciente"
            width={768}
            height={1536}
            className="mx-auto mt-3 h-[clamp(300px,52vw,700px)] w-auto object-contain"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-[clamp(0.75rem,1.6vw,1.25rem)]">
          <div className="flex items-center justify-between gap-4">
            <Button className="h-[clamp(36px,3.6vw,42px)] rounded-full px-[clamp(1rem,2vw,1.5rem)] text-[clamp(0.8125rem,1.2vw,0.9375rem)] font-normal">
              + adicionar dados
            </Button>
            <Avatar />
          </div>

          <label className="flex h-[clamp(52px,6vw,76px)] items-center gap-3 rounded-full bg-card px-[clamp(1.25rem,2.5vw,2rem)]">
            <input
              placeholder="Pesquisar..."
              className="min-w-0 flex-1 bg-transparent text-[clamp(0.875rem,1.2vw,1rem)] outline-none placeholder:text-muted-foreground"
            />
            <span className="flex size-[clamp(28px,3vw,36px)] shrink-0 items-center justify-center rounded-full bg-border text-muted-foreground">
              <Search className="size-4" />
            </span>
          </label>

          <div className="grid grid-cols-2 gap-[clamp(0.75rem,1.6vw,1.25rem)]">
            {railItems.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="group relative flex aspect-[427/268] min-w-0 flex-col overflow-hidden transition-transform hover:-translate-y-0.5"
              >
                <img src={pasta.url} alt="" className="absolute inset-0 size-full" />
                <span className="relative z-10 truncate px-[6%] py-[4%] text-[clamp(0.875rem,1.9vw,1.625rem)]">
                  {c.nome}
                </span>
                <img
                  src={c.img}
                  alt={c.nome}
                  loading="lazy"
                  className="relative z-10 mx-[5%] mb-[5%] h-0 min-h-0 w-[90%] flex-1 rounded-[clamp(0.5rem,1.2vw,1rem)] object-cover"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>


      <div className="pt-[clamp(1rem,2.5vw,1.5rem)]">
        <Timeline
          onClick={() => setCalendario(true)}
          action={
            <Button
              onClick={() => setCalendario(true)}
              className="h-[clamp(40px,4.4vw,48px)] shrink-0 rounded-full px-[clamp(1rem,2.4vw,1.75rem)] text-[clamp(0.8125rem,1.2vw,1rem)]"
            >
              resumo geral
            </Button>
          }
        />
      </div>


      {calendario && <CalendarOverlay onClose={() => setCalendario(false)} />}
    </main>
  );
}
