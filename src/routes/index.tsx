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
    <main className="mx-auto flex min-h-screen max-w-[1080px] flex-col px-4 py-5 sm:px-8 sm:py-7">
      <div className="grid flex-1 gap-6 md:grid-cols-[0.8fr_1.2fr]">
        <div className="relative flex flex-col">
          <div className="flex items-center gap-5">
            <h1 className="text-4xl font-medium sm:text-6xl">{patient.nome}</h1>
            <Button className="hidden rounded-full px-5 sm:inline-flex">
              + mais informações
            </Button>
          </div>
          <div className="mt-1 flex w-full max-w-[380px] justify-between text-sm text-muted-foreground">
            <span>{patient.sexo}</span>
            <span>{patient.idade}</span>
          </div>
          <img
            src={body}
            alt="Ilustração do corpo da paciente"
            width={768}
            height={1536}
            className="mx-auto mt-2 h-[360px] w-auto object-contain sm:h-[calc(100vh-320px)]"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="hidden justify-end sm:flex">
            <Avatar />
          </div>

          <label className="flex items-center gap-3 rounded-[1.75rem] bg-card px-7 py-5">
            <input
              placeholder="Pesquisar..."
              className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            <span className="flex size-8 items-center justify-center rounded-full bg-border text-muted-foreground">
              <Search className="size-4" />
            </span>
          </label>

          <div className="grid grid-cols-2 gap-5">
            {railItems.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="group relative flex aspect-[427/268] min-w-0 flex-col overflow-hidden rounded-[1.5rem] transition-transform hover:-translate-y-0.5"
              >
                <img src={pasta.url} alt="" className="absolute inset-0 size-full" />
                <span className="relative z-10 px-5 pb-3 pt-4 text-xl sm:text-2xl">{c.nome}</span>
                <img
                  src={c.img}
                  alt={c.nome}
                  loading="lazy"
                  className="relative z-10 mx-4 mb-4 h-0 min-h-0 w-[calc(100%-2rem)] flex-1 rounded-[1rem] object-cover"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Timeline
          onClick={() => setCalendario(true)}
          action={
            <Button
              onClick={() => setCalendario(true)}
              className="h-12 rounded-full px-7"
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
