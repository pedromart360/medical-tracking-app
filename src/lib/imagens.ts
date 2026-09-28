/**
 * Mapa central de imagens da interface.
 * Todos os arquivos vivem em `public/img/` e são referenciados por caminho absoluto.
 * Quando um item não tiver arquivo próprio, usa-se a imagem genérica de reserva.
 */
import exameGenerico from "@/assets/exames.jpg";
import medicoGenerico from "@/assets/medicos.jpg";
import tratamentoGenerico from "@/assets/tratamentos.jpg";
import doencaGenerica from "@/assets/doencas.jpg";

export const genericos = {
  exames: exameGenerico,
  medicos: medicoGenerico,
  tratamentos: tratamentoGenerico,
  doencas: doencaGenerica,
};

/* Ícones pequenos de categoria (barra de navegação / cabeçalho).
   Não existe "medicos-CAT.webp": a seção Médicos usa consultas-CAT.webp. */
export const iconesCategoria: Record<string, string> = {
  Exames: "/img/categorias/exames-CAT.webp",
  Médicos: "/img/categorias/consultas-CAT.webp",
  Tratamentos: "/img/categorias/tratamentos-CAT.webp",
  Doenças: "/img/categorias/doencas-CAT.webp",
};

/* Miolo dos cards da Home */
export const imagensHome: Record<string, string> = {
  Exames: "/img/home-categories/exames-HOME.webp",
  Médicos: "/img/home-categories/medicos-HOME.webp",
  Tratamentos: "/img/home-categories/tratamentos-HOME.webp",
  Doenças: "/img/home-categories/doencas-HOME.webp",
};

/* Categorias gerais de exames (por slug da categoria) */
export const imagensCategoriaExame: Record<string, string> = {
  laboratoriais: "/img/exames-gerais/laboratoriais-EG.webp",
  citologicos: "/img/exames-gerais/citologicos-EG.webp",
  "de-imagem": "/img/exames-gerais/raiox-EG.webp",
  nucleares: "/img/exames-gerais/nuclear-EG.webp",
  graficos: "/img/exames-gerais/graficos-EG.webp",
  geneticos: "/img/exames-gerais/geneticos-EG.webp",
  endoscopicos: "/img/exames-gerais/endoscopicos-EG.webp",
  sensoriais: "/img/exames-gerais/sensoriais-EG.webp",
};

