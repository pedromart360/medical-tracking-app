import { useEffect, useRef, useState } from "react";
import { X, Upload, Check, LogOut } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { sair } from "@/lib/conta";
import {
  aoAbrirPerfil,
  idadeDoPerfil,
  iniciais,
  salvarPerfil,
  SEXO_OPCOES,
  usePerfil,
  type Perfil,
} from "@/lib/perfil";


const inputCls =
  "h-10 w-full rounded-full bg-card px-4 text-sm outline-none ring-foreground/10 placeholder:text-muted-foreground focus:ring-2";

function mascaraData(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}

function Campo({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function PerfilDrawer() {
  const perfil = usePerfil();
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState<Perfil>(perfil);
  const [salvo, setSalvo] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return aoAbrirPerfil(() => {
      setForm(perfil);
      setSalvo(false);
      setAberto(true);
    });
  }, [perfil]);

  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [aberto]);

  if (!aberto) return null;

  const set = (k: keyof Perfil) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const salvar = () => {
    salvarPerfil(form);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  };

  const foto = (arquivo: File) => {
    const leitor = new FileReader();
    leitor.onload = () => set("foto")(String(leitor.result));
    leitor.readAsDataURL(arquivo);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Fechar perfil"
        onClick={() => setAberto(false)}
        className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px]"
      />
      <aside className="relative flex h-full w-full max-w-[26rem] flex-col gap-5 overflow-y-auto bg-background p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Seu perfil</p>
            <h2 className="text-2xl font-medium leading-tight tracking-tight">
              {form.nome || "Seu perfil"}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Fechar"
            onClick={() => setAberto(false)}
            className="rounded-full"
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-muted to-border text-lg text-muted-foreground ring-2 ring-foreground/80">
            {form.foto ? (
              <img src={form.foto} alt="" className="size-full object-cover" />
            ) : (
              iniciais(form.nome)
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) foto(f);
              }}
            />
            <Button
              variant="outline"
              className="h-9 rounded-full text-xs font-normal"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="mr-2 size-3.5" /> Enviar foto
            </Button>
            {form.foto && (
              <Button
                variant="ghost"
                className="h-7 rounded-full text-xs font-normal text-muted-foreground"
                onClick={() => set("foto")("")}
              >
                remover foto
              </Button>
            )}
          </div>
        </div>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-medium">Identificação</h3>
          <Campo label="Nome completo">
            <input
              className={inputCls}
              value={form.nome}
              placeholder="Nome completo ou social"
              onChange={(e) => set("nome")(e.target.value)}
            />
          </Campo>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Data de nascimento">
              <input
                className={inputCls}
                value={form.nascimento}
                placeholder="DD/MM/AAAA"
                inputMode="numeric"
                onChange={(e) => set("nascimento")(mascaraData(e.target.value))}
              />
            </Campo>
            <Campo label="Idade">
              <div className="flex h-10 items-center rounded-full bg-card px-4 text-sm text-muted-foreground">
                {idadeDoPerfil(form)}
              </div>
            </Campo>
          </div>
          <Campo label="Sexo (define a ilustração do corpo)">
            <div className="flex gap-2">
              {SEXO_OPCOES.map((op) => {
                const ativo = form.sexo === op;
                return (
                  <button
                    key={op}
                    type="button"
                    onClick={() => set("sexo")(op)}
                    className={`h-10 flex-1 rounded-full text-sm transition-colors ${
                      ativo
                        ? "bg-foreground text-background"
                        : "bg-card text-muted-foreground hover:bg-border"
                    }`}
                  >
                    {op}
                  </button>
                );
              })}
            </div>
          </Campo>

        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-medium">Informações clínicas</h3>
          <div className="grid grid-cols-3 gap-3">
            <Campo label="Sangue">
              <input
                className={inputCls}
                value={form.tipoSanguineo}
                placeholder="O+"
                onChange={(e) => set("tipoSanguineo")(e.target.value)}
              />
            </Campo>
            <Campo label="Altura">
              <input
                className={inputCls}
                value={form.altura}
                placeholder="1,65 m"
                onChange={(e) => set("altura")(e.target.value)}
              />
            </Campo>
            <Campo label="Peso">
              <input
                className={inputCls}
                value={form.peso}
                placeholder="60 kg"
                onChange={(e) => set("peso")(e.target.value)}
              />
            </Campo>
          </div>
          <Campo label="Alergias conhecidas">
            <textarea
              className="min-h-16 w-full rounded-2xl bg-card px-4 py-3 text-sm outline-none ring-foreground/10 placeholder:text-muted-foreground focus:ring-2"
              value={form.alergias}
              placeholder="Medicamentos, alimentos..."
              onChange={(e) => set("alergias")(e.target.value)}
            />
          </Campo>
          <Campo label="Condições crônicas prévias">
            <textarea
              className="min-h-16 w-full rounded-2xl bg-card px-4 py-3 text-sm outline-none ring-foreground/10 placeholder:text-muted-foreground focus:ring-2"
              value={form.condicoes}
              placeholder="Asma, diabetes..."
              onChange={(e) => set("condicoes")(e.target.value)}
            />
          </Campo>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-medium">Contatos</h3>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Contato de emergência">
              <input
                className={inputCls}
                value={form.contatoNome}
                placeholder="Nome"
                onChange={(e) => set("contatoNome")(e.target.value)}
              />
            </Campo>
            <Campo label="Telefone">
              <input
                className={inputCls}
                value={form.contatoTelefone}
                placeholder="(31) 90000-0000"
                onChange={(e) => set("contatoTelefone")(e.target.value)}
              />
            </Campo>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Plano de saúde">
              <input
                className={inputCls}
                value={form.plano}
                placeholder="Operadora"
                onChange={(e) => set("plano")(e.target.value)}
              />
            </Campo>
            <Campo label="Carteirinha">
              <input
                className={inputCls}
                value={form.carteirinha}
                placeholder="Número"
                onChange={(e) => set("carteirinha")(e.target.value)}
              />
            </Campo>
          </div>
        </section>

        <div className="sticky bottom-0 -mx-5 mt-auto flex items-center gap-3 border-t border-border bg-background px-5 py-4 sm:-mx-6 sm:px-6">
          <Button
            className="h-10 flex-1 rounded-full text-sm font-normal"
            disabled={!form.nome.trim()}
            onClick={salvar}
          >
            {salvo ? (
              <>
                <Check className="mr-2 size-4" /> Salvo
              </>
            ) : (
              "Salvar perfil"
            )}
          </Button>
          <Button
            variant="ghost"
            className="h-10 rounded-full text-xs font-normal text-muted-foreground"
            onClick={() => {
              void sair().then(() => {
                setAberto(false);
                router.navigate({ to: "/entrar", replace: true });
              });
            }}
          >
            <LogOut className="mr-2 size-3.5" /> Sair da conta
          </Button>
        </div>
      </aside>
    </div>
  );
}
