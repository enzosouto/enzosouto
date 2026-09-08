<script setup lang="ts">
/**
 * A ONDA DE TOQUE — o clique vira gota. Ver ficha.ts, ao lado.
 *
 * Um círculo nasce EXATAMENTE onde o dedo ou o ponteiro encostou, abre até
 * cobrir a superfície e some. É a marca em escala mínima: água responde ao
 * toque, e responde no ponto do toque.
 *
 * NASCER NO PONTO DO CLIQUE É O EFEITO INTEIRO. Uma onda que sempre parte do
 * centro é uma animação de destino — bonita e muda, porque não diz nada sobre
 * o que a pessoa fez. Nascendo sob o dedo, ela confirma o toque: é a diferença
 * entre "algo aconteceu" e "aconteceu AQUI, porque você tocou aqui".
 *
 * ESCUTA NO PAI, E NÃO EM SI MESMA. O componente é uma CAMADA: ele não embrulha
 * nada, não recebe o conteúdo por slot e não muda o layout de quem o usa. Fica
 * dentro do elemento que deve reagir — botão, cartão, chip — e escuta o
 * `pointerdown` dele. Embrulhar exigiria trocar a marcação de todo lugar que
 * quisesse a onda; assim, basta acrescentar uma linha.
 *
 * `pointerdown` E NÃO `click`. O clique só dispara ao SOLTAR, e num toque de
 * telefone isso é uns 120ms depois do encostar — tempo suficiente para a onda
 * parecer atrasada em relação ao dedo. `pointerdown` cobre mouse, toque e
 * caneta no mesmo evento.
 *
 * CADA ONDA SE APAGA SOZINHA. O elemento sai do DOM no fim da própria
 * animação, pelo evento — não por relógio. Um `setTimeout` com a duração
 * copiada à mão fica errado no dia em que o token de duração mudar, e o
 * sintoma seria um punhado de círculos invisíveis empilhados para sempre.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

withDefaults(defineProps<{
  /** Cor da onda. Por padrão, a tinta de quem a contém, bem apagada. */
  cor?: string
}>(), { cor: 'currentColor' })

const camada = ref<HTMLElement | null>(null)
let pai: HTMLElement | null = null
let aoTocar: ((e: PointerEvent) => void) | undefined

onMounted(() => {
  pai = camada.value?.parentElement ?? null
  if (!pai) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

  aoTocar = (e: PointerEvent) => {
    const r = pai!.getBoundingClientRect()
    /* O DIÂMETRO É A MAIOR DIMENSÃO, e não a média nem a diagonal: a onda tem
       de cobrir o elemento inteiro mesmo partindo de um canto, senão ela para
       no meio e vira um círculo pousado em cima do botão. */
    const lado = Math.max(r.width, r.height)
    const onda = document.createElement('span')
    onda.className = 'onda'
    onda.style.width = onda.style.height = `${lado}px`
    onda.style.left = `${e.clientX - r.left - lado / 2}px`
    onda.style.top = `${e.clientY - r.top - lado / 2}px`
    onda.addEventListener('animationend', () => onda.remove())
    camada.value?.append(onda)
  }
  pai.addEventListener('pointerdown', aoTocar)
})

onBeforeUnmount(() => {
  if (pai && aoTocar) pai.removeEventListener('pointerdown', aoTocar)
})
</script>

<template>
  <span ref="camada" class="camada" aria-hidden="true" :style="{ '--acq-onda-cor': cor }" />
</template>

<style scoped>
/* A CAMADA É QUEM RECORTA, e não o elemento de fora. Pedir `overflow: hidden`
   ao botão cortaria também o anel de foco, que precisa transbordar para ser
   visto — é o tipo de conserto que troca um defeito visível por um defeito de
   acessibilidade. Aqui o recorte fica na camada, que não tem foco nenhum. */
.camada {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
}

.camada :deep(.onda) {
  position: absolute;
  border-radius: 50%;
  background: var(--acq-onda-cor);
  opacity: 0.28;
  transform: scale(0);
  animation: acq-onda var(--dur-lento) var(--mov-onda) forwards;
}

@keyframes acq-onda {
  to {
    transform: scale(2.4);
    opacity: 0;
  }
}
</style>
