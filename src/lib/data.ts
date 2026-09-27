export const patient = {
  nome: "Ana Carolina",
  sexo: "Mulher",
  idade: "24A",
};

export const anos = [2026, 2025, 2024, 2023];

export const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export type Registro = { titulo: string; categoria: string };

export const registrosDoDia: Registro[] = [
  { titulo: "Internação", categoria: "Doenças" },
  { titulo: "Gripe", categoria: "Doenças" },
  { titulo: "Imunologista", categoria: "Médicos" },
  { titulo: "RX do braço", categoria: "Exames" },
  { titulo: "Gastrointerite", categoria: "Doenças" },
  { titulo: "Cardiologista", categoria: "Médicos" },
  { titulo: "Pregabalina", categoria: "Tratamentos" },
];

/* Marcadores (badges) por mês: índice do dia -> quantidade */
export const marcadores: Record<string, Record<number, number>> = {
  Janeiro: { 3: 1, 19: 12, 25: 5 },
  Fevereiro: { 0: 1, 1: 5, 9: 12 },
  Dezembro: { 17: 1, 18: 5, 19: 12 },
};

export const exameCategorias = [
  { slug: "laboratoriais", nome: "Laboratoriais" },
  { slug: "citologicos", nome: "Citológicos" },
  { slug: "de-imagem", nome: "De Imagem" },
  { slug: "nucleares", nome: "Nucleares" },
  { slug: "graficos", nome: "Gráficos" },
  { slug: "geneticos", nome: "Genéticos" },
  { slug: "endoscopicos", nome: "Endoscópicos" },
  { slug: "sensoriais", nome: "Sensoriais" },
];

export const areasMedicas = [
  "Cardiologia",
  "Ortopedia",
  "Ginecologia e Obstetrícia",
  "Dermatologia",
  "Psiquiatria",
  "Pediatria",
  "Oftalmologia",
  "Neurologia",
  "Endocrinologia",
  "Otorrinolaringologia",
  "Urologia",
  "Gastroenterologia",
  "Pneumatologia",
  "Reumatologia",
  "Nefrologia",
  "Infectologia",
  "Geriatria",
  "Hematologia",
  "Mastologia",
  "Coloproctologia",
  "Angiologia",
  "Alergia e Imunologia",
];

export const tiposPorCategoria: Record<string, { nome: string; slug: string }[]> = {
  laboratoriais: [
    { nome: "Hematológicos", slug: "hematologicos" },
    { nome: "Bioquímicos", slug: "bioquimicos" },
    { nome: "Hormonais", slug: "hormonais" },
    { nome: "Imunológicos", slug: "imunologicos" },
    { nome: "Parasitológicos", slug: "parasitologicos" },
  ],
  "de-imagem": [
    { nome: "Radiografia", slug: "radiografia" },
    { nome: "Ultrassonografia", slug: "ultrassonografia" },
    { nome: "Tomografia computadorizada", slug: "tomografia-computadorizada" },
    { nome: "Ressonância magnética", slug: "ressonancia-magnetica" },
    { nome: "Endoscopia", slug: "endoscopia" },
    { nome: "Exames vasculares", slug: "exames-vasculares" },
    { nome: "Exames oftalmológicos", slug: "exames-oftalmologicos" },
  ],
  graficos: [
    { nome: "Cardíacos", slug: "cardiacos" },
    { nome: "Neurológicos", slug: "neurologicos" },
    { nome: "Respiratórios", slug: "respiratorios" },
    { nome: "Sono", slug: "sono" },
    { nome: "Obstétricos", slug: "obstetricos" },
    { nome: "Auditivos", slug: "auditivos" },
    { nome: "Vasculares", slug: "vasculares" },
    { nome: "Urológicos", slug: "urologicos" },
  ],
  endoscopicos: [
    { nome: "Digestivos", slug: "digestivos" },
    { nome: "Respiratórios", slug: "respiratorios" },
    { nome: "Otorrino", slug: "otorrino" },
    { nome: "Ginecológicos", slug: "ginecologicos" },
    { nome: "Cirúrgicos", slug: "cirurgicos" },
    { nome: "Ortopédicos", slug: "ortopedicos" },
  ],
  citologicos: [
    { nome: "Ginecológicos", slug: "ginecologicos" },
    { nome: "Urinários", slug: "urinarios" },
    { nome: "Respiratórios", slug: "respiratorios" },
    { nome: "Líquidos corporais", slug: "liquidos-corporais" },
    { nome: "Punções", slug: "puncoes" },
    { nome: "Mamários", slug: "mamarios" },
    { nome: "Hormonais", slug: "hormonais" },
    { nome: "Cirúrgicos", slug: "cirurgicos" },
  ],
  nucleares: [
    { nome: "Ósseos", slug: "osseos" },
    { nome: "Cardíacos", slug: "cardiacos" },
    { nome: "Neurológicos", slug: "neurologicos" },
    { nome: "Tireoidianos", slug: "tireoidianos" },
    { nome: "Renais", slug: "renais" },
    { nome: "Pulmonares", slug: "pulmonares" },
    { nome: "Oncológicos", slug: "oncologicos" },
    { nome: "Linfáticos", slug: "linfaticos" },
    { nome: "Gastrointestinais", slug: "gastrointestinais" },
  ],
  geneticos: [
    { nome: "Cromossômicos", slug: "cromossomicos" },
    { nome: "Moleculares", slug: "moleculares" },
    { nome: "Sequenciamento", slug: "sequenciamento" },
    { nome: "Pré-natais", slug: "pre-natais" },
    { nome: "Oncológicos", slug: "oncologicos" },
    { nome: "Neonatais", slug: "neonatais" },
    { nome: "Parentesco", slug: "parentesco" },
    { nome: "Farmacogenéticos", slug: "farmacogeneticos" },
    { nome: "Reprodutivos", slug: "reprodutivos" },
  ],
  sensoriais: [
    { nome: "Visuais", slug: "visuais" },
    { nome: "Auditivos", slug: "auditivos" },
    { nome: "Otoneurológicos", slug: "otoneurologicos" },
    { nome: "Neurossensoriais", slug: "neurossensoriais" },
    { nome: "Olfatórios", slug: "olfatorios" },
    { nome: "Gustativos", slug: "gustativos" },
    { nome: "Táteis", slug: "tateis" },
  ],
};

