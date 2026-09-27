import { patient, tratamentoTipos, tratamentosBase, type TratamentoRegistro } from "@/lib/data";

const ordem = (d: string) => {
  const [dia, mes] = d.split("/");
  return Number(mes) * 100 + Number(dia);
};

function resumoSalvo(id: string) {
  try {
    return localStorage.getItem(`resumo-tratamento-${id}`) ?? "";
  } catch {
    return "";
  }
}

export async function exportarHistoricoPDF(ano: number) {
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

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Histórico de tratamentos", margem, y);
  y += 24;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(110);
  doc.text(`${patient.nome} · ${patient.sexo} · ${patient.idade}`, margem, y);
  y += 15;
  doc.text(
    `Ano de referência: ${ano} · Documento gerado em ${new Date().toLocaleDateString("pt-BR")}`,
    margem,
    y,
  );
  y += 18;
  doc.setTextColor(0);
  linha();

  let total = 0;

  for (const tipo of tratamentoTipos) {
    const registros: TratamentoRegistro[] = tratamentosBase
      .filter((t) => t.categoria === tipo.slug && t.ano === ano)
      .sort((a, b) => ordem(a.dias[0]!) - ordem(b.dias[0]!));

    quebrar(60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(tipo.nome, margem, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`${registros.length} registro(s)`, margem + largura, y, { align: "right" });
    doc.setTextColor(0);
    y += 16;

    if (registros.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(130);
      doc.text("Nenhum tratamento registrado neste ano.", margem, y);
      doc.setTextColor(0);
      y += 22;
      continue;
    }

    for (const t of registros) {
      const resumo = resumoSalvo(t.id);
      const linhasResumo = resumo
        ? doc.splitTextToSize(resumo, largura - 12)
        : ([] as string[]);

      quebrar(70 + linhasResumo.length * 12);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(t.nome, margem, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(110);
      doc.text(t.dataCompleta, margem + largura, y, { align: "right" });
      doc.setTextColor(0);
      y += 14;

      doc.setFontSize(9.5);
      doc.setTextColor(90);
      doc.text(`Pedido por: ${t.pedidoPor.nome}`, margem, y);
      doc.text(`Realizado por: ${t.realizadoPor}`, margem + largura / 2, y);
      y += 12;
      doc.text(`Local: ${t.local}`, margem, y);
      doc.text(`Dias: ${t.dias.join(", ")}`, margem + largura / 2, y);
      y += 12;

      if (linhasResumo.length > 0) {
        doc.setTextColor(60);
        doc.text("Resumo:", margem, y);
        y += 12;
        for (const l of linhasResumo) {
          quebrar(14);
          doc.text(l, margem + 12, y);
          y += 12;
        }
      }

      doc.setTextColor(0);
      y += 8;
      total += 1;
    }

    y += 6;
    linha();
  }

  quebrar(24);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Total de tratamentos em ${ano}: ${total}`, margem, y);

  doc.save(`historico-tratamentos-${ano}.pdf`);
}
