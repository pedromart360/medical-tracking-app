import { useEffect, useState } from "react";
import { patient } from "@/lib/data";

export type Perfil = {
  nome: string;
  nascimento: string; // DD/MM/AAAA
  sexo: string;
  foto: string; // dataURL
  tipoSanguineo: string;
  alergias: string;
  condicoes: string;
  altura: string;
  peso: string;
  contatoNome: string;
  contatoTelefone: string;
  plano: string;
  carteirinha: string;
};

export const perfilVazio: Perfil = {
  nome: "",
  nascimento: "",
  sexo: "",
  foto: "",
  tipoSanguineo: "",
  alergias: "",
  condicoes: "",
  altura: "",
  peso: "",
  contatoNome: "",
  contatoTelefone: "",
  plano: "",
  carteirinha: "",
};

export const perfilPadrao: Perfil = {
  ...perfilVazio,
  nome: patient.nome,
  sexo: patient.sexo,
  nascimento: "14/06/2002",
};

const CHAVE = "perfil-paciente";

let cache: Perfil | null = null;
const ouvintes = new Set<() => void>();

function ler(): Perfil {
  if (cache) return cache;
  if (typeof window === "undefined") return perfilVazio;
  try {
    const bruto = localStorage.getItem(CHAVE);
    cache = bruto ? { ...perfilVazio, ...(JSON.parse(bruto) as Partial<Perfil>) } : perfilVazio;
  } catch {
    cache = perfilVazio;
  }
  return cache;
}

export function temPerfilSalvo() {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(CHAVE) !== null;
  } catch {
    return true;
  }
}

function guardar(p: Perfil) {
  cache = p;
  try {
    localStorage.setItem(CHAVE, JSON.stringify(p));
  } catch {
    /* ignora */
  }
  ouvintes.forEach((l) => l());
}

/** Salva no aparelho e envia para a conta na nuvem. */
export function salvarPerfil(p: Perfil) {
  guardar(p);
  void import("./nuvem").then((n) => n.enviarPerfil(p));
}

/** Aplica o perfil vindo da nuvem, sem reenviá-lo. */
export function aplicarPerfilDaNuvem(p: Perfil) {
  guardar(p);
}

/** Limpa os dados guardados neste aparelho (usado ao sair da conta). */
export function limparDadosLocais() {
  cache = null;
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    /* ignora */
  }
  ouvintes.forEach((l) => l());
}

function inscrever(l: () => void) {
  ouvintes.add(l);
  return () => {
    ouvintes.delete(l);
  };
}

export function usePerfil(): Perfil {
  // Após a hidratação passamos a ler o que está salvo no navegador.
  const [p, setP] = useState<Perfil>(perfilVazio);
  useEffect(() => {
    setP(ler());
    return inscrever(() => setP(ler()));
  }, []);
  return p;
}

/** Idade em anos no formato "24A", calculada a partir da data de nascimento. */
export function idadeDoPerfil(p: Perfil): string {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(p.nascimento.trim());
  if (!m) return patient.idade;
  const dia = Number(m[1]);
  const mes = Number(m[2]);
  const ano = Number(m[3]);
  const hoje = new Date();
  let idade = hoje.getFullYear() - ano;
  const aniversarioPassou =
    hoje.getMonth() + 1 > mes || (hoje.getMonth() + 1 === mes && hoje.getDate() >= dia);
  if (!aniversarioPassou) idade -= 1;
  if (idade < 0 || idade > 130) return patient.idade;
  return `${idade}A`;
}

export function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "";
  const primeira = partes[0]![0] ?? "";
  const ultima = partes.length > 1 ? (partes[partes.length - 1]![0] ?? "") : "";
  return (primeira + ultima).toUpperCase();
}

/* ---- ilustração anatômica conforme o sexo do perfil ---- */
export const SEXO_OPCOES = ["Mulher", "Homem"] as const;

export function ehMasculino(sexo: string) {
  return /^h/i.test(sexo.trim()) || /^m(asculino)?$/i.test(sexo.trim());
}

export function imagensCorpo(sexo: string): { frente: string; costas: string } {
  return ehMasculino(sexo)
    ? { frente: "/body_front_male.webp", costas: "/body_back_male.webp" }
    : { frente: "/body_front.webp", costas: "/body_back.webp" };
}


/* ---- abertura da gaveta a partir de qualquer tela ---- */
const EVENTO = "abrir-perfil";

export function abrirPerfil() {
  window.dispatchEvent(new CustomEvent(EVENTO));
}

export function aoAbrirPerfil(handler: () => void) {
  window.addEventListener(EVENTO, handler);
  return () => window.removeEventListener(EVENTO, handler);
}
