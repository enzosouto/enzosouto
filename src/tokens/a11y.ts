/**
 * TOKENS DE ACESSIBILIDADE — as preferências que o leitor pode ajustar.
 *
 * A ideia central, e ela é do protótipo original do Emerson (herdada do
 * espelho): cada preferência é UMA CLASSE na raiz que REMAPEIA TOKENS. Nenhuma
 * preferência mexe em elemento.
 *
 * Isso é o que torna a coisa barata: como todo o sistema já lê `var(--color-*)`
 * e `var(--font-*)`, trocar o valor de um token sob uma classe na raiz muda a
 * página inteira de uma vez. A alternativa — uma regra por elemento — custaria
 * uma linha de CSS por lugar e ficaria velha no primeiro componente novo.
 *
 * POR QUE ISTO EXISTE, e não é redundante com o sistema operacional: o livro
 * já respeita `prefers-reduced-motion`. Só que **quem sente desconforto
 * raramente sabe que essa chave existe no aparelho** — e ninguém troca o
 * sistema inteiro para ler uma página. O painel é o caminho de quem não
 * configurou nada.
 *
 * DELTA DE DOUTRINA contra o espelho, e as duas coisas são o mesmo motivo:
 *
 *   1. PREFIXO `acq-`, não `ri-`. É o namespace do pacote.
 *   2. NÃO EXISTE "fonte simples nos títulos" (`a-fonte` no espelho). Aquela
 *      opção trocava a serifa da marca (Playfair) pela sans, para quem tem
 *      dificuldade de decodificar letra de alto contraste. A ACQUARIO não tem
 *      serifa — o sistema inteiro já é `--font-sans` (Montserrat), do título
 *      ao rótulo — então a opção não teria o que fazer: seria um botão que
 *      liga uma classe remapeando um token (`--font-serif`) que este sistema
 *      nunca declara. Opção fantasma; por isso ela não existe aqui.
 */

export type A11yGroup = 'texto' | 'leitura' | 'sinais'

export interface A11yPref {
  /** Sufixo da classe: `a-forte` vira `acq-a-forte` na raiz. */
  id: string
  group: A11yGroup
  label: string
  /** Uma linha dizendo o que muda, em voz de quem vai usar — não em jargão. */
  hint: string
  /** Por que a opção existe. Alimenta a documentação e um MCP futuro. */
  why: string
  /**
   * Ligada por padrão quando o sistema operacional já pede.
   * Hoje só `menos movimento` — e é o conserto de um defeito real: o CSS
   * respeitava `prefers-reduced-motion` e o controle aparecia DESLIGADO, então
   * a interface mentia sobre o próprio estado.
   */
  daPreferenciaDoSistema?: '(prefers-reduced-motion: reduce)'
}

/** A escala de texto. Três passos: mais que isso ninguém compara, só experimenta. */
export const a11yEscalas = [
  { id: '', label: 'normal', fator: 1 },
  { id: 'a-g', label: 'grande', fator: 1.15 },
  { id: 'a-gg', label: 'maior', fator: 1.3 },
] as const

export const a11yPrefs: A11yPref[] = [
  {
    id: 'a-forte',
    group: 'leitura',
    label: 'Texto mais forte',
    hint: 'engrossa o traço, sem mudar tamanho',
    why: 'O corpo do sistema é peso 400, o mais leve que o documento carrega. Para quem tem baixa visão, engrossar resolve mais que aumentar — e não reflui o layout.',
  },
  {
    id: 'a-solto',
    group: 'leitura',
    label: 'Linhas mais soltas',
    hint: 'mais espaço entre linhas e letras',
    why: 'Entrelinha e tracking maiores ajudam quem perde a linha ao voltar do fim de uma para o começo da outra — dislexia inclusive.',
  },
  {
    id: 'a-contraste',
    group: 'sinais',
    label: 'Mais contraste',
    hint: 'texto secundário fica mais claro',
    why: 'O texto secundário usa `dim` e o metadado usa `dimmer` (entre 3,0 e 4,5:1, de propósito). Ligado, os dois sobem um degrau: `dim` vira `ink` e `dimmer` vira o `dim` original.',
  },
  {
    id: 'a-links',
    group: 'sinais',
    label: 'Sublinhar links',
    hint: 'link deixa de se anunciar só pela cor',
    why: 'Devolve o segundo sinal ao link, que hoje se anuncia só pelo ciano do acento — e cor sozinha não é sinal, que é regra do próprio sistema.',
  },
  {
    id: 'a-parado',
    group: 'sinais',
    label: 'Menos movimento',
    hint: 'desliga transições e animações',
    why: 'Para quem NÃO configurou o sistema. O livro já respeita `prefers-reduced-motion`, mas quem sente desconforto raramente sabe que a chave existe no aparelho.',
    daPreferenciaDoSistema: '(prefers-reduced-motion: reduce)',
  },
]

/** Chave do `localStorage`. Versionada: mudar o catálogo não deve ressuscitar estado velho. */
export const a11yStorageKey = 'enzo.a11y.v1'

/** Prefixo das classes na raiz. Namespace do pacote — `a-forte` vira
 *  `acq-a-forte`, não `acq-a-a-forte`: o prefixo já termina em hífen. */
export const a11yPrefix = 'acq-'

export const a11yGroups: { id: A11yGroup; label: string }[] = [
  { id: 'texto', label: 'tamanho do texto' },
  { id: 'leitura', label: 'leitura' },
  { id: 'sinais', label: 'contraste e sinais' },
]

export const inA11yGroup = (g: A11yGroup) => a11yPrefs.filter((p) => p.group === g)

/** O que não se reinventa neste painel. Um MCP futuro lê isto. */
export const a11yRules: string[] = [
  'Cada preferência <b>remapeia token</b>, nunca estiliza elemento. É o que faz uma linha de CSS valer para a página inteira.',
  'O painel é <b>disclosure, não diálogo</b>: <code>aria-expanded</code> no botão e <code>aria-controls</code> apontando para a região. Ajuste de preferência não deve prender o foco nem bloquear a página atrás.',
  'Preferência que o sistema operacional já declara <b>nasce marcada</b>. Controle que mostra "desligado" enquanto o efeito está ligado é interface mentindo.',
  'O estado <b>persiste</b> e é aplicado <b>antes da primeira pintura</b> — senão a página nasce no padrão e pisca para a preferência do leitor.',
  'Todo alvo do painel tem <b>44dp</b>, 48dp em ponteiro grosso. Um painel de acessibilidade com alvo pequeno é uma piada de mau gosto.',
  'No celular o painel é <b>folha que sobe do rodapé</b> — senão ele nasce sobre a área que o polegar alcança.',
  'Não existe opção de troca de família tipográfica. O sistema tem uma família só (`--font-sans`); "fonte simples" é opção fantasma aqui e por isso não está no catálogo.',
]
