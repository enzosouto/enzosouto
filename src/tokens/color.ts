/**
 * TOKENS DE COR — DERIVADOS do tema, não escritos à mão.
 *
 * A fonte é `src/tokens/temas/*.json` (hoje só `enzo.json`; o tipo já é de
 * biblioteca — nada aqui assume "uma família só" além deste arquivo). Este
 * módulo exporta a MESMA forma que o espelho (`colors`, `byName`, `inGroup`,
 * `corDoTema`, `paresDoTema`, `parProibido`) para os consumidores (livro, MCP
 * futuro) não precisarem saber que os valores vêm de JSON e não de hex
 * escrito aqui.
 *
 * Cada token carrega `role` e, quando restrito, `rule` — um valor sem regra é
 * um convite a usar errado.
 */

import enzo from './temas/enzo.json'
import { contraste, resolverRef, type Esquema, type FamiliaDeTema, type Papel } from './tema'

export type TokenGroup = 'neutro' | 'acento' | 'sinal'

export interface ColorToken {
  /** Nome do papel. Vira `--color-<name>` no CSS. */
  name: Papel
  value: string
  group: TokenGroup
  role: string
  /** Restrição de uso. Ausente = pode usar livremente dentro do papel. */
  rule?: string
  /** Contra qual fundo este token foi verificado, no tema em questão. */
  onto?: string
}

const familia = enzo as unknown as FamiliaDeTema

/** Resolve um papel no tema dado. Delega para `resolverRef()` (`tema.ts`) —
 *  um papel com referência quebrada diz `degrau "X" não existe em "Y"`, em vez
 *  de estourar `TypeError: Cannot read properties of undefined`. */
export function corDoTema(f: FamiliaDeTema, esquema: Esquema, papel: Papel): string {
  const ref = f.esquemas[esquema].papeis[papel]
  return resolverRef(f, esquema, ref)
}

/**
 * O papel de cada token. Isto é doutrina, não valor — não muda com o tema.
 *
 * Os 23 papéis de `tema.ts::PAPEIS`, na mesma ordem. Os seis últimos
 * (`positivo`/`negativo`, as duas tintas, e o degrau de TEXTO de cada um —
 * `positivo-text`/`negativo-text`) são o sinal de valor que a ACQUARIO tem e
 * a risilva não tinha — produto sem fluxo de valor não precisa dele, e por
 * isso o espelho não o carrega.
 */
const PAPEIS: { name: Papel; group: TokenGroup; role: string; rule?: string }[] = [
  { name: 'canvas', group: 'neutro', role: 'fundo da página' },
  { name: 'card', group: 'neutro', role: 'superfície elevada, painel',
    rule: 'separa-se por régua de 1px MAIS var(--elev-repouso); a mudança de valor contra o canvas é reforço, não o mecanismo — o piso do sistema (dL card/canvas, tema.ts) é 0,01 de ΔL, e sozinho isso não sustenta a separação' },
  { name: 'well', group: 'neutro', role: 'superfície recuada: bloco de código, poço',
    rule: 'recuado é mais escuro que o canvas nos DOIS esquemas — não é inversão de polaridade; e nunca leva elevação, porque well é recuo, não flutuação' },
  { name: 'soft', group: 'neutro', role: 'régua interna entre itens de uma lista' },
  { name: 'hair', group: 'neutro', role: 'borda de 1px, régua de separação forte',
    rule: 'é token de BORDA. Como cor de texto o contraste contra o canvas é baixo demais para leitura e o texto some' },
  { name: 'ink', group: 'neutro', role: 'texto principal e título' },
  { name: 'dim', group: 'neutro', role: 'texto secundário, corpo longo' },
  { name: 'dimmer', group: 'neutro', role: 'rótulo terciário, metadado',
    rule: 'nunca em texto corrido — o piso do sistema mantém `dimmer/canvas` entre 3,0 e 4,5:1 de propósito (assertiva D, `verificar-temas.mjs`), e acima disso colapsaria com o dim' },
  { name: 'accent', group: 'acento', role: 'ponto da marca, indicador de status, anel de foco',
    rule: 'só em ponto, régua de 1px ou marca de até 8px — em área maior vibra e barateia' },
  { name: 'accent-text', group: 'acento', role: 'acento legível: numeração, rótulo pequeno, link',
    rule: 'use este, e não o accent, sempre que o acento for TEXTO' },
  { name: 'accent-bg', group: 'acento', role: 'fundo de área tingida pelo acento',
    rule: 'o único tom de acento admitido em área grande' },
  { name: 'action', group: 'acento', role: 'botão principal e sinalização de atenção',
    rule: 'o texto sobre ele é `on-action`, nunca escolhido à mão. `action` e `accent` são o MESMO ciano nesta família (spec §2.4) — a separação entre os dois é de FORMA (pílula cheia vs. ponto/régua/anel), nunca de matiz' },
  { name: 'on-action', group: 'acento', role: 'tinta sobre a ação preenchida' },
  { name: 'on-accent', group: 'acento', role: 'tinta sobre o acento preenchido' },
  { name: 'on-accent-bg', group: 'acento', role: 'tinta sobre a área tingida' },
  { name: 'bench', group: 'neutro', role: 'superfície de instrumento (bancada de aparelhos)',
    rule: 'IGUAL nos dois esquemas: se a bancada trocasse de cor com o tema, a régua de medição do próprio livro passaria a mentir' },
  { name: 'on-bench', group: 'neutro', role: 'tinta sobre o painel da bancada — texto que fica DENTRO do fundo cinza-médio fixo',
    rule: 'nunca `bench` sobre `bench`: achado pela auditoria de página (2026-08-13) — o rótulo dos controles da bancada usava a cor do próprio painel, com ou sem tingimento, e ficava invisível nos dois esquemas' },
  { name: 'positivo', group: 'sinal', role: 'entrada de valor, confirmação, saldo positivo',
    rule: 'ponto, ícone, régua ou fundo tingido — não o texto do sinal quando ele precisa ser LIDO: aí é `positivo-text`' },
  { name: 'negativo', group: 'sinal', role: 'saída de valor, erro, saldo negativo',
    rule: 'ponto, ícone, régua ou fundo tingido — não o texto do sinal quando ele precisa ser LIDO: aí é `negativo-text`' },
  { name: 'on-positivo', group: 'sinal', role: 'tinta sobre a área positiva preenchida' },
  { name: 'on-negativo', group: 'sinal', role: 'tinta sobre a área negativa preenchida' },
  { name: 'positivo-text', group: 'sinal', role: 'o sinal positivo como texto corrido (ex.: AcqTag tingido)',
    rule: 'mesma separação que `accent`/`accent-text`: `positivo` sozinho, como texto sobre o próprio tingimento de 16%, reprova AA no claro — este degrau é o que a auditoria de página mediu como o primeiro a passar' },
  { name: 'negativo-text', group: 'sinal', role: 'o sinal negativo como texto corrido (ex.: AcqTag tingido)',
    rule: 'mesma separação que `accent`/`accent-text` — `negativo` sozinho reprova como texto no esquema claro (e por uma margem estreita no escuro, contra `card`)' },
]

