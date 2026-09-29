import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { limparDadosLocais } from "./perfil";
import { limparRegistrosLocais } from "./adicionados";
import { baixarTudo } from "./nuvem";

/** Conta do usuário na nuvem (Lovable Cloud / autenticação real). */

export function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function traduzir(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed")) return "pendente";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Já existe uma conta com esse e-mail. Tente entrar.";
  if (m.includes("password")) return "A senha precisa de pelo menos 6 caracteres.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Muitas tentativas. Aguarde um instante e tente de novo.";
  return msg;
}

/**
 * Cria a conta. Retorna null quando entrou direto,
 * "pendente" quando falta confirmar o e-mail, ou uma mensagem de erro.
 */
export async function criarConta(email: string, senha: string, nome: string): Promise<string | null> {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password: senha,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: { nome: nome.trim() },
    },
  });
  if (error) return traduzir(error.message);
  return data.session ? null : "pendente";
}

/** Entra com e-mail e senha. null = ok, "pendente" = falta confirmar, ou mensagem de erro. */
export async function entrar(email: string, senha: string): Promise<string | null> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: senha,
  });
  if (error) return traduzir(error.message);
  return null;
}

/** Entrar com a conta Google. */
export async function entrarComGoogle(): Promise<string | null> {
  const result = await lovable.auth.signInWithOAuth("google", {
    redirect_uri: window.location.origin,
  });
  if (result.error) return "Não foi possível entrar com o Google. Tente de novo.";
  return null;
}

/** Reenvia o e-mail de confirmação. */
export async function reenviarConfirmacao(email: string): Promise<string | null> {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email.trim(),
    options: { emailRedirectTo: `${window.location.origin}/` },
  });
  return error ? traduzir(error.message) : null;
}

/** Envia o e-mail com o link para criar uma nova senha. */
export async function enviarLinkDeSenha(email: string): Promise<string | null> {
  if (!validarEmail(email)) return "Digite um e-mail válido.";
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/entrar`,
  });
  return error ? traduzir(error.message) : null;
}

/** Define a nova senha (usado depois de abrir o link recebido por e-mail). */
export async function definirNovaSenha(senha: string): Promise<string | null> {
  if (senha.length < 6) return "A senha precisa de pelo menos 6 caracteres.";
  const { error } = await supabase.auth.updateUser({ password: senha });
  return error ? traduzir(error.message) : null;
}

export async function sair() {
  await supabase.auth.signOut();
  limparDadosLocais();
  limparRegistrosLocais();
}

/** true depois de conferir a sessão; enquanto isso, `pronto` é false. */
export function useSessao(): { pronto: boolean; ativa: boolean } {
  const [estado, setEstado] = useState({ pronto: false, ativa: false });

  useEffect(() => {
    let vivo = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!vivo) return;
      setEstado({ pronto: true, ativa: !!data.session });
      if (data.session) void baixarTudo();
    });

    const { data: sub } = supabase.auth.onAuthStateChange((evento, sessao) => {
      if (!vivo) return;
      setEstado({ pronto: true, ativa: !!sessao });
      if (evento === "SIGNED_IN" || evento === "USER_UPDATED") void baixarTudo();
    });

    return () => {
      vivo = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return estado;
}
