<script setup lang="ts">
/**
 * O ANEL DE ÁGUA — o cursor da casa.
 *
 * Um aro de ciano que acompanha o ponteiro e ABRE sobre o que é clicável. É o
 * mesmo gesto da marca em escala mínima: a superfície reage ao toque.
 *
 * NASCEU DENTRO DE UM AMBIENTE E SAIU DUAS VEZES. Primeiro morava junto com o
 * mar e as bolhas numa proposta de desenho em avaliação, e por isso só existia
 * naquela proposta — o site de verdade ficava sem ele. Virou peça do site; e aí
 * ficou claro que também não era do site: é da marca, e vale numa página sem
 * mar nenhum. Cada mudança dessas custou uma reescrita; a regra que sobrou é a
 * de sempre — o que é da marca mora na biblioteca.
 *
 * MONTE UMA VEZ POR PÁGINA. Ele escuta `mousemove` no `window` e desenha um
 * aro; duas instâncias são dois aros perseguindo o mesmo ponteiro, e o de cima
 * esconde o de baixo — o defeito aparece como "o cursor está borrado", não como
 * "há dois cursores". Em página com quadros embutidos, monte só na de fora.
 *
 * ONDE ELE VIVE, E POR QUÊ. Em `<Teleport to="body">`: precisa ficar acima de
 * qualquer seção e FORA de todo contexto de empilhamento. Um `z-index` alto
 * dentro de uma seção com `transform` ou `filter` não vence nada — aquele
 * elemento cria o próprio contexto, e o anel ficaria preso debaixo da seção
 * seguinte. Teleport resolve sem `document.createElement` e sem CSS solto.
 *
 * TRÊS CONDIÇÕES PARA EXISTIR, e nenhuma é largura de tela:
 *   · `(hover: hover) and (pointer: fine)` — um tablet de 1024px tem dedo, e
 *     um anel perseguindo um ponteiro que não existe fica parado num canto;
 *   · `prefers-reduced-motion: reduce` — é movimento perpétuo preso ao olho;
 *   · a montagem em si, porque nada aqui é essencial à leitura.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

/* O que faz o anel abrir. Não é `:hover` em CSS porque o anel não é filho de
   nada: ele está no `body`, e quem sabe o que está sob o ponteiro é o
   `mousemove` — que já é o evento que temos na mão. */
const CLICAVEL = 'a[href], button, [role="button"], input, select, textarea, summary, label'

const ligado = ref(false)
const aceso = ref(false)
const aberto = ref(false)
const aro = ref<HTMLElement | null>(null)

let quadro = 0
let aoMover: ((e: MouseEvent) => void) | undefined
let aoSair: ((e: MouseEvent) => void) | undefined

onMounted(() => {
  if (typeof matchMedia !== 'function') return
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  ligado.value = true

  /* A POSIÇÃO É ESCRITA NUM `requestAnimationFrame`, e não no evento.
     `mousemove` dispara mais vezes do que a tela pinta — em mouse de 1000Hz,
     oito vezes por quadro — e cada escrita de estilo que o navegador não vai
     mostrar é trabalho jogado fora. Guardar o último evento e pintar uma vez
     por quadro dá o mesmo resultado visual pela fração do custo.

     E é `transform`, não `left`/`top`: os dois últimos são geometria, e mudar
     geometria a 60Hz recalcula layout a 60Hz. `transform` fica na composição. */
  let x = 0
  let y = 0
  const pintar = () => {
    quadro = 0
    if (aro.value?.parentElement) {
      aro.value.parentElement.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
  }

  aoMover = (e: MouseEvent) => {
    x = e.clientX
    y = e.clientY
    aceso.value = true
    aberto.value = !!(e.target as Element | null)?.closest?.(CLICAVEL)
    if (!quadro) quadro = requestAnimationFrame(pintar)
  }

  /* `relatedTarget` nulo é o ponteiro saindo da JANELA, não passando de um
     elemento para outro. Sem esta distinção o anel apagaria a cada troca de
     elemento; sem o tratamento nenhum, ele congela na borda quando a pessoa
     vai para outra aba. */
  aoSair = (e: MouseEvent) => {
    if (!e.relatedTarget) aceso.value = false
  }

  addEventListener('mousemove', aoMover, { passive: true })
  addEventListener('mouseout', aoSair)
})

onBeforeUnmount(() => {
  if (aoMover) removeEventListener('mousemove', aoMover)
  if (aoSair) removeEventListener('mouseout', aoSair)
  if (quadro) cancelAnimationFrame(quadro)
})
</script>

<template>
  <Teleport v-if="ligado" to="body">
    <div class="anel" aria-hidden="true">
      <!-- DUAS CAMADAS DE PROPÓSITO. A de fora carrega a POSIÇÃO e não pode
           ter transição — com uma, o anel viraria um balão puxado por
           barbante, sempre atrás do ponteiro. A de dentro carrega o TAMANHO e
           a opacidade, que são justamente o que deve transitar. Numa camada
           só, a transição de tamanho arrastaria a posição junto. -->
      <span ref="aro" class="aro" :class="{ aceso, aberto }" />
    </div>
  </Teleport>
</template>

<style scoped>
.anel {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
}

.aro {
  display: block;
  width: 22px;
  height: 22px;
  margin: -11px 0 0 -11px;
  border-radius: 50%;
  border: 1.5px solid var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
  opacity: 0;
  /* `screen` faz o anel CLAREAR o que está embaixo em vez de tapar: sobre
     texto escuro ele acende, sobre fundo claro some. É o que o mantém legível
     sem precisar de contorno próprio. */
  mix-blend-mode: screen;
  transition:
    transform var(--dur-padrao) var(--mov-onda),
    opacity var(--dur-padrao) var(--mov-onda),
    background-color var(--dur-padrao) var(--mov-onda);
}

.aro.aceso {
  opacity: 0.5;
}

/* Sobre o que é clicável o aro ABRE — e essa é a única informação que ele
   carrega. Sem isso o anel é enfeite que segue o mouse; com isso ele diz onde
   a página responde, antes do `:hover` do próprio elemento. */
.aro.aberto {
  transform: scale(2.1);
  background: color-mix(in srgb, var(--color-accent) 20%, transparent);
}
</style>
