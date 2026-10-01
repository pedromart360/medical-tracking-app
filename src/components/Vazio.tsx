import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

/** Aviso amigável quando ainda não há registros cadastrados. */
export function Vazio({
  titulo,
  acao = "+ adicionar dados",
  className = "",
}: {
  titulo: string;
  acao?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-[clamp(0.75rem,1.4vw,1.25rem)] rounded-[clamp(1rem,1.8vw,1.5rem)] border border-dashed border-border/70 px-[clamp(1rem,2vw,2rem)] py-[clamp(1.5rem,3.5vw,3rem)] text-center ${className}`}
    >
      <p className="max-w-[32ch] text-[clamp(0.8125rem,1.1vw,1rem)] text-muted-foreground">{titulo}</p>
      <Button asChild className="h-[clamp(36px,3.6vw,42px)] rounded-full px-5 text-[0.8125rem] font-normal">
        <Link to="/adicionar">{acao}</Link>
      </Button>
    </div>
  );
}