/* Tipos de exame: a imagem depende da categoria + do tipo */
export const imagensTipoExame: Record<string, Record<string, string>> = {
  laboratoriais: {
    hematologicos: "/img/tipos-exames/laboratoriais/hematologicos-TE-LAB.webp",
    bioquimicos: "/img/tipos-exames/laboratoriais/bioquimicos-TE-LAB.webp",
    hormonais: "/img/tipos-exames/laboratoriais/hormonais-TE-LAB.webp",
    imunologicos: "/img/tipos-exames/laboratoriais/imunologicos-TE-LAB.webp",
    parasitologicos: "/img/tipos-exames/laboratoriais/parasitologico-TE-LAB.webp",
  },
  "de-imagem": {
    radiografia: "/img/tipos-exames/imagens/radiografia-TE-IMG.webp",
    ultrassonografia: "/img/tipos-exames/imagens/ultrassom-TE-IMG.webp",
    "tomografia-computadorizada": "/img/tipos-exames/imagens/tomografia-computadorizada-TE-IMG.webp",
    "ressonancia-magnetica": "/img/tipos-exames/imagens/ressonancia-magnetica-TE-IMG.webp",
    endoscopia: "/img/tipos-exames/laboratoriais/endoscopia-TE-LAB.webp",
    "exames-vasculares": "/img/tipos-exames/laboratoriais/exame-vascular-TE-LAB.webp",
    "exames-oftalmologicos": "/img/tipos-exames/laboratoriais/exame-oftalmo-TE-LAB.webp",
  },
  graficos: {
    cardiacos: "/img/tipos-exames/graficos/cardiacos-TE-GRAF.webp",
    neurologicos: "/img/tipos-exames/graficos/neurologicos-TE-GRAF.webp",
    respiratorios: "/img/tipos-exames/graficos/respiratorios-TE-GRAF.webp",
    sono: "/img/tipos-exames/graficos/sono-TE-GRAF.webp",
    obstetricos: "/img/tipos-exames/graficos/obstetricos-TE-GRAF.webp",
    auditivos: "/img/tipos-exames/graficos/auditivos-TE-GRAF.webp",
    vasculares: "/img/tipos-exames/graficos/vasculares-TE-GRAF.webp",
    urologicos: "/img/tipos-exames/graficos/urologicos-TE-GRAF.webp",
    neuromusculares: "/img/tipos-exames/graficos/neuromusculares-TE-GRAF.webp",
  },
  endoscopicos: {
    digestivos: "/img/tipos-exames/endoscopicos/digestivos-TE-END.webp",
    respiratorios: "/img/tipos-exames/endoscopicos/respiratorios-TE-END.webp",
    otorrino: "/img/tipos-exames/endoscopicos/otorrino-TE-END.webp",
    ginecologicos: "/img/tipos-exames/endoscopicos/ginecologicos-TE-END.webp",
    cirurgicos: "/img/tipos-exames/endoscopicos/cirurgicos-TE-END.webp",
    ortopedicos: "/img/tipos-exames/endoscopicos/ortopedicos-TE-END.webp",
    urologicos: "/img/tipos-exames/endoscopicos/urologicos-TE-END.webp",
  },
  citologicos: {
    ginecologicos: "/img/tipos-exames/citologicos/ginecologicos-TE-CIT.webp",
    urinarios: "/img/tipos-exames/citologicos/urinarios-TE-CIT.webp",
    respiratorios: "/img/tipos-exames/citologicos/respiratorios-TE-CIT.webp",
    "liquidos-corporais": "/img/tipos-exames/citologicos/liquidos-corporais-TE-CIT.webp",
    puncoes: "/img/tipos-exames/citologicos/puncoes-TE-CIT.webp",
    mamarios: "/img/tipos-exames/citologicos/mamarios-TE-CIT.webp",
    hormonais: "/img/tipos-exames/citologicos/hormonais-TE-CIT.webp",
    cirurgicos: "/img/tipos-exames/citologicos/cirurgicos-TE-CIT.webp",
  },
  nucleares: {
    osseos: "/img/tipos-exames/nucleares/osseos-TE-NUC.webp",
    cardiacos: "/img/tipos-exames/nucleares/cardiacos-TE-NUC.webp",
    neurologicos: "/img/tipos-exames/nucleares/neurologicos-TE-NUC.webp",
    tireoidianos: "/img/tipos-exames/nucleares/tireodianos-TE-NUC.webp",
    renais: "/img/tipos-exames/nucleares/renais-TE-NUC.webp",
    pulmonares: "/img/tipos-exames/nucleares/pulmonares-TE-NUC.webp",
    oncologicos: "/img/tipos-exames/nucleares/oncologicos-TE-NUC.webp",
    linfaticos: "/img/tipos-exames/nucleares/linfaticos-TE-NUC.webp",
    gastrointestinais: "/img/tipos-exames/nucleares/gastrointestinais-TE-NUC.webp",
  },
  geneticos: {
    cromossomicos: "/img/tipos-exames/geneticos/cromossomicos-TE-GEN.webp",
    moleculares: "/img/tipos-exames/geneticos/moleculares-TE-GEN.webp",
    sequenciamento: "/img/tipos-exames/geneticos/sequenciamento-TE-GEN.webp",
    "pre-natais": "/img/tipos-exames/geneticos/pre-natais-TE-GEN.webp",
    oncologicos: "/img/tipos-exames/geneticos/oncologicos-TE-GEN.webp",
    neonatais: "/img/tipos-exames/geneticos/neonatais-TE-GEN.webp",
    parentesco: "/img/tipos-exames/geneticos/parentesco-TE-GEN.webp",
    farmacogeneticos: "/img/tipos-exames/geneticos/farmacogeneticos-TE-GEN.webp",
    reprodutivos: "/img/tipos-exames/geneticos/reprodutivos-TE-GEN.webp",
  },
  sensoriais: {
    visuais: "/img/tipos-exames/sensoriais/visuais-TE-SEN.webp",
    auditivos: "/img/tipos-exames/sensoriais/auditivos-TE-SEN.webp",
    otoneurologicos: "/img/tipos-exames/sensoriais/otoneurologicos-TE-SEN.webp",
    neurossensoriais: "/img/tipos-exames/sensoriais/neurossensoriais-TE-SEN.webp",
    olfatorios: "/img/tipos-exames/sensoriais/olfatorios-TE-SEN.webp",
    gustativos: "/img/tipos-exames/sensoriais/gustativos-TE-SEN.webp",
    tateis: "/img/tipos-exames/sensoriais/tateis-TE-SEN.webp",
  },
};