export const resultadosExame: Record<string, { titulo: string; nome: string; data: string }[]> = {
  radiografia: [
    "RX do úmero",
    "RX da perna direita",
    "RX do úmero",
    "RX do úmero",
    "RX da perna direita",
    "RX do crânio",
    "RX do pé esquerdo",
    "RX da perna direita",
    "RX da perna direita",
    "RX da perna esquerda",
  ].map((t, i) => ({ titulo: "Radiografia", nome: t, data: `0${(i % 9) + 1}/05/2025` })),
  cardiacos: [
    "Eletrocardiograma",
    "Holter 24h",
    "Eletrocardiograma",
    "Holter 24h",
    "Eletrocardiograma",
    "Eletrocardiograma",
    "Holter 24h",
    "Eletrocardiograma",
    "Holter 24h",
    "Eletrocardiograma",
  ].map((t, i) => ({ titulo: "Gráfico", nome: t, data: `1${i % 9}/03/2025` })),
};

export const especialidades = [
  "Cardiologia",
  "Psiquiatria",
  "Endocrinologia",
  "Ortopedia",
  "Pediatria",
  "Otorrinolaringologia",
  "Ginecologia e Obstetrícia",
  "Oftalmologia",
  "Urologia",
  "Dermatologia",
  "Neurologia",
  "Gastroenterologia",
  "Pneumatologia",
  "Reumatologia",
  "Nefrologia",
  "Infectologia",
  "Geriatria",
  "Hematologia",
  "Mastologia",
  "Coloproctologia",
  "Angiologia",
  "Alergia e Imunologia",
];

export const medicos = [
  {
    id: "jorge-luis-borges",
    nome: "Dr. Jorge Luís Borges",
    especialidade: "Cardiologista",
    bio: "Dr. Jorge Luís Borges é cardiologista há mais de 15 anos, atuando em clínica SulAmérica e Unimed, especialista em doenças cardíacas hereditárias.",
  },
  {
    id: "gabriel-garcia",
    nome: "Dr. Gabriel Garcia",
    especialidade: "Cardiologista",
    bio: "Dr. Gabriel Garcia atende em consultório próprio e é referência em arritmias e acompanhamento pós-operatório.",
  },
  {
    id: "edith-stein",
    nome: "Dra. Edith Stein",
    especialidade: "Cardiologista",
    bio: "Dra. Edith Stein atua em cardiologia preventiva, com foco em hipertensão e reabilitação cardiovascular.",
  },
  {
    id: "joao-cabral",
    nome: "Dr. João Cabral",
    especialidade: "Cardiologista",
    bio: "Dr. João Cabral é cardiologista intervencionista, com atuação em hemodinâmica e cateterismo.",
  },
];

