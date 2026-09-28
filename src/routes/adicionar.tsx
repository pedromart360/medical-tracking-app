import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Upload, X } from "lucide-react";
import { z } from "zod";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import {
  areasMedicas,
  especialidades,
  exameCategorias,
  tiposPorCategoria,
} from "@/lib/data";

export const Route = createFileRoute("/adicionar")({
  head: () => ({
    meta: [
      { title: "Adicionar dados — Ana Carolina" },
      { name: "description", content: "Cadastre novos exames, médicos, tratamentos e doenças no prontuário." },
      { property: "og:title", content: "Adicionar dados — Ana Carolina" },
      { property: "og:description", content: "Cadastre novos dados no prontuário." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Adicionar,
});

type Tipo = "exame" | "medico" | "tratamento" | "doenca";

const tipos: { id: Tipo; nome: string }[] = [
  { id: "exame", nome: "Exame" },
  { id: "medico", nome: "Médico" },
  { id: "tratamento", nome: "Tratamento" },
  { id: "doenca", nome: "Doença" },
];

const dataSchema = z
  .string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Use o formato DD/MM/AAAA")
  .refine((v) => {
    const [d, m, a] = v.split("/").map(Number);
    const dt = new Date(a!, m! - 1, d!);
    return dt.getFullYear() === a && dt.getMonth() === m! - 1 && dt.getDate() === d;
  }, "Data inválida");

const exameSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome do exame").max(120),
  categoria: z.string().min(1, "Escolha a categoria"),
  tipo: z.string().min(1, "Escolha o tipo"),
  data: dataSchema,
  area: z.string().max(80).optional(),
  solicitante: z.string().trim().max(120).optional(),
  realizador: z.string().trim().max(120).optional(),
  local: z.string().trim().max(120).optional(),
  observacoes: z.string().trim().max(1000).optional(),
});

const medicoSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome do médico").max(120),
  especialidade: z.string().min(1, "Escolha a especialidade"),
  crm: z.string().trim().max(20).optional(),
  bio: z.string().trim().max(600).optional(),
});

const tratamentoSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome do tratamento").max(120),
  categoria: z.string().min(1, "Escolha a categoria"),
  inicio: dataSchema,
  fim: z.string().optional(),
  pedidoPor: z.string().trim().max(120).optional(),
  realizadoPor: z.string().trim().max(120).optional(),
  local: z.string().trim().max(120).optional(),
  resumo: z.string().trim().max(1000).optional(),
});

const doencaSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome da doença").max(120),
  data: dataSchema,
  percebidaPor: z.string().trim().max(120).optional(),
  tratamento: z.string().trim().max(120).optional(),
  observacoes: z.string().trim().max(1000).optional(),
});

const inputCls =
  "h-11 w-full rounded-full bg-card px-4 text-[clamp(0.75rem,1vw,0.875rem)] outline-none placeholder:text-muted-foreground";
const selectCls = `${inputCls} appearance-none pr-9`;
const labelCls = "mb-1.5 block text-[clamp(0.6875rem,0.95vw,0.8125rem)] text-muted-foreground";

function Campo({
  label,
  obrigatorio,
  erro,
  children,
}: {
  label: string;
  obrigatorio?: boolean;
  erro?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>
        {label}
        {obrigatorio && <span className="text-foreground"> *</span>}
      </label>
      {children}
      {erro && <p className="mt-1 text-[0.75rem] text-destructive">{erro}</p>}
    </div>
  );
}

function UploadFalso({ rotulo, nome, onChange }: { rotulo: string; nome: string; onChange: (n: string) => void }) {
  return (
    <label className="flex h-11 cursor-pointer items-center gap-2 rounded-full border border-dashed border-muted-foreground/40 px-4 text-[clamp(0.75rem,1vw,0.875rem)] text-muted-foreground transition-colors hover:bg-card">
      <Upload className="size-4 shrink-0" />
      <span className="truncate">{nome || rotulo}</span>
      <input
        type="file"
        accept=".pdf,image/jpeg,image/png"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f && f.size <= 10 * 1024 * 1024) onChange(f.name);
        }}
      />
    </label>
  );
}

