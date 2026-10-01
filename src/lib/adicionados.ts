import { useEffect, useMemo, useState } from "react";
import {
  arquivosExame,
  areaSlug,
  cargoPorEspecialidade,
  doencasBase,
  especialidadeSlug,
  medicosBase,
  pontosCorpo,
  regioesCorpo,
  tiposPorCategoria,
  tratamentosBase,
  type Consulta,
  type DoencaRegistro,
  type ExameArquivo,
  type Medico,
  type MidiaExame,
  type PontoCorpo,
  type TratamentoRegistro,
} from "./data";

export type TipoAdicionado = "exame" | "medico" | "consulta" | "tratamento" | "doenca";

export const TIPOS_REGISTRO: TipoAdicionado[] = [
  "exame",
  "medico",
  "consulta",
  "tratamento",
  "doenca",
];

export type RegistroSalvo = Record<string, string> & { id: string };

const EVENTO = "adicionados-mudou";

export function lerRegistros(t: TipoAdicionado): RegistroSalvo[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = JSON.parse(localStorage.getItem(`adicionados-${t}`) ?? "[]") as unknown;
    return Array.isArray(bruto) ? (bruto as RegistroSalvo[]) : [];
  } catch {
    return [];
  }
}

function guardarLocal(t: TipoAdicionado, lista: RegistroSalvo[]) {
  try {
    localStorage.setItem(`adicionados-${t}`, JSON.stringify(lista));
  } catch {
    /* ignora */
  }
  window.dispatchEvent(new Event(EVENTO));
}

/** Salva no aparelho e envia para a conta na nuvem. */
export function salvarRegistros(t: TipoAdicionado, lista: RegistroSalvo[]) {
  guardarLocal(t, lista);
  void import("./nuvem").then((n) => n.enviarRegistros(t, lista));
}

/** Aplica os registros vindos da nuvem, sem reenviá-los. */
export function aplicarRegistrosDaNuvem(porTipo: Record<TipoAdicionado, RegistroSalvo[]>) {
  for (const t of TIPOS_REGISTRO) guardarLocal(t, porTipo[t] ?? []);
}

/** Limpa os registros guardados neste aparelho (usado ao sair da conta). */
export function limparRegistrosLocais() {
  for (const t of TIPOS_REGISTRO) {
    try {
      localStorage.removeItem(`adicionados-${t}`);
    } catch {
      /* ignora */
    }
  }
  window.dispatchEvent(new Event(EVENTO));
}

/** Lê os registros salvos pelo paciente e reage a novas inclusões */
export function useRegistros(t: TipoAdicionado): RegistroSalvo[] {
  const [lista, setLista] = useState<RegistroSalvo[]>([]);

  useEffect(() => {
    const ler = () => setLista(lerRegistros(t));
    ler();
    window.addEventListener(EVENTO, ler);
    window.addEventListener("storage", ler);
    return () => {
      window.removeEventListener(EVENTO, ler);
      window.removeEventListener("storage", ler);
    };
  }, [t]);

  return lista;
}

/* ---------- utilidades de data ---------- */

const pad = (v: number) => String(v).padStart(2, "0");

function partes(data: string) {
  const [d, m, a] = data.split("/").map(Number);
  return { d: d ?? 1, m: m ?? 1, a: a ?? new Date().getFullYear() };
}

export function anoDe(data: string) {
  return partes(data).a;
}

/** lista de "DD/MM" entre duas datas (limitado ao ano de início) */
function diasEntre(inicio: string, fim?: string) {
  const i = partes(inicio);
  const inicial = new Date(i.a, i.m - 1, i.d);
  let final = inicial;
  if (fim) {
    const f = partes(fim);
    const dt = new Date(f.a, f.m - 1, f.d);
    if (dt > inicial) final = dt;
  }
  const dias: string[] = [];
  const cursor = new Date(inicial);
  while (cursor <= final && dias.length < 366 && cursor.getFullYear() === i.a) {
    dias.push(`${pad(cursor.getDate())}/${pad(cursor.getMonth() + 1)}`);
    cursor.setDate(cursor.getDate() + 1);
  }
  return dias.length > 0 ? dias : [`${pad(i.d)}/${pad(i.m)}`];
}

