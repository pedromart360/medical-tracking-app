CREATE TABLE public.perfis (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL DEFAULT '',
  nascimento text NOT NULL DEFAULT '',
  sexo text NOT NULL DEFAULT '',
  foto text NOT NULL DEFAULT '',
  tipo_sanguineo text NOT NULL DEFAULT '',
  alergias text NOT NULL DEFAULT '',
  condicoes text NOT NULL DEFAULT '',
  altura text NOT NULL DEFAULT '',
  peso text NOT NULL DEFAULT '',
  contato_nome text NOT NULL DEFAULT '',
  contato_telefone text NOT NULL DEFAULT '',
  plano text NOT NULL DEFAULT '',
  carteirinha text NOT NULL DEFAULT '',
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.perfis TO authenticated;
GRANT ALL ON public.perfis TO service_role;

ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "perfil proprio select" ON public.perfis FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "perfil proprio insert" ON public.perfis FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "perfil proprio update" ON public.perfis FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "perfil proprio delete" ON public.perfis FOR DELETE TO authenticated USING (auth.uid() = id);

CREATE TABLE public.registros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  tipo text NOT NULL CHECK (tipo IN ('exame','medico','consulta','tratamento','doenca')),
  dados jsonb NOT NULL DEFAULT '{}'::jsonb,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX registros_user_tipo_idx ON public.registros (user_id, tipo);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.registros TO authenticated;
GRANT ALL ON public.registros TO service_role;

ALTER TABLE public.registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "registros proprios select" ON public.registros FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "registros proprios insert" ON public.registros FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "registros proprios update" ON public.registros FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "registros proprios delete" ON public.registros FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.criar_perfil_para_novo_usuario()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfis (id, nome)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.raw_user_meta_data ->> 'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER criar_perfil_apos_signup
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.criar_perfil_para_novo_usuario();