import { Link } from "@tanstack/react-router";
import { abrirPerfil, iniciais, usePerfil } from "@/lib/perfil";
import { ChevronLeft } from "lucide-react";
import { Timeline } from "@/components/Timeline";
import pastaGrande from "@/assets/pasta-grande.svg.asset.json";
import { imgHome, imgIconeCategoria } from "@/lib/imagens";

export const railItems = [
  { to: "/exames", img: imgIconeCategoria("Exames"), home: imgHome("Exames"), nome: "Exames" },
  { to: "/medicos", img: imgIconeCategoria("Médicos"), home: imgHome("Médicos"), nome: "Médicos" },
  {
    to: "/tratamentos",
    img: imgIconeCategoria("Tratamentos"),
    home: imgHome("Tratamentos"),
    nome: "Tratamentos",
  },
  { to: "/doencas", img: imgIconeCategoria("Doenças"), home: imgHome("Doenças"), nome: "Doenças" },
];

export function Avatar({ className = "" }: { className?: string }) {
  const perfil = usePerfil();
  return (
    <button
      type="button"
      aria-label="Abrir perfil do paciente"
      onClick={() => abrirPerfil()}
      className={`flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-muted to-border text-xs text-muted-foreground ring-2 ring-foreground/80 transition-transform hover:scale-105 ${className}`}
    >
      {perfil.foto ? (
        <img src={perfil.foto} alt="" className="size-full object-cover" />
      ) : (
        iniciais(perfil.nome)
      )}
    </button>
  );
}

export function Rail({ className = "" }: { className?: string }) {
  return (
    <nav
      aria-label="Categorias"
      className={`flex shrink-0 items-center gap-[clamp(0.375rem,1vw,0.875rem)] ${className}`}
    >

      {railItems.map((r) => (
        <Link key={r.to} to={r.to} title={r.nome}>
          <img
            src={r.img}
            alt={r.nome}
            loading="lazy"
            className="size-[clamp(2.5rem,min(5.5vw,9vh),4.75rem)] shrink-0 rounded-full object-cover transition-transform hover:scale-105"
          />
        </Link>
      ))}
      <Avatar className="size-[clamp(2.5rem,min(5.5vw,9vh),4.75rem)]" />
    </nav>
  );
}

/* Estilos padrão dos cards de lista (mesma harmonia em todos os módulos) */
export const cardLista =
  "flex h-[clamp(3.75rem,6.1vw,5.25rem)] items-center justify-between gap-[clamp(0.5rem,1.1vw,1rem)] rounded-[clamp(1.5rem,2.4vw,2.5rem)] bg-muted pl-[clamp(1.125rem,2vw,2rem)] pr-[clamp(0.375rem,0.7vw,0.625rem)] transition-colors hover:bg-border";
export const cardListaTexto =
  "min-w-0 flex-1 truncate text-[clamp(0.9375rem,1.45vw,1.375rem)] leading-[1.3]";
export const cardListaImg =
  "size-[clamp(2.75rem,4.6vw,4.375rem)] shrink-0 rounded-full object-cover";

function Titulo({ label, title, backTo }: { label: string; title: string; backTo: string }) {
  return (
    <div className="flex min-w-0 items-center gap-[clamp(0.75rem,2.2vw,1.875rem)]">
      <Link
        to={backTo}
        aria-label="Voltar"
        className="flex size-[clamp(1.75rem,3.2vw,2.75rem)] shrink-0 items-center justify-center rounded-full bg-border text-muted-foreground transition-colors hover:bg-muted-foreground/30"
      >
        <ChevronLeft className="size-[55%]" />
      </Link>
      <div className="min-w-0">
        {label && (
          <p className="mb-[0.15em] translate-y-[0.2em] text-[clamp(0.6875rem,1.1vw,1rem)] leading-none text-muted-foreground">
            {label}
          </p>
        )}
        <h1 className="truncate py-[0.04em] text-[clamp(1.75rem,min(4vw,6.5vh),3.5rem)] font-medium leading-[1.18] tracking-tight">
          {title}
        </h1>
      </div>
    </div>
  );
}


export function PageShell({
  label,
  title,
  backTo,
  children,
}: {
  label: string;
  title: string;
  backTo: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1366px] flex-col gap-[clamp(0.75rem,1.6vw,1.375rem)] px-[clamp(0.75rem,1.5vw,1.25rem)] py-[clamp(0.75rem,1.5vw,1.25rem)] md:h-dvh md:min-h-0 md:overflow-hidden">
      {/* Mobile: layout simples sem a pasta */}
      <div className="flex flex-1 flex-col gap-5 rounded-[1.75rem] bg-card/60 p-4 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <Titulo label={label} title={title} backTo={backTo} />
          <Avatar className="size-10" />
        </div>
        {children}
      </div>

      {/* Desktop: pasta grande como fundo */}
      <div
        className="relative hidden aspect-[1326/781] w-full bg-contain bg-top bg-no-repeat md:mx-auto md:block md:max-w-[calc((100dvh-9rem)*1326/781)] md:shrink-0"
        style={{ backgroundImage: `url(${pastaGrande.url})` }}
      >
        <div className="absolute inset-0 flex flex-col">
          <div className="grid h-[16%] shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 pl-[3.5%] pr-[1.5%]">
            <Titulo label={label} title={title} backTo={backTo} />
            <Rail className="-translate-y-[5px]" />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[7.2%] pb-[6%] pt-[3%] [scrollbar-width:thin]">{children}</div>
        </div>
      </div>

      <Timeline />
    </main>
  );
}
