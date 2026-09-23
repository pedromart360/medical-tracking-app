import { Suspense, lazy, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { X, RotateCcw } from "lucide-react";
import type { ExameCorpo, PontoCorpo } from "@/lib/data";

const BodyScene = lazy(() => import("@/components/BodyScene"));

function Placeholder() {
  return <div className="size-full animate-pulse rounded-[1.5rem] bg-muted/50" />;
}

function DetalheExame({ exame, onClose }: { exame: ExameCorpo; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/10 p-[clamp(0.75rem,3vw,2.5rem)] backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-[720px] flex-col gap-4 overflow-y-auto rounded-[clamp(1.25rem,2.4vw,2rem)] bg-muted p-[clamp(1rem,2vw,1.75rem)] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.4)]"
      >
        <button
          onClick={onClose}
          aria-label="Fechar exame"
          className="absolute left-[clamp(1rem,2vw,1.75rem)] top-[clamp(1rem,2vw,1.75rem)] flex size-8 items-center justify-center rounded-full bg-border text-muted-foreground transition-colors hover:bg-muted-foreground/30"
        >
          <X className="size-4" />
        </button>
        <div className="grid gap-4 pt-10 sm:grid-cols-[1fr_1fr]">
          <div className="aspect-square rounded-[1rem] bg-gradient-to-br from-foreground/90 via-foreground/70 to-muted-foreground/40" />
          <div className="flex flex-col gap-2">
            <h3 className="text-[clamp(1.25rem,2.4vw,2rem)] font-medium leading-none">{exame.nome}</h3>
            <p className="text-sm text-muted-foreground">Pedido por: {exame.pedidoPor}</p>
            <p className="text-sm text-muted-foreground">Realizado em: {exame.realizadoEm}</p>
            <p className="text-sm text-muted-foreground">Local: {exame.local}</p>
            <button className="mt-2 w-max rounded-full bg-foreground px-5 py-2 text-sm text-background">
              laudo
            </button>
            <div className="mt-2 rounded-[1rem] border border-border p-3">
              <span className="text-sm underline">Observações</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BodyViewer({ pontos }: { pontos: PontoCorpo[] }) {
  const [aberto, setAberto] = useState<string | null>(null);
  const [exame, setExame] = useState<ExameCorpo | null>(null);

  return (
    <div className="relative size-full min-h-[clamp(320px,46vh,640px)]">
      <ClientOnly fallback={<Placeholder />}>
        <Suspense fallback={<Placeholder />}>
          <BodyScene
            pontos={pontos}
            aberto={aberto}
            selecionado={exame}
            onToggle={(id) => {
              setAberto((a) => (a === id ? null : id));
              setExame(null);
            }}
            onSelecionar={setExame}
          />
        </Suspense>
      </ClientOnly>

      <span className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-card/80 px-3 py-1 text-[0.6875rem] text-muted-foreground">
        <RotateCcw className="size-3" /> arraste para girar
      </span>

      {exame && <DetalheExame exame={exame} onClose={() => setExame(null)} />}
    </div>
  );
}
