import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Timeline } from "@/components/Timeline";
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
    <nav aria-label="Categorias" className="flex items-center gap-3">
      {railItems.map((r) => (
        <Link key={r.to} to={r.to} title={r.nome}>
          <img
            src={r.img}
            alt={r.nome}
            loading="lazy"
            className="size-11 rounded-full object-cover transition-transform hover:scale-105"
          />
        </Link>
      ))}
      <Avatar />
    </nav>
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
    <main className="mx-auto flex min-h-screen max-w-[1080px] flex-col px-4 py-5 sm:px-8 sm:py-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            to={backTo}
            className="mt-2 flex size-7 items-center justify-center rounded-full bg-border text-muted-foreground transition-colors hover:bg-muted-foreground/30"
          >
            <ChevronLeft className="size-4" />
          </Link>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <h1 className="text-3xl font-medium sm:text-5xl">{title}</h1>
          </div>
        </div>
        <div className="hidden sm:block"><Rail /></div>
      </div>

      <div className="flex-1 py-6 sm:py-8">{children}</div>

      <Timeline />
    </main>
  );
}
