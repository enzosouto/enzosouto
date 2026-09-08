/**
 * O CONTEÚDO DO CURRÍCULO — texto, e só texto.
 *
 * Nasceu como portfólio (sobre + projetos, sem canal de contato — ver
 * histórico do arquivo). Virou currículo completo: o texto abaixo parte do
 * PDF `Enzo_Souto_CV_Atualizado.pdf`, reescrito para leitura em tela — frase
 * curta, verbo na frente, sem a compressão de bullet de PDF — e ganhou um
 * canal de contato porque um currículo sem jeito de responder não cumpre o
 * que promete.
 *
 * BILÍNGUE: `conteudo(idioma)` devolve o pacote inteiro no idioma pedido.
 * O que NÃO muda entre os dois (nome próprio de empresa, url, arquivo de
 * logo, e-mail, coordenadas do enxame de hexágonos) mora FORA da função,
 * uma vez só — duplicar isso nos dois idiomas é o tipo de cópia que
 * desalinha sozinha na primeira alteração (muda o `x` do hexágono do
 * português e esquece o inglês). Só o TEXTO — o que uma pessoa lê — vive
 * dobrado, um bloco PT e um EN com a mesma forma.
 */

export type Idioma = 'pt' | 'en'

/** `icone` é o selo branco (fundo claro, traço preto) — lê bem sobre o
 *  canvas escuro. `iconeClaro` é o mesmo selo invertido (fundo preto, traço
 *  branco) — é o que lê no tema claro; o branco sobre um canvas quase
 *  branco só desaparece. */
export type Rede = { nome: string; url: string; icone: string; iconeClaro: string }

/** GitHub/LinkedIn: nome e link não mudam com o idioma. */
export const REDES: Rede[] = [
  { nome: 'GitHub', url: 'https://github.com/enzosouto', icone: '/redes/github.png', iconeClaro: '/redes/github-preto.png' },
  { nome: 'LinkedIn', url: 'https://www.linkedin.com/in/enzosd/', icone: '/redes/linkedin.png', iconeClaro: '/redes/linkedin-preto.png' },
]

/* O ENXAME DE LOGOS que flutua ao lado das habilidades — `x`/`y` em
   porcentagem do retângulo do enxame (ver `HexFerramentas.vue`), `tam` em
   pixels, `dur`/`atraso` em segundos. Números escritos à mão, não sorteados:
   a mesma razão do `AcqBolhas` — determinístico, e os atrasos negativos
   fazem cada hexágono já nascer no meio do próprio ciclo, pra não subirem
   todos juntos na primeira dobra. `nome` não aparece em tela (o `alt` do
   `<img>` é vazio, decoração pura) — por isso não precisa de versão em
   inglês. */
export type Ferramenta = { nome: string; arquivo: string; x: number; y: number; tam: number; dur: number; atraso: number }

export const FERRAMENTAS: Ferramenta[] = [
  { nome: 'Microsoft Azure', arquivo: 'azure.png', x: 16, y: 1, tam: 64, dur: 13, atraso: -2 },
  { nome: 'Databricks', arquivo: 'databricks.png', x: 62, y: 0, tam: 58, dur: 16, atraso: -7 },
  { nome: 'DBeaver', arquivo: 'dbeaver.png', x: 38, y: 13, tam: 72, dur: 11, atraso: -4 },
  { nome: 'Figma', arquivo: 'figma.png', x: 2, y: 24, tam: 60, dur: 15, atraso: -9 },
  { nome: 'GitHub', arquivo: 'github.png', x: 68, y: 21, tam: 66, dur: 12, atraso: -1 },
  { nome: 'PostgreSQL', arquivo: 'postgres.png', x: 32, y: 33, tam: 76, dur: 17, atraso: -11 },
  { nome: 'Postman', arquivo: 'postman.png', x: 60, y: 44, tam: 56, dur: 14, atraso: -6 },
  { nome: 'Power BI', arquivo: 'powerbi.png', x: 8, y: 47, tam: 68, dur: 18, atraso: -3 },
  { nome: 'Python', arquivo: 'python.png', x: 42, y: 57, tam: 74, dur: 10, atraso: -8 },
  { nome: 'SQL', arquivo: 'sql.png', x: 72, y: 61, tam: 58, dur: 19, atraso: -13 },
  { nome: 'VS Code', arquivo: 'vscode.png', x: 24, y: 73, tam: 64, dur: 13.5, atraso: -5 },
  { nome: 'WireGuard', arquivo: 'wireguard.png', x: 54, y: 84, tam: 60, dur: 15.5, atraso: -10 },
]