/* Especialidades / áreas médicas (por nome exibido) */
export const imagensEspecialidade: Record<string, string> = {
  Cardiologia: "/img/areas-medicas/cardiologia-AM.webp",
  Ortopedia: "/img/areas-medicas/ortopedia-AM.webp",
  "Ginecologia e Obstetrícia": "/img/areas-medicas/gineco-AM.webp",
  Dermatologia: "/img/areas-medicas/dermato-AM.webp",
  Psiquiatria: "/img/areas-medicas/psiquiatria-AM.webp",
  Pediatria: "/img/areas-medicas/pediatria-AM.webp",
  Oftalmologia: "/img/areas-medicas/oftalmo-AM.webp",
  Neurologia: "/img/areas-medicas/neurologia-AM.webp",
  Endocrinologia: "/img/areas-medicas/endocrino-AM.webp",
  Otorrinolaringologia: "/img/areas-medicas/otorrino-AM.webp",
  Urologia: "/img/areas-medicas/urologia-AM.webp",
  Gastroenterologia: "/img/areas-medicas/gastro-AM.webp",
  Pneumatologia: "/img/areas-medicas/pneumo-AM.webp",
  Reumatologia: "/img/areas-medicas/reumato-AM.webp",
  Nefrologia: "/img/areas-medicas/nefrologia-AM.webp",
  Infectologia: "/img/areas-medicas/infectologia-AM.webp",
  Geriatria: "/img/areas-medicas/geriatra-AM.webp",
  Hematologia: "/img/areas-medicas/hemato-AM.webp",
  Mastologia: "/img/areas-medicas/mamografia-AM.webp",
  Coloproctologia: "/img/areas-medicas/coloproctologia-AM.webp",
  Angiologia: "/img/areas-medicas/angiologia-AM.webp",
  "Alergia e Imunologia": "/img/areas-medicas/alergia-e-imuno-AM.webp",
  Oncologia: "/img/areas-medicas/oncologia-AM.webp",
};

/* Tipos de tratamento (por slug) */
export const imagensTratamento: Record<string, string> = {
  domiciliar: "/img/icones-tratamentos/domiciliar-TRAT.webp",
  hospitalar: "/img/icones-tratamentos/hospitalar-TRAT.webp",
  medicamentoso: "/img/icones-tratamentos/medicamentoso-TRAT.webp",
};

export const imgCategoriaExame = (slug: string) =>
  imagensCategoriaExame[slug] ?? genericos.exames;

export const imgTipoExame = (categoriaSlug: string, tipoSlug: string) =>
  imagensTipoExame[categoriaSlug]?.[tipoSlug] ?? imgCategoriaExame(categoriaSlug);

export const imgEspecialidade = (nome: string) =>
  imagensEspecialidade[nome] ?? genericos.medicos;

export const imgTratamento = (slug: string) =>
  imagensTratamento[slug] ?? genericos.tratamentos;

export const imgIconeCategoria = (nome: string) => iconesCategoria[nome] ?? genericos.exames;

export const imgHome = (nome: string) => imagensHome[nome] ?? genericos.exames;
