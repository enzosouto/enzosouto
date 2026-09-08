<script setup lang="ts">
/**
 * O AMBIENTE DA PÁGINA — a composição, não as peças.
 *
 * Mar, partículas e luz eram escritos aqui dentro. Hoje são componentes da
 * biblioteca (`AcqMar`, `AcqBolhas`, `AcqBrilho`), e o que sobrou neste arquivo
 * é a única coisa que é mesmo do site: COMO eles se combinam nesta página —
 * a altura da faixa, onde ela dissolve, e o pin em cada cartão.
 *
 * A MUDANÇA NÃO FOI ARRUMAÇÃO. Enquanto o mar morava aqui, ele não existia em
 * nenhum outro lugar da marca; a segunda superfície que precisasse de água iria
 * reescrevê-lo com números ligeiramente diferentes, e a marca passaria a ter
 * dois mares parecidos. Os números — três lâminas, períodos sem divisor comum,
 * deriva de meia largura — são regra, e regra mora na biblioteca.
 *
 * O PIN É TELEPORTADO, e é isso que deixa as seções em paz. Ele entra no
 * cabeçalho de cada cartão sem que o cartão precise saber que existe um
 * marcador: o conteúdo é do site, e nenhuma seção deve carregar uma linha
 * escrita por causa de decoração. O espaço para ele é aberto por
 * `liquido.css` — e a folga lá depende de especificidade, não de sorte; está
 * explicado no arquivo.
 */
import { onMounted, ref } from 'vue'
import AcqBolhas from '@/lib/marca/AcqBolhas/AcqBolhas.vue'
import AcqBrilho from '@/lib/marca/AcqBrilho/AcqBrilho.vue'
import AcqMar from '@/lib/marca/AcqMar/AcqMar.vue'
import AcqWavePin from '@/lib/marca/AcqWavePin/AcqWavePin.vue'

const destinos = ref<HTMLElement[]>([])

onMounted(() => {
  /* Os cabeçalhos de cartão só existem depois que as seções montaram, e o
     Teleport precisa de um elemento de verdade — daí medir aqui, e não numa
     propriedade calculada. */
  destinos.value = Array.from(
    document.querySelectorAll<HTMLElement>('[data-test="card"] > header'),
  )
})
</script>

<template>
  <!-- Decoração pura: fora do fluxo, fora da árvore de acessibilidade e fora
       do alcance do ponteiro. -->
  <div class="acq-ambiente" aria-hidden="true">
    <AcqMar :laminas="3" altura="46vh" />
    <AcqBrilho />
    <AcqBolhas :quantidade="8" />
  </div>

  <!-- O PIN DA MARCA em cada cartão. `animate` porque, num selo que fica na
       tela o tempo todo, a maré é cíclica: enche, esvazia, enche. O ciclo varia
       por índice para os cartões não pulsarem em uníssono. -->
  <Teleport v-for="(alvo, i) in destinos" :key="i" :to="alvo">
    <span class="acq-pin-cartao"><AcqWavePin size="sm" animate :ciclo="9 + (i % 4)" /></span>
  </Teleport>
</template>

<style>
/* SEM `scoped`, e a classe do pin com prefixo por causa disso: ele é
   TELEPORTADO para dentro do cabeçalho dos cartões, que estão fora deste
   componente, e o atributo de escopo do Vue não viaja com ele. */

.acq-ambiente {
  position: absolute;
  inset: 0 0 auto;
  height: 92vh;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;

  /* O AMBIENTE DISSOLVE, NÃO TERMINA.
     Com `overflow: hidden` e altura fixa, o mar era cortado numa linha reta: a
     água azulada acabava de uma vez e virava o preto do fundo, deixando uma
     faixa horizontal atravessando a página inteira. Corte reto num fundo é o
     tipo de coisa que o olho lê como erro de renderização, não como desenho. A
     máscara faz a última terça parte desaparecer aos poucos. */
  mask-image: linear-gradient(to bottom, #000 62%, transparent 100%);
}

.acq-pin-cartao {
  position: absolute;
  top: 22px;
  left: 24px;
  display: block;
  line-height: 0;
}
</style>
