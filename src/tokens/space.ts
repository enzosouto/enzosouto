/**
 * TOKENS DE ESPAÇO E MEDIDA.
 *
 * A escala é curta de propósito. Nove valores cobrem o sistema inteiro; um
 * décimo valor intermediário é o começo da erosão.
 *
 * A doutrina de FORMA (`form`, abaixo) é o ponto em que este arquivo se
 * afasta do espelho por inteiro, e não por ajuste de valor: a risilva é
 * "raio zero e sombra nenhuma, em tudo" porque o Manual da Marca dela descreve
 * material impresso. A ACQUARIO é o oposto — curva e sombra difusa são a
 * assinatura (ver `curva.ts`, `elevation.ts`) — e por isso as regras abaixo
 * dizem o contrário do que o mesmo arquivo diz no espelho.
 */

export const rhythm = [8, 12, 14, 16, 20, 22, 24, 26, 30] as const

/**
 * O ÚNICO valor grande do sistema: seção → seção, em px.
 *
 * Está aqui e não na escala porque não é ritmo interno — é o que separa dois
 * assuntos. Existe como export porque um componente de seção do livro precisa
 * dele em CSS: sem isto ele escreveria `150px` à mão, e o token deixaria de
 * mandar no único lugar em que o número aparece na tela.
 */
export const sectionGap = 150

/** No telefone 150px é um terço da tela em branco. */
export const sectionGapPhone = 88

export const rhythmUse: { gap: string; use: string }[] = [
  { gap: '8px', use: 'rótulo → texto do mesmo item' },
  { gap: '12–14px', use: 'parágrafo → parágrafo' },
  { gap: '16–20px', use: 'título → corpo' },
  { gap: '22px', use: 'eyebrow → título' },
  { gap: '24–30px', use: 'padding interno de caixa' },
  { gap: '26px', use: 'caixa → caixa' },
  { gap: '150px', use: 'seção → seção (o único valor grande)' },
]

/**
 * Medida de linha. É o token mais importante e o mais fácil de perder:
 * o container é largo, o texto nunca é.
 */
export const measures: { name: string; value: string; use: string }[] = [
  { name: 'lead', value: '46ch', use: 'parágrafo de abertura' },
  { name: 'body', value: '62ch', use: 'corpo de texto' },
  { name: 'item', value: '60ch', use: 'descrição de item de lista' },
  { name: 'title', value: '20–22ch', use: 'título em Montserrat 800' },
  { name: 'prose', value: '68ch', use: 'texto longo de documentação' },
]

/**
 * FORMA — o inverso deliberado da doutrina do espelho.
 *
 * Lá: "Raio 0 em tudo, sombra nenhuma em nenhum lugar." Aqui a curva CRESCE
 * com a área (`curva.ts`) e toda superfície estática carrega sombra difusa
 * (`elevation.ts`, `elev-repouso`) — o padrão está invertido de propósito, não
 * por gosto: o Manual da marca ACQUARIO descreve interface líquida, não
 * material impresso reto.
 */
export const form: { rule: string; why: string }[] = [
  {
    rule: 'Raio: sai de `var(--curva-sm|md|lg|xl|pill)`, cresce com a ÁREA, nunca com a importância',
    why: '`scripts/verificar-curvas.mjs` reprova todo `border-radius` literal fora da escada (exceto `0`, `50%` e `999px`, que são forma e não medida).',
  },
  {
    rule: 'Sombra: `var(--elev-repouso)` em toda superfície estática; `var(--elev-flutua)` só no que sai do fluxo',
    why: 'A elevação se comunica por sombra difusa de baixa opacidade — nunca por profundidade dura, que é o oposto de leveza.',
  },
  {
    rule: 'Exceção: indicador de status é redondo (`50%`)',
    why: 'Lê como LED, não como caixa. É forma conceitual, não um sexto degrau da escada de curva.',
  },
  {
    rule: 'Borda: 1px, e só onde separa informação',
    why: 'Régua entre itens de uma lista é informação. Moldura em volta de seção é decoração — e pica a página.',
  },
]

/** Armadilhas conhecidas na implementação. Um MCP futuro deve avisar sobre elas. */
export const pitfalls: { title: string; body: string }[] = [
  {
    title: 'Raio literal em vez de token',
    body: 'Cada componente inventando o próprio raio (<code>10px</code> aqui, <code>14px</code> ali) é como o sistema vira um mosaico sem assinatura. O raio sai de <code>var(--curva-*)</code> ou não sai — é o que <code>verificar-curvas.mjs</code> cobra.',
  },
  {
    title: 'Container largo não autoriza texto largo',
    body: 'Ao herdar a largura de um container maior, os parágrafos passam de 60–70 caracteres por linha e o conforto de leitura desaparece — a tipografia continua idêntica no código, e só o resultado piora.',
  },
  {
    title: 'Link sem cor cai na cor do navegador',
    body: 'Um <code>&lt;a&gt;</code> sem <code>color</code> declarado sai azul ou roxo sobre o canvas quase-preto do tema escuro. O reset de <code>style.css</code> cobre isso com <code>a { color: inherit }</code> — mas só protege o que herda; componente que escreve a própria cor de link precisa lembrar disso de novo.',
  },
  {
    title: 'style.css sem o bloco de forma e movimento não erra visivelmente',
    body: 'Se <code>--curva-*</code>, <code>--elev-*</code>, <code>--mov-*</code> e <code>--dur-*</code> não estiverem declarados em algum <code>:root</code>, os 40+ componentes que os leem não lançam erro nenhum: <code>border-radius: var(--curva-xl)</code> sem a variável resolve para o valor inicial da propriedade, que é <code>0</code>. O componente nasce quadrado e sem transição, e nada no console aponta a causa.',
  },
]
