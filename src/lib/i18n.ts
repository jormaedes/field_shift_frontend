export type Lang = "pt" | "en";

type IconKey = "map" | "form" | "compare";

type Step = {
  title: string;
  text: string;
};

type StrategyField = {
  name: string;
  text: string;
};

type DataItem = {
  name: string;
  source: string;
  text: string;
};

export type LandingCopy = {
  htmlLang: string;
  a11y: {
    skipToContent: string;
  };
  toggle: {
    groupLabel: string;
    pt: string;
    en: string;
  };
  nav: {
    label: string;
    how: string;
    data: string;
    limits: string;
    cta: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    note: string;
    figure: {
      rain: string;
      moisture: string;
      vegetation: string;
      caption: string;
      alt: string;
    };
  };
  statement: {
    label: string;
    title: string;
    lead: string;
    points: Step[];
  };
  steps: {
    label: string;
    title: string;
    lead: string;
    items: (Step & { icon: IconKey })[];
  };
  strategies: {
    label: string;
    title: string;
    lead: string;
    tabs: string[];
    cardTitle: string;
    fields: StrategyField[];
    reference: string;
    confidence: string;
    note: string;
  };
  data: {
    label: string;
    title: string;
    lead: string;
    items: DataItem[];
    note: string;
  };
  limits: {
    label: string;
    title: string;
    lead: string;
    items: string[];
    footnote: string;
  };
  cta: {
    title: string;
    text: string;
    button: string;
  };
  footer: {
    tagline: string;
    projectLabel: string;
    project: string;
    sourcesLabel: string;
    sources: string[];
    mapLabel: string;
    map: string;
    rights: string;
  };
};

