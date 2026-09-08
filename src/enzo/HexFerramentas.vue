<script setup lang="ts">
/**
 * O ENXAME DE FERRAMENTAS — o logo de cada tecnologia num hexágono, boiando
 * solto ao lado da lista de habilidades.
 *
 * DECORAÇÃO PURA, `aria-hidden`. A lista de texto em `PaginaEnzo.vue` (os
 * `AcqTag` dentro de `.pills`) já diz cada ferramenta por nome pra quem usa
 * leitor de tela; repetir aqui seria ouvir "Python, Python" sem nenhuma
 * informação nova — o mesmo raciocínio do `AcqBolhas` e do `AcqMar`.
 *
 * BOIA COM ATRASO NEGATIVO, mesma doutrina do `AcqBolhas`: duração e atraso
 * diferentes por peça (`FERRAMENTAS`, em `conteudo.ts`) pra não subirem todas
 * juntas em cortina — o atraso negativo faz cada uma já nascer no meio do
 * próprio ciclo.
 *
 * SOMBRA POR `filter: drop-shadow`, NÃO `box-shadow`. `clip-path` corta a
 * caixa inteira, sombra de `box-shadow` incluída — o hexágono ficaria sem
 * sombra nenhuma. `drop-shadow` desenha depois do recorte, seguindo o
 * contorno de verdade.
 *
 * ABAIXO DE 1080PX, O ENXAME DESCE E VIRA GRADE. Onze hexágonos soltos ao
 * lado de uma coluna de texto só cabem quando sobra largura de verdade — no
 * celular não sobra, então o mesmo `.hexes` troca de `position: absolute`
 * (nuvem flutuando ao lado) para `static` num `flex-wrap` (fileira quebrada
 * embaixo das ferramentas). É a MESMA marcação e os MESMOS `f.x`/`f.y` do
 * template; `position: static` simplesmente ignora `left`/`top` por
 * definição da especificação — não precisa de um segundo `v-for`. `left`
 * fica no HTML porque a régua de origem do bug some, mas o valor não
 * atrapalha nada quando `position` não é `absolute`/`relative`/`fixed`.
 */
import { FERRAMENTAS } from './conteudo'
</script>

<template>
  <div class="hexes" aria-hidden="true">
    <div
      v-for="f in FERRAMENTAS"
      :key="f.nome"
      class="hex"
      :style="{
        left: `${f.x}%`,
        top: `${f.y}%`,
        width: `${f.tam}px`,
        height: `${f.tam}px`,
        animationDuration: `${f.dur}s`,
        animationDelay: `${f.atraso}s`,
        padding: `${f.tam * 0.16}px`,
      }"
    >
      <img :src="`/ferramentas/${f.arquivo}`" alt="" loading="lazy" />
    </div>
  </div>
</template>

<style scoped>
.hexes {
  position: relative;
  flex: 0 0 auto;
  width: 320px;
  height: 560px;
}
.hex {
  position: absolute;
  box-sizing: border-box;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  background: var(--color-card);
  border: 1px solid var(--color-hair);
  filter: drop-shadow(0 8px 16px rgb(0 0 0 / 0.35));
  display: flex;
  align-items: center;
  justify-content: center;
  /* PADDING EM PX, NÃO EM `%` — porcentagem de padding resolve contra a
     largura do CONTAINING BLOCK (`.hexes`, 320px), não contra o próprio
     hexágono: um hex de 58px com `padding: 15%` levava 48px de recuo de
     CADA lado — 96px, mais que o hexágono inteiro — e a imagem colapsava
     pra largura zero. Por isso o valor vem calculado por peça, em `f.tam`,
     no `:style` do template. */
  animation-name: boiar;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
.hex img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
@keyframes boiar {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-14px) rotate(3deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .hex {
    animation: none;
  }
}
@media (max-width: 1080px) {
  .hexes {
    width: auto;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    gap: 22px 18px;
    padding-top: 8px;
  }
  .hex {
    position: static;
  }
}
</style>
