/** Avatar genérico do médico: usado quando nenhuma foto foi enviada. */
export function FotoMedico({ nome, className = "" }: { nome: string; className?: string }) {
  const iniciais = nome
    .replace(/^(Dr\.|Dra\.)\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-muted to-border font-medium text-muted-foreground ${className}`}
    >
      <span className="text-[40%] leading-none tracking-wide">{iniciais}</span>
    </div>
  );
}