const pt: LandingCopy = {
  htmlLang: "pt-PT",
  a11y: {
    skipToContent: "Saltar para o conteúdo",
  },
  toggle: {
    groupLabel: "Idioma",
    pt: "Português",
    en: "English",
  },
  nav: {
    label: "Navegação principal",
    how: "Como funciona",
    data: "Dados da NASA",
    limits: "Limitações",
    cta: "Começar análise",
  },
  hero: {
    eyebrow: "NASA Space Apps Challenge 2026 · Desafio 7 — Field Shift",
    title: "O que plantar a seguir,",
    titleAccent: "com dados da NASA.",
    lead: "Marque o terreno, diga o que cultiva e o que quer melhorar. Comparamos três estratégias de rotação com o histórico de chuva, solo e vegetação — para decidir com mais confiança.",
    primaryCta: "Começar análise",
    secondaryCta: "Ver como funciona",
    note: "Sem previsão do tempo. Só padrões históricos e o que já aconteceu nesta época.",
    figure: {
      rain: "Chuva",
      moisture: "Humidade do solo",
      vegetation: "Vegetação",
      caption: "Esquema ilustrativo — não representa um terreno real",
      alt: "Esquema de um terreno agrícola com camadas de solo, curvas de nível e leituras de chuva, humidade e vegetação.",
    },
  },
  statement: {
    label: "O problema",
    title: "Chuvas que já não chegam na mesma altura.",
    lead: "Solos que perdem qualidade de época para época. O agricultor decide com experiência e intuição, mas sem acesso às décadas de dados de satélite que já existem — e são gratuitos.",
    points: [
      {
        title: "Chuva imprevisível",
        text: "A época começa mais tarde ou falha. Sem histórico local, é difícil distinguir uma exceção de um padrão.",
      },
      {
        title: "Solo a degradar",
        text: "A monocultura e a erosão reduzem a matéria orgânica e a capacidade do solo de guardar água.",
      },
      {
        title: "Informação dispersa",
        text: "Os dados existem, mas estão em portais técnicos e em linguagem de satélite. A Field Shift traduz.",
      },
    ],
  },
  steps: {
    label: "Como funciona",
    title: "Três passos, sem complicações",
    lead: "Não precisa de saber ler mapas de satélite. Só precisa de conhecer o seu terreno.",
    items: [
      {
        icon: "map",
        title: "Marque o terreno",
        text: "Toque no mapa ou desenhe o contorno. A área é calculada automaticamente em hectares.",
      },
      {
        icon: "form",
        title: "Descreva a situação",
        text: "Cultura atual, acesso a rega, tipo de solo, objetivo e horizonte de uma a três épocas.",
      },
      {
        icon: "compare",
        title: "Compare estratégias",
        text: "Três opções com pontuação, confiança e os cinco pontos exigidos: porquê, evidência, benefícios, lacunas e riscos.",
      },
    ],
  },
  strategies: {
    label: "O que recebe",
    title: "Três estratégias. Cinco respostas claras.",
    lead: "A estratégia A é sempre a rotação atual ou a referência regional. B e C são alternativas calculadas para o seu objetivo e horizonte.",
    tabs: ["A", "B", "C"],
    cardTitle: "Rotação atual (referência)",
    fields: [
      {
        name: "Porquê",
        text: "A razão da recomendação, em linguagem simples.",
      },
      {
        name: "Evidência dos dados",
        text: "O que a chuva, o solo e a vegetação mostram naquele local.",
      },
      {
        name: "Benefícios",
        text: "O que pode melhorar: água, erosão, rendimento ou saúde do solo.",
      },
      {
        name: "Lacunas de informação",
        text: "O que os dados não conseguem responder.",
      },
      {
        name: "Riscos a validar",
        text: "O que deve confirmar no terreno ou com um técnico.",
      },
    ],
    reference: "A é a referência. A ordem pode mudar com pequenas correções.",
    confidence: "Confiança alta, média ou baixa — sempre visível, sem esconder lacunas nem riscos.",
    note: "Valores de fontes da FAO. Devem ser validados com um técnico local.",
  },
  data: {
    label: "Os dados",
    title: "NASA, em linguagem de agricultor",
    lead: "Sem contas, sem instalações. Só o histórico que já foi medido por satélite e está disponível para todos.",
    items: [
      {
        name: "Chuva e temperatura",
        source: "NASA POWER",
        text: "Histórico mensal e período típico de início da época, estimados para células de cerca de 50 km.",
      },
      {
        name: "Humidade do solo",
        source: "NASA POWER",
        text: "Valor estimado comparado com o normal do local, numa escala de 0 a 1.",
      },
      {
        name: "Vegetação (NDVI)",
        source: "MODIS · ORNL DAAC",
        text: "Média do terreno com 250 m de resolução. Mostra se a vegetação está acima ou abaixo do habitual.",
      },
    ],
    note: "A chuva, a temperatura e a humidade do solo são estimativas para uma área de cerca de 50 km. A vegetação é uma média do seu terreno.",
  },
  limits: {
    label: "Limitações",
    title: "O que esta ferramenta não faz",
    lead: "Dizemos o que sabemos — e o que não sabemos. Nenhum aviso fica escondido nos resultados.",
    items: [
      "Esta ferramenta apoia a decisão do agricultor. Não substitui o conhecimento local nem os técnicos agrícolas.",
      "Não fazemos previsão do tempo. Mostramos padrões históricos e o que já aconteceu nesta época.",
      "A chuva, a temperatura e a humidade do solo são estimativas para uma área de cerca de 50 km. A vegetação é uma média do seu terreno.",
    ],
    footnote:
      "A localização do agricultor é informação pessoal. Não é guardada no browser sem consentimento explícito.",
  },
  cta: {
    title: "Comece pelo seu terreno.",
    text: "Basta marcar a área e responder a três perguntas. Não precisa de conta.",
    button: "Começar análise",
  },
  footer: {
    tagline:
      "Comparação de estratégias de rotação de culturas com dados da NASA para pequenos agricultores.",
    projectLabel: "Projeto",
    project: "NASA Space Apps Challenge 2026 · Desafio 7: Field Shift.",
    sourcesLabel: "Fontes de dados",
    sources: ["NASA POWER", "MODIS · ORNL DAAC", "FAO"],
    mapLabel: "Mapa",
    map: "EOxCloudless · Copernicus Sentinel-2, por EOX IT Services GmbH.",
    rights: "Protótipo de hackathon. Resultados indicativos, não substituem assistência técnica.",
  },
};

