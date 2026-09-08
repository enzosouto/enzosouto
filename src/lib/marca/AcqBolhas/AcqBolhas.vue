<script setup lang="ts">
/**
 * AS BOLHAS — as partículas que sobem pela superfície. Ver ficha.ts.
 *
 * OITO ELEMENTOS VAZIOS QUE NÃO DIZEM NADA — e é justamente por isso que
 * existem aqui e não no HTML de quem usa. Escritos à mão numa página, são oito
 * `<span>` sem conteúdo que o próximo leitor apaga por parecerem sobra.
 *
 * CADA BOLHA TEM POSIÇÃO, TAMANHO, DURAÇÃO E ATRASO PRÓPRIOS, e os números não
 * são decorativos: oito bolhas iguais subindo juntas formam uma CORTINA, que é
 * exatamente o que não se quer. Os atrasos são NEGATIVOS de propósito — assim a
 * animação já começa no meio, e a primeira dobra não abre com a tela vazia
 * esperando a primeira bolha nascer.
 *
 * O SORTEIO É DETERMINÍSTICO. Nada de `Math.random()`: a mesma página tem de
 * render igual em servidor e cliente, e um valor aleatório entre os dois é
 * incompatibilidade de hidratação — que aparece como um aviso críptico e um
 * repaint, não como bolha errada.
 */
withDefaults(defineProps<{
  /** Quantas partículas. Acima de doze a tela vira aquário, não superfície. */
  quantidade?: number
}>(), { quantidade: 8 })

/* Os oito perfis, na ordem em que aparecem da esquerda para a direita. Pedir
   menos usa os primeiros; pedir mais repete a série deslocada, e o deslocamento
   evita que a repetição caia na mesma coluna. */
const PERFIS = [
  { x: 8, r: 8, dur: 17, atraso: 0 },
  { x: 21, r: 5, dur: 21, atraso: -4 },
  { x: 34, r: 11, dur: 14, atraso: -9 },
  { x: 47, r: 6, dur: 19, atraso: -2 },
  { x: 59, r: 8, dur: 12, atraso: -7 },
  { x: 72, r: 4, dur: 23, atraso: -12 },
  { x: 84, r: 9, dur: 16, atraso: -5 },
  { x: 93, r: 6, dur: 20, atraso: -15 },
]

const perfil = (i: number) => {
  const p = PERFIS[i % PERFIS.length]
  const volta = Math.floor(i / PERFIS.length)
  return {
    left: `${(p.x + volta * 6) % 97}%`,
    width: `${p.r}px`,
    height: `${p.r}px`,
    animationDuration: `${p.dur + volta * 3}s`,
    animationDelay: `${p.atraso - volta * 2}s`,
  }
}
</script>

<template>
  <div class="bolhas" aria-hidden="true" data-test="bolhas">
    <span v-for="n in quantidade" :key="n" :style="perfil(n - 1)" />
  </div>
</template>

<style scoped>
.bolhas {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bolhas span {
  position: absolute;
  /* Nasce ABAIXO da borda: bolha que aparece do nada no meio do quadro lê como
     falha de pintura, não como bolha. */
  bottom: -30px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-accent) 32%, transparent);
  animation-name: acq-bolha;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* Sobe uma tela inteira, cresce um pouco e some nas duas pontas — água que
   aparece e desaparece em corte é vidro, não água. */
@keyframes acq-bolha {
  0% {
    transform: translateY(0) scale(0.8);
    opacity: 0;
  }
  12% {
    opacity: 0.7;
  }
  88% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-92vh) scale(1.15);
    opacity: 0;
  }
}

/* Aqui não basta parar: bolha parada é um punhado de pontos ciano espalhados
   pela tela, que lê como sujeira. Quem pediu menos movimento não recebe nenhuma. */
@media (prefers-reduced-motion: reduce) {
  .bolhas {
    display: none;
  }
}
</style>
