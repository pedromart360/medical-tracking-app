import { useState } from "react";
import { ExameModal } from "@/components/ExameModal";
import { Button } from "@/components/ui/button";
import { imagensCorpo, usePerfil } from "@/lib/perfil";
import type { ExameCorpo, PontoCorpo } from "@/lib/data";

type Vista = "frente" | "costas";


/** recorte da ilustração (1024x1024) onde a figura realmente aparece, com folga lateral */
const JANELA = { x: 315, y: 20, w: 394, h: 985 };


function Marcador({
  ponto,
  aberto,
  selecionado,
  onToggle,
  onSelecionar,
}: {
  ponto: PontoCorpo;
  aberto: boolean;
  selecionado: ExameCorpo | null;
  onToggle: () => void;
  onSelecionar: (e: ExameCorpo) => void;
}) {
  const [x, y] = ponto.pos2d;
  const paraEsquerda = x > 50;

  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className={`flex items-center gap-2 ${paraEsquerda ? "flex-row-reverse" : ""}`}>
        <button
          onClick={onToggle}
          aria-label={`${ponto.parte}: ${ponto.exames.length} exames`}
          className={`flex size-[clamp(1.75rem,3.4vw,2.25rem)] shrink-0 items-center justify-center rounded-full text-[clamp(0.625rem,1.1vw,0.75rem)] shadow-sm ring-1 ring-border transition-colors ${
            aberto ? "bg-foreground text-background" : "bg-card/95 text-muted-foreground hover:bg-card"
          }`}
        >
          +{ponto.exames.length}
        </button>

        {aberto && (
          <div className="flex flex-col gap-1.5">
            <span className="whitespace-nowrap text-[0.625rem] uppercase tracking-wide text-muted-foreground">
              {ponto.parte}
            </span>
            {ponto.exames.map((e, i) => {
              const ativo = selecionado?.nome === e.nome && selecionado?.data === e.data;
              return (
                <button
                  key={i}
                  onClick={() => onSelecionar(e)}
                  className={`flex w-max items-center gap-3 whitespace-nowrap rounded-full px-3 py-1.5 text-[0.6875rem] shadow-sm transition-colors ${
                    ativo
                      ? "bg-foreground text-background"
                      : "bg-muted/95 text-muted-foreground hover:bg-border"
                  }`}
                >
                  <span>{e.nome}</span>
                  <span>{e.data}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function BodyFigure({ pontos }: { pontos: PontoCorpo[] }) {
  const [vista, setVista] = useState<Vista>("frente");
  const [aberto, setAberto] = useState<string | null>(null);
  const [exame, setExame] = useState<ExameCorpo | null>(null);
  const perfil = usePerfil();
  const imagens = imagensCorpo(perfil.sexo);

  const visiveis = pontos.filter((p) => p.vista === vista);


  const trocar = (v: Vista) => {
    setVista(v);
    setAberto(null);
    setExame(null);
  };

  return (
    <div className="flex size-full min-h-[clamp(320px,46vh,640px)] flex-col items-center justify-center gap-3">
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        {/* janela recortada na silhueta: mostra só a faixa da ilustração ocupada pela figura */}
        <div className="relative h-full" style={{ aspectRatio: `${JANELA.w} / ${JANELA.h}` }}>
          <div
            className="absolute"
            style={{
              width: `${(1024 / JANELA.w) * 100}%`,
              height: `${(1024 / JANELA.h) * 100}%`,
              left: `${(-JANELA.x / JANELA.w) * 100}%`,
              top: `${(-JANELA.y / JANELA.h) * 100}%`,
            }}
          >
            <img
              src={imagens[vista]}
              alt={
                vista === "frente"
                  ? "Ilustração anatômica em vista frontal"
                  : "Ilustração anatômica em vista dorsal"
              }
              width={1024}
              height={1024}
              className="size-full object-contain"
            />

            {visiveis.map((p) => (
              <Marcador
                key={p.id}
                ponto={p}
                aberto={aberto === p.id}
                selecionado={exame}
                onToggle={() => {
                  setAberto((a) => (a === p.id ? null : p.id));
                  setExame(null);
                }}
                onSelecionar={setExame}
              />
            ))}
          </div>
        </div>
      </div>


      <div className="flex shrink-0 items-center gap-1 rounded-full bg-muted p-1">
        {(["frente", "costas"] as Vista[]).map((v) => (
          <Button
            key={v}
            onClick={() => trocar(v)}
            variant={vista === v ? "default" : "ghost"}
            className="h-8 rounded-full px-4 text-xs font-normal"
          >
            {v}
          </Button>
        ))}
      </div>

      {exame && (
        <ExameModal
          exame={{
            nome: exame.nome,
            pedidoPor: exame.pedidoPor,
            data: exame.data,
            local: exame.local,
            midia: "rx",
          }}
          onClose={() => setExame(null)}
        />
      )}
    </div>
  );
}
