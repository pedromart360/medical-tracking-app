import { useEffect, useState } from "react";

/**
 * Conta local do usuário (armazenada no navegador).
 * O app é um protótipo sem servidor: guardamos apenas o necessário
 * para simular criar conta, entrar e sair.
 */
export type Conta = {
  email: string;
  senha: string;
};

const CHAVE_CONTA = "conta-usuario";
const CHAVE_SESSAO = "sessao-ativa";

const ouvintes = new Set<() => void>();

function avisar() {
  ouvintes.forEach((l) => l());
}

export function lerConta(): Conta | null {
  if (typeof window === "undefined") return null;
  try {
    const bruto = localStorage.getItem(CHAVE_CONTA);
    return bruto ? (JSON.parse(bruto) as Conta) : null;
  } catch {
    return null;
  }
}

export function temConta() {
  return lerConta() !== null;
}

export function criarConta(conta: Conta) {
  try {
    localStorage.setItem(CHAVE_CONTA, JSON.stringify(conta));
    localStorage.setItem(CHAVE_SESSAO, "1");
  } catch {
    /* ignora */
  }
  avisar();
}

/** Retorna null quando entrou, ou uma mensagem de erro. */
export function entrar(email: string, senha: string): string | null {
  const conta = lerConta();
  if (!conta) return "Ainda não existe uma conta neste dispositivo.";
  if (conta.email.trim().toLowerCase() !== email.trim().toLowerCase())
    return "E-mail não encontrado.";
  if (conta.senha !== senha) return "Senha incorreta.";
  try {
    localStorage.setItem(CHAVE_SESSAO, "1");
  } catch {
    /* ignora */
  }
  avisar();
  return null;
}

export function sair() {
  try {
    localStorage.removeItem(CHAVE_SESSAO);
  } catch {
    /* ignora */
  }
  avisar();
}

export function sessaoAtiva() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(CHAVE_SESSAO) === "1";
  } catch {
    return false;
  }
}

/** true depois da hidratação; enquanto isso, `pronto` é false. */
export function useSessao(): { pronto: boolean; ativa: boolean } {
  const [estado, setEstado] = useState({ pronto: false, ativa: false });
  useEffect(() => {
    const atualizar = () => setEstado({ pronto: true, ativa: sessaoAtiva() });
    atualizar();
    ouvintes.add(atualizar);
    window.addEventListener("storage", atualizar);
    return () => {
      ouvintes.delete(atualizar);
      window.removeEventListener("storage", atualizar);
    };
  }, []);
  return estado;
}

export function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}
