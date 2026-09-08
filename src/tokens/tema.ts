/**
 * O NÚCLEO DO SISTEMA DE TEMAS. Zero imports — é a base de tudo.
 *
 * Um TEMA não é uma paleta: é o conjunto fechado de papéis que todo tema é
 * obrigado a fornecer. Uma FAMÍLIA declara as rampas e os dois esquemas; um tema
 * é a projeção de uma família num esquema.
 *
 * A doutrina de cor mora aqui como NÚMERO, não como texto solto em documento:
 * `origem.<rampa>.matiz`. Hoje só existe a família `acquario`, mas o tipo já é
 * de biblioteca — nada aqui assume "uma família só" além do arquivo que a
 * declara (Task 3). O que a verificação cobra não é "ser frio" ou "ser
 * quente": é COERÊNCIA — cada degrau com croma relevante precisa ficar a ±8°
 * do matiz que a família declarou para aquela rampa.
 */

export type Esquema = 'escuro' | 'claro'
export type Hex = string

/**
 * A escada de luminosidade é UMA SÓ, compartilhada por todas as rampas de uma
 * família; só matiz e croma variam. É isso que torna os índices de papel
 * comparáveis entre rampas e o par claro/escuro barato de calcular.
 *
 * Os degraus 75 e 350 existem por medida, não por completude decorativa:
 * `dimmer` precisa cair entre 3,0 e 4,5:1 contra o papel (assertiva D), e sem
 * um degrau nessa faixa fina o esquema claro pularia de contraste baixo demais
 * para alto demais sem nada no meio.
 */
export const DEGRAUS_NEUTRO = [
  0, 50, 75, 100, 200, 300, 350, 400, 500, 600, 700, 800, 900, 950, 1000,
] as const
export const DEGRAUS_COR = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

export type DegrauNeutro = (typeof DEGRAUS_NEUTRO)[number]
export type DegrauCor = (typeof DEGRAUS_COR)[number]

/** Referência a um degrau de rampa, ou à voltagem. */
export type Ref = string // 'neutro.700' | 'acento.400' | 'acento.voltagem' | 'positivo.400'

export const PAPEIS = [
  // superfície
  'canvas', 'card', 'well', 'soft', 'hair',
  // texto
  'ink', 'dim', 'dimmer',
  // marca — ação e acento são o MESMO ciano na ACQUARIO (spec §2.4); a
  // separação entre os dois é de FORMA (pílula cheia vs. ponto/régua/anel),
  // nunca de matiz, e por isso os dois podem apontar para a mesma rampa.
  'accent', 'accent-text', 'accent-bg', 'action',
  // tinta sobre preenchimento — o que hoje é assumido pela polaridade
  'on-action', 'on-accent', 'on-accent-bg',
  // instrumento (fora do tema: igual nos dois esquemas). `on-bench` é a tinta
  // sobre o PAINEL da bancada especificamente — texto que sente na pele o
  // mesmo fundo cinza-médio fixo, não o texto de legenda que respira sobre o
  // canvas/card do livro (esse lê `dim`/`dimmer`, que já variam por esquema).
  'bench', 'on-bench',
  // sinal de valor — entrada/confirmação e saída/erro, e a tinta de cada um.
  // Par que a risilva não tinha: produto sem fluxo de valor não precisa dele.
  'positivo', 'negativo', 'on-positivo', 'on-negativo',
  // a mesma separação que `accent`/`accent-text` já tem: `positivo`/`negativo`
  // são a cor de ENTRADA/ÁREA (ponto, tag `tinted`, ícone); quando o sinal
  // precisa ser LIDO como texto corrido — inclusive sobre o próprio tingimento
  // de 16% que `AcqTag` cria — o degrau muda para o que a auditoria de página
  // mediu como o primeiro a cruzar 4,5:1 nos dois fundos (`card` e `canvas`).
  // Achado pela auditoria de dois temas de 2026-08-13, não pela spec original.
  'positivo-text', 'negativo-text',
] as const
export type Papel = (typeof PAPEIS)[number]