export const remediosPrescritos = [
  { nome: "Buscopan", data: "01/10/2025" },
  { nome: "Omeprazol", data: "02/09/2025" },
  { nome: "Dipirona", data: "15/07/2025" },
  { nome: "Tramadol", data: "05/12/2025" },
];

export const examesSolicitados = [
  { nome: "Buscopan", data: "01/10/2025" },
  { nome: "Omeprazol", data: "02/08/2025" },
  { nome: "Dipirona", data: "13/07/2025" },
  { nome: "Tramadol", data: "06/12/2025" },
];

export const tratamentoTipos = [
  { slug: "domiciliar", nome: "Domiciliar" },
  { slug: "hospitalar", nome: "Hospitalar" },
  { slug: "medicamentoso", nome: "Medicamentoso" },
];

export const tratamentos: Record<string, { nome: string; local: string; inicio: string; fim: string }[]> = {
  domiciliar: [
    { nome: "Imunoglobulina", local: "Domicílio", inicio: "05/03/2025", fim: "02/07/2025" },
    { nome: "Fisioterapia", local: "Domicílio", inicio: "10/01/2025", fim: "30/04/2025" },
  ],
  hospitalar: [
    { nome: "Imunoglobulina", local: "Hospital Praia Grande", inicio: "05/03/2025", fim: "02/07/2025" },
    { nome: "Quimioterapia", local: "Hospital Santa Cruz", inicio: "12/02/2024", fim: "20/08/2024" },
  ],
  medicamentoso: [
    { nome: "Pregabalina", local: "Uso contínuo", inicio: "05/03/2025", fim: "05/03/2026" },
    { nome: "Omeprazol", local: "Uso contínuo", inicio: "02/09/2025", fim: "02/12/2025" },
  ],
};

export const doencas = [
  { nome: "Internação", data: "05/03/2025" },
  { nome: "Gripe", data: "12/04/2025" },
  { nome: "Infecção urinária", data: "22/05/2025" },
  { nome: "Faringite aguda", data: "03/06/2025" },
  { nome: "Gastrointerite", data: "19/07/2025" },
  { nome: "Dengue", data: "28/08/2025" },
  { nome: "Sinusite", data: "09/11/2025" },
];

/* ---- Figura 3D interativa: pontos do corpo por categoria de exame ---- */

export type ExameCorpo = {
  nome: string;
  data: string;
  pedidoPor: string;
  realizadoEm: string;
  local: string;
};

export type PontoCorpo = {
  id: string;
  parte: string;
  /** posição no modelo 3D em metros [x, y, z] */
  pos: [number, number, number];
  exames: ExameCorpo[];
};

const ex = (nome: string, data: string, pedidoPor: string, local: string): ExameCorpo => ({
  nome,
  data,
  pedidoPor,
  realizadoEm: data,
  local,
});