/** Currículo sem canal de resposta é o mesmo defeito que a proposta Pimenta
 *  evita com WhatsApp — aqui o canal é e-mail e telefone. Não muda com o
 *  idioma. */
export const CONTATO = {
  email: 'enzo.ferrari.sd@gmail.com',
  telefone: '+55 (61) 98100-7329',
  local: 'Asa Sul, Brasília - DF, Brazil',
}

export type Atividade = { title: string; desc: string }

/** `w`/`h` são as dimensões naturais do arquivo — ver `RetratoFragmentado.vue`
 *  (usado com `sem-moldura` pros selos), que usa esse par pra recortar o
 *  logo em `cover` sem esticar a proporção. Serve tanto pro logo de empresa
 *  quanto pro de instituição de ensino. */
export type LogoCargo = { arquivo: string; w: number; h: number }

export type Cargo = {
  id: string
  empresa: string
  cargo: string
  periodo: string
  logo: LogoCargo
  atual?: boolean
  atividades: Atividade[]
}

export type GrupoHabilidade = { nome: string; itens: string[] }

export type Academica = {
  id: string
  titulo: string
  instituicao: string
  periodo: string
  desc: string
  logo: LogoCargo
  atual?: boolean
}

export type Projeto = {
  id: string
  titulo: string
  tag: string
  url: string
  destaque?: boolean
  descricao: string
}

/* O PERCURSO, na ordem em que aconteceu — a mesma ordem em que os cartões de
   EXPERIENCIA aparecem, só que de trás para frente lá (mais recente primeiro,
   como currículo se lê) e aqui na ordem cronológica normal, porque um
   percurso anda para frente. Rótulo curto: é etapa de AcqFluxo, não frase.
   `cargoId` é o `id` do cartão em EXPERIENCIA.cargos — é pra onde o clique
   na etapa leva. Nome de empresa é nome próprio — não muda com o idioma. */
export const PERCURSO = [
  { label: 'DF Precatórios', cargoId: 'df-precatorios' },
  { label: 'BRB Card', cargoId: 'brbcard' },
  { label: 'SECOM', cargoId: 'secom' },
  { label: 'Oliva e Souza', cargoId: 'oliva-e-souza' },
] as const

/* LOGOS por cargo/instituição — arquivo e dimensões não mudam com o idioma. */
const LOGO_OLIVA: LogoCargo = { arquivo: '/empresas/olivaesouza.jpg', w: 200, h: 200 }
const LOGO_SECOM: LogoCargo = { arquivo: '/empresas/secom.png', w: 443, h: 389 }
const LOGO_BRBCARD: LogoCargo = { arquivo: '/empresas/brbcard.png', w: 447, h: 447 }
const LOGO_DFPRECATORIOS: LogoCargo = { arquivo: '/empresas/dfprecatorios.png', w: 506, h: 395 }
const LOGO_FIAP: LogoCargo = { arquivo: '/instituicoes/fiap.png', w: 1558, h: 477 }
const LOGO_UNICEUB: LogoCargo = { arquivo: '/instituicoes/uniceub.png', w: 385, h: 225 }

