import { useMemo, useState } from "react";
import { ExameArte } from "@/components/ExameArte";
import { Vazio } from "@/components/Vazio";
import { ExameModal } from "@/components/ExameModal";
import type { ExameArquivo } from "@/lib/data";

const COL = "clamp(7.5rem,14vw,12.5rem)";

export function ArquivosExames({ itens }: { itens: ExameArquivo[] }) {
  const [aberto, setAberto] = useState<ExameArquivo | null>(null);

  /** organiza em colunas de 2 (leitura por coluna, como no design) */
  const colunas = useMemo(() => {
    const cols: ExameArquivo[][] = [];
    for (let i = 0; i < itens.length; i += 2) cols.push(itens.slice(i, i + 2));
    return cols;
  }, [itens]);

  /** primeira coluna de cada ano, para a régua superior */
  const marcasAno = useMemo(() => {
    const vistos = new Set<number>();
    return colunas
      .map((c, i) => ({ ano: c[0]?.ano, col: i }))
      .filter((m) => {
        if (m.ano === undefined || vistos.has(m.ano)) return false;
        vistos.add(m.ano);
        return true;
      }) as { ano: number; col: number }[];
  }, [colunas]);

  if (itens.length === 0) {
    return <Vazio titulo="Nenhum exame cadastrado aqui ainda." acao="+ adicionar exame" />;
  }

  return (
    <>
      <div className="w-full overflow-x-auto pb-[clamp(0.5rem,1vw,1rem)] [scrollbar-color:var(--color-muted-foreground)_transparent]">
        <div
          className="grid w-max gap-x-[clamp(0.75rem,2vw,2rem)]"
          style={{ gridTemplateColumns: `repeat(${colunas.length}, ${COL})` }}
        >
          {/* régua de anos */}
          {colunas.map((_, i) => {
            const marca = marcasAno.find((m) => m.col === i);
            return (
              <div key={`ano-${i}`} className="flex h-[clamp(2rem,4vw,3.25rem)] flex-col items-start">
                {marca && (
                  <>
                    <span className="text-[clamp(0.75rem,1.1vw,1rem)] text-muted-foreground">{marca.ano}</span>
                    <span className="mt-1 h-[clamp(0.5rem,1vw,0.875rem)] w-px bg-muted-foreground/60" />
                  </>
                )}
              </div>
            );
          })}

          {/* duas linhas de cards */}
          {[0, 1].map((linha) =>
            colunas.map((col, i) => {
              const item = col[linha];
              if (!item) return <div key={`${linha}-${i}`} />;
              return (
                <button
                  key={item.id}
                  onClick={() => setAberto(item)}
                  className="group mb-[clamp(0.75rem,2vw,2rem)] flex flex-col text-left"
                >
                  <ExameArte
                    midia={item.midia}
                    seed={item.nome.length + i}
                    className="aspect-square w-full rounded-[clamp(0.75rem,1.4vw,1.25rem)] transition-transform group-hover:scale-[1.03]"
                  />
                  <span className="mt-[clamp(0.375rem,0.9vw,0.75rem)] truncate text-[clamp(0.8125rem,1.25vw,1.125rem)]">
                    {item.nome}
                  </span>
                  <span className="self-end text-[clamp(0.625rem,0.9vw,0.8125rem)] text-muted-foreground">
                    {item.data}
                  </span>
                  <span className="text-[clamp(0.625rem,0.9vw,0.8125rem)] text-muted-foreground">{item.pedidoPor}</span>
                </button>
              );
            }),
          )}
        </div>
      </div>

      {aberto && (
        <ExameModal
          exame={{
            nome: aberto.nome,
            pedidoPor: aberto.pedidoPor,
            data: aberto.data,
            realizadoPor: aberto.realizadoPor,
            local: aberto.local,
            midia: aberto.midia,
            arquivoPath: aberto.arquivoPath,
            laudoPath: aberto.laudoPath,
            observacoes: aberto.observacoes,
          }}
          onClose={() => setAberto(null)}
        />
      )}
    </>
  );
}
