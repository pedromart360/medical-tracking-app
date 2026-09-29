import { useEffect, useState } from "react";

/**
 * Conta local do usuário (armazenada no navegador).
 * O app é um protótipo sem servidor: guardamos apenas o necessário
 * para simular criar conta, entrar e sair.
 */
export type Conta = {
  email: string;
  senha: string;
  /** false enquanto o e-mail não foi confirmado (contas antigas contam como confirmadas). */
  confirmado?: boolean;
  codigo?: string;
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

function gravarConta(c: Conta) {
  try {
    localStorage.setItem(CHAVE_CONTA, JSON.stringify(c));
  } catch {
    /* ignora */
  }
}

export function temConta() {
  return lerConta() !== null;
}

export function contaPendente() {
  return lerConta()?.confirmado === false;
}

function novoCodigo() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** Cria a conta ainda não confirmada e devolve o código "enviado" por e-mail. */
export function criarConta(conta: { email: string; senha: string }): string {
  const codigo = novoCodigo();
  gravarConta({ ...conta, confirmado: false, codigo });
  try {
    localStorage.removeItem(CHAVE_SESSAO);
  } catch {
    /* ignora */
  }
  avisar();
  return codigo;
}

/** Gera um novo código para a conta pendente. */
export function reenviarCodigo(): string | null {
  const conta = lerConta();
  if (!conta) return null;
  const codigo = novoCodigo();
  gravarConta({ ...conta, codigo });
  return codigo;
}

export function codigoAtual() {
  return lerConta()?.codigo ?? "";
}

/** Confirma o e-mail e inicia a sessão. Retorna null ou mensagem de erro. */
export function confirmarEmail(codigo: string): string | null {
  const conta = lerConta();
  if (!conta) return "Ainda não existe uma conta neste dispositivo.";
  if (conta.codigo !== codigo.trim()) return "Código incorreto. Confira e tente de novo.";
  gravarConta({ email: conta.email, senha: conta.senha, confirmado: true });
  try {
    localStorage.setItem(CHAVE_SESSAO, "1");
  } catch {
    /* ignora */
  }
  avisar();
  return null;
}

export const CONTA_TESTE = { email: "teste@prontuario.app", senha: "teste123" };

/** Cria (ou recria) a conta de teste já confirmada, sem entrar. */
export function criarContaTeste() {
  gravarConta({ ...CONTA_TESTE, confirmado: true });
  try {
    const perfil = JSON.parse(localStorage.getItem("perfil-paciente") || "null");
    if (!perfil?.nascimento) {
      localStorage.setItem(
        "perfil-paciente",
        JSON.stringify({ ...(perfil ?? {}), nome: "Ana Carolina", nascimento: "12/04/1990", sexo: "Mulher" }),
      );
    }
  } catch {
    /* ignora */
  }
}

/** Retorna null quando entrou, "pendente" se falta confirmar, ou uma mensagem de erro. */
export function entrar(email: string, senha: string): string | null {
  if (
    email.trim().toLowerCase() === CONTA_TESTE.email &&
    senha === CONTA_TESTE.senha &&
    lerConta()?.email.toLowerCase() !== CONTA_TESTE.email
  ) {
    criarContaTeste();
  }
  const conta = lerConta();
  if (!conta) return "Ainda não existe uma conta neste dispositivo.";
  if (conta.email.trim().toLowerCase() !== email.trim().toLowerCase())
    return "E-mail não encontrado.";
  if (conta.senha !== senha) return "Senha incorreta.";
  if (conta.confirmado === false) return "pendente";
  try {
    localStorage.setItem(CHAVE_SESSAO, "1");
  } catch {
    /* ignora */
  }
  avisar();
  return null;
}

/**
 * Redefine a senha confirmando o e-mail e a data de nascimento cadastrados.
 * Retorna null quando deu certo, ou uma mensagem de erro.
 */
export function redefinirSenha(email: string, nascimento: string, novaSenha: string): string | null {
  const conta = lerConta();
  if (!conta) return "Ainda não existe uma conta neste dispositivo.";
  if (conta.email.trim().toLowerCase() !== email.trim().toLowerCase())
    return "E-mail não encontrado.";
  let nascSalvo = "";
  try {
    nascSalvo = (JSON.parse(localStorage.getItem("perfil-paciente") || "{}") as { nascimento?: string }).nascimento ?? "";
  } catch {
    /* ignora */
  }
  if (!nascSalvo || nascSalvo !== nascimento.trim())
    return "A data de nascimento não confere com a cadastrada.";
  if (novaSenha.length < 6) return "A nova senha precisa de pelo menos 6 caracteres.";
  try {
    localStorage.setItem(CHAVE_CONTA, JSON.stringify({ ...conta, senha: novaSenha }));
  } catch {
    /* ignora */
  }
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