/* PROJETOS — id/url/destaque não mudam; título é nome próprio do projeto. */
const PROJETOS_URLS = {
  tribuna: 'https://tribuna-web.vercel.app',
  skitz: 'https://skitz-stats-archive.vercel.app',
  pokedex: 'https://pokedex-8bit.vercel.app',
  daplug: 'https://9daplug.vercel.app',
  radiator: 'https://radiator-springs-racing-archive.vercel.app/#/',
  corinthians: 'https://corinthians-almanaque.vercel.app',
}

export function conteudo(idioma: Idioma) {
  const pt = idioma === 'pt'

  const NAV = pt
    ? [
        { id: 'sobre', rotulo: 'sobre' },
        { id: 'experiencia', rotulo: 'experiência' },
        { id: 'habilidades', rotulo: 'habilidades' },
        { id: 'formacao', rotulo: 'formação' },
        { id: 'projetos', rotulo: 'projetos' },
      ]
    : [
        { id: 'sobre', rotulo: 'about' },
        { id: 'experiencia', rotulo: 'experience' },
        { id: 'habilidades', rotulo: 'skills' },
        { id: 'formacao', rotulo: 'education' },
        { id: 'projetos', rotulo: 'projects' },
      ]

  const HERO = pt
    ? {
        eyebrow: 'currículo · dados & tecnologia',
        titulo: 'Enzo Souto',
        papel: 'Analista de Dados',
        lead: 'Transformo dado bruto em decisão: extração, ETL, dashboards em Power BI e automação em Python. Tudo com a mira de quem já testou software e desenhou interface antes de virar analista.',
      }
    : {
        eyebrow: 'résumé · data & technology',
        titulo: 'Enzo Souto',
        papel: 'Data Analyst',
        lead: 'I turn raw data into decisions: extraction, ETL, Power BI dashboards and Python automation. All with the eye of someone who tested software and designed interfaces before becoming an analyst.',
      }

  const SOBRE = pt
    ? {
        label: 'sobre',
        titulo: 'Quem faz',
        paragrafos: [
          'Analista de Dados formado em Ciência da Computação (UniCEUB), com passagem por quatro casas bem diferentes entre si: suporte de infraestrutura, QA de banco, comunicação da Presidência da República e, hoje, um escritório de advocacia. O fio que atravessa todas é o mesmo: pegar dado espalhado, arrumar a casa (ETL, PostgreSQL, SQL) e devolver em Power BI ou automação Python algo que alguém usa para decidir.',
          'A passagem por Testes de Software e por UX/UI não é currículo enfeitado: é a razão de um dashboard seu ser cobrado pelo requisito antes de ser bonito, e desenhado para quem vai abrir às 8h da manhã, não para quem construiu. Os projetos abaixo são pessoais, fora do trabalho de cliente.',
        ],
      }
    : {
        label: 'about',
        titulo: 'What I do',
        paragrafos: [
          "Data Analyst with a degree in Computer Science (UniCEUB), with a track record across four very different houses: infrastructure support, banking QA, communications for the Presidency of Brazil and, today, a law firm. The thread running through all of them is the same: take scattered data, put the house in order (ETL, PostgreSQL, SQL) and hand back, in Power BI or a Python automation, something someone uses to decide.",
          "The time spent in Software Testing and UX/UI isn't a resume decoration: it's the reason a dashboard of mine gets checked against the requirement before it gets checked for looking nice, and is designed for whoever opens it at 8am, not for whoever built it. The projects below are personal, outside of client work.",
        ],
      }

  const EXPERIENCIA = pt
    ? {
        label: 'experiência',
        titulo: 'Trajetória profissional',
        lead: 'Do suporte N1 ao Power BI: quatro casas, uma linha só. Dado bruto virando algo que alguém usa para decidir.',
        cargos: [
          {
            id: 'oliva-e-souza',
            empresa: 'Oliva e Souza Advogados',
            cargo: 'Analista de Dados',
            periodo: 'mar 2026 - atual',
            logo: LOGO_OLIVA,
            atual: true,
            atividades: [
              { title: 'ETL de ponta a ponta', desc: 'Construção e manutenção dos processos que integram, transformam e disponibilizam dado de fontes e bancos diferentes.' },
              { title: 'Dashboards em Power BI', desc: 'Desenvolvimento e manutenção de indicadores e painéis para o dia a dia do escritório.' },
              { title: 'PostgreSQL & SQL', desc: 'Consulta, manipulação e integração de dados direto na fonte, com apoio do DBeaver.' },
              { title: 'Automação em Python', desc: 'Scripts para tirar rotina operacional repetitiva da mão de gente.' },
              { title: 'Acesso e nuvem', desc: 'WireGuard para acesso seguro a ambientes internos; operação em Microsoft Azure.' },
            ],
          },
          {
            id: 'secom',
            empresa: 'SECOM Presidência da República',
            cargo: 'Analista de Dados e Desenvolvimento',
            periodo: 'dez 2024 - mar 2026',
            logo: LOGO_SECOM,
            atividades: [
              { title: 'Dashboards de decisão', desc: 'Visualizações que apoiam decisão no ritmo de comunicação da Presidência.' },
              { title: 'Bases tratadas', desc: 'Tratamento e organização de bases antes de qualquer painel abrir.' },
              { title: 'APIs em produção', desc: 'Integração e consumo de APIs para coleta de dado em rotina.' },
              { title: 'Automação de análise', desc: 'Rotinas automatizadas onde antes havia planilha refeita à mão.' },
            ],
          },
          {
            id: 'brbcard',
            empresa: 'BRBCARD Banco de Brasília',
            cargo: 'Analista de Testes / QA',
            periodo: 'set 2022 - set 2024',
            logo: LOGO_BRBCARD,
            atividades: [
              { title: 'Testes funcionais e de desempenho', desc: 'Execução de testes funcionais, exploratórios e de desempenho sobre sistema em produção de banco.' },
              { title: 'Requisitos e histórias', desc: 'Análise de requisitos e histórias de usuário antes do código existir.' },
              { title: 'APIs e automação', desc: 'Testes de API e automação de testes com Postman e Jenkins.' },
              { title: 'Mobile e UX lado a lado', desc: 'Testes mobile em Android Studio, em conjunto direto com equipes de UX/UI.' },
            ],
          },
          {
            id: 'df-precatorios',
            empresa: 'DF Precatórios',
            cargo: 'Suporte de Infraestrutura N1',
            periodo: '',
            logo: LOGO_DFPRECATORIOS,
            atividades: [
              { title: 'Hardware e software', desc: 'Suporte técnico de primeiro nível, instalação e configuração de sistemas.' },
              { title: 'Ambientes Windows', desc: 'Administração de ambientes Windows e monitoramento com suporte remoto.' },
            ],
          },
        ] satisfies Cargo[],
      }
    : {
        label: 'experience',
        titulo: 'Professional experience',
        lead: 'From tier-1 support to Power BI: four houses, one thread. Raw data turning into something someone uses to decide.',
        cargos: [
          {
            id: 'oliva-e-souza',
            empresa: 'Oliva e Souza Advogados',
            cargo: 'Data Analyst',
            periodo: 'Mar 2026 - present',
            logo: LOGO_OLIVA,
            atual: true,
            atividades: [
              { title: 'End-to-end ETL', desc: 'Building and maintaining the processes that integrate, transform and make data available from different sources and databases.' },
              { title: 'Power BI dashboards', desc: 'Development and maintenance of indicators and panels for the firm’s day to day.' },
              { title: 'PostgreSQL & SQL', desc: 'Querying, handling and integrating data straight at the source, with DBeaver.' },
              { title: 'Python automation', desc: 'Scripts to take repetitive operational routine out of people’s hands.' },
              { title: 'Access & cloud', desc: 'WireGuard for secure access to internal environments; operation on Microsoft Azure.' },
            ],
          },
          {
            id: 'secom',
            empresa: 'SECOM – Office of the Presidency of Brazil',
            cargo: 'Data Analyst and Development',
            periodo: 'Dec 2024 - Mar 2026',
            logo: LOGO_SECOM,
            atividades: [
              { title: 'Decision dashboards', desc: 'Visualizations that support decision-making at the pace of Presidential communications.' },
              { title: 'Data cleanup', desc: 'Treatment and organization of databases before any panel opens.' },
              { title: 'APIs in production', desc: 'Integration and consumption of APIs for routine data collection.' },
              { title: 'Analysis automation', desc: 'Automated routines where a manually-redone spreadsheet used to be.' },
            ],
          },
          {
            id: 'brbcard',
            empresa: 'BRBCARD – Bank of Brasília',
            cargo: 'QA / Test Analyst',
            periodo: 'Sep 2022 - Sep 2024',
            logo: LOGO_BRBCARD,
            atividades: [
              { title: 'Functional & performance testing', desc: 'Execution of functional, exploratory and performance tests on a bank’s production system.' },
              { title: 'Requirements & stories', desc: 'Analysis of requirements and user stories before the code exists.' },
              { title: 'API testing & automation', desc: 'API testing and test automation with Postman and Jenkins.' },
              { title: 'Mobile & UX side by side', desc: 'Mobile testing in Android Studio, working directly alongside UX/UI teams.' },
            ],
          },
          {
            id: 'df-precatorios',
            empresa: 'DF Precatórios',
            cargo: 'Tier-1 Infrastructure Support',
            periodo: '',
            logo: LOGO_DFPRECATORIOS,
            atividades: [
              { title: 'Hardware & software', desc: 'Tier-1 technical support, installation and configuration of systems.' },
              { title: 'Windows environments', desc: 'Administration of Windows environments and monitoring with remote support.' },
            ],
          },
        ] satisfies Cargo[],
      }

  const HABILIDADES = pt
    ? {
        label: 'habilidades',
        titulo: 'Caixa de ferramentas',
        lead: 'Agrupadas pelo problema que resolvem, não em ordem alfabética.',
        grupos: [
          { nome: 'Dados & BI', itens: ['Power BI', 'SQL', 'ETL / ELT', 'Análise de dados', 'Visualização de dados', 'Integração de dados', 'APIs'] },
          { nome: 'Programação & automação', itens: ['Python', 'Scripts de automação'] },
          { nome: 'Bancos & plataformas', itens: ['PostgreSQL', 'MySQL', 'Databricks', 'Microsoft Azure', 'DBeaver'] },
          { nome: 'Infraestrutura & ferramentas', itens: ['WireGuard', 'VS Code', 'Git / GitHub'] },
          { nome: 'QA & produto', itens: ['Testes de software (QA)', 'UX/UI Design', 'Figma', 'Postman'] },
        ] satisfies GrupoHabilidade[],
      }
    : {
        label: 'skills',
        titulo: 'Toolbox',
        lead: 'Grouped by the problem they solve, not alphabetically.',
        grupos: [
          { nome: 'Data & BI', itens: ['Power BI', 'SQL', 'ETL / ELT', 'Data analysis', 'Data visualization', 'Data integration', 'APIs'] },
          { nome: 'Programming & automation', itens: ['Python', 'Automation scripts'] },
          { nome: 'Databases & platforms', itens: ['PostgreSQL', 'MySQL', 'Databricks', 'Microsoft Azure', 'DBeaver'] },
          { nome: 'Infrastructure & tools', itens: ['WireGuard', 'VS Code', 'Git / GitHub'] },
          { nome: 'QA & product', itens: ['Software testing (QA)', 'UX/UI Design', 'Figma', 'Postman'] },
        ] satisfies GrupoHabilidade[],
      }

  const FORMACAO = pt
    ? {
        label: 'formação',
        titulo: 'Formação e certificações',
        academicas: [
          {
            id: 'fiap-mba',
            titulo: 'MBA em Engenharia de Dados',
            instituicao: 'FIAP',
            periodo: 'ago 2026 - atual',
            desc: 'Pós-graduação em andamento, aprofundando engenharia de dados sobre a base que o dia a dia de analista já constrói.',
            logo: LOGO_FIAP,
            atual: true,
          },
          {
            id: 'uniceub-cc',
            titulo: 'Ciência da Computação',
            instituicao: 'UniCEUB',
            periodo: '2021 - 2025',
            desc: 'Graduação com foco em tecnologia, desenvolvimento de software e análise de dados.',
            logo: LOGO_UNICEUB,
          },
        ] satisfies Academica[],
        certificacoes: [
          { titulo: 'Google UX Design Certificate', instituicao: 'Google · Coursera', ano: '2025' },
          { titulo: 'Figma Application', instituicao: 'EBAC', ano: '2025' },
          { titulo: 'User Experience', instituicao: 'FIAP', ano: '2024' },
        ],
        idiomas: [
          { idioma: 'Português', nivel: 'Nativo' },
          { idioma: 'Inglês', nivel: 'Fluente' },
          { idioma: 'Espanhol', nivel: 'Avançado' },
        ],
      }
    : {
        label: 'education',
        titulo: 'Education & certifications',
        academicas: [
          {
            id: 'fiap-mba',
            titulo: 'MBA in Data Engineering',
            instituicao: 'FIAP',
            periodo: 'Aug 2026 - present',
            desc: "Postgraduate degree in progress, going deeper into data engineering on top of what the analyst day-to-day already builds.",
            logo: LOGO_FIAP,
            atual: true,
          },
          {
            id: 'uniceub-cc',
            titulo: 'Computer Science',
            instituicao: 'UniCEUB',
            periodo: '2021 - 2025',
            desc: 'Bachelor’s degree focused on technology, software development and data analysis.',
            logo: LOGO_UNICEUB,
          },
        ] satisfies Academica[],
        certificacoes: [
          { titulo: 'Google UX Design Certificate', instituicao: 'Google · Coursera', ano: '2025' },
          { titulo: 'Figma Application', instituicao: 'EBAC', ano: '2025' },
          { titulo: 'User Experience', instituicao: 'FIAP', ano: '2024' },
        ],
        idiomas: [
          { idioma: 'Portuguese', nivel: 'Native' },
          { idioma: 'English', nivel: 'Fluent' },
          { idioma: 'Spanish', nivel: 'Advanced' },
        ],
      }

  const PROJETOS: Projeto[] = pt
    ? [
        {
          id: 'tribuna',
          titulo: 'Tribuna',
          tag: 'projeto pessoal',
          url: PROJETOS_URLS.tribuna,
          destaque: true,
          descricao: 'Rede social de futebol: descubra partidas, avalie jogos, escreva reviews, siga pessoas, crie listas e acompanhe sua Watchlist (partidas futuras) e Diário (partidas assistidas).',
        },
        {
          id: 'skitz-stats-archive',
          titulo: 'Skitz Stats Archive',
          tag: 'projeto pessoal',
          url: PROJETOS_URLS.skitz,
          descricao: 'Um centro pessoal de inteligência e histórico competitivo de CS2, construído sobre a FACEIT Data API. Não é um clone do perfil da FACEIT: é um arquivo vivo que acompanha a evolução do jogador partida a partida, com sincronização automática, gráficos de evolução e insights de estilo de jogo gerados dinamicamente.',
        },
        {
          id: 'pokedex',
          titulo: 'Pokédex 8-bit',
          tag: 'projeto pessoal',
          url: PROJETOS_URLS.pokedex,
          descricao: 'Pokédex interativa em estilo 8-bit/pixel art, cobrindo os Pokémon #001–#493 (Gerações I a IV). SPA estática, sem backend, sem serviços pagos. Feita para estudo de Vue 3, TypeScript, consumo de API e persistência local com IndexedDB.',
        },
        {
          id: '9daplug',
          titulo: '9DAPLUG',
          tag: 'projeto pessoal',
          url: PROJETOS_URLS.daplug,
          descricao: 'Landing page pessoal de estatísticas da panelinha de CS, com visual escuro, oriental e minimalista. Puxa dados reais da Faceit, permite ordenar e comparar jogadores por Elo e desempenho, além de contar com cadastro manual protegido e um card especial de homenagem.',
        },
        {
          id: 'radiator-springs',
          titulo: 'Radiator Springs Racing Archive',
          tag: 'projeto pessoal',
          url: PROJETOS_URLS.radiator,
          descricao: 'Arquivo digital interativo e feito por fãs sobre o universo de Carros, com estética de automobilismo, almanaque e garagem. Reúne corredores, estatísticas, corridas, pistas, rankings, comparações e uma linha histórica, com insights gerados a partir dos dados. Projeto não-oficial, criado para estudo e portfólio.',
        },
        {
          id: 'corinthians-almanaque',
          titulo: 'Corinthians Almanaque',
          tag: 'projeto pessoal',
          url: PROJETOS_URLS.corinthians,
          descricao: 'Álbum digital interativo sobre a história do Corinthians, com estética de almanaque histórico de futebol. Reúne temporadas, títulos, ídolos e grandes momentos em uma experiência editorial sombria, com animações sutis e design mobile-first. Site estático, gratuito e sem backend.',
        },
      ]
    : [
        {
          id: 'tribuna',
          titulo: 'Tribuna',
          tag: 'personal project',
          url: PROJETOS_URLS.tribuna,
          destaque: true,
          descricao: 'A social network for football: discover matches, rate games, write reviews, follow people, build lists, and keep a Watchlist (upcoming matches) and a Diary (matches watched).',
        },
        {
          id: 'skitz-stats-archive',
          titulo: 'Skitz Stats Archive',
          tag: 'personal project',
          url: PROJETOS_URLS.skitz,
          descricao: 'A personal competitive-intelligence hub for CS2, built on the FACEIT Data API. Not a clone of the FACEIT profile: it’s a living archive that tracks a player’s evolution match by match, with automatic syncing, progress charts and dynamically generated playstyle insights.',
        },
        {
          id: 'pokedex',
          titulo: 'Pokédex 8-bit',
          tag: 'personal project',
          url: PROJETOS_URLS.pokedex,
          descricao: 'An interactive Pokédex in 8-bit/pixel-art style, covering Pokémon #001–#493 (Generations I to IV). A static SPA, no backend, no paid services — built to practice Vue 3, TypeScript, API consumption and local persistence with IndexedDB.',
        },
        {
          id: '9daplug',
          titulo: '9DAPLUG',
          tag: 'personal project',
          url: PROJETOS_URLS.daplug,
          descricao: 'A personal landing page of stats for a small CS friend group, dark, minimalist and East-Asian-inspired in style. Pulls real Faceit data, lets you sort and compare players by Elo and performance, plus protected manual sign-up and a special tribute card.',
        },
        {
          id: 'radiator-springs',
          titulo: 'Radiator Springs Racing Archive',
          tag: 'personal project',
          url: PROJETOS_URLS.radiator,
          descricao: 'An interactive, fan-made digital archive about the Cars universe, styled like motorsport memorabilia — almanac and garage aesthetic. Brings together racers, stats, races, tracks, rankings, comparisons and a historical timeline, with data-driven insights. Unofficial project, built for study and portfolio.',
        },
        {
          id: 'corinthians-almanaque',
          titulo: 'Corinthians Almanaque',
          tag: 'personal project',
          url: PROJETOS_URLS.corinthians,
          descricao: 'An interactive digital album about the history of Corinthians, styled like a historic football almanac. Brings together seasons, titles, idols and great moments in a dark editorial experience, with subtle animations and mobile-first design. Static, free, backend-less site.',
        },
      ]

  return { NAV, HERO, SOBRE, PERCURSO, EXPERIENCIA, HABILIDADES, FORMACAO, PROJETOS }
}