export interface EsquemaDeTema {
  papeis: Record<Papel, Ref>
  /**
   * O cartão precisa de régua de 1px? Medido no espelho: `ΔL(card, canvas)`
   * fica bem abaixo do que separa superfície por valor sozinho nos esquemas
   * claros. Elevação por mudança de valor NÃO EXISTE no papel — a régua é o
   * mecanismo; o valor é reforço.
   */
  cartaoComRegua: boolean
  /** Multiplicador da opacidade da sombra. Sombra preta sobre fundo quase preto
   *  é invisível; a força compensa sem inventar valor por componente. */
  sombra: { forca: number }
  /** Força da lavagem de hover (`color-mix(ink N%, transparent)`). */
  lavagem: { forca: string }
}

export interface FamiliaDeTema {
  id: string
  nome: string
  descricao: string
  /** A receita. Documenta a intenção e alimenta o gerador; os hex das rampas é
   *  que são normativos. A assertiva de matiz liga os dois. */
  origem: {
    neutro: { matiz: number; croma: number }
    acento: { matiz: number; croma: number }
    positivo: { matiz: number; croma: number }
    negativo: { matiz: number; croma: number }
  }
  rampas: {
    neutro: Record<string, Hex>
    acento: Record<string, Hex>
    positivo: Record<string, Hex>
    negativo: Record<string, Hex>
  }
  /** O sinal de plena saturação, FORA da rampa de propósito — o cusp de um
   *  matiz raramente serve aos dois polos. Um por esquema. */
  voltagem: Record<Esquema, Hex>
  /** OS DOIS esquemas são obrigatórios. Um app precisa de claro E escuro da
   *  MESMA identidade, e o schema não permite entregar só um. */
  esquemas: Record<Esquema, EsquemaDeTema>
}

/** Um tema é a projeção de uma família num esquema. Não é um arquivo. */
export interface Tema {
  id: string
  familia: FamiliaDeTema
  esquema: Esquema
  /** O id do irmão. Sempre presente, sempre válido — é o que permite ao seletor
   *  oferecer "trocar o esquema" sem sair da identidade. */
  par: string
}

export function temasDaFamilia(f: FamiliaDeTema): [Tema, Tema] {
  const escuro: Tema = { id: `${f.id}-escuro`, familia: f, esquema: 'escuro', par: `${f.id}-claro` }
  const claro: Tema = { id: `${f.id}-claro`, familia: f, esquema: 'claro', par: `${f.id}-escuro` }
  return [escuro, claro]
}

// ---------------------------------------------------------------------------
// Resolução
// ---------------------------------------------------------------------------

/** Resolve uma `Ref` no hex correspondente da família. Falha alto. */
export function resolverRef(f: FamiliaDeTema, esquema: Esquema, ref: Ref): Hex {
  const [rampa, degrau] = ref.split('.')
  if (degrau === 'voltagem') {
    const v = f.voltagem[esquema]
    if (!v) throw new Error(`tema ${f.id}: voltagem ausente no esquema ${esquema}`)
    return v
  }
  const r = (f.rampas as Record<string, Record<string, Hex>>)[rampa]
  if (!r) throw new Error(`tema ${f.id}: rampa "${rampa}" não existe (ref "${ref}")`)
  const hex = r[degrau]
  if (!hex) throw new Error(`tema ${f.id}: degrau "${degrau}" não existe em "${rampa}"`)
  return hex
}

export type TemaResolvido = Record<Papel, Hex>

export function resolverTema(t: Tema): TemaResolvido {
  const e = t.familia.esquemas[t.esquema]
  const out = {} as TemaResolvido
  for (const p of PAPEIS) {
    const ref = e.papeis[p]
    if (!ref) throw new Error(`tema ${t.id}: papel "${p}" não declarado`)
    out[p] = resolverRef(t.familia, t.esquema, ref)
  }
  return out
}

