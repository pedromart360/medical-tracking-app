import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  criarConta,
  entrar,
  temConta,
  sessaoAtiva,
  validarEmail,
  redefinirSenha,
} from "@/lib/conta";
import {
  iniciais,
  perfilVazio,
  salvarPerfil,
  SEXO_OPCOES,
  idadeDoPerfil,
  type Perfil,
} from "@/lib/perfil";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Criar conta — Prontuário digital" },
      {
        name: "description",
        content:
          "Crie seu espaço e organize exames, consultas, tratamentos e diagnósticos em uma linha do tempo.",
      },
      { property: "og:title", content: "Criar conta — Prontuário digital" },
      {
        property: "og:description",
        content: "Seu histórico de saúde, visual e organizado em um só lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Entrar,
});

const inputCls =
  "h-12 w-full rounded-full bg-card px-5 text-sm outline-none ring-foreground/10 placeholder:text-muted-foreground focus:ring-2";

function mascaraData(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Entrar() {
  const router = useRouter();
  const [modo, setModo] = useState<"cadastro" | "login" | "recuperar">("cadastro");
  const [passo, setPasso] = useState<1 | 2>(1);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [nascimento, setNascimento] = useState("");
  const [sexo, setSexo] = useState<string>("");
  const [foto, setFoto] = useState("");
  const [erro, setErro] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [aviso, setAviso] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessaoAtiva()) router.navigate({ to: "/", replace: true });
    else if (temConta()) setModo("login");
  }, [router]);

  const perfilPreview: Perfil = { ...perfilVazio, nome, nascimento, sexo, foto };

  const continuar = () => {
    if (!nome.trim()) return setErro("Escreva como quer ser chamado.");
    if (!validarEmail(email)) return setErro("Digite um e-mail válido.");
    if (senha.length < 6) return setErro("A senha precisa de pelo menos 6 caracteres.");
    setErro("");
    setPasso(2);
  };

  const concluir = () => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(nascimento)) return setErro("Informe a data no formato DD/MM/AAAA.");
    if (!sexo) return setErro("Escolha o modelo do corpo para a ilustração.");
    setErro("");
    salvarPerfil({ ...perfilVazio, nome: nome.trim(), nascimento, sexo, foto });
    criarConta({ email: email.trim(), senha });
    router.navigate({ to: "/", replace: true });
  };

  const fazerLogin = () => {
    const msg = entrar(email, senha);
    if (msg) return setErro(msg);
    setErro("");
    router.navigate({ to: "/", replace: true });
  };

  const recuperar = () => {
    if (!validarEmail(email)) return setErro("Digite um e-mail válido.");
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(nascimento)) return setErro("Informe a data no formato DD/MM/AAAA.");
    if (senha !== confirmar) return setErro("As senhas não são iguais.");
    const msg = redefinirSenha(email, nascimento, senha);
    if (msg) return setErro(msg);
    setErro("");
    setSenha("");
    setConfirmar("");
    setNascimento("");
    setAviso("Senha redefinida. Entre com a nova senha.");
    setModo("login");
  };

  const lerFoto = (arquivo: File) => {
    const leitor = new FileReader();
    leitor.onload = () => setFoto(String(leitor.result));
    leitor.readAsDataURL(arquivo);
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background px-[clamp(1rem,4vw,2.5rem)] py-10">
      <div className="grid w-full max-w-[980px] items-center gap-[clamp(1.5rem,4vw,3.5rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <section className="hidden flex-col gap-4 md:flex">
          <p className="text-sm text-muted-foreground">Seu espaço de saúde</p>
          <h1 className="text-[clamp(2rem,4.4vw,3.25rem)] font-medium leading-[1.12] tracking-tight">
            Seu histórico de saúde, visual e organizado.
          </h1>
          <p className="max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
            Reúna exames, consultas, tratamentos e diagnósticos em uma linha do tempo simples de
            entender — e leve tudo com você em um resumo em PDF.
          </p>
        </section>

        <section className="flex w-full flex-col gap-5 rounded-[2rem] bg-card/60 p-[clamp(1.25rem,3vw,2rem)]">
          <div className="flex items-center gap-3">
            {modo === "cadastro" && passo === 2 && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Voltar"
                className="rounded-full"
                onClick={() => {
                  setErro("");
                  setPasso(1);
                }}
              >
                <ArrowLeft className="size-5" />
              </Button>
            )}
            <div>
              <p className="text-xs text-muted-foreground">
                {modo === "login"
                  ? "Bem-vindo de volta"
                  : passo === 1
                    ? "Passo 1 de 2"
                    : "Passo 2 de 2"}
              </p>
              <h2 className="text-2xl font-medium leading-tight tracking-tight">
                {modo === "login"
                  ? "Entrar"
                  : passo === 1
                    ? "Crie seu espaço"
                    : "Personalize seu espaço"}
              </h2>
            </div>
          </div>

          {modo === "login" ? (
            <div className="flex flex-col gap-3">
              <Campo label="Seu e-mail">
                <input
                  className={inputCls}
                  type="email"
                  value={email}
                  placeholder="voce@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Campo>
              <Campo label="Senha">
                <div className="relative">
                  <input
                    className={`${inputCls} pr-12`}
                    type={verSenha ? "text" : "password"}
                    value={senha}
                    placeholder="••••••"
                    onChange={(e) => setSenha(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fazerLogin()}
                  />
                  <button
                    type="button"
                    aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setVerSenha((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {verSenha ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Campo>
            </div>
          ) : passo === 1 ? (
            <div className="flex flex-col gap-3">
              <Campo label="Como gostaria de ser chamado(a)?">
                <input
                  className={inputCls}
                  value={nome}
                  placeholder="Nome completo ou social"
                  onChange={(e) => setNome(e.target.value)}
                />
              </Campo>
              <Campo label="Seu e-mail de acesso">
                <input
                  className={inputCls}
                  type="email"
                  value={email}
                  placeholder="voce@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Campo>
              <Campo label="Crie uma senha">
                <div className="relative">
                  <input
                    className={`${inputCls} pr-12`}
                    type={verSenha ? "text" : "password"}
                    value={senha}
                    placeholder="Mínimo de 6 caracteres"
                    onChange={(e) => setSenha(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && continuar()}
                  />
                  <button
                    type="button"
                    aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setVerSenha((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {verSenha ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Campo>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-muted to-border text-lg text-muted-foreground ring-2 ring-foreground/80">
                  {foto ? (
                    <img src={foto} alt="" className="size-full object-cover" />
                  ) : (
                    iniciais(nome)
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
                      if (f) lerFoto(f);
                    }}
                  />
                  <Button
                    variant="outline"
                    className="h-9 rounded-full text-xs font-normal"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload className="mr-2 size-3.5" /> Enviar foto
                  </Button>
                  <span className="text-xs text-muted-foreground">Opcional</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Campo label="Sua data de nascimento">
                  <input
                    className={inputCls}
                    value={nascimento}
                    placeholder="DD/MM/AAAA"
                    inputMode="numeric"
                    onChange={(e) => setNascimento(mascaraData(e.target.value))}
                  />
                </Campo>
                <Campo label="Idade">
                  <div className="flex h-12 items-center rounded-full bg-card px-5 text-sm text-muted-foreground">
                    {/^\d{2}\/\d{2}\/\d{4}$/.test(nascimento) ? idadeDoPerfil(perfilPreview) : "—"}
                  </div>
                </Campo>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">
                  Modelo do corpo usado nas ilustrações
                </span>
                <div className="flex gap-2">
                  {SEXO_OPCOES.map((op) => {
                    const ativo = sexo === op;
                    return (
                      <button
                        key={op}
                        type="button"
                        onClick={() => setSexo(op)}
                        className={`h-12 flex-1 rounded-full text-sm transition-colors ${
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
              </div>
            </div>
          )}

          {erro && <p className="text-xs text-destructive">{erro}</p>}
          {aviso && !erro && <p className="text-xs text-foreground">{aviso}</p>}

          <Button
            className="h-12 w-full rounded-full text-sm font-normal"
            onClick={
              modo === "login"
                ? fazerLogin
                : modo === "recuperar"
                  ? recuperar
                  : passo === 1
                    ? continuar
                    : concluir
            }
          >
            {modo === "login"
              ? "Entrar"
              : modo === "recuperar"
                ? "Redefinir senha"
                : passo === 1
                  ? "Continuar"
                  : "Concluir e entrar"}
          </Button>

          {modo === "login" && (
            <button
              type="button"
              className="text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
              onClick={() => {
                setErro("");
                setAviso("");
                setSenha("");
                setModo("recuperar");
              }}
            >
              Esqueceu a senha?
            </button>
          )}

          <button
            type="button"
            className="text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => {
              setErro("");
              setAviso("");
              setPasso(1);
              setModo((m) => (m === "login" ? "cadastro" : "login"));
            }}
          >
            {modo === "login"
              ? "Ainda não tem conta? Criar agora"
              : modo === "recuperar"
                ? "Lembrou a senha? Voltar para entrar"
                : "Já tem uma conta? Entrar"}
          </button>
        </section>
      </div>
    </main>
  );
}
