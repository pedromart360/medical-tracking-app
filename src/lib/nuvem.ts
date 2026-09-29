import { supabase } from "@/integrations/supabase/client";
import { perfilVazio, aplicarPerfilDaNuvem, type Perfil } from "./perfil";
import { TIPOS_REGISTRO, aplicarRegistrosDaNuvem, type RegistroSalvo, type TipoAdicionado } from "./adicionados";

/** Converte a linha do banco para o formato usado no app. */
function paraPerfil(linha: Record<string, unknown>): Perfil {
  const t = (v: unknown) => (typeof v === "string" ? v : "");
  return {
    ...perfilVazio,
    nome: t(linha["nome"]),
    nascimento: t(linha["nascimento"]),
    sexo: t(linha["sexo"]),
    foto: t(linha["foto"]),
    tipoSanguineo: t(linha["tipo_sanguineo"]),
    alergias: t(linha["alergias"]),
    condicoes: t(linha["condicoes"]),
    altura: t(linha["altura"]),
    peso: t(linha["peso"]),
    contatoNome: t(linha["contato_nome"]),
    contatoTelefone: t(linha["contato_telefone"]),
    plano: t(linha["plano"]),
    carteirinha: t(linha["carteirinha"]),
  };
}

function paraLinha(p: Perfil, id: string) {
  return {
    id,
    nome: p.nome,
    nascimento: p.nascimento,
    sexo: p.sexo,
    foto: p.foto,
    tipo_sanguineo: p.tipoSanguineo,
    alergias: p.alergias,
    condicoes: p.condicoes,
    altura: p.altura,
    peso: p.peso,
    contato_nome: p.contatoNome,
    contato_telefone: p.contatoTelefone,
    plano: p.plano,
    carteirinha: p.carteirinha,
    atualizado_em: new Date().toISOString(),
  };
}

export async function usuarioAtual() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/** Salva o perfil do usuário logado na nuvem. */
export async function enviarPerfil(p: Perfil) {
  const user = await usuarioAtual();
  if (!user) return;
  await supabase.from("perfis").upsert(paraLinha(p, user.id));
}

/** Substitui na nuvem todos os registros de um tipo. */
export async function enviarRegistros(tipo: TipoAdicionado, lista: RegistroSalvo[]) {
  const user = await usuarioAtual();
  if (!user) return;
  await supabase.from("registros").delete().eq("user_id", user.id).eq("tipo", tipo);
  if (lista.length === 0) return;
  await supabase
    .from("registros")
    .insert(lista.map((dados) => ({ user_id: user.id, tipo, dados })));
}

/** Baixa perfil e registros do usuário logado para dentro do app. */
export async function baixarTudo() {
  const user = await usuarioAtual();
  if (!user) return;

  const { data: perfilLinha } = await supabase
    .from("perfis")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (perfilLinha) {
    aplicarPerfilDaNuvem(paraPerfil(perfilLinha as Record<string, unknown>));
  } else {
    const nome =
      (user.user_metadata?.["nome"] as string | undefined) ??
      (user.user_metadata?.["full_name"] as string | undefined) ??
      "";
    const novo: Perfil = { ...perfilVazio, nome };
    aplicarPerfilDaNuvem(novo);
    await supabase.from("perfis").upsert(paraLinha(novo, user.id));
  }

  const { data: linhas } = await supabase
    .from("registros")
    .select("tipo, dados, criado_em")
    .eq("user_id", user.id)
    .order("criado_em", { ascending: false });

  const porTipo: Record<TipoAdicionado, RegistroSalvo[]> = {
    exame: [],
    medico: [],
    consulta: [],
    tratamento: [],
    doenca: [],
  };
  for (const l of linhas ?? []) {
    const tipo = l.tipo as TipoAdicionado;
    if (TIPOS_REGISTRO.includes(tipo)) porTipo[tipo].push(l.dados as RegistroSalvo);
  }
  aplicarRegistrosDaNuvem(porTipo);
}