export const pontosCorpo: Record<string, PontoCorpo[]> = {
  "de-imagem": [
    {
      id: "cranio",
      parte: "Crânio e face",
      pos: [0.16, 1.66, 0.06],
      exames: [
        ex("RX da face", "04/05/2026", "Dr. Jorge Luís Borges", "Clínica SulAmérica"),
        ex("RX da face", "02/11/2025", "Dra. Edith Stein", "Hospital Santa Cruz"),
        ex("RX do crânio", "15/03/2025", "Dr. João Cabral", "Clínica SulAmérica"),
      ],
    },
    {
      id: "ombro",
      parte: "Ombro direito",
      pos: [0.24, 1.36, 0.08],
      exames: [
        ex("RX do ombro", "22/08/2025", "Dr. Gabriel Garcia", "Hospital Praia Grande"),
        ex("Ressonância do ombro", "09/01/2025", "Dr. Gabriel Garcia", "Clínica Unimed"),
      ],
    },
    {
      id: "torax",
      parte: "Tórax",
      pos: [0.0, 1.25, 0.18],
      exames: [
        ex("RX de tórax", "12/06/2025", "Dra. Edith Stein", "Hospital Santa Cruz"),
        ex("Tomografia de tórax", "30/09/2024", "Dr. João Cabral", "Hospital Santa Cruz"),
        ex("RX de tórax", "04/02/2024", "Dra. Edith Stein", "Clínica Unimed"),
        ex("Ultrassonografia de mama", "18/07/2024", "Dra. Edith Stein", "Clínica SulAmérica"),
      ],
    },
    {
      id: "abdome",
      parte: "Abdome",
      pos: [0.05, 1.0, 0.16],
      exames: [
        ex("Ultrassonografia abdominal", "19/07/2025", "Dr. João Cabral", "Clínica Unimed"),
        ex("Tomografia de abdome", "28/03/2025", "Dr. João Cabral", "Hospital Praia Grande"),
      ],
    },
    {
      id: "joelho",
      parte: "Joelho esquerdo",
      pos: [-0.11, 0.46, 0.1],
      exames: [
        ex("RX do joelho", "05/12/2025", "Dr. Gabriel Garcia", "Hospital Praia Grande"),
        ex("Ressonância do joelho", "21/05/2025", "Dr. Gabriel Garcia", "Clínica SulAmérica"),
        ex("RX do joelho", "13/07/2024", "Dr. Gabriel Garcia", "Clínica Unimed"),
      ],
    },
    {
      id: "pe",
      parte: "Pé direito",
      pos: [0.11, 0.06, 0.12],
      exames: [ex("RX do pé", "03/06/2025", "Dr. Gabriel Garcia", "Hospital Praia Grande")],
    },
  ],
  nucleares: [
    {
      id: "cerebro",
      parte: "Cérebro",
      pos: [0.14, 1.68, 0.05],
      exames: [
        ex("Cintilografia cerebral", "10/04/2026", "Dra. Edith Stein", "Hospital Santa Cruz"),
        ex("PET-CT cerebral", "02/10/2025", "Dra. Edith Stein", "Hospital Santa Cruz"),
        ex("SPECT cerebral", "14/06/2025", "Dr. João Cabral", "Clínica Unimed"),
        ex("Cintilografia cerebral", "08/01/2025", "Dra. Edith Stein", "Hospital Santa Cruz"),
        ex("PET-CT cerebral", "27/09/2024", "Dr. João Cabral", "Clínica Unimed"),
      ],
    },
    {
      id: "tireoide",
      parte: "Tireoide",
      pos: [0.08, 1.48, 0.1],
      exames: [
        ex("Cintilografia da tireoide", "17/05/2025", "Dr. Jorge Luís Borges", "Clínica SulAmérica"),
        ex("Captação de iodo", "03/02/2025", "Dr. Jorge Luís Borges", "Clínica SulAmérica"),
      ],
    },
    {
      id: "coracao",
      parte: "Coração",
      pos: [-0.07, 1.27, 0.17],
      exames: [
        ex("Cintilografia miocárdica", "22/11/2025", "Dr. Jorge Luís Borges", "Clínica Unimed"),
        ex("Cintilografia miocárdica", "12/03/2025", "Dr. Gabriel Garcia", "Clínica Unimed"),
      ],
    },
    {
      id: "rins",
      parte: "Rins",
      pos: [0.09, 1.02, -0.14],
      exames: [ex("Cintilografia renal", "06/08/2025", "Dr. João Cabral", "Hospital Praia Grande")],
    },
    {
      id: "ossos",
      parte: "Esqueleto",
      pos: [-0.1, 0.72, 0.12],
      exames: [
        ex("Cintilografia óssea", "29/07/2025", "Dr. Gabriel Garcia", "Hospital Praia Grande"),
        ex("Cintilografia óssea", "16/12/2024", "Dr. Gabriel Garcia", "Hospital Praia Grande"),
      ],
    },
  ],
};

/* ---- Base unificada de arquivos de exames ---- */

export type MidiaExame = "rx" | "grafico" | "laudo" | "microscopia";

export type ExameArquivo = {
  id: string;
  nome: string;
  categoriaSlug: string;
  tipoSlug: string;
  tipoNome: string;
  areaMedica: string;
  data: string;
  ano: number;
  pedidoPor: string;
  realizadoPor: string;
  local: string;
  midia: MidiaExame;
  temLaudo: boolean;
};

type PerfilTipo = { nomes: string[]; area: string; midia: MidiaExame };

