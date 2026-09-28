import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { idadeDoPerfil, usePerfil } from "@/lib/perfil";
import { Timeline } from "@/components/Timeline";
import { CalendarOverlay } from "@/components/Calendar";
import { Avatar, railItems } from "@/components/PageShell";
const body = "/body_front.webp";
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
  const [gerando, setGerando] = useState(false);
  const perfil = usePerfil();

  const gerarResumo = async () => {
    setGerando(true);
    try {
      const { exportarResumoGeralPDF } = await import("@/lib/export-resumo");
      await exportarResumoGeralPDF(perfil);
    } finally {
      setGerando(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1286px] flex-col px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1rem,2.5vw,2.5rem)]">
      <div className="grid flex-1 gap-[clamp(1rem,2.5vw,1.875rem)] md:grid-cols-[minmax(0,31%)_minmax(0,1fr)]">
        <div className="relative flex min-w-0 flex-col">
          <header className="flex flex-col gap-2 md:contents">
            <div className="flex items-center gap-3">
              <h1 className="min-w-0 flex-1 truncate text-[clamp(1.75rem,7vw,3.5rem)] font-medium leading-none tracking-tight">
                {perfil.nome || "Paciente"}
              </h1>
              <Avatar className="size-10 md:hidden" />
            </div>

            <div className="flex items-center justify-between gap-3 md:mt-2 md:max-w-[380px] md:justify-between">
              <div className="flex min-w-0 items-center gap-2 text-[clamp(0.75rem,3.2vw,0.875rem)] text-muted-foreground md:w-full md:justify-between md:gap-0">
                <span className="truncate">{perfil.sexo}</span>
                <span className="md:hidden" aria-hidden>
                  ·
                </span>
                <span>{idadeDoPerfil(perfil)}</span>
              </div>
              <Button
                asChild
                className="h-8 shrink-0 rounded-full px-4 text-[0.75rem] font-normal md:hidden"
              >
                <Link to="/adicionar">+ adicionar dados</Link>
              </Button>
            </div>
          </header>

          {/* recorte da janela 1024x1024 onde a figura aparece (mesma janela do BodyFigure).
              No desktop a figura preenche toda a altura livre da coluna, alinhando a base
              da imagem à base do bloco; a figura está centrada na imagem original (x 315-709). */}
          <div
            className="relative mx-auto mt-3 h-[min(78vw,420px)] w-full overflow-hidden md:h-auto md:min-h-0 md:flex-1"
            style={{ aspectRatio: "394 / 985" }}
          >
            <img
              src={body}
              alt="Ilustração anatômica da paciente em vista frontal"
              width={1024}
              height={1024}
              className="absolute left-1/2 top-0 max-w-none"
              style={{
                width: "auto",
                height: `${(1024 / 985) * 100}%`,
                transform: `translate(-50%, ${(-20 / 1024) * 100}%)`,
              }}
            />
          </div>

        </div>

        <div className="flex min-w-0 flex-col gap-[clamp(0.75rem,1.6vw,1.25rem)]">
          <div className="hidden items-center justify-between gap-4 md:flex">
            <Button
              asChild
              className="h-[clamp(36px,3.6vw,42px)] rounded-full px-[clamp(1rem,2vw,1.5rem)] text-[clamp(0.8125rem,1.2vw,0.9375rem)] font-normal"
            >
              <Link to="/adicionar">+ adicionar dados</Link>
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
              onClick={gerarResumo}
              disabled={gerando}
              className="h-[clamp(40px,4.4vw,48px)] shrink-0 rounded-full px-[clamp(1rem,2.4vw,1.75rem)] text-[clamp(0.8125rem,1.2vw,1rem)]"
            >
              {gerando ? "gerando..." : "resumo geral"}
            </Button>
          }
        />
      </div>


      {calendario && <CalendarOverlay onClose={() => setCalendario(false)} />}
    </main>
  );
}
