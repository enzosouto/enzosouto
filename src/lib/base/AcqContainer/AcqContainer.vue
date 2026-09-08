<script setup lang="ts">
// Contêiner de largura. Ver ficha.ts, ao lado.
//
// A REGRA QUE MAIS SOME NUMA MIGRAÇÃO: contêiner largo não autoriza texto
// largo. `width` governa a CAIXA — 72rem, 90rem, sem limite — e nunca o
// parágrafo, que continua medido em `ch`. Um contêiner de 72rem com um
// parágrafo dentro sem `width="prose"` produz uma linha de mais de 100
// caracteres: nada quebra, nada estoura, só fica cansativo de ler — e é
// exatamente por não quebrar que o defeito atravessa revisão sem ninguém notar.
//
// Sem superfície própria — não pinta fundo, não tem borda — o contêiner não
// entra na escada de curva nem na de elevação: as duas medem peça com ÁREA
// visível, e uma caixa transparente não tem nenhuma para arredondar ou erguer.
withDefaults(
  defineProps<{ width?: 'prose' | 'page' | 'wide' | 'full'; pad?: boolean; as?: string }>(),
  { width: 'page', pad: true, as: 'div' },
)
</script>

<template>
  <component :is="as" class="ct" :class="[`w-${width}`, { pad }]"><slot /></component>
</template>

<style scoped>
.ct { margin-inline: auto; width: 100%; }
.pad { padding-inline: 22px; }
.w-prose { max-width: 68ch; }
.w-page { max-width: 72rem; }
.w-wide { max-width: 90rem; }
.w-full { max-width: none; }
</style>
