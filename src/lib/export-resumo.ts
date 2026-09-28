import {
  arquivosExame,
  doencasBase,
  medicosBase,
  tratamentoTipos,
  tratamentosBase,
  acharTratamento,
} from "@/lib/data";
import { idadeDoPerfil, type Perfil } from "@/lib/perfil";

function guardado(chave: string) {
  try {
    return localStorage.getItem(chave) ?? "";
  } catch {
    return "";
  }
}

const ordemData = (d: string) => {
  const [dia, mes] = d.split("/");
  return Number(mes) * 100 + Number(dia);
};

export async function exportarResumoGeralPDF(
  perfil: Perfil,
  dados?: {
    arquivos: typeof arquivosExame;
    medicos: typeof medicosBase;
    tratamentos: typeof tratamentosBase;
    doencas: typeof doencasBase;
  },
) {
  const fonteExames = dados?.arquivos ?? arquivosExame;
  const fonteMedicos = dados?.medicos ?? medicosBase;
  const fonteTratamentos = dados?.tratamentos ?? tratamentosBase;
  const fonteDoencas = dados?.doencas ?? doencasBase;
  const buscarTratamento = (id: string) =>
    dados ? dados.tratamentos.find((t) => t.id === id) : acharTratamento(id);

  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const larguraPagina = doc.internal.pageSize.getWidth();
  const alturaPagina = doc.internal.pageSize.getHeight();
  const margem = 48;
  const largura = larguraPagina - margem * 2;
  let y = margem;

  const quebrar = (necessario: number) => {
    if (y + necessario > alturaPagina - margem) {
      doc.addPage();
      y = margem;
    }
  };

  const linha = () => {
    doc.setDrawColor(220);
    doc.line(margem, y, margem + largura, y);
    y += 14;
  };

  const titulo = (texto: string) => {
    quebrar(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(texto, margem, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
  };

  const paragrafo = (texto: string, recuo = 0, cor = 70) => {
    const linhas = doc.splitTextToSize(texto, largura - recuo) as string[];
    for (const l of linhas) {
      quebrar(14);
      doc.setTextColor(cor);
      doc.text(l, margem + recuo, y);
      y += 13;
    }
    doc.setTextColor(0);
  };

  /* Cabeçalho */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Resumo clínico geral", margem, y);
  y += 24;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(110);
  doc.text(
    `${perfil.nome || "Paciente"} · ${perfil.sexo || "—"} · ${idadeDoPerfil(perfil)}`,
    margem,
    y,
  );
  y += 15;
  doc.text(
    `Nascimento: ${perfil.nascimento || "—"} · Documento gerado em ${new Date().toLocaleDateString("pt-BR")}`,
    margem,
    y,
  );
  y += 18;
  doc.setTextColor(0);
  linha();

  /* Quadro de alertas */
  const alertas: string[] = [];
  if (perfil.tipoSanguineo) alertas.push(`Tipo sanguíneo: ${perfil.tipoSanguineo}`);
  if (perfil.alergias) alertas.push(`Alergias: ${perfil.alergias}`);
  if (perfil.condicoes) alertas.push(`Condições prévias: ${perfil.condicoes}`);
  if (perfil.altura || perfil.peso)
    alertas.push(`Altura/Peso: ${perfil.altura || "—"} · ${perfil.peso || "—"}`);
  if (perfil.contatoNome || perfil.contatoTelefone)
    alertas.push(`Contato de emergência: ${perfil.contatoNome || "—"} ${perfil.contatoTelefone}`);
  if (perfil.plano) alertas.push(`Plano de saúde: ${perfil.plano} ${perfil.carteirinha}`);

  if (alertas.length > 0) {
    titulo("Informações essenciais");
    for (const a of alertas) paragrafo(`• ${a}`, 8, 60);
    y += 6;
    linha();
  }

  /* Doenças */
  titulo("Diagnósticos e doenças");
  const doencas = [...fonteDoencas].sort((a, b) => b.ano - a.ano || ordemData(b.data) - ordemData(a.data));
  if (doencas.length === 0) paragrafo("Nenhum diagnóstico registrado.", 0, 130);
  for (const d of doencas.slice(0, 40)) {
    quebrar(44);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(d.nome, margem, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(110);
    doc.text(d.data, margem + largura, y, { align: "right" });
    doc.setTextColor(0);
    y += 13;
    doc.setFontSize(9.5);
    const trat = buscarTratamento(d.tratamentoId);
    paragrafo(
      `Percebida por ${d.percebidaPor.nome}${trat ? ` · Tratamento vinculado: ${trat.nome}` : ""}`,
      8,
      95,
    );
    const obs = guardado(`obs-doenca-${d.id}`);
    if (obs) paragrafo(`Observações: ${obs}`, 8, 70);
    y += 4;
  }
  y += 4;
  linha();

  /* Tratamentos */
  titulo("Tratamentos e medicamentos");
  for (const tipo of tratamentoTipos) {
    const registros = fonteTratamentos
      .filter((t) => t.categoria === tipo.slug)
      .sort((a, b) => b.ano - a.ano || ordemData(b.dias[0]!) - ordemData(a.dias[0]!))
      .slice(0, 20);
    quebrar(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(tipo.nome, margem, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    y += 14;
    if (registros.length === 0) {
      paragrafo("Nenhum registro.", 8, 130);
      continue;
    }
    for (const t of registros) {
      quebrar(26);
      paragrafo(
        `• ${t.nome} — ${t.periodo} (${t.ano}) · Pedido por ${t.pedidoPor.nome} · ${t.local}`,
        8,
        75,
      );
      const resumo = guardado(`resumo-tratamento-${t.id}`);
      if (resumo) paragrafo(`Resumo: ${resumo}`, 20, 95);
    }
    y += 6;
  }
  linha();

  /* Médicos */
  titulo("Equipe médica assistente");
  const medicos = fonteMedicos.slice(0, 24);
  for (const m of medicos) {
    quebrar(22);
    paragrafo(
      `• ${m.nome} — ${m.cargo} · ${m.crm} · ${m.consultas.length} consulta(s) registrada(s)`,
      8,
      75,
    );
  }
  y += 6;
  linha();

  /* Exames */
  titulo("Exames realizados");
  const exames = [...fonteExames]
    .sort((a, b) => b.ano - a.ano || ordemData(b.data) - ordemData(a.data))
    .slice(0, 40);
  for (const e of exames) {
    quebrar(22);
    paragrafo(
      `• ${e.nome} — ${e.data} · ${e.areaMedica} · ${e.local}${e.temLaudo ? " · com laudo" : ""}`,
      8,
      75,
    );
  }

  y += 10;
  quebrar(24);
  doc.setFontSize(9);
  doc.setTextColor(130);
  paragrafo(
    "Documento gerado automaticamente a partir dos registros do prontuário digital. Não substitui laudo médico.",
    0,
    130,
  );

  doc.save(`resumo-clinico-${(perfil.nome || "paciente").toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
