import { supabase } from "@/integrations/supabase/client";

const BUCKET = "documentos";
const LIMITE = 20 * 1024 * 1024;

function nomeSeguro(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(-80);
}

/** Envia o arquivo para a nuvem e devolve o caminho salvo (ou um erro em texto). */
export async function enviarArquivo(file: File): Promise<{ caminho: string } | { erro: string }> {
  if (file.size > LIMITE) return { erro: "O arquivo precisa ter no máximo 20 MB." };
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return { erro: "Entre na sua conta para enviar arquivos." };
  const caminho = `${uid}/${crypto.randomUUID()}-${nomeSeguro(file.name)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(caminho, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) return { erro: "Não foi possível enviar o arquivo. Tente novamente." };
  return { caminho };
}

/** Link temporário para abrir um arquivo guardado. */
export async function abrirArquivo(caminho: string) {
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(caminho, 60 * 10);
  if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
}

export async function removerArquivo(caminho: string) {
  await supabase.storage.from(BUCKET).remove([caminho]);
}