function Adicionar() {
  const [tipo, setTipo] = useState<Tipo>("exame");
  const [valores, setValores] = useState<Record<string, string>>({});
  const [erros, setErros] = useState<Record<string, string>>({});
  const [salvo, setSalvo] = useState(false);

  const set = (k: string, v: string) => {
    setValores((s) => ({ ...s, [k]: v }));
    setErros((s) => ({ ...s, [k]: "" }));
    setSalvo(false);
  };

  const trocarTipo = (t: Tipo) => {
    setTipo(t);
    setValores({});
    setErros({});
    setSalvo(false);
  };

  const schema = useMemo(
    () =>
      tipo === "exame"
        ? exameSchema
        : tipo === "medico"
          ? medicoSchema
          : tipo === "tratamento"
            ? tratamentoSchema
            : doencaSchema,
    [tipo],
  );

  const salvar = () => {
    const r = schema.safeParse(valores);
    if (!r.success) {
      const novos: Record<string, string> = {};
      for (const issue of r.error.issues) novos[String(issue.path[0])] = issue.message;
      setErros(novos);
      return;
    }
    const chave = `adicionados-${tipo}`;
    const lista = JSON.parse(localStorage.getItem(chave) ?? "[]") as unknown[];
    lista.push({ id: `${tipo}-${Date.now()}`, ...r.data });
    localStorage.setItem(chave, JSON.stringify(lista));
    setValores({});
    setErros({});
    setSalvo(true);
  };

  const tiposExame = tiposPorCategoria[valores["categoria"] ?? ""] ?? [];

  return (
    <PageShell label="" title="Adicionar dados" backTo="/">
      <div className="mx-auto flex max-w-[640px] flex-col gap-[clamp(0.875rem,1.6vw,1.5rem)]">
        {/* Seletor de tipo */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tipos.map((t) => (
            <Button
              key={t.id}
              variant="ghost"
              onClick={() => trocarTipo(t.id)}
              className={`h-11 rounded-full text-[clamp(0.75rem,1vw,0.9375rem)] font-normal ${
                tipo === t.id
                  ? "bg-foreground text-background hover:bg-foreground/85"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {t.nome}
            </Button>
          ))}
        </div>

        <div className="rounded-[clamp(1.25rem,2vw,1.75rem)] bg-muted p-[clamp(1rem,2vw,1.75rem)]">
          <div className="grid gap-4 sm:grid-cols-2">
            {tipo === "exame" && (
              <>
                <Campo label="Nome do exame" obrigatorio erro={erros["nome"]}>
                  <input
                    value={valores["nome"] ?? ""}
                    onChange={(e) => set("nome", e.target.value)}
                    placeholder="Ex.: Hemograma completo"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Data de realização" obrigatorio erro={erros["data"]}>
                  <input
                    value={valores["data"] ?? ""}
                    onChange={(e) => set("data", e.target.value)}
                    placeholder="DD/MM/AAAA"
                    inputMode="numeric"
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Categoria" obrigatorio erro={erros["categoria"]}>
                  <select
                    value={valores["categoria"] ?? ""}
                    onChange={(e) => {
                      set("categoria", e.target.value);
                      set("tipo", "");
                    }}
                    className={selectCls}
                  >
                    <option value="">Selecionar...</option>
                    {exameCategorias.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Tipo" obrigatorio erro={erros["tipo"]}>
                  <select
                    value={valores["tipo"] ?? ""}
                    onChange={(e) => set("tipo", e.target.value)}
                    disabled={!valores["categoria"]}
                    className={selectCls}
                  >
                    <option value="">Selecionar...</option>
                    {tiposExame.map((t) => (
                      <option key={t.slug} value={t.slug}>
                        {t.nome}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Área médica" erro={erros["area"]}>
                  <select
                    value={valores["area"] ?? ""}
                    onChange={(e) => set("area", e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Selecionar...</option>
                    {areasMedicas.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Local" erro={erros["local"]}>
                  <input
                    value={valores["local"] ?? ""}
                    onChange={(e) => set("local", e.target.value)}
                    placeholder="Ex.: Laboratório São Lucas"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Médico solicitante" erro={erros["solicitante"]}>
                  <input
                    value={valores["solicitante"] ?? ""}
                    onChange={(e) => set("solicitante", e.target.value)}
                    placeholder="Ex.: Dr. Davi"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Realizado por" erro={erros["realizador"]}>
                  <input
                    value={valores["realizador"] ?? ""}
                    onChange={(e) => set("realizador", e.target.value)}
                    placeholder="Ex.: Dra. Antonieta"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Resultado (imagem ou PDF)">
                  <UploadFalso
                    rotulo="Enviar resultado"
                    nome={valores["arquivo"] ?? ""}
                    onChange={(n) => set("arquivo", n)}
                  />
                </Campo>
                <Campo label="Laudo (PDF)">
                  <UploadFalso
                    rotulo="Enviar laudo"
                    nome={valores["laudo"] ?? ""}
                    onChange={(n) => set("laudo", n)}
                  />
                </Campo>
                <div className="sm:col-span-2">
                  <Campo label="Observações" erro={erros["observacoes"]}>
                    <textarea
                      value={valores["observacoes"] ?? ""}
                      onChange={(e) => set("observacoes", e.target.value)}
                      placeholder="Anotações sobre o exame..."
                      maxLength={1000}
                      className="h-24 w-full resize-none rounded-[1.25rem] bg-card p-4 text-[clamp(0.75rem,1vw,0.875rem)] outline-none placeholder:text-muted-foreground"
                    />
                  </Campo>
                </div>
              </>
            )}

            {tipo === "medico" && (
              <>
                <Campo label="Nome do médico" obrigatorio erro={erros["nome"]}>
                  <input
                    value={valores["nome"] ?? ""}
                    onChange={(e) => set("nome", e.target.value)}
                    placeholder="Ex.: Dr. Davi Almeida"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Especialidade" obrigatorio erro={erros["especialidade"]}>
                  <select
                    value={valores["especialidade"] ?? ""}
                    onChange={(e) => set("especialidade", e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Selecionar...</option>
                    {especialidades.map((e2) => (
                      <option key={e2} value={e2}>
                        {e2}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="CRM" erro={erros["crm"]}>
                  <input
                    value={valores["crm"] ?? ""}
                    onChange={(e) => set("crm", e.target.value)}
                    placeholder="Ex.: CRM/MG 00000"
                    maxLength={20}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Foto">
                  <UploadFalso
                    rotulo="Enviar foto"
                    nome={valores["foto"] ?? ""}
                    onChange={(n) => set("foto", n)}
                  />
                </Campo>
                <div className="sm:col-span-2">
                  <Campo label="Apresentação" erro={erros["bio"]}>
                    <textarea
                      value={valores["bio"] ?? ""}
                      onChange={(e) => set("bio", e.target.value)}
                      placeholder="Breve biografia do profissional..."
                      maxLength={600}
                      className="h-24 w-full resize-none rounded-[1.25rem] bg-card p-4 text-[clamp(0.75rem,1vw,0.875rem)] outline-none placeholder:text-muted-foreground"
                    />
                  </Campo>
                </div>
              </>
            )}

            {tipo === "tratamento" && (
              <>
                <Campo label="Nome do tratamento" obrigatorio erro={erros["nome"]}>
                  <input
                    value={valores["nome"] ?? ""}
                    onChange={(e) => set("nome", e.target.value)}
                    placeholder="Ex.: Pregabalina"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Categoria" obrigatorio erro={erros["categoria"]}>
                  <select
                    value={valores["categoria"] ?? ""}
                    onChange={(e) => set("categoria", e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Selecionar...</option>
                    <option value="domiciliar">Domiciliar</option>
                    <option value="hospitalar">Hospitalar</option>
                    <option value="medicamentoso">Medicamentoso</option>
                  </select>
                </Campo>
                <Campo label="Data de início" obrigatorio erro={erros["inicio"]}>
                  <input
                    value={valores["inicio"] ?? ""}
                    onChange={(e) => set("inicio", e.target.value)}
                    placeholder="DD/MM/AAAA"
                    inputMode="numeric"
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Data de fim" erro={erros["fim"]}>
                  <input
                    value={valores["fim"] ?? ""}
                    onChange={(e) => set("fim", e.target.value)}
                    placeholder="DD/MM/AAAA (opcional)"
                    inputMode="numeric"
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Pedido por" erro={erros["pedidoPor"]}>
                  <input
                    value={valores["pedidoPor"] ?? ""}
                    onChange={(e) => set("pedidoPor", e.target.value)}
                    placeholder="Ex.: Dr. Davi"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Realizado por" erro={erros["realizadoPor"]}>
                  <input
                    value={valores["realizadoPor"] ?? ""}
                    onChange={(e) => set("realizadoPor", e.target.value)}
                    placeholder="Ex.: Enf. Antonieta"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Local" erro={erros["local"]}>
                  <input
                    value={valores["local"] ?? ""}
                    onChange={(e) => set("local", e.target.value)}
                    placeholder="Ex.: Hospital Felício Rocho"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <div className="sm:col-span-2">
                  <Campo label="Resumo" erro={erros["resumo"]}>
                    <textarea
                      value={valores["resumo"] ?? ""}
                      onChange={(e) => set("resumo", e.target.value)}
                      placeholder="Anotações sobre o tratamento..."
                      maxLength={1000}
                      className="h-24 w-full resize-none rounded-[1.25rem] bg-card p-4 text-[clamp(0.75rem,1vw,0.875rem)] outline-none placeholder:text-muted-foreground"
                    />
                  </Campo>
                </div>
              </>
            )}

            {tipo === "doenca" && (
              <>
                <Campo label="Nome da doença" obrigatorio erro={erros["nome"]}>
                  <input
                    value={valores["nome"] ?? ""}
                    onChange={(e) => set("nome", e.target.value)}
                    placeholder="Ex.: Gripe"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Data da descoberta" obrigatorio erro={erros["data"]}>
                  <input
                    value={valores["data"] ?? ""}
                    onChange={(e) => set("data", e.target.value)}
                    placeholder="DD/MM/AAAA"
                    inputMode="numeric"
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Percebida por" erro={erros["percebidaPor"]}>
                  <input
                    value={valores["percebidaPor"] ?? ""}
                    onChange={(e) => set("percebidaPor", e.target.value)}
                    placeholder="Ex.: Dra. Antonieta"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Tratamento vinculado" erro={erros["tratamento"]}>
                  <input
                    value={valores["tratamento"] ?? ""}
                    onChange={(e) => set("tratamento", e.target.value)}
                    placeholder="Ex.: Dipirona"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <div className="sm:col-span-2">
                  <Campo label="Laudo ou documento">
                    <UploadFalso
                      rotulo="Enviar documento"
                      nome={valores["documento"] ?? ""}
                      onChange={(n) => set("documento", n)}
                    />
                  </Campo>
                </div>
                <div className="sm:col-span-2">
                  <Campo label="Observações" erro={erros["observacoes"]}>
                    <textarea
                      value={valores["observacoes"] ?? ""}
                      onChange={(e) => set("observacoes", e.target.value)}
                      placeholder="Anotações sobre a doença..."
                      maxLength={1000}
                      className="h-24 w-full resize-none rounded-[1.25rem] bg-card p-4 text-[clamp(0.75rem,1vw,0.875rem)] outline-none placeholder:text-muted-foreground"
                    />
                  </Campo>
                </div>
              </>
            )}
          </div>

          <div className="mt-[clamp(1rem,2vw,1.75rem)] flex flex-wrap items-center gap-3">
            <Button
              onClick={salvar}
              className="h-11 rounded-full bg-foreground px-8 text-[clamp(0.75rem,1vw,0.9375rem)] font-normal text-background hover:bg-foreground/85"
            >
              Salvar {tipos.find((t) => t.id === tipo)?.nome.toLowerCase()}
            </Button>
            {salvo && (
              <span className="flex items-center gap-1.5 text-[clamp(0.75rem,1vw,0.875rem)] text-muted-foreground">
                <Check className="size-4" />
                Salvo! Você pode adicionar outro.
              </span>
            )}
            {Object.keys(erros).length > 0 && (
              <span className="flex items-center gap-1.5 text-[clamp(0.75rem,1vw,0.875rem)] text-destructive">
                <X className="size-4" />
                Verifique os campos destacados.
              </span>
            )}
          </div>
        </div>

        <p className="text-center text-[clamp(0.6875rem,0.95vw,0.8125rem)] text-muted-foreground">
          Os dados cadastrados entram no prontuário e passam a aparecer nas listas, no calendário e na
          linha do tempo. <Link to="/" className="underline underline-offset-4">Voltar para a página inicial</Link>
        </p>
      </div>
    </PageShell>
  );
}
