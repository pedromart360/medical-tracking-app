import { useEffect, useState } from "react";
import { Minus, Plus, X } from "lucide-react";

export type DocumentoAberto = {
  titulo: string;
  paginas: number;
  medico: string;
  crm: string;
  data: string;
  local: string;
};

/** Visualizador simples de documento (estilo leitor de PDF) dentro do app. */
export function DocumentoViewer({ doc, onClose }: { doc: DocumentoAberto; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const fechar = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fechar);
    return () => window.removeEventListener("keydown", fechar);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={doc.titulo}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/25 p-[clamp(0.5rem,3vw,2.5rem)] backdrop-blur-[3px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[94vh] w-full max-w-[820px] flex-col overflow-hidden rounded-[clamp(1.25rem,2.4vw,2rem)] bg-muted shadow-[0_40px_90px_-40px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center gap-3 border-b border-border px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(0.625rem,1.4vw,1rem)]">
          <button
            onClick={onClose}
            aria-label="Fechar documento"
            className="flex size-[clamp(1.75rem,2.6vw,2.25rem)] shrink-0 items-center justify-center rounded-full bg-border text-muted-foreground transition-colors hover:bg-muted-foreground/30"
          >
            <X className="size-[55%]" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[clamp(0.875rem,1.4vw,1.125rem)] font-medium leading-tight">{doc.titulo}</p>
            <p className="truncate text-[clamp(0.6875rem,1vw,0.8125rem)] text-muted-foreground">
              {doc.medico} · {doc.data} · {doc.paginas} páginas
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => setZoom((z) => Math.max(0.7, +(z - 0.15).toFixed(2)))}
              aria-label="Diminuir zoom"
              className="flex size-8 items-center justify-center rounded-full bg-card text-muted-foreground transition-colors hover:bg-border"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-11 text-center text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.15).toFixed(2)))}
              aria-label="Aumentar zoom"
              className="flex size-8 items-center justify-center rounded-full bg-card text-muted-foreground transition-colors hover:bg-border"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-background/60 p-[clamp(0.75rem,2vw,1.75rem)]">
          <div
            className="mx-auto flex w-full max-w-[620px] origin-top flex-col gap-[clamp(0.75rem,1.6vw,1.25rem)]"
            style={{ transform: `scale(${zoom})` }}
          >
            {Array.from({ length: doc.paginas }, (_, p) => (
              <Pagina key={p} doc={doc} indice={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Pagina({ doc, indice }: { doc: DocumentoAberto; indice: number }) {
  const linhas = Array.from({ length: 16 }, (_, i) => 55 + ((i * 37 + indice * 11) % 45));

  return (
    <article className="aspect-[1/1.414] w-full overflow-hidden rounded-[0.5rem] bg-card p-[8%] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.5)]">
      <header className="flex items-start justify-between gap-3 border-b border-border pb-[4%]">
        <div className="min-w-0">
          <p className="truncate text-[0.65rem] font-medium capitalize sm:text-sm">{doc.titulo}</p>
          <p className="truncate text-[0.5625rem] text-muted-foreground sm:text-xs">{doc.local}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[0.5625rem] text-muted-foreground sm:text-xs">{doc.medico}</p>
          <p className="text-[0.5625rem] text-muted-foreground sm:text-xs">{doc.crm}</p>
        </div>
      </header>

      {indice === 0 && (
        <p className="mt-[6%] text-[0.6rem] leading-relaxed text-foreground/80 sm:text-xs">
          Documento emitido em {doc.data}, referente ao atendimento do titular da conta.
        </p>
      )}

      <div className="mt-[6%] space-y-[10px]">
        {linhas.map((l, i) => (
          <div key={i} className="h-[5px] rounded-full bg-muted-foreground/25" style={{ width: `${l}%` }} />
        ))}
      </div>

      <p className="mt-[8%] text-right text-[0.5625rem] text-muted-foreground sm:text-xs">
        página {indice + 1} de {doc.paginas}
      </p>
    </article>
  );
}