/** Os tokens do tema padrão (`enzo-escuro`). Para quem precisa dos
 *  valores em tempo de módulo. */
export const colors: ColorToken[] = PAPEIS.map((p) => ({
  ...p,
  value: corDoTema(familia, 'escuro', p.name),
  onto: p.group === 'neutro' && p.name !== 'canvas' ? undefined : corDoTema(familia, 'escuro', 'canvas'),
}))

export const byName = (name: string) => colors.find((c) => c.name === name)
export const inGroup = (g: TokenGroup) => colors.filter((c) => c.group === g)

/** Os mesmos tokens, para um tema qualquer. É o que a página de Cor do livro
 *  consome quando o leitor troca de esquema — senão o capítulo afirmaria
 *  coisa falsa. */
export function tokensDoTema(f: FamiliaDeTema, esquema: Esquema): ColorToken[] {
  const canvas = corDoTema(f, esquema, 'canvas')
  return PAPEIS.map((p) => ({
    ...p,
    value: corDoTema(f, esquema, p.name),
    onto: canvas,
  }))
}

/**
 * Pares de contraste verificados. A razão é CALCULADA, nunca digitada — número
 * escrito à mão envelhece, alguém muda um degrau e a tabela continua
 * afirmando o antigo.
 *
 * Os pares são SIMBÓLICOS (papel contra papel) e não hex: um tema claro tem
 * hex diferentes do escuro, e uma tabela em hex cravado afirmaria coisa falsa
 * no segundo esquema.
 */
export const paresSimbolicos: { fg: Papel; bg: Papel; label: string; note?: string }[] = [
  { fg: 'accent', bg: 'canvas', label: 'accent / canvas' },
  { fg: 'ink', bg: 'canvas', label: 'ink / canvas' },
  { fg: 'dim', bg: 'canvas', label: 'dim / canvas' },
  { fg: 'dimmer', bg: 'canvas', label: 'dimmer / canvas', note: 'só metadado, nunca leitura' },
  { fg: 'accent-text', bg: 'card', label: 'accent-text / card' },
  { fg: 'on-action', bg: 'action', label: 'on-action / action', note: 'é assim que o botão se escreve' },
  { fg: 'on-accent', bg: 'accent', label: 'on-accent / accent' },
  { fg: 'on-accent-bg', bg: 'accent-bg', label: 'on-accent-bg / accent-bg' },
  { fg: 'on-positivo', bg: 'positivo', label: 'on-positivo / positivo' },
  { fg: 'on-negativo', bg: 'negativo', label: 'on-negativo / negativo' },
  { fg: 'positivo-text', bg: 'card', label: 'positivo-text / card', note: 'o sinal como texto, não como área' },
  { fg: 'negativo-text', bg: 'card', label: 'negativo-text / card', note: 'o sinal como texto, não como área' },
]

export function paresDoTema(f: FamiliaDeTema, esquema: Esquema) {
  return paresSimbolicos.map((p) => ({
    fg: corDoTema(f, esquema, p.fg),
    bg: corDoTema(f, esquema, p.bg),
    label: p.label,
    note: p.note,
  }))
}

/** Compatibilidade: os pares do tema padrão. */
export const contrastPairs = paresDoTema(familia, 'escuro')

/**
 * O par PROIBIDO, mantido como doutrina e não como valor de tema: branco sobre
 * a ação é o erro clássico de quem escolhe a tinta à mão em vez de usar
 * `on-action`, e a página de Usos precisa poder renderizar o erro.
 */
export const parProibido = {
  fg: '#FFFFFF',
  bg: corDoTema(familia, 'escuro', 'action'),
  label: 'branco / action',
  note: 'proibido — a tinta correta é on-action, nunca escolhida à mão',
  razao: contraste('#FFFFFF', corDoTema(familia, 'escuro', 'action')),
}
