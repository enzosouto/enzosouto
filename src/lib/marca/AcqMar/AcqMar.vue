<script setup lang="ts">
/**
 * O MAR — as lâminas de água que derivam atrás do conteúdo. Ver ficha.ts.
 *
 * Não é textura nem imagem de fundo: são senoides desenhadas em SVG, cada uma
 * com período, amplitude, opacidade e velocidade próprios, deslizando na
 * horizontal em laço sem emenda.
 *
 * TRÊS LÂMINAS, E O NÚMERO É MEDIDO. Com uma, o olho lê uma curva parada. Com
 * DUAS, lê padrão repetido — as duas cruzam nos mesmos pontos e o cruzamento
 * vira um losango que se repete. Com QUATRO, a soma fica opaca e some a
 * sensação de profundidade. Três é onde a superposição parece água.
 *
 * OS PERÍODOS NÃO SÃO MÚLTIPLOS ENTRE SI (1200, 760, 430) pelo mesmo motivo
 * que os tempos não são (34s, 23s, 15s): períodos com divisor comum recompõem
 * a mesma figura em intervalos curtos, e o laço passa a ter batida. Sem divisor
 * comum pequeno, o arranjo demora tanto a se repetir que não há emenda visível.
 *
 * O SVG TEM 200% DE LARGURA E A DERIVA É DE 50%. É isso que fecha o laço: em
 * meia volta o desenho já se repetiu exatamente, então o quadro final é igual
 * ao inicial e não existe salto. Animar a largura inteira mostraria a costura.
 *
 * A AMOSTRAGEM É DE 12 EM 12 PIXELS num viewBox de 3600. Mais fino não muda
 * nada na tela (a lâmina é esticada por `preserveAspectRatio="none"`) e engorda
 * o `d` de cada caminho em milhares de caracteres, que viajam no HTML.
 */
const props = withDefaults(defineProps<{
  /** Quantas lâminas. Três é a superposição que lê como água; menos é gesto. */
  laminas?: 1 | 2 | 3
  /** Altura da faixa de água, em qualquer unidade CSS. */
  altura?: string
}>(), { laminas: 3, altura: '46vh' })

const LARGURA = 3600
const ALTURA = 260

/** Uma lâmina: senoide amostrada e fechada por baixo, para virar área. */
function caminho(amplitude: number, periodo: number, base: number) {
  const p: string[] = []
  for (let x = 0; x <= LARGURA; x += 12) {
    const y = base + amplitude * Math.sin((2 * Math.PI * x) / periodo)
    p.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(2)}`)
  }
  p.push(`L${LARGURA} ${ALTURA}`, `L0 ${ALTURA}`, 'Z')
  return p.join(' ')
}

/* A lâmina 1 é a da frente e a mais alta; a 3 é a do fundo, mais rasa e mais
   rápida. Pedir menos lâminas tira as de trás, nunca a da frente — o gesto
   principal continua o mesmo. */
const TODAS = [
  { n: 1, d: caminho(26, 1200, 130) },
  { n: 2, d: caminho(18, 760, 158) },
  { n: 3, d: caminho(12, 430, 180) },
]
const lamas = TODAS.slice(0, props.laminas)
</script>

<template>
  <!-- Decoração pura: fora da árvore de acessibilidade e fora do alcance do
       ponteiro. Um mar que recebe clique rouba o link que está por cima. -->
  <div class="mar" :style="{ height: altura }" aria-hidden="true" data-test="mar">
    <svg
      v-for="l in lamas"
      :key="l.n"
      :class="`lamina-${l.n}`"
      :viewBox="`0 0 ${LARGURA} ${ALTURA}`"
      preserveAspectRatio="none"
    >
      <path :d="l.d" fill="currentColor" />
    </svg>
  </div>
</template>

<style scoped>
.mar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  /* `currentColor` no `<path>` para a cor descer por herança: quem embute o mar
     dentro de uma superfície de outra voltagem troca `color` e pronto. */
  color: var(--color-accent);
}

.mar svg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
}

/* Opacidade, velocidade e altura próprias por lâmina. Iguais, as três viram
   uma massa só — foi assim que a primeira tentativa ficou opaca demais. */
.lamina-1 {
  opacity: 0.1;
  animation: acq-deriva 34s linear infinite;
}
.lamina-2 {
  opacity: 0.07;
  bottom: -14px;
  animation: acq-deriva 23s linear infinite reverse;
}
.lamina-3 {
  opacity: 0.05;
  bottom: -26px;
  animation: acq-deriva 15s linear infinite;
}

/* Metade da largura, porque o SVG tem 200%: em meia volta o desenho já se
   repetiu e o laço fecha sem salto. */
@keyframes acq-deriva {
  to {
    transform: translateX(-50%);
  }
}

/* Movimento contínuo e periférico é exatamente o que incomoda quem tem
   sensibilidade vestibular. Parado, o mar continua sendo o desenho. */
@media (prefers-reduced-motion: reduce) {
  .mar svg {
    animation: none;
  }
}
</style>