function listaJson(valor: string | undefined): string[] {
  if (!valor) return [];
  try {
    const v = JSON.parse(valor) as unknown;
    return Array.isArray(v) ? v.map(String).filter(Boolean) : [];
  } catch {
    return valor
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

/* ---------- conversores ---------- */

function paraArquivo(r: RegistroSalvo): ExameArquivo {
  const categoria = r["categoria"] ?? "";
  const tipoSlug = r["tipo"] ?? "";
  const tipoNome = tiposPorCategoria[categoria]?.find((t) => t.slug === tipoSlug)?.nome ?? tipoSlug;
  const data = r["data"] ?? "";
  const arquivo: ExameArquivo = {
    id: r.id,
    nome: r["nome"] ?? "Exame",
    categoriaSlug: categoria,
    tipoSlug,
    tipoNome,
    areaMedica: r["area"] || "Geral",
    data,
    ano: anoDe(data),
    pedidoPor: r["solicitante"] || "Não informado",
    realizadoPor: r["realizador"] || "Não informado",
    local: r["local"] || "Não informado",
    midia: (r["midia"] as MidiaExame) || "laudo",
    temLaudo: !!r["laudo"],
  };
  if (r["regiao"]) arquivo.regiao = r["regiao"];
  if (r["observacoes"]) arquivo.observacoes = r["observacoes"];
  return arquivo;
}

function paraMedico(r: RegistroSalvo): Medico {
  const esp = r["especialidade"] ?? "Clínica";
  const nome = r["nome"] ?? "Profissional";
  return {
    id: `add-${areaSlug(nome)}-${r.id.slice(-4)}`,
    nome,
    cargo: cargoPorEspecialidade[esp] ?? "Médico",
    especialidade: esp,
    especialidadeSlug: especialidadeSlug(esp),
    bio: r["bio"] || `${nome} acompanha o prontuário em ${esp}.`,
    crm: r["crm"] || "CRM não informado",
    consultas: [],
    remedios: [],
    examesSolicitados: [],
  };
}

function paraConsulta(r: RegistroSalvo): Consulta {
  const data = r["data"] ?? "";
  const p = partes(data);
  return {
    id: r.id,
    dia: `${pad(p.d)}/${pad(p.m)}`,
    data,
    ano: p.a,
    local: r["local"] || "Não informado",
    laudos: r["documento"] ? [{ id: `${r.id}-doc`, titulo: r["documento"], paginas: 1 }] : [],
    exames: listaJson(r["exames"]).map((nome) => ({ nome, midia: "laudo" as MidiaExame })),
    resumo: r["resumo"] ?? "",
  };
}

function paraTratamento(r: RegistroSalvo): TratamentoRegistro {
  const inicio = r["inicio"] ?? "";
  const p = partes(inicio);
  const continuo = r["continuo"] === "sim";
  const fim = continuo ? `31/12/${p.a}` : r["fim"];
  const dias = diasEntre(inicio, fim);
  const nomeMedico = r["pedidoPor"] || "Não informado";
  const vinculo = medicosBase.find((m) => m.nome === nomeMedico);
  return {
    id: r.id,
    nome: r["nome"] ?? "Tratamento",
    categoria: r["categoria"] ?? "domiciliar",
    ano: p.a,
    dias,
    periodo: dias.length > 1 ? `${dias[0]}–${dias[dias.length - 1]}` : dias[0]!,
    dataCompleta: inicio,
    pedidoPor: {
      nome: nomeMedico,
      espSlug: vinculo?.especialidadeSlug ?? "",
      medicoId: vinculo?.id ?? "",
    },
    realizadoPor: r["realizadoPor"] || "Não informado",
    local: r["local"] || "Não informado",
  };
}

function paraDoenca(r: RegistroSalvo, tratamentos: TratamentoRegistro[]): DoencaRegistro {
  const data = r["data"] ?? "";
  const nomeMedico = r["percebidaPor"] || "Não informado";
  const vinculo = medicosBase.find((m) => m.nome === nomeMedico);
  const trat = r["tratamento"]
    ? tratamentos.find((t) => t.nome.toLowerCase() === r["tratamento"]!.toLowerCase())
    : undefined;
  return {
    id: r.id,
    nome: r["nome"] ?? "Doença",
    data,
    ano: anoDe(data),
    percebidaPor: {
      nome: nomeMedico,
      espSlug: vinculo?.especialidadeSlug ?? "",
      medicoId: vinculo?.id ?? "",
    },
    tratamentoId: trat?.id ?? "",
    documentos: r["documento"] ? [{ id: `${r.id}-doc`, titulo: r["documento"], paginas: 1 }] : [],
  };
}

/* ---------- mesclagem ---------- */

export function mesclarMedicos(addMedicos: RegistroSalvo[], addConsultas: RegistroSalvo[]): Medico[] {
  const todos: Medico[] = [...medicosBase, ...addMedicos.map(paraMedico)];
  const chave = (m: Medico) => `${m.especialidadeSlug}|${m.id}`;
  const porRef = new Map(todos.map((m) => [chave(m), m]));
  const alterados = new Map<string, Medico>();

  for (const r of addConsultas) {
    const ref = r["medicoRef"] ?? "";
    const alvo = porRef.get(ref);
    if (!alvo) continue;
    const atual =
      alterados.get(ref) ??
      ({
        ...alvo,
        consultas: [...alvo.consultas],
        remedios: [...alvo.remedios],
        examesSolicitados: [...alvo.examesSolicitados],
      } as Medico);

    const consulta = paraConsulta(r);
    atual.consultas = [consulta, ...atual.consultas];
    atual.remedios = [
      ...listaJson(r["prescricoes"]).map((nome) => ({ nome, data: consulta.data, consultaId: consulta.id })),
      ...atual.remedios,
    ];
    atual.examesSolicitados = [
      ...consulta.exames.map((e) => ({ nome: e.nome, data: consulta.data })),
      ...atual.examesSolicitados,
    ];
    alterados.set(ref, atual);
  }

  return todos.map((m) => alterados.get(chave(m)) ?? m);
}

export function mesclarPontos(slug: string, exames: ExameArquivo[]): PontoCorpo[] | undefined {
  const base = pontosCorpo[slug];
  if (!base) return undefined;
  const novos = exames.filter((e) => e.categoriaSlug === slug && e.regiao);

  const lista: PontoCorpo[] = base.map((p) => ({ ...p, exames: [...p.exames] }));
  for (const e of novos) {
    const regiao = regioesCorpo.find((r) => r.id === e.regiao);
    if (!regiao) continue;
    let ponto = lista.find((p) => p.id === regiao.id);
    if (!ponto) {
      ponto = {
        id: regiao.id,
        parte: regiao.nome,
        pos: [0, 0, 0],
        pos2d: regiao.pos2d,
        vista: regiao.vista,
        exames: [],
      };
      lista.push(ponto);
    }
    ponto.exames = [
      { nome: e.nome, data: e.data, pedidoPor: e.pedidoPor, realizadoEm: e.data, local: e.local },
      ...ponto.exames,
    ];
  }
  /* só mostra marcador onde existe exame cadastrado */
  return lista.filter((p) => p.exames.length > 0);
}

export type Prontuario = {
  arquivos: ExameArquivo[];
  medicos: Medico[];
  tratamentos: TratamentoRegistro[];
  doencas: DoencaRegistro[];
};

/** Base do app + tudo que o paciente cadastrou em "Adicionar dados" */
export function useProntuario(): Prontuario {
  const addExames = useRegistros("exame");
  const addMedicos = useRegistros("medico");
  const addConsultas = useRegistros("consulta");
  const addTratamentos = useRegistros("tratamento");
  const addDoencas = useRegistros("doenca");

  return useMemo(() => {
    const arquivos = [...addExames.map(paraArquivo), ...arquivosExame];
    const medicos = mesclarMedicos(addMedicos, addConsultas);
    const tratamentos = [...addTratamentos.map(paraTratamento), ...tratamentosBase];
    const doencas = [...addDoencas.map((r) => paraDoenca(r, tratamentos)), ...doencasBase];
    return { arquivos, medicos, tratamentos, doencas };
  }, [addExames, addMedicos, addConsultas, addTratamentos, addDoencas]);
}
