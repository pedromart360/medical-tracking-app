import { Suspense, lazy, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { ExameModal } from "@/components/ExameModal";
import type { ExameCorpo, PontoCorpo } from "@/lib/data";

const BodyScene = lazy(() => import("@/components/BodyScene"));

function Placeholder() {
  return <div className="size-full animate-pulse rounded-[1.5rem] bg-muted/50" />;
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
