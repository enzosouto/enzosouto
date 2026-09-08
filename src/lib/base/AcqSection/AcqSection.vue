<script setup lang="ts">
// SEÇÃO DE PÁGINA. Ver ficha.ts, ao lado.
//
// O ESPAÇO É O SEPARADOR, e é a razão de o componente existir: sem ele cada
// página reinventa o ritmo vertical, e a primeira coisa que alguém faz quando o
// ritmo está incerto é desenhar uma `border-top` entre as seções. A régua pica
// a página; o vazio é que diz "outro assunto".
//
// RITMO, NÃO CAIXA: a seção não ganha curva nem sombra — ela não é superfície,
// é o espaço em branco entre blocos. Dar-lhe `--elev-repouso` criaria uma
// superfície flutuante fantasma sem nenhuma borda que a justifique.
import { sectionGap, sectionGapPhone } from '../../../tokens/space'
import AcqEyebrow from '../../marca/AcqEyebrow/AcqEyebrow.vue'

withDefaults(
  defineProps<{
    /** Âncora para navegação. */
    id: string
    /** Texto do eyebrow. */
    label: string
    /** Título. Montserrat 800 — esta marca não tem segunda família. */
    title?: string
    /** Composição da seção. */
    align?: 'center' | 'left'
  }>(),
  { align: 'center' },
)
</script>

<template>
  <!-- O valor vem de `tokens/space.ts`. Escrito à mão aqui, o único número
       grande do sistema passaria a morar num `.vue`. -->
  <section
    :id="id"
    class="sec"
    :class="`al-${align}`"
    data-test="section"
    :style="{ '--acq-sec': `${sectionGap}px`, '--acq-sec-tel': `${sectionGapPhone}px` }"
  >
    <AcqEyebrow :text="label" />
    <!-- Título em Montserrat 800, nunca em mono e nunca em caixa alta — caixa
         alta é vocabulário do eyebrow, não do título. Medida em `ch`: título
         longo em peso 800 vira parágrafo com cara de manchete. -->
    <h2 v-if="title" class="tit">{{ title }}</h2>
    <div class="corpo"><slot /></div>
  </section>
</template>

<style scoped>
/* `--acq-sec-parte` é QUANTO DO VAZIO SOBE PARA O TOPO quando há uma seção
   antes desta. Zero por padrão, que é o comportamento de sempre. */
.sec { padding-block: calc(var(--acq-sec) * (1 - var(--acq-sec-parte, 0))); }
/* Duas seções seguidas não somam o vazio duas vezes: o de baixo perde o topo.

   ISTO PRESSUPÕE FUNDO CONTÍNUO, e a suposição é boa aqui: sem cor própria, o
   vazio da seção de cima e o da de baixo são o mesmo vazio, e somá-los daria o
   dobro do respiro entre dois assuntos. Numa página que PINTA as seções em
   faixas alternadas, porém, o vazio de cima fica da cor da seção anterior — e
   a faixa nova passa a começar exatamente no rótulo, colada no topo. Quem
   pinta faixas reparte o espaço com `--acq-sec-parte: .5` na raiz: metade em
   cima, metade embaixo, e a distância ENTRE assuntos não muda (75 + 75 são os
   mesmos 150). É variável e não seletor porque o estilo aqui é `scoped` — de
   fora, `.sec + .sec` mede 0-4-0 e não há seletor razoável que o vença. O
   padrão continua sendo zero. */
.sec + .sec { padding-block-start: calc(var(--acq-sec) * var(--acq-sec-parte, 0)); }

.al-center { text-align: center; }
.al-center .corpo { margin-inline: auto; }

.tit {
  margin: 22px 0 0;
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: calc(clamp(30px, 5vw, 52px) * var(--acq-esc));
  line-height: 1.1;
  color: var(--color-ink);
  max-width: 22ch;
}
.al-center .tit { margin-inline: auto; }

.corpo { margin-top: 20px; }

@media (max-width: 640px) {
  .sec { padding-block: var(--acq-sec-tel); }
}
</style>
