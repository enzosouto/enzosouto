<script setup lang="ts">
// Texto de apoio. Ver ficha.ts, ao lado.
//
// SEM prop de tamanho, e é esse o conserto: o papel — legenda, rótulo,
// metadado, dica — tem nome, e o corpo é consequência do papel, não escolha
// de quem chama. Sem isto, o mesmo texto apagado nasce em corpos diferentes
// pela base de código, um por arquivo que precisou dele.
//
// A ACQUARIO não tem segunda família: não existe "mono é a voz do texto
// pequeno" aqui. Os quatro papéis são Montserrat, diferenciados por peso,
// tamanho e rastreamento — nunca por trocar de fonte.
withDefaults(
  defineProps<{
    as?: 'span' | 'p' | 'small' | 'div'
    role?: 'caption' | 'label' | 'data' | 'hint'
  }>(),
  { as: 'span', role: 'caption' },
)
</script>

<template>
  <component :is="as" :class="['ac-m', `r-${role}`]" data-test="meta"><slot /></component>
</template>

<style scoped>
.ac-m { margin: 0; font-family: var(--font-sans); }
.r-caption { font-size: calc(12.5px * var(--acq-esc)); font-weight: 400; color: var(--color-dim); }
.r-label {
  font-weight: 600; font-size: calc(10.5px * var(--acq-esc)); letter-spacing: .08em;
  color: var(--color-dimmer);
}
.r-data { font-weight: 500; font-size: calc(12px * var(--acq-esc)); line-height: 2; color: var(--color-dimmer); }
.r-hint { font-weight: 400; font-size: calc(12px * var(--acq-esc)); color: var(--color-dimmer); }
</style>
