import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Timeline } from "@/components/Timeline";
import { Avatar, railItems } from "@/components/PageShell";
import { exameCategorias, tiposPorCategoria } from "@/lib/data";
import pastaGrande from "@/assets/pasta-grande.svg.asset.json";
import { imgCategoriaExame } from "@/lib/imagens";

export const Route = createFileRoute("/exames/")({
  head: () => ({
    meta: [
      { title: "Exames — Ana Carolina" },
      { name: "description", content: "Categorias de exames: laboratoriais, de imagem, gráficos e mais." },
      { property: "og:title", content: "Exames — Ana Carolina" },
      { property: "og:description", content: "Categorias de exames do prontuário de Ana Carolina." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Exames,
});

function Cards() {
  return (
    <div className="grid w-full max-w-[1034px] grid-cols-1 gap-[clamp(0.625rem,1.5vw,1.25rem)] sm:grid-cols-2">
      {exameCategorias.map((c) => {
        const temDetalhe = Boolean(tiposPorCategoria[c.slug]);
        const conteudo = (
          <div className="flex h-[clamp(3.5rem,9vw,7.75rem)] items-center justify-between rounded-[clamp(1rem,2.2vw,1.875rem)] bg-muted pl-[clamp(1rem,2.9vw,2.5rem)] pr-[clamp(0.5rem,1.5vw,1.25rem)] transition-colors hover:bg-border">

            <span className="truncate text-[clamp(0.9375rem,1.55vw,1.375rem)]">{c.nome}</span>
            <img
              src={imgCategoriaExame(c.slug)}
              alt=""
              loading="lazy"
              className="size-[clamp(2.25rem,4.7vw,4rem)] shrink-0 rounded-full object-cover"
            />
          </div>
        );
        return temDetalhe ? (
          <Link key={c.slug} to="/exames/$slug" params={{ slug: c.slug }} className="block h-full">
            {conteudo}
          </Link>
        ) : (
          <div key={c.slug}>{conteudo}</div>
        );
      })}
    </div>
  );
}

function Nav() {
  return (
    <nav aria-label="Categorias" className="flex items-center gap-[clamp(0.5rem,1.5vw,1.25rem)]">
      {railItems.map((r) => (
        <Link key={r.to} to={r.to} title={r.nome}>
          <img
            src={r.img}
            alt={r.nome}
            loading="lazy"
            className="size-[clamp(2.5rem,6.7vw,5.75rem)] rounded-full object-cover transition-transform hover:scale-105"
          />
        </Link>
      ))}
      <Avatar className="size-[clamp(2.5rem,6.7vw,5.75rem)]" />
    </nav>
  );
}

function Titulo() {
  return (
    <div className="flex items-center gap-[clamp(0.75rem,2.2vw,1.875rem)]">
      <Link
        to="/"
        aria-label="Voltar"
        className="flex size-[clamp(1.75rem,3.2vw,2.75rem)] shrink-0 items-center justify-center rounded-full bg-border text-muted-foreground transition-colors hover:bg-muted-foreground/30"
      >
        <ChevronLeft className="size-[55%]" />
      </Link>
      <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-medium leading-none tracking-tight">Exames</h1>
    </div>
  );
}

function Exames() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1366px] flex-col gap-[clamp(0.75rem,1.6vw,1.375rem)] px-[clamp(0.75rem,1.5vw,1.25rem)] py-[clamp(0.75rem,1.5vw,1.25rem)]">
      {/* Mobile: layout simples sem a pasta */}
      <div className="flex flex-1 flex-col gap-5 rounded-[1.75rem] bg-card/60 p-4 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <Titulo />
          <Avatar className="size-10" />
        </div>
        <Cards />
      </div>

      {/* Desktop: pasta grande como fundo */}
      <div
        className="relative hidden aspect-[1326/781] w-full bg-contain bg-top bg-no-repeat md:block"
        style={{ backgroundImage: `url(${pastaGrande.url})` }}
      >
        <div className="absolute inset-0 flex flex-col">
          <div className="flex h-[14%] items-center justify-between pl-[3.5%] pr-[1.5%]">
            <Titulo />
            <Nav />
          </div>
          <div className="flex flex-1 items-start px-[4.4%] pb-[5%] pt-[6.5%]">
            <Cards />
          </div>
        </div>
      </div>

      <Timeline />
    </main>
  );
}
