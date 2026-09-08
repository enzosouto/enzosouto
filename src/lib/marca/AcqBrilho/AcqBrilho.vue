<script setup lang="ts">
/**
 * O BRILHO — a luz que varre a superfície. Ver ficha.ts, ao lado.
 *
 * É uma faixa diagonal claríssima que atravessa o quadro devagar, de um lado ao
 * outro e de volta. O papel dela é o mesmo do reflexo numa lâmina de água: dizer
 * que existe uma FONTE DE LUZ fora do quadro. Sem isso, mar e bolhas ficam
 * corretos e mortos — desenho de água em vez de água.
 *
 * O CICLO É DE IDA E VOLTA, NÃO EM LAÇO. Uma varredura que volta ao início por
 * teletransporte marca o instante do salto, e o olho passa a esperar por ele.
 * Indo e voltando (`alternate` embutido nos quadros 0/50/100), o movimento não
 * tem começo visível.
 *
 * TREZE SEGUNDOS, E É LENTO DE PROPÓSITO. Rápido demais vira o "shimmer" de
 * esqueleto de carregamento — que significa OUTRA coisa na interface: "isto
 * ainda está chegando". Um brilho que se parece com carregamento numa página
 * já carregada é informação errada, não enfeite.
 *
 * O GRADIENTE PASSA POR TRANSPARENTE NAS DUAS PONTAS: a faixa não tem borda, e
 * é a ausência de borda que a faz ler como luz em vez de retângulo claro.
 */
withDefaults(defineProps<{
  /** Força da luz, em porcentagem da cor de acento. Acima de 15% vira faixa. */
  intensidade?: number
}>(), { intensidade: 9 })
</script>

<template>
  <div
    class="brilho"
    aria-hidden="true"
    data-test="brilho"
    :style="{ '--acq-luz': `${intensidade}%` }"
  />
</template>

<style scoped>
.brilho {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    104deg,
    transparent 38%,
    color-mix(in srgb, var(--color-accent) var(--acq-luz), transparent) 50%,
    transparent 62%
  );
  animation: acq-brilho 13s ease-in-out infinite;
}

@keyframes acq-brilho {
  0%,
  100% {
    transform: translateX(-28%);
  }
  50% {
    transform: translateX(28%);
  }
}

/* Parado ele continua fazendo o trabalho: a diagonal clara sozinha já implica
   a fonte de luz. É a varredura que some, não a luz. */
@media (prefers-reduced-motion: reduce) {
  .brilho {
    animation: none;
  }
}
</style>