const perfilTipo: Record<string, PerfilTipo> = {
  radiografia: {
    nomes: ["RX do úmero", "RX da perna direita", "RX do crânio", "RX do pé esquerdo", "RX de tórax"],
    area: "Ortopedia",
    midia: "rx",
  },
  ultrassonografia: {
    nomes: ["US abdominal", "US de tireoide", "US de mama", "US obstétrico"],
    area: "Ginecologia e Obstetrícia",
    midia: "rx",
  },
  "tomografia-computadorizada": {
    nomes: ["TC de tórax", "TC de abdome", "TC de crânio", "TC de coluna"],
    area: "Neurologia",
    midia: "rx",
  },
  "ressonancia-magnetica": {
    nomes: ["RM do joelho", "RM de crânio", "RM do ombro", "RM de coluna lombar"],
    area: "Ortopedia",
    midia: "rx",
  },
  cardiacos: {
    nomes: ["Eletrocardiograma", "Holter 24h", "Teste ergométrico", "MAPA 24h"],
    area: "Cardiologia",
    midia: "grafico",
  },
  neurologicos: {
    nomes: ["Eletroencefalograma", "Eletroneuromiografia", "Potencial evocado"],
    area: "Neurologia",
    midia: "grafico",
  },
  respiratorios: {
    nomes: ["Espirometria", "Prova broncodilatadora", "Oximetria noturna"],
    area: "Pneumatologia",
    midia: "grafico",
  },
  sono: { nomes: ["Polissonografia", "Actigrafia", "Poligrafia respiratória"], area: "Pneumatologia", midia: "grafico" },
  obstetricos: { nomes: ["Cardiotocografia", "Doppler obstétrico"], area: "Ginecologia e Obstetrícia", midia: "grafico" },
  auditivos: { nomes: ["Audiometria tonal", "Impedanciometria", "Emissões otoacústicas"], area: "Otorrinolaringologia", midia: "grafico" },
  vasculares: { nomes: ["Doppler de carótidas", "Doppler venoso de MMII"], area: "Angiologia", midia: "grafico" },
  urologicos: { nomes: ["Urofluxometria", "Estudo urodinâmico"], area: "Urologia", midia: "grafico" },
  hematologicos: { nomes: ["Hemograma completo", "Coagulograma", "Ferritina sérica"], area: "Hematologia", midia: "laudo" },
  bioquimicos: { nomes: ["Glicemia de jejum", "Perfil lipídico", "Função hepática", "Creatinina"], area: "Endocrinologia", midia: "laudo" },
  hormonais: { nomes: ["TSH e T4 livre", "Cortisol sérico", "Prolactina"], area: "Endocrinologia", midia: "laudo" },
  imunologicos: { nomes: ["FAN", "Fator reumatoide", "Proteína C reativa"], area: "Alergia e Imunologia", midia: "laudo" },
  parasitologicos: { nomes: ["Parasitológico de fezes", "Pesquisa de sangue oculto"], area: "Infectologia", midia: "laudo" },
  osseos: { nomes: ["Cintilografia óssea", "Densitometria óssea"], area: "Ortopedia", midia: "rx" },
  tireoidianos: { nomes: ["Cintilografia da tireoide", "Captação de iodo"], area: "Endocrinologia", midia: "rx" },
  renais: { nomes: ["Cintilografia renal", "Renograma com DTPA"], area: "Nefrologia", midia: "rx" },
  pulmonares: { nomes: ["Cintilografia pulmonar", "Perfusão pulmonar"], area: "Pneumatologia", midia: "rx" },
  oncologicos: { nomes: ["PET-CT oncológico", "Cintilografia com gálio"], area: "Hematologia", midia: "rx" },
  ginecologicos: { nomes: ["Citologia cervical", "Colposcopia dirigida"], area: "Ginecologia e Obstetrícia", midia: "microscopia" },
  mamarios: { nomes: ["Punção aspirativa de mama", "Citologia mamária"], area: "Mastologia", midia: "microscopia" },
  digestivos: { nomes: ["Endoscopia digestiva alta", "Colonoscopia"], area: "Gastroenterologia", midia: "rx" },
  visuais: { nomes: ["Campimetria", "Tonometria", "Mapeamento de retina"], area: "Oftalmologia", midia: "grafico" },
};

const medicosSolicitantes = ["Dr. Davi", "Dra. Edith Stein", "Dr. João Cabral", "Dr. Gabriel Garcia"];
const medicosRealizadores = ["Dra. Antonieta", "Dr. Rubem Braga", "Dra. Cecília Meireles"];
const locais = ["Clínica Eccoar", "Hospital Santa Cruz", "Clínica SulAmérica", "Hospital Praia Grande"];