// ---------------------------------------------------------------------------
// Medida. A mesma matemática que os componentes de instrumento do livro usam —
// e agora ela mora num lugar só, em vez de existir no componente e nos
// scripts de verificação.
// ---------------------------------------------------------------------------

const canal = (v: number) => {
  const s = v / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

export function rgb(hex: Hex): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

export function luminancia(hex: Hex): number {
  const [r, g, b] = rgb(hex).map(canal)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Razão de contraste WCAG 2.1. Para legibilidade de TEXTO, que é o que a norma cobra. */
export function contraste(a: Hex, b: Hex): number {
  const [hi, lo] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// --- OKLab / OKLCH ---------------------------------------------------------
// Necessário porque a fórmula da WCAG NÃO é perceptualmente uniforme para
// vizinhos próximos: o mesmo passo perceptual entre card e canvas lê razões de
// contraste bem diferentes no escuro e no claro. Separação de superfície usa
// ΔL; texto usa WCAG.

export function oklab(hex: Hex): [number, number, number] {
  const [r, g, b] = rgb(hex).map(canal)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

export function oklch(hex: Hex): { l: number; c: number; h: number } {
  const [L, a, b] = oklab(hex)
  const c = Math.sqrt(a * a + b * b)
  let h = (Math.atan2(b, a) * 180) / Math.PI
  if (h < 0) h += 360
  return { l: L, c, h }
}

/** Diferença de luminosidade percebida. É o que mede separação de superfície. */
export function dL(a: Hex, b: Hex): number {
  return Math.abs(oklab(a)[0] - oklab(b)[0])
}

/** Distância perceptual em OKLab. Mede se duas cores são confundíveis. */
export function dEok(a: Hex, b: Hex): number {
  const [l1, a1, b1] = oklab(a)
  const [l2, a2, b2] = oklab(b)
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2)
}

/** Distância angular de matiz, em graus, pelo caminho curto. */
export function dMatiz(a: number, b: number): number {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

// ---------------------------------------------------------------------------
// Pisos do sistema.
// ---------------------------------------------------------------------------

/**
 * Pisos herdados do espelho — os mesmos mínimos de separação de superfície e
 * de leitura de instrumento, agora a meta que toda família desta biblioteca
 * (hoje só `acquario`) tem de cumprir. Dois entram diferentes do espelho, e os
 * dois têm motivo escrito na spec:
 *
 * - `dL:action/accent-text` substitui o antigo piso de distância de MATIZ
 *   entre ação e acento. Na risilva as duas cores são diferentes (verde e
 *   laranja) — inconfundíveis por natureza, e o piso cobrava isso. Na ACQUARIO
 *   as duas são o MESMO ciano (spec §2.4): a separação passa a ser de FORMA, e
 *   o piso que sobrevive é de LUMINOSIDADE — o botão não pode ficar claro
 *   demais perto de um link do mesmo tom a ponto de os dois se confundirem.
 * - `croma:minimo-para-cobrar-matiz` existe porque cinza quase puro não tem
 *   matiz estável: um degrau de croma baixíssimo pode medir qualquer ângulo
 *   por ruído de arredondamento. Abaixo deste croma a assertiva de matiz (E)
 *   simplesmente não se aplica — não é folga, é a métrica não fazer sentido.
 */
export const pisosDeSistema = {
  'dL:hair/canvas': 0.11,
  'dL:soft/card': 0.03,
  'dL:well/canvas': 0.02,
  'dL:card/canvas': 0.01,
  'ratio:bench/canvas': 1.5,
  'dL:action/accent-text': 0.08,
  'matiz:±graus': 8,
  'croma:minimo-para-cobrar-matiz': 0.01,
} as const

/** A escada de texto, do mais apagado ao mais forte. O painel de acessibilidade
 *  sobe UM degrau nela — é o que faz "mais contraste" ser relativo em vez de
 *  absoluto. */
export const escadaDeTexto = ['dimmer', 'dim', 'ink'] as const
