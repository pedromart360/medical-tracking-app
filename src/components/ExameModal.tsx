import { useEffect, useState } from "react";
import { FileText, X } from "lucide-react";
import { ExameArte } from "@/components/ExameArte";
import { abrirArquivo, linkArquivo } from "@/lib/arquivos";
import type { MidiaExame } from "@/lib/data";

export type ExameDetalhe = {
  nome: string;
  pedidoPor: string;
  data: string;
  realizadoPor?: string | undefined;
  local: string;
  midia?: MidiaExame | undefined;
  arquivoPath?: string | undefined;
  laudoPath?: string | undefined;
  observacoes?: string | undefined;
};

const EH_IMAGEM = /\.(png|jpe?g|webp|gif|heic|bmp)$/i;

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <p className="text-[clamp(0.8125rem,1.1vw,1rem)] text-muted-foreground">
      {rotulo}&nbsp;&nbsp;<span className="text-foreground/80">{valor}</span>
    </p>
  );
}

export function ExameModal({ exame, onClose }: { exame: ExameDetalhe; onClose: () => void }) {
  const [miniatura, setMiniatura] = useState<string | null>(null);
  const arquivo = exame.arquivoPath ?? exame.laudoPath;

  useEffect(() => {
    const fechar = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fechar);
    return () => window.removeEventListener("keydown", fechar);
  }, [onClose]);

  useEffect(() => {
    setMiniatura(null);
    if (!arquivo || !EH_IMAGEM.test(arquivo)) return;
    let ativo = true;
    void linkArquivo(arquivo).then((url) => ativo && setMiniatura(url));
    return () => {
      ativo = false;
    };
  }, [arquivo]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={exame.nome}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/15 p-[clamp(0.75rem,3vw,3rem)] backdrop-blur-[3px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-[1000px] flex-col overflow-y-auto rounded-[clamp(1.5rem,2.6vw,2.25rem)] bg-muted p-[clamp(1rem,2.4vw,2.25rem)] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.45)]"
      >
        <button
          onClick={onClose}
          aria-label="Fechar exame"
          className="mb-[clamp(0.75rem,1.6vw,1.25rem)] flex size-[clamp(1.75rem,2.6vw,2.25rem)] items-center justify-center rounded-full bg-border text-muted-foreground transition-colors hover:bg-muted-foreground/30"
        >
          <X className="size-[55%]" />
        </button>

        <div className="grid gap-[clamp(1rem,2.6vw,2.5rem)] sm:grid-cols-[minmax(0,40%)_minmax(0,1fr)]">
          {arquivo ? (
            <button
              onClick={() => void abrirArquivo(arquivo)}
              aria-label={`Abrir arquivo de ${exame.nome}`}
              className="group relative block overflow-hidden rounded-[clamp(1rem,1.8vw,1.5rem)] text-left"
            >
              {miniatura ? (
                <img src={miniatura} alt={exame.nome} className="aspect-[3/4] w-full bg-card object-cover" />
              ) : (
                <ExameArte midia={exame.midia ?? "rx"} seed={exame.nome.length} className="aspect-[3/4] w-full" />
              )}
              <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-foreground/80 px-3 py-1.5 text-xs text-background transition-opacity group-hover:bg-foreground">
                <FileText className="size-3.5" /> abrir arquivo
              </span>
            </button>
          ) : (
            <div className="relative">
              <ExameArte
                midia={exame.midia ?? "rx"}
                seed={exame.nome.length}
                className="aspect-[3/4] w-full rounded-[clamp(1rem,1.8vw,1.5rem)]"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-card/90 px-3 py-1.5 text-xs text-muted-foreground">
                sem arquivo anexado
              </span>
            </div>
          )}

          <div className="flex min-w-0 flex-col gap-[clamp(0.375rem,0.8vw,0.625rem)]">
            <h2 className="py-[0.08em] text-[clamp(1.5rem,3.4vw,3rem)] font-medium leading-[1.18] tracking-tight">{exame.nome}</h2>
            <div className="mt-[clamp(0.5rem,1.2vw,1rem)] flex flex-col gap-[clamp(0.25rem,0.6vw,0.5rem)]">
              <Linha rotulo="Pedido por:" valor={exame.pedidoPor} />
              <Linha rotulo="Realizado na data:" valor={exame.data} />
              {exame.realizadoPor && <Linha rotulo="Realizado por:" valor={exame.realizadoPor} />}
              <Linha rotulo="Local:" valor={exame.local} />
            </div>

            <button
              onClick={() => exame.laudoPath && void abrirArquivo(exame.laudoPath)}
              disabled={!exame.laudoPath}
              className="mt-[clamp(0.75rem,1.6vw,1.5rem)] h-[clamp(2.25rem,3vw,2.75rem)] w-max rounded-full bg-foreground px-[clamp(1.5rem,2.6vw,2.25rem)] text-[clamp(0.8125rem,1.1vw,1rem)] text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {exame.laudoPath ? "laudo" : "sem laudo anexado"}
            </button>

            <div className="mt-[clamp(0.75rem,1.6vw,1.5rem)] rounded-[clamp(0.75rem,1.4vw,1.25rem)] border border-border p-[clamp(0.75rem,1.2vw,1rem)]">
              <p className="mb-1 text-[clamp(0.6875rem,0.95vw,0.8125rem)] text-muted-foreground">Observações</p>
              <p className="whitespace-pre-wrap text-[clamp(0.8125rem,1.1vw,1rem)] text-foreground/80">
                {exame.observacoes || "Nenhuma observação. Você pode incluir pela tela adicionar dados."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