function slugArea(area: string) {
  return area
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const areaSlug = slugArea;

function gerarArquivos(): ExameArquivo[] {
  const lista: ExameArquivo[] = [];
  let n = 0;

  for (const cat of exameCategorias) {
    const tipos = tiposPorCategoria[cat.slug] ?? [];
    for (const tipo of tipos) {
      const perfil =
        perfilTipo[tipo.slug] ??
        ({ nomes: [`${tipo.nome} — painel 1`, `${tipo.nome} — painel 2`], area: areasMedicas[n % areasMedicas.length]!, midia: "laudo" } as PerfilTipo);

      const total = 10;
      for (let i = 0; i < total; i++) {
        n++;
        const ano = [2026, 2025, 2025, 2024, 2024][i % 5]!;
        const mes = ((n * 3) % 12) + 1;
        const dia = ((n * 7) % 27) + 1;
        const pad = (v: number) => String(v).padStart(2, "0");
        lista.push({
          id: `${cat.slug}-${tipo.slug}-${i}`,
          nome: perfil.nomes[i % perfil.nomes.length]!,
          categoriaSlug: cat.slug,
          tipoSlug: tipo.slug,
          tipoNome: tipo.nome,
          areaMedica: perfil.area,
          data: `${pad(dia)}/${pad(mes)}/${ano}`,
          ano,
          pedidoPor: medicosSolicitantes[n % medicosSolicitantes.length]!,
          realizadoPor: medicosRealizadores[n % medicosRealizadores.length]!,
          local: locais[n % locais.length]!,
          midia: perfil.midia,
          temLaudo: true,
        });
      }
    }
  }

  return lista;
}

export const arquivosExame: ExameArquivo[] = gerarArquivos();

const porAno = (a: ExameArquivo, b: ExameArquivo) => b.ano - a.ano;

export function arquivosPorTipo(categoriaSlug: string, tipoSlug: string) {
  return arquivosExame.filter((a) => a.categoriaSlug === categoriaSlug && a.tipoSlug === tipoSlug).sort(porAno);
}

export function arquivosPorArea(categoriaSlug: string, area: string) {
  return arquivosExame
    .filter((a) => a.categoriaSlug === categoriaSlug && slugArea(a.areaMedica) === slugArea(area))
    .sort(porAno);
}

/* =====================  Módulo Médicos  ===================== */

export type DocumentoConsulta = {
  id: string;
  titulo: string;
  paginas: number;
};

export type ExameDaConsulta = {
  nome: string;
  midia: MidiaExame;
};

export type Consulta = {
  id: string;
  dia: string; // 05/03
  data: string; // 05/03/2026
  ano: number;
  local: string;
  laudos: DocumentoConsulta[];
  exames: ExameDaConsulta[];
  resumo: string;
};

export type Medico = {
  id: string;
  nome: string;
  cargo: string;
  especialidade: string;
  especialidadeSlug: string;
  bio: string;
  crm: string;
  consultas: Consulta[];
  remedios: { nome: string; data: string; consultaId: string }[];
  examesSolicitados: { nome: string; data: string }[];
};

export const especialidadeSlug = slugArea;

const cargoPorEspecialidade: Record<string, string> = {
  Cardiologia: "Cardiologista",
  Psiquiatria: "Psiquiatra",
  Endocrinologia: "Endocrinologista",
  Ortopedia: "Ortopedista",
  Pediatria: "Pediatra",
  Otorrinolaringologia: "Otorrinolaringologista",
  "Ginecologia e Obstetrícia": "Ginecologista e Obstetra",
  Oftalmologia: "Oftalmologista",
  Urologia: "Urologista",
  Dermatologia: "Dermatologista",
  Neurologia: "Neurologista",
  Gastroenterologia: "Gastroenterologista",
  Pneumatologia: "Pneumologista",
  Reumatologia: "Reumatologista",
  Nefrologia: "Nefrologista",
  Infectologia: "Infectologista",
  Geriatria: "Geriatra",
  Hematologia: "Hematologista",
  Mastologia: "Mastologista",
  Coloproctologia: "Coloproctologista",
  Angiologia: "Angiologista",
  "Alergia e Imunologia": "Alergista e Imunologista",
};

const nomesProfissionais: { nome: string; f: boolean }[] = [
  { nome: "Jorge Luís Borges", f: false },
  { nome: "Edith Stein", f: true },
  { nome: "Gabriel Garcia", f: false },
  { nome: "Cecília Meireles", f: true },
  { nome: "João Cabral", f: false },
  { nome: "Antonieta Duarte", f: true },
  { nome: "Rubem Braga", f: false },
  { nome: "Clarice Lispector", f: true },
  { nome: "Mário Quintana", f: false },
  { nome: "Hilda Hilst", f: true },
  { nome: "Davi Rocha", f: false },
  { nome: "Marina Colasanti", f: true },
  { nome: "Manuel Bandeira", f: false },
  { nome: "Adélia Prado", f: true },
  { nome: "Carlos Drummond", f: false },
  { nome: "Rachel de Queiroz", f: true },
];

const remediosPool = [
  "Buscopan",
  "Omeprazol",
  "Dipirona",
  "Tramadol",
  "Losartana",
  "Pregabalina",
  "Amoxicilina",
  "Prednisona",
  "Metformina",
  "Sertralina",
];

const documentosPool = [
  "atestado de alta",
  "prontuário clínico",
  "relatório médico",
  "receituário",
  "laudo clínico",
  "encaminhamento",
];

const resumosPool = [
  "Paciente compareceu para acompanhamento de rotina. Queixas leves, exame físico sem alterações relevantes. Mantida a conduta anterior.",
  "Retorno com resultados de exames. Quadro estável, ajuste de dose da medicação em curso e novo retorno em três meses.",
  "Consulta de avaliação inicial. Solicitados exames complementares para investigação e orientações gerais de cuidado.",
  "Avaliação pós-procedimento. Boa evolução clínica, sem intercorrências. Liberada para atividades habituais.",
];

function examesDaArea(area: string): ExameDaConsulta[] {
  const lista: ExameDaConsulta[] = [];
  for (const [, perfil] of Object.entries(perfilTipo)) {
    if (perfil.area === area) for (const nome of perfil.nomes) lista.push({ nome, midia: perfil.midia });
  }
  if (lista.length === 0) {
    return [
      { nome: "Hemograma completo", midia: "laudo" },
      { nome: "Perfil lipídico", midia: "laudo" },
      { nome: "RX de tórax", midia: "rx" },
    ];
  }
  return lista;
}

function gerarMedicos(): Medico[] {
  const lista: Medico[] = [];
  let n = 3;

  for (const esp of especialidades) {
    const cargo = cargoPorEspecialidade[esp] ?? "Médico";
    const pool = examesDaArea(esp);
    const quantos = 4 + (esp.length % 3);

    for (let d = 0; d < quantos; d++) {
      n += 5;
      const base = nomesProfissionais[(n + d * 3) % nomesProfissionais.length]!;
      const titulo = base.f ? "Dra." : "Dr.";
      const nome = `${titulo} ${base.nome}`;
      const id = `${slugArea(base.nome)}-${d + 1}`;

      const consultas: Consulta[] = [];
      for (const ano of [2026, 2025, 2024]) {
        const total = 3 + ((n + ano + d) % 12);
        for (let c = 0; c < total; c++) {
          n += 3;
          const dia = ((n * 7) % 27) + 1;
          const mes = ((n * 5) % 12) + 1;
          const pad = (v: number) => String(v).padStart(2, "0");
          const nLaudos = 1 + ((n + c) % 3);
          const nExames = (n + c) % 4;
          consultas.push({
            id: `${id}-${ano}-${c}`,
            dia: `${pad(dia)}/${pad(mes)}`,
            data: `${pad(dia)}/${pad(mes)}/${ano}`,
            ano,
            local: locais[(n + c) % locais.length]!,
            laudos: Array.from({ length: nLaudos }, (_, i) => ({
              id: `${id}-${ano}-${c}-doc${i}`,
              titulo: documentosPool[(n + i + c) % documentosPool.length]!,
              paginas: 2 + ((n + i) % 3),
            })),
            exames: Array.from({ length: nExames }, (_, i) => pool[(n + i * 2 + c) % pool.length]!),
            resumo: resumosPool[(n + c) % resumosPool.length]!,
          });
        }
      }
      consultas.sort((a, b) => b.ano - a.ano);

      lista.push({
        id,
        nome,
        cargo,
        especialidade: esp,
        especialidadeSlug: slugArea(esp),
        crm: `CRM ${100000 + ((n * 37) % 899999)}`,
        bio: `${nome} atua em ${esp} há mais de ${8 + (n % 18)} anos, atendendo em ${locais[n % locais.length]} e ${locais[(n + 1) % locais.length]}. Acompanha Ana Carolina em consultas periódicas e no seguimento dos exames solicitados.`,
        consultas,
        remedios: Array.from({ length: 4 + (n % 4) }, (_, i) => {
          const consulta = consultas[(i * 2) % consultas.length];
          return {
            nome: remediosPool[(n + i * 3) % remediosPool.length]!,
            data: consulta?.data ?? "01/03/2025",
            consultaId: consulta?.id ?? "",
          };
        }),
        examesSolicitados: Array.from({ length: 4 + ((n + 1) % 4) }, (_, i) => ({
          nome: pool[(n + i) % pool.length]!.nome,
          data: consultas[(i * 3) % consultas.length]?.data ?? "01/03/2025",
        })),
      });
    }
  }

  return lista;
}

export const medicosBase: Medico[] = gerarMedicos();

export function medicosPorEspecialidade(slug: string) {
  return medicosBase.filter((m) => m.especialidadeSlug === slug);
}

export function acharMedico(espSlug: string, id: string) {
  return medicosBase.find((m) => m.especialidadeSlug === espSlug && m.id === id);
}

export function nomeEspecialidadePorSlug(slug: string) {
  return especialidades.find((e) => slugArea(e) === slug);
}

/* ---- Módulo Tratamentos ---- */

export type TratamentoRegistro = {
  id: string;
  nome: string;
  categoria: string;
  ano: number;
  dias: string[];
  periodo: string;
  dataCompleta: string;
  pedidoPor: { nome: string; espSlug: string; medicoId: string };
  realizadoPor: string;
  local: string;
};

const nomesTratamento: Record<string, string[]> = {
  domiciliar: [
    "Imunoglobulina",
    "Fisioterapia respiratória",
    "Curativo domiciliar",
    "Hidratação venosa",
    "Fonoaudiologia",
    "Aplicação de enoxaparina",
  ],
  hospitalar: [
    "Imunoglobulina",
    "Transfusão sanguínea",
    "Antibioticoterapia IV",
    "Pulsoterapia",
    "Sessão de diálise",
    "Quimioterapia",
  ],
  medicamentoso: [
    "Pregabalina",
    "Omeprazol",
    "Prednisona",
    "Amoxicilina",
    "Sertralina",
    "Metformina",
    "Losartana",
    "Dipirona",
  ],
};

const locaisTratamento: Record<string, string[]> = {
  domiciliar: ["Domiciliar", "Domiciliar — home care", "Domiciliar"],
  hospitalar: ["Hospital Felício Rocho", "Hospital Santa Cruz", "Hospital Praia Grande"],
  medicamentoso: ["Domiciliar", "Uso contínuo", "Domiciliar"],
};

const equipeTratamento = [
  "Enf. Antonieta Duarte",
  "Enf. Marina Colasanti",
  "Fisio. Rubem Braga",
  "Ana Carolina",
  "Enf. Adélia Prado",
];

function gerarTratamentos(): TratamentoRegistro[] {
  const pad = (v: number) => String(v).padStart(2, "0");
  const lista: TratamentoRegistro[] = [];
  let n = 11;

  for (const cat of ["domiciliar", "hospitalar", "medicamentoso"]) {
    const nomes = nomesTratamento[cat]!;
    const locais = locaisTratamento[cat]!;

    for (const ano of anos) {
      const total = cat === "medicamentoso" ? 8 : 12 + (n % 5);
      let anteriorMes = 1;
      let anteriorDia = 1;
      for (let i = 0; i < total; i++) {
        n += 7;
        const repetirDia = i > 0 && i % 4 === 0;
        const mes = repetirDia ? anteriorMes : ((n * 5) % 12) + 1;
        const diaBase = repetirDia ? anteriorDia : ((n * 3) % 24) + 1;
        anteriorMes = mes;
        anteriorDia = diaBase;
        const duracao = cat === "medicamentoso" ? 3 + ((n + i) % 8) : 1;
        const dias = Array.from({ length: duracao }, (_, d) => `${pad(diaBase + d)}/${pad(mes)}`);

        const medico = medicosBase[(n * 13 + i) % medicosBase.length]!;
        const primeiro = dias[0]!;
        const ultimo = dias[dias.length - 1]!;

        lista.push({
          id: `${cat}-${ano}-${i}`,
          nome: nomes[(n + i) % nomes.length]!,
          categoria: cat,
          ano,
          dias,
          periodo: duracao > 1 ? `${primeiro}-${ultimo}` : primeiro,
          dataCompleta:
            duracao > 1
              ? `${diaBase}-${diaBase + duracao - 1}/${pad(mes)}/${ano}`
              : `${primeiro}/${ano}`,
          pedidoPor: { nome: medico.nome, espSlug: medico.especialidadeSlug, medicoId: medico.id },
          realizadoPor:
            cat === "medicamentoso" ? "Ana Carolina" : equipeTratamento[(n + i) % equipeTratamento.length]!,
          local: locais[(n + i) % locais.length]!,
        });
      }
    }
  }

  return lista;
}

export const tratamentosBase: TratamentoRegistro[] = gerarTratamentos();

export function tratamentosPorCategoria(categoria: string, ano: number) {
  return tratamentosBase.filter((t) => t.categoria === categoria && t.ano === ano);
}
