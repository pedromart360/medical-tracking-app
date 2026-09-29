DROP TRIGGER IF EXISTS criar_perfil_apos_signup ON auth.users;
DROP FUNCTION IF EXISTS public.criar_perfil_para_novo_usuario();