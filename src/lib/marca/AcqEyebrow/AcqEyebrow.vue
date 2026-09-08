<script setup lang="ts">
// Rótulo de seção. Ver ficha.ts, ao lado.
//
// SEM O CHEVRON DA RISILVA. Lá o `>` é o prompt da marca — a referência a uma
// linha de comando. A ACQUARIO não tem terminal: o rótulo de seção é a mesma
// forma medida nas próprias telas da marca, caixa alta com rastreamento de
// `.35em`, sem glifo de abertura. `text-transform` faz o trabalho, então quem
// chama continua escrevendo em minúscula — a peça é que converte.
//
// `num` sobrevive do espelho: numeração de capítulo continua fazendo sentido
// aqui, só que sem o `>` e sem o ponto final que amarrava no wordmark de lá.
withDefaults(defineProps<{ text: string; num?: string }>(), { num: undefined })
</script>

<template>
  <span class="eb" data-test="eyebrow">
    <template v-if="num">{{ num }} · </template>{{ text }}
  </span>
</template>

<style scoped>
.eb {
  display: block;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: calc(12px * var(--acq-esc));
  letter-spacing: .35em;
  text-transform: uppercase;
  color: var(--color-accent-text);
}
</style>
