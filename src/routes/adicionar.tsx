import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, FileText, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { abrirArquivo, enviarArquivo } from "@/lib/arquivos";
import { z } from "zod";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  areasMedicas,
  arquivosExame,
  especialidades,
  exameCategorias,
  medicosBase,
  regioesCorpo,
  tiposPorCategoria,
  tratamentosBase,
} from "@/lib/data";
import {
  lerRegistros,
  salvarRegistros,
  useProntuario,
  type RegistroSalvo,
  type TipoAdicionado,
} from "@/lib/adicionados";

export const Route = createFileRoute("/adicionar")({
  head: () => ({
    meta: [
      { title: "Adicionar dados — Ana Carolina" },
      { name: "description", content: "Cadastre novos exames, médicos, consultas, tratamentos e doenças no prontuário." },
      { property: "og:title", content: "Adicionar dados — Ana Carolina" },
      { property: "og:description", content: "Cadastre novos dados no prontuário." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Adicionar,
});

type Tipo = "exame" | "medico" | "tratamento" | "doenca";
type Modo = "medico" | "consulta";

const tipos: { id: Tipo; nome: string }[] = [
  { id: "exame", nome: "Exame" },
  { id: "medico", nome: "Médico" },
  { id: "tratamento", nome: "Tratamento" },
  { id: "doenca", nome: "Doença" },
];

const midias = [
  { valor: "rx", nome: "Imagem / Raio-X" },
  { valor: "grafico", nome: "Gráfico" },
  { valor: "laudo", nome: "Laudo descritivo" },
  { valor: "microscopia", nome: "Microscopia" },
];

/** categorias em que a região do corpo é obrigatória */
const COM_REGIAO = new Set(["de-imagem", "nucleares"]);

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
  regiao: z.string().max(40).optional(),
  midia: z.string().max(20).optional(),
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

const consultaSchema = z.object({
  medicoRef: z.string().min(1, "Escolha o médico atendente"),
  data: dataSchema,
  local: z.string().trim().max(120).optional(),
  resumo: z.string().trim().max(2000).optional(),
});

const tratamentoSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome do tratamento").max(120),
  categoria: z.string().min(1, "Escolha a categoria"),
  inicio: dataSchema,
  fim: z.string().optional(),
  continuo: z.string().optional(),
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
const areaCls =
  "h-24 w-full resize-none rounded-[1.25rem] bg-card p-4 text-[clamp(0.75rem,1vw,0.875rem)] outline-none placeholder:text-muted-foreground";

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

function UploadArquivo({
  rotulo,
  nome,
  onChange,
}: {
  rotulo: string;
  nome: string;
  onChange: (nome: string, caminho: string) => void;
}) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  return (
    <div>
      <label className="flex h-11 cursor-pointer items-center gap-2 rounded-full border border-dashed border-muted-foreground/40 px-4 text-[clamp(0.75rem,1vw,0.875rem)] text-muted-foreground transition-colors hover:bg-card">
        <Upload className="size-4 shrink-0" />
        <span className="truncate">{enviando ? "Enviando..." : nome || rotulo}</span>
        <input
          type="file"
          accept=".pdf,image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setErro("");
            setEnviando(true);
            void enviarArquivo(f).then((r) => {
              setEnviando(false);
              if ("erro" in r) setErro(r.erro);
              else onChange(f.name, r.caminho);
            });
          }}
        />
      </label>
      {erro && <p className="mt-1 text-[0.75rem] text-destructive">{erro}</p>}
    </div>
  );
}

/** lista editável de textos curtos (prescrições, exames pedidos) */
function ListaRapida({
  itens,
  valor,
  onValor,
  onAdicionar,
  onRemover,
  placeholder,
  lista,
}: {
  itens: string[];
  valor: string;
  onValor: (v: string) => void;
  onAdicionar: () => void;
  onRemover: (i: number) => void;
  placeholder: string;
  lista?: string;
}) {
  return (
    <div>
      <div className="flex gap-2">
        <input
          value={valor}
          onChange={(e) => onValor(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdicionar();
            }
          }}
          {...(lista ? { list: lista } : {})}
          autoComplete="off"
          placeholder={placeholder}
          maxLength={120}
          className={inputCls}
        />
        <Button
          type="button"
          onClick={onAdicionar}
          aria-label="Adicionar item"
          className="size-11 shrink-0 rounded-full bg-foreground p-0 text-background hover:bg-foreground/85"
        >
          <Plus className="size-4" />
        </Button>
      </div>
      {itens.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {itens.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-2 rounded-full bg-card py-1.5 pl-4 pr-1.5 text-[clamp(0.6875rem,0.95vw,0.8125rem)]"
            >
              {item}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remover ${item}`}
                onClick={() => onRemover(i)}
                className="size-6 rounded-full text-muted-foreground hover:bg-border"
              >
                <X className="size-3.5" />
              </Button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const CAMPOS_DATA = new Set(["data", "inicio", "fim"]);

function mascaraData(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

const normalizar = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

type Registro = RegistroSalvo;

function listaJson(valor: string | undefined): string[] {
  if (!valor) return [];
  try {
    const v = JSON.parse(valor) as unknown;
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

// Índice nome do exame → categoria/tipo, a partir da base e dos exames cadastrados
function inferirCategoria(nome: string): { categoria: string; tipo: string } | null {
  const n = normalizar(nome);
  if (n.length < 3) return null;
  const base = [
    ...lerRegistros("exame").map((r) => ({ nome: r["nome"] ?? "", categoria: r["categoria"] ?? "", tipo: r["tipo"] ?? "" })),
    ...arquivosExame.map((a) => ({ nome: a.nome, categoria: a.categoriaSlug, tipo: a.tipoSlug })),
  ];
  const achado =
    base.find((b) => normalizar(b.nome) === n) ??
    base.find((b) => normalizar(b.nome).startsWith(n)) ??
    base.find((b) => normalizar(b.nome).includes(n) || n.includes(normalizar(b.nome)));
  if (achado) return { categoria: achado.categoria, tipo: achado.tipo };
  for (const [cat, tipos] of Object.entries(tiposPorCategoria)) {
    const t = tipos.find((x) => n.includes(normalizar(x.nome)) || normalizar(x.nome).startsWith(n));
    if (t) return { categoria: cat, tipo: t.slug };
  }
  return null;
}

function resumoRegistro(chave: TipoAdicionado, r: Registro) {
  if (chave === "medico") return r["especialidade"] ?? "";
  if (chave === "consulta") return `${r["medico"] ?? ""} · ${r["data"] ?? ""}`;
  if (chave === "tratamento") return [r["inicio"], r["continuo"] === "sim" ? "uso contínuo" : r["fim"]].filter(Boolean).join(" – ");
  return r["data"] ?? "";
}

const rotuloLista: Record<TipoAdicionado, string> = {
  exame: "Exames cadastrados",
  medico: "Médicos cadastrados",
  consulta: "Consultas registradas",
  tratamento: "Tratamentos cadastrados",
  doenca: "Doenças cadastradas",
};

function Adicionar() {
  const { medicos } = useProntuario();
  const [tipo, setTipo] = useState<Tipo>("exame");
  const [modo, setModo] = useState<Modo>("medico");
  const [valores, setValores] = useState<Record<string, string>>({});
  const [erros, setErros] = useState<Record<string, string>>({});
  const [salvo, setSalvo] = useState<string | false>(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [categoriaManual, setCategoriaManual] = useState(false);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [excluir, setExcluir] = useState<Registro | null>(null);
  const [versao, setVersao] = useState(0);
  const [prescricoes, setPrescricoes] = useState<string[]>([]);
  const [examesPedidos, setExamesPedidos] = useState<string[]>([]);
  const [novaPrescricao, setNovaPrescricao] = useState("");
  const [novoExame, setNovoExame] = useState("");

  const chave: TipoAdicionado = tipo === "medico" ? modo : tipo;

  useEffect(() => {
    setRegistros(lerRegistros(chave));
  }, [chave, versao]);

  const set = (k: string, v: string) => {
    const valor = CAMPOS_DATA.has(k) ? mascaraData(v) : v;
    setValores((s) => ({ ...s, [k]: valor }));
    setErros((s) => {
      const { [k]: _, ...resto } = s;
      return resto;
    });
    setSalvo(false);
  };

  const setNomeExame = (v: string) => {
    set("nome", v);
    if (categoriaManual) return;
    const inf = inferirCategoria(v);
    if (inf) setValores((s) => ({ ...s, nome: v, categoria: inf.categoria, tipo: inf.tipo }));
  };

  const limpar = () => {
    setValores({});
    setErros({});
    setEditandoId(null);
    setCategoriaManual(false);
    setPrescricoes([]);
    setExamesPedidos([]);
    setNovaPrescricao("");
    setNovoExame("");
  };

  const trocarTipo = (t: Tipo) => {
    setTipo(t);
    limpar();
    setSalvo(false);
  };

  const trocarModo = (m: Modo) => {
    setModo(m);
    limpar();
    setSalvo(false);
  };

  const schema = useMemo(
    () =>
      chave === "exame"
        ? exameSchema
        : chave === "medico"
          ? medicoSchema
          : chave === "consulta"
            ? consultaSchema
            : chave === "tratamento"
              ? tratamentoSchema
              : doencaSchema,
    [chave],
  );

  const salvar = () => {
    const r = schema.safeParse(valores);
    if (!r.success) {
      const novos: Record<string, string> = {};
      for (const issue of r.error.issues) novos[String(issue.path[0])] = issue.message;
      setErros(novos);
      return;
    }
    if (chave === "exame" && COM_REGIAO.has(valores["categoria"] ?? "") && !valores["regiao"]) {
      setErros({ regiao: "Escolha a região do corpo" });
      return;
    }
    if (chave === "tratamento" && valores["continuo"] !== "sim" && valores["fim"] && !dataSchema.safeParse(valores["fim"]).success) {
      setErros({ fim: "Use o formato DD/MM/AAAA" });
      return;
    }
    const extras: Record<string, string> = {};
    for (const k of ["arquivo", "laudo", "foto", "documento", "continuo", "arquivoPath", "laudoPath", "fotoPath", "documentoPath"]) if (valores[k]) extras[k] = valores[k]!;
    if (chave === "consulta") {
      extras["prescricoes"] = JSON.stringify(prescricoes);
      extras["exames"] = JSON.stringify(examesPedidos);
      const alvo = medicos.find((m) => `${m.especialidadeSlug}|${m.id}` === valores["medicoRef"]);
      extras["medico"] = alvo?.nome ?? "";
      extras["nome"] = alvo ? `Consulta com ${alvo.nome}` : "Consulta";
    }
    const lista = lerRegistros(chave);
    const dados = { ...(r.data as Record<string, string>), ...extras };
    if (editandoId) {
      const i = lista.findIndex((x) => x.id === editandoId);
      if (i >= 0) lista[i] = { ...dados, id: editandoId };
    } else {
      lista.push({ ...dados, id: `${chave}-${Date.now()}` });
    }
    salvarRegistros(chave, lista);
    setSalvo(editandoId ? "Alterações salvas." : "Salvo! Já aparece nas telas do prontuário.");
    limpar();
    setVersao((v) => v + 1);
  };

  const editar = (r: Registro) => {
    const { id, ...resto } = r;
    setValores(resto);
    setErros({});
    setEditandoId(id);
    setCategoriaManual(true);
    setPrescricoes(listaJson(r["prescricoes"]));
    setExamesPedidos(listaJson(r["exames"]));
    setSalvo(false);
  };

  const confirmarExclusao = () => {
    if (!excluir) return;
    const lista = lerRegistros(chave).filter((x) => x.id !== excluir.id);
    salvarRegistros(chave, lista);
    if (editandoId === excluir.id) limpar();
    setExcluir(null);
    setVersao((v) => v + 1);
  };

  // Sugestões a partir da base do app + tudo que o paciente já cadastrou
  const sugestoes = useMemo(() => {
    const todos = (["exame", "medico", "consulta", "tratamento", "doenca"] as TipoAdicionado[]).flatMap(lerRegistros);
    const uniq = (xs: (string | undefined)[]) =>
      [...new Set(xs.filter((x): x is string => !!x && x.trim().length > 0))].sort((a, b) =>
        a.localeCompare(b, "pt-BR"),
      );
    const nomesMedicos = uniq([
      ...medicosBase.map((m) => m.nome),
      ...lerRegistros("medico").map((r) => r["nome"]),
      ...todos.flatMap((r) => [r["solicitante"], r["pedidoPor"], r["percebidaPor"]]),
    ]);
    const locais = uniq([
      ...arquivosExame.map((a) => a.local),
      ...tratamentosBase.map((t) => t.local),
      ...todos.map((r) => r["local"]),
    ]);
    const pessoas = uniq([
      ...nomesMedicos,
      ...arquivosExame.map((a) => a.realizadoPor),
      ...tratamentosBase.map((t) => t.realizadoPor),
      ...todos.flatMap((r) => [r["realizador"], r["realizadoPor"]]),
    ]);
    const trats = uniq([
      ...tratamentosBase.map((t) => t.nome),
      ...lerRegistros("tratamento").map((r) => r["nome"]),
    ]);
    const nomesExames = uniq(arquivosExame.map((a) => a.nome));
    return { medicos: nomesMedicos, locais, pessoas, trats, exames: nomesExames };
  }, [versao]);

  const tiposExame = tiposPorCategoria[valores["categoria"] ?? ""] ?? [];
  const exigeRegiao = COM_REGIAO.has(valores["categoria"] ?? "");

  return (
    <>
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

        {tipo === "medico" && (
          <div className="flex gap-2 rounded-full bg-muted p-1">
            {([
              { id: "medico", nome: "Cadastrar médico" },
              { id: "consulta", nome: "Registrar consulta" },
            ] as { id: Modo; nome: string }[]).map((m) => (
              <Button
                key={m.id}
                variant="ghost"
                onClick={() => trocarModo(m.id)}
                className={`h-10 flex-1 rounded-full text-[clamp(0.6875rem,0.95vw,0.875rem)] font-normal ${
                  modo === m.id ? "bg-card hover:bg-card" : "text-muted-foreground hover:bg-border"
                }`}
              >
                {m.nome}
              </Button>
            ))}
          </div>
        )}

        <div className="rounded-[clamp(1.25rem,2vw,1.75rem)] bg-muted p-[clamp(1rem,2vw,1.75rem)]">
          <div className="grid gap-4 sm:grid-cols-2">
            {chave === "exame" && (
              <>
                <Campo label="Nome do exame" obrigatorio erro={erros["nome"]}>
                  <input
                    value={valores["nome"] ?? ""}
                    onChange={(e) => setNomeExame(e.target.value)}
                    list="dl-exames"
                    autoComplete="off"
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
                    maxLength={10}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Categoria" obrigatorio erro={erros["categoria"]}>
                  <select
                    value={valores["categoria"] ?? ""}
                    onChange={(e) => {
                      setCategoriaManual(true);
                      set("categoria", e.target.value);
                      set("tipo", "");
                      set("regiao", "");
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
                    onChange={(e) => {
                      setCategoriaManual(true);
                      set("tipo", e.target.value);
                    }}
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
                {exigeRegiao && (
                  <Campo label="Região do corpo" obrigatorio erro={erros["regiao"]}>
                    <select
                      value={valores["regiao"] ?? ""}
                      onChange={(e) => set("regiao", e.target.value)}
                      className={selectCls}
                    >
                      <option value="">Selecionar...</option>
                      {regioesCorpo.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nome} ({r.vista})
                        </option>
                      ))}
                    </select>
                  </Campo>
                )}
                <Campo label="Tipo de resultado" erro={erros["midia"]}>
                  <select
                    value={valores["midia"] ?? ""}
                    onChange={(e) => set("midia", e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Laudo descritivo</option>
                    {midias.map((m) => (
                      <option key={m.valor} value={m.valor}>
                        {m.nome}
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
                    list="dl-locais"
                    autoComplete="off"
                    placeholder="Ex.: Laboratório São Lucas"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Médico solicitante" erro={erros["solicitante"]}>
                  <input
                    value={valores["solicitante"] ?? ""}
                    onChange={(e) => set("solicitante", e.target.value)}
                    list="dl-medicos"
                    autoComplete="off"
                    placeholder="Ex.: Dr. Davi"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Realizado por" erro={erros["realizador"]}>
                  <input
                    value={valores["realizador"] ?? ""}
                    onChange={(e) => set("realizador", e.target.value)}
                    list="dl-pessoas"
                    autoComplete="off"
                    placeholder="Ex.: Dra. Antonieta"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Resultado (imagem ou PDF)">
                  <UploadArquivo
                    rotulo="Enviar resultado"
                    nome={valores["arquivo"] ?? ""}
                    onChange={(n, c) => { set("arquivo", n); set("arquivoPath", c); }}
                  />
                </Campo>
                <Campo label="Laudo (PDF)">
                  <UploadArquivo
                    rotulo="Enviar laudo"
                    nome={valores["laudo"] ?? ""}
                    onChange={(n, c) => { set("laudo", n); set("laudoPath", c); }}
                  />
                </Campo>
                <div className="sm:col-span-2">
                  <Campo label="Observações" erro={erros["observacoes"]}>
                    <textarea
                      value={valores["observacoes"] ?? ""}
                      onChange={(e) => set("observacoes", e.target.value)}
                      placeholder="Anotações sobre o exame..."
                      maxLength={1000}
                      className={areaCls}
                    />
                  </Campo>
                </div>
              </>
            )}

            {chave === "medico" && (
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
                  <UploadArquivo
                    rotulo="Enviar foto"
                    nome={valores["foto"] ?? ""}
                    onChange={(n, c) => { set("foto", n); set("fotoPath", c); }}
                  />
                </Campo>
                <div className="sm:col-span-2">
                  <Campo label="Apresentação" erro={erros["bio"]}>
                    <textarea
                      value={valores["bio"] ?? ""}
                      onChange={(e) => set("bio", e.target.value)}
                      placeholder="Breve biografia do profissional..."
                      maxLength={600}
                      className={areaCls}
                    />
                  </Campo>
                </div>
              </>
            )}

            {chave === "consulta" && (
              <>
                <Campo label="Médico atendente" obrigatorio erro={erros["medicoRef"]}>
                  <select
                    value={valores["medicoRef"] ?? ""}
                    onChange={(e) => set("medicoRef", e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Selecionar...</option>
                    {medicos.map((m) => (
                      <option key={`${m.especialidadeSlug}|${m.id}`} value={`${m.especialidadeSlug}|${m.id}`}>
                        {m.nome} — {m.especialidade}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Data da consulta" obrigatorio erro={erros["data"]}>
                  <input
                    value={valores["data"] ?? ""}
                    onChange={(e) => set("data", e.target.value)}
                    placeholder="DD/MM/AAAA"
                    inputMode="numeric"
                    maxLength={10}
                    className={inputCls}
                  />
                </Campo>
                <div className="sm:col-span-2">
                  <Campo label="Local da consulta" erro={erros["local"]}>
                    <input
                      value={valores["local"] ?? ""}
                      onChange={(e) => set("local", e.target.value)}
                      list="dl-locais"
                      autoComplete="off"
                      placeholder="Ex.: Hospital Felício Rocho"
                      maxLength={120}
                      className={inputCls}
                    />
                  </Campo>
                </div>
                <div className="sm:col-span-2">
                  <Campo label="Resumo / parecer clínico" erro={erros["resumo"]}>
                    <textarea
                      value={valores["resumo"] ?? ""}
                      onChange={(e) => set("resumo", e.target.value)}
                      placeholder="O que foi conversado, avaliado e diagnosticado..."
                      maxLength={2000}
                      className={areaCls}
                    />
                  </Campo>
                </div>
                <div className="sm:col-span-2">
                  <Campo label="Prescrições (medicamento e dosagem)">
                    <ListaRapida
                      itens={prescricoes}
                      valor={novaPrescricao}
                      onValor={setNovaPrescricao}
                      onAdicionar={() => {
                        const v = novaPrescricao.trim();
                        if (!v) return;
                        setPrescricoes((s) => [...s, v]);
                        setNovaPrescricao("");
                      }}
                      onRemover={(i) => setPrescricoes((s) => s.filter((_, j) => j !== i))}
                      placeholder="Ex.: Losartana 50mg 1x ao dia"
                    />
                  </Campo>
                </div>
                <div className="sm:col-span-2">
                  <Campo label="Exames solicitados na consulta">
                    <ListaRapida
                      itens={examesPedidos}
                      valor={novoExame}
                      onValor={setNovoExame}
                      onAdicionar={() => {
                        const v = novoExame.trim();
                        if (!v) return;
                        setExamesPedidos((s) => [...s, v]);
                        setNovoExame("");
                      }}
                      onRemover={(i) => setExamesPedidos((s) => s.filter((_, j) => j !== i))}
                      placeholder="Ex.: Hemograma completo"
                      lista="dl-exames"
                    />
                  </Campo>
                </div>
                <div className="sm:col-span-2">
                  <Campo label="Documento (receita, atestado ou prontuário em PDF)">
                    <UploadArquivo
                      rotulo="Enviar documento"
                      nome={valores["documento"] ?? ""}
                      onChange={(n, c) => { set("documento", n); set("documentoPath", c); }}
                    />
                  </Campo>
                </div>
              </>
            )}

            {chave === "tratamento" && (
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
                    maxLength={10}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Data de fim" erro={erros["fim"]}>
                  <input
                    value={valores["fim"] ?? ""}
                    onChange={(e) => set("fim", e.target.value)}
                    disabled={valores["continuo"] === "sim"}
                    placeholder="DD/MM/AAAA (opcional)"
                    inputMode="numeric"
                    maxLength={10}
                    className={`${inputCls} disabled:opacity-50`}
                  />
                </Campo>
                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-full bg-card px-4 py-3 text-[clamp(0.75rem,1vw,0.875rem)]">
                    <input
                      type="checkbox"
                      checked={valores["continuo"] === "sim"}
                      onChange={(e) => {
                        set("continuo", e.target.checked ? "sim" : "");
                        if (e.target.checked) set("fim", "");
                      }}
                      className="size-4 accent-current"
                    />
                    Medicamento ou tratamento de uso contínuo
                  </label>
                </div>
                <Campo label="Pedido por" erro={erros["pedidoPor"]}>
                  <input
                    value={valores["pedidoPor"] ?? ""}
                    onChange={(e) => set("pedidoPor", e.target.value)}
                    list="dl-medicos"
                    autoComplete="off"
                    placeholder="Ex.: Dr. Davi"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Realizado por" erro={erros["realizadoPor"]}>
                  <input
                    value={valores["realizadoPor"] ?? ""}
                    onChange={(e) => set("realizadoPor", e.target.value)}
                    list="dl-pessoas"
                    autoComplete="off"
                    placeholder="Ex.: Enf. Antonieta"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Local" erro={erros["local"]}>
                  <input
                    value={valores["local"] ?? ""}
                    onChange={(e) => set("local", e.target.value)}
                    list="dl-locais"
                    autoComplete="off"
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
                      className={areaCls}
                    />
                  </Campo>
                </div>
              </>
            )}

            {chave === "doenca" && (
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
                    maxLength={10}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Percebida por" erro={erros["percebidaPor"]}>
                  <input
                    value={valores["percebidaPor"] ?? ""}
                    onChange={(e) => set("percebidaPor", e.target.value)}
                    list="dl-medicos"
                    autoComplete="off"
                    placeholder="Ex.: Dra. Antonieta"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Tratamento vinculado" erro={erros["tratamento"]}>
                  <input
                    value={valores["tratamento"] ?? ""}
                    onChange={(e) => set("tratamento", e.target.value)}
                    list="dl-trats"
                    autoComplete="off"
                    placeholder="Ex.: Dipirona"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
                <div className="sm:col-span-2">
                  <Campo label="Laudo ou documento comprobatório">
                    <UploadArquivo
                      rotulo="Enviar documento"
                      nome={valores["documento"] ?? ""}
                      onChange={(n, c) => { set("documento", n); set("documentoPath", c); }}
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
                      className={areaCls}
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
              {editandoId
                ? "Salvar alterações"
                : chave === "consulta"
                  ? "Salvar consulta"
                  : `Salvar ${tipos.find((t) => t.id === tipo)?.nome.toLowerCase()}`}
            </Button>
            {editandoId && (
              <Button variant="ghost" onClick={limpar} className="h-11 rounded-full px-6 font-normal">
                Cancelar edição
              </Button>
            )}
            {salvo && (
              <span className="flex items-center gap-1.5 text-[clamp(0.75rem,1vw,0.875rem)] text-muted-foreground">
                <Check className="size-4" />
                {salvo}
              </span>
            )}
            {Object.values(erros).some(Boolean) && (
              <span className="flex items-center gap-1.5 text-[clamp(0.75rem,1vw,0.875rem)] text-destructive">
                <X className="size-4" />
                Verifique os campos destacados.
              </span>
            )}
          </div>
        </div>

        <datalist id="dl-medicos">{sugestoes.medicos.map((v) => <option key={v} value={v} />)}</datalist>
        <datalist id="dl-locais">{sugestoes.locais.map((v) => <option key={v} value={v} />)}</datalist>
        <datalist id="dl-pessoas">{sugestoes.pessoas.map((v) => <option key={v} value={v} />)}</datalist>
        <datalist id="dl-trats">{sugestoes.trats.map((v) => <option key={v} value={v} />)}</datalist>
        <datalist id="dl-exames">{sugestoes.exames.map((v) => <option key={v} value={v} />)}</datalist>

        {registros.length > 0 && (
          <div className="rounded-[clamp(1.25rem,2vw,1.75rem)] bg-muted p-[clamp(1rem,2vw,1.75rem)]">
            <p className={labelCls}>
              {rotuloLista[chave]} ({registros.length})
            </p>
            <ul className="flex flex-col gap-2">
              {[...registros].reverse().map((r) => (
                <li
                  key={r.id}
                  className={`flex items-center gap-3 rounded-full bg-card py-1.5 pl-4 pr-1.5 ${editandoId === r.id ? "ring-1 ring-foreground" : ""}`}
                >
                  <span className="min-w-0 flex-1 truncate text-[clamp(0.75rem,1vw,0.875rem)]">
                    {r["nome"]}
                    <span className="ml-2 text-muted-foreground">{resumoRegistro(chave, r)}</span>
                  </span>
                  {["arquivoPath", "laudoPath", "fotoPath", "documentoPath"]
                    .map((k) => r[k])
                    .filter((c): c is string => !!c)
                    .slice(0, 1)
                    .map((caminho) => (
                      <Button
                        key={caminho}
                        variant="ghost"
                        size="icon"
                        aria-label={`Abrir arquivo de ${r["nome"]}`}
                        onClick={() => void abrirArquivo(caminho)}
                        className="size-8 rounded-full"
                      >
                        <FileText className="size-4" />
                      </Button>
                    ))}
                  <Button variant="ghost" size="icon" aria-label={`Editar ${r["nome"]}`} onClick={() => editar(r)} className="size-8 rounded-full">
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label={`Excluir ${r["nome"]}`} onClick={() => setExcluir(r)} className="size-8 rounded-full text-destructive hover:text-destructive">
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}


        <p className="text-center text-[clamp(0.6875rem,0.95vw,0.8125rem)] text-muted-foreground">
          Os dados cadastrados entram no prontuário e passam a aparecer nas listas, no calendário e na
          linha do tempo. <Link to="/" className="underline underline-offset-4">Voltar para a página inicial</Link>
        </p>
      </div>
    </PageShell>
        <AlertDialog open={!!excluir} onOpenChange={(o) => !o && setExcluir(null)}>
          <AlertDialogContent className="rounded-[1.75rem]">
            <AlertDialogTitle>Excluir “{excluir?.["nome"]}”?</AlertDialogTitle>
            <AlertDialogHeader>
              <AlertDialogDescription>
                Este registro será removido do prontuário. Essa ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmarExclusao} className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
