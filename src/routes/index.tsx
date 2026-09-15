import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { patient } from "@/lib/data";
import { Timeline } from "@/components/Timeline";
import { CalendarOverlay } from "@/components/Calendar";
import { Avatar, railItems } from "@/components/PageShell";
import body from "@/assets/body.png";

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
    <main className="mx-auto flex min-h-screen max-w-[1366px] flex-col px-8 py-7">
      <div className="grid flex-1 grid-cols-[1fr_1.25fr] gap-6">
        <div className="relative flex flex-col">
          <div className="flex items-center gap-5">
            <h1 className="text-6xl font-medium tracking-tight">{patient.nome}</h1>
            <button className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground transition-opacity hover:opacity-90">
              + mais informações
            </button>
          </div>
          <div className="mt-1 flex w-[380px] justify-between text-sm text-muted-foreground">
            <span>{patient.sexo}</span>
            <span>{patient.idade}</span>
          </div>
          <img
            src={body}
            alt="Ilustração do corpo da paciente"
            width={768}
            height={1536}
            className="mx-auto mt-2 h-[calc(100vh-320px)] w-auto object-contain"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex justify-end">
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

          <div className="grid flex-1 grid-cols-2 gap-5">
            {railItems.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="group flex flex-col rounded-[1.75rem] bg-card p-4 transition-transform hover:-translate-y-0.5"
              >
                <span className="px-2 pb-3 pt-1 text-2xl">{c.nome}</span>
                <img
                  src={c.img}
                  alt={c.nome}
                  loading="lazy"
                  className="h-full w-full flex-1 rounded-[1.25rem] object-cover"
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
            <button
              onClick={() => setCalendario(true)}
              className="rounded-full bg-primary px-7 py-4 text-sm text-primary-foreground transition-opacity hover:opacity-90"
            >
              resumo geral
            </button>
          }
        />
      </div>

      {calendario && <CalendarOverlay onClose={() => setCalendario(false)} />}
    </main>
  );
}
