<script setup lang="ts">
// PILHA. Ver ficha.ts, ao lado.
//
// O sintoma que justifica a peça é o mesmo em qualquer sistema: `gap` escrito
// à mão, com valor inventado, tela a tela. Alguém acha 16 apertado, 20 largo,
// escreve 18 — e em duas semanas a escala tem vinte números e nenhuma
// decisão.
//
// POR ISSO `gap` ACEITA NOME, NUNCA NÚMERO. A escala vem de `rhythm`
// (`tokens/space.ts`) e não muda entre risilva e ACQUARIO: espaço não é onde
// a marca inverte — curva, sombra e movimento são.
import { computed } from 'vue'
import { rhythm } from '../../../tokens/space'

type Gap = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Cinco PAPÉIS de distância, não cinco tamanhos. O nome carrega a decisão; o
 * número sai de `rhythm` para nunca morar aqui.
 */
const ESCALA: Record<Gap, number> = {
  xs: rhythm[0], //  8 · rótulo → texto do mesmo item
  sm: rhythm[1], // 12 · parágrafo → parágrafo
  md: rhythm[3], // 16 · título → corpo
  lg: rhythm[5], // 22 · eyebrow → título
  xl: rhythm[7], // 26 · caixa → caixa
}

const p = withDefaults(
  defineProps<{
    /** Nome do papel na escala, nunca número. Ver `ESCALA` acima. */
    gap?: Gap
    /** Eixo da pilha. */
    direction?: 'column' | 'row'
    /** Alinhamento no eixo transversal. */
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
    /** Distribuição no eixo principal. */
    justify?: 'start' | 'center' | 'end' | 'between'
    /**
     * Quebra de linha. Só tem efeito em `row`: pilha vertical que quebra em
     * colunas é grade, e grade é o `AcqGrid`.
     */
    wrap?: boolean
    /** Elemento produzido. `ul`/`ol` só com filhos `<li>`. */
    as?: string
  }>(),
  { gap: 'md', direction: 'column', align: 'stretch', justify: 'start', wrap: true, as: 'div' },
)

// `wrap` só alcança `row`: em `column`, `flex-wrap: wrap` numa coluna de
// altura limitada quebra o conteúdo em duas colunas que ninguém pediu.
const quebra = computed(() => p.direction === 'row' && p.wrap)
</script>

<template>
  <component
    :is="as"
    class="ac-st"
    :class="[`d-${direction}`, `a-${align}`, `j-${justify}`, { wr: quebra }]"
    :style="{ '--acq-pilha-gap': `${ESCALA[gap]}px` }"
    data-test="stack"
  >
    <slot />
  </component>
</template>

<style scoped>
/* `min-width: 0` porque o mínimo automático de um item flex é o tamanho do
   conteúdo: sem isto, uma pilha dentro de uma linha se recusa a encolher e
   estoura o pai — o defeito que aparece como "a tabela empurra a página". */
.ac-st {
  display: flex;
  gap: var(--acq-pilha-gap);
  min-width: 0;
}

.d-column { flex-direction: column; }
.d-row { flex-direction: row; }
.wr { flex-wrap: wrap; }

.a-start { align-items: flex-start; }
.a-center { align-items: center; }
.a-end { align-items: flex-end; }
.a-stretch { align-items: stretch; }
.a-baseline { align-items: baseline; }

.j-start { justify-content: flex-start; }
.j-center { justify-content: center; }
.j-end { justify-content: flex-end; }
.j-between { justify-content: space-between; }
</style>
