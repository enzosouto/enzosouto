<script setup lang="ts">
// GRADE RESPONSIVA. Ver ficha.ts, ao lado.
//
// `columns` É TETO, NÃO NÚMERO FIXO — e essa é a peça inteira. A faixa mínima é
// a MAIOR entre `min` e a largura exata de N colunas: assim nunca aparece uma
// coluna a mais que o declarado, e a grade ainda cai sozinha para menos colunas
// quando a tela encolhe. As duas coisas ao mesmo tempo, sem media query.
//
// A grade não pinta nada: cor, curva e sombra são decisão de cada CÉLULA — a
// grade só decide quantas cabem por linha e a distância entre elas.
import { rhythm } from '../../../tokens/space'

type Gap = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** A mesma escala de papéis de ritmo do sistema. Os números saem de `rhythm`. */
const ESCALA: Record<Gap, number> = {
  xs: rhythm[0],
  sm: rhythm[1],
  md: rhythm[3],
  lg: rhythm[5],
  xl: rhythm[7], // caixa → caixa, e célula de grade é caixa
}

withDefaults(
  defineProps<{
    /** TETO de colunas. Em tela estreita a grade usa menos, nunca mais. */
    columns?: 1 | 2 | 3 | 4
    /** Nome do papel na escala, nunca número. */
    gap?: Gap
    /**
     * Largura mínima da faixa. É o que decide QUANDO cair para menos colunas —
     * não é enfeite, é o ponto de quebra escrito em largura de conteúdo em vez
     * de largura de tela.
     */
    min?: string
    /** Elemento produzido. */
    as?: string
  }>(),
  { columns: 3, gap: 'xl', min: '228px', as: 'div' },
)
</script>

<template>
  <component
    :is="as"
    class="gd"
    :style="{
      '--acq-grade-cols': columns,
      '--acq-grade-gap': `${ESCALA[gap]}px`,
      '--acq-grade-min': min,
    }"
    data-test="grid"
  >
    <slot />
  </component>
</template>

<style scoped>
/* A conta, de dentro para fora:
   · `calc((100% - (cols - 1) * gap) / cols)` é a largura EXATA de uma coluna
     quando há `cols` colunas. Enquanto a faixa mínima é esse valor, o auto-fit
     não consegue encaixar uma faixa a mais — é o teto.
   · `max(min, …)` põe o piso: quando a tela encolhe, a largura de N colunas
     desce abaixo de `min`, o `min` passa a mandar e o auto-fit cai para menos
     colunas sozinho.
   · `min(100%, …)` existe para a tela mais estreita que `min`: sem ele a faixa
     mínima fica maior que o contêiner e a grade estoura para o lado em vez de
     encolher a única coluna que sobrou. */
.gd {
  display: grid;
  gap: var(--acq-grade-gap);
  grid-template-columns: repeat(
    auto-fit,
    minmax(
      min(
        100%,
        max(
          var(--acq-grade-min),
          calc((100% - (var(--acq-grade-cols) - 1) * var(--acq-grade-gap)) / var(--acq-grade-cols))
        )
      ),
      1fr
    )
  );
}
</style>
