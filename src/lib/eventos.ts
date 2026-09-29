import { useMemo } from "react";
import type { Prontuario } from "./adicionados";

export type ModuloEvento = "consultas" | "exames" | "tratamentos" | "doencas";

export type EventoCalendario = {
  id: string;
  titulo: string;
  detalhe: string;
  modulo: ModuloEvento;
  data: string; // DD/MM/AAAA
};

export const MODULOS: { id: ModuloEvento | "todos"; nome: string }[] = [
  { id: "todos", nome: "Todos" },
  { id: "consultas", nome: "Consultas" },
  { id: "exames", nome: "Exames" },
  { id: "tratamentos", nome: "Tratamentos" },
  { id: "doencas", nome: "Doenças" },
];

export const corModulo: Record<ModuloEvento, string> = {
  consultas: "bg-sky-500/15 text-sky-700",
  exames: "bg-amber-500/15 text-amber-700",
  tratamentos: "bg-emerald-500/15 text-emerald-700",
  doencas: "bg-rose-500/15 text-rose-700",
};

export const nomeModulo: Record<ModuloEvento, string> = {
  consultas: "Consultas",
  exames: "Exames",
  tratamentos: "Tratamentos",
  doencas: "Doenças",
};

const pad = (v: number) => String(v).padStart(2, "0");

function normalizar(data: string): string {
  const [d, m, a] = data.split("/");
  if (!d || !m || !a) return "";
  return `${pad(Number(d))}/${pad(Number(m))}/${a}`;
}

/** Todos os eventos do prontuário agrupados por data DD/MM/AAAA */
export function agruparEventos(p: Prontuario): Map<string, EventoCalendario[]> {
  const mapa = new Map<string, EventoCalendario[]>();
  const add = (e: EventoCalendario) => {
    if (!e.data) return;
    const lista = mapa.get(e.data) ?? [];
    lista.push(e);
    mapa.set(e.data, lista);
  };

  for (const ex of p.arquivos) {
    add({
      id: `ex-${ex.id}`,
      titulo: ex.nome,
      detalhe: ex.tipoNome || ex.areaMedica,
      modulo: "exames",
      data: normalizar(ex.data),
    });
  }

  for (const m of p.medicos) {
    for (const c of m.consultas) {
      add({
        id: `co-${m.id}-${c.id}`,
        titulo: m.nome,
        detalhe: m.cargo || m.especialidade,
        modulo: "consultas",
        data: normalizar(c.data),
      });
    }
  }

  for (const t of p.tratamentos) {
    for (const dia of t.dias) {
      add({
        id: `tr-${t.id}-${dia}`,
        titulo: t.nome,
        detalhe: t.categoria,
        modulo: "tratamentos",
        data: normalizar(`${dia}/${t.ano}`),
      });
    }
  }

  for (const d of p.doencas) {
    add({
      id: `do-${d.id}`,
      titulo: d.nome,
      detalhe: d.percebidaPor?.nome ? `Percebida por ${d.percebidaPor.nome}` : "Doença",
      modulo: "doencas",
      data: normalizar(d.data),
    });
  }

  return mapa;
}

export function useEventos(p: Prontuario) {
  return useMemo(() => agruparEventos(p), [p]);
}