const en: LandingCopy = {
  htmlLang: "en",
  a11y: {
    skipToContent: "Skip to content",
  },
  toggle: {
    groupLabel: "Language",
    pt: "Português",
    en: "English",
  },
  nav: {
    label: "Main navigation",
    how: "How it works",
    data: "NASA data",
    limits: "Limitations",
    cta: "Start analysis",
  },
  hero: {
    eyebrow: "NASA Space Apps Challenge 2026 · Challenge 7 — Field Shift",
    title: "What to plant next,",
    titleAccent: "with NASA data.",
    lead: "Mark your land, tell us what you grow and what you want to improve. We compare three rotation strategies using historical rain, soil and vegetation data — so you can decide with more confidence.",
    primaryCta: "Start analysis",
    secondaryCta: "See how it works",
    note: "No weather forecasts. Only historical patterns and what has already happened this season.",
    figure: {
      rain: "Rainfall",
      moisture: "Soil moisture",
      vegetation: "Vegetation",
      caption: "Illustrative diagram — not a real plot of land",
      alt: "Diagram of farmland showing soil layers, contour lines and readings for rainfall, moisture and vegetation.",
    },
  },
  statement: {
    label: "The problem",
    title: "Rains that no longer arrive at the same time.",
    lead: "Soils that lose quality season after season. Farmers decide with experience and intuition, but without access to the decades of satellite data that already exist — and are free.",
    points: [
      {
        title: "Unpredictable rain",
        text: "The season starts later or fails. Without local history, it is hard to tell an exception from a pattern.",
      },
      {
        title: "Degrading soil",
        text: "Monocropping and erosion reduce organic matter and the soil's ability to hold water.",
      },
      {
        title: "Scattered information",
        text: "The data exists, but it sits in technical portals and satellite jargon. Field Shift translates it.",
      },
    ],
  },
  steps: {
    label: "How it works",
    title: "Three steps, no complications",
    lead: "You don't need to read satellite maps. You only need to know your land.",
    items: [
      {
        icon: "map",
        title: "Mark the land",
        text: "Tap the map or draw the outline. The area is calculated automatically in hectares.",
      },
      {
        icon: "form",
        title: "Describe the situation",
        text: "Current crop, irrigation access, soil type, goal and a horizon of one to three seasons.",
      },
      {
        icon: "compare",
        title: "Compare strategies",
        text: "Three options with scores, confidence and the five required points: why, evidence, benefits, gaps and risks.",
      },
    ],
  },
  strategies: {
    label: "What you get",
    title: "Three strategies. Five clear answers.",
    lead: "Strategy A is always the current rotation or the regional reference. B and C are alternatives calculated for your goal and horizon.",
    tabs: ["A", "B", "C"],
    cardTitle: "Current rotation (reference)",
    fields: [
      {
        name: "Why",
        text: "The reason behind the recommendation, in plain language.",
      },
      {
        name: "Evidence from data",
        text: "What rain, soil and vegetation show at that location.",
      },
      {
        name: "Benefits",
        text: "What can improve: water, erosion, yield or soil health.",
      },
      {
        name: "Information gaps",
        text: "What the data cannot answer.",
      },
      {
        name: "Risks to validate",
        text: "What should be checked on the ground or with an adviser.",
      },
    ],
    reference: "A is the reference. The order can change with small corrections.",
    confidence: "High, medium or low confidence — always visible, never hiding gaps or risks.",
    note: "Values from FAO sources. They should be validated with a local adviser.",
  },
  data: {
    label: "The data",
    title: "NASA, in a farmer's language",
    lead: "No accounts, no installs. Just the history already measured by satellite and available to everyone.",
    items: [
      {
        name: "Rain and temperature",
        source: "NASA POWER",
        text: "Monthly history and typical season start, estimated for cells of about 50 km.",
      },
      {
        name: "Soil moisture",
        source: "NASA POWER",
        text: "Estimated value compared with the local normal, on a scale of 0 to 1.",
      },
      {
        name: "Vegetation (NDVI)",
        source: "MODIS · ORNL DAAC",
        text: "Land average at 250 m resolution. Shows whether vegetation is above or below usual.",
      },
    ],
    note: "Rain, temperature and soil moisture are estimates for an area of about 50 km. Vegetation is an average for your land.",
  },
  limits: {
    label: "Limitations",
    title: "What this tool does not do",
    lead: "We say what we know — and what we don't. No warning is hidden inside the results.",
    items: [
      "This tool supports the farmer's decision. It does not replace local knowledge or agricultural advisers.",
      "We do not forecast the weather. We show historical patterns and what has already happened this season.",
      "Rain, temperature and soil moisture are estimates for an area of about 50 km. Vegetation is an average for your land.",
    ],
    footnote:
      "A farmer's location is personal information. It is not stored in the browser without explicit consent.",
  },
  cta: {
    title: "Start with your land.",
    text: "Just mark the area and answer three questions. No account needed.",
    button: "Start analysis",
  },
  footer: {
    tagline:
      "Comparing crop rotation strategies with NASA data for smallholder farmers.",
    projectLabel: "Project",
    project: "NASA Space Apps Challenge 2026 · Challenge 7: Field Shift.",
    sourcesLabel: "Data sources",
    sources: ["NASA POWER", "MODIS · ORNL DAAC", "FAO"],
    mapLabel: "Map",
    map: "EOxCloudless · Copernicus Sentinel-2, by EOX IT Services GmbH.",
    rights: "Hackathon prototype. Indicative results; they do not replace technical assistance.",
  },
};

export const copy: Record<Lang, LandingCopy> = { pt, en };
