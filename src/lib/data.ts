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
