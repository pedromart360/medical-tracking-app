import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Timeline } from "@/components/Timeline";
import pastaGrande from "@/assets/pasta-grande.svg.asset.json";
import exames from "@/assets/exames.jpg";
import medicos from "@/assets/medicos.jpg";
import tratamentos from "@/assets/tratamentos.jpg";
import doencas from "@/assets/doencas.jpg";

export const railItems = [
  { to: "/exames", img: exames, nome: "Exames" },
  { to: "/medicos", img: medicos, nome: "Médicos" },
  { to: "/tratamentos", img: tratamentos, nome: "Tratamentos" },
  { to: "/doencas", img: doencas, nome: "Doenças" },
];

export function Avatar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`size-14 shrink-0 rounded-full bg-gradient-to-br from-muted to-border ring-2 ring-foreground/80 ${className}`}
    />
  );
}

export function Rail() {
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
          <p className="text-[clamp(0.6875rem,1.1vw,1rem)] leading-tight text-muted-foreground">{label}</p>
        )}
        <h1 className="truncate text-[clamp(1.75rem,4vw,3.5rem)] font-medium leading-none tracking-tight">
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
    <main className="mx-auto flex min-h-screen w-full max-w-[1366px] flex-col gap-[clamp(0.75rem,1.6vw,1.375rem)] px-[clamp(0.75rem,1.5vw,1.25rem)] py-[clamp(0.75rem,1.5vw,1.25rem)]">
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
        className="relative hidden aspect-[1326/781] w-full bg-contain bg-top bg-no-repeat md:block"
        style={{ backgroundImage: `url(${pastaGrande.url})` }}
      >
        <div className="absolute inset-0 flex flex-col">
          <div className="flex h-[11.3%] items-center justify-between pl-[3.5%] pr-[1.5%]">
            <Titulo label={label} title={title} backTo={backTo} />
            <Rail />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[7.2%] pb-[4%] pt-[3%]">{children}</div>
        </div>
      </div>

      <Timeline />
    </main>
  );
}
