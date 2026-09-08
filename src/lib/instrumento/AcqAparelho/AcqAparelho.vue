<script setup lang="ts">
/**
 * <AcqAparelho> — o site rodando dentro de um aparelho de verdade.
 *
 * Não é desenho de aparelho em CSS: é a fotografia de um mockup com a tela
 * RECORTADA, e o site vivo aparecendo pelo buraco. Dá para rolar e clicar lá
 * dentro.
 *
 * COMO A PEÇA FOI FEITA (o caminho inteiro está em `mistura/base/`):
 *   1 · uma placa magenta com malha de pontos verdes entra na tela do mockup;
 *   2 · o mockup é exportado grande, com fundo transparente;
 *   3 · a medição acha os pontos, resolve a perspectiva por mínimos quadrados e
 *       recorta o magenta — sobra o aparelho com um buraco no formato do vidro;
 *   4 · aqui o `<iframe>` entra ATRÁS e é projetado para os quatro cantos.
 *
 * DE ONDE ELE VEIO. Este componente foi escrito dentro do site e morou em três
 * pastas antes desta — uma delas era o espelho da biblioteca, que é apagado
 * antes de cada sincronização, e ele foi perdido lá uma vez inteiro. O vaivém
 * acabou quando ficou claro o que ele é: um INSTRUMENTO, irmão do
 * `AcqDeviceFrame`. Aquele desenha a moldura como RÉGUA, em dp reais, para
 * medir composição; este põe o produto dentro de um aparelho FOTOGRAFADO, com
 * a perspectiva medida, para mostrar. Régua e vitrine, não duplicata.
 *
 * AS PEÇAS VIAJAM COM A BIBLIOTECA. `aparelhos.json` fica ao lado deste arquivo
 * e as imagens em `public/aparelhos/`. Deixá-las no produto que usa parecia mais
 * limpo e não é: a ficha e a foto são UM par medido — trocar uma sem a outra
 * desloca o conteúdo para fora do vidro, e o defeito não tem mensagem de erro.
 *
 * TRÊS DETALHES QUE PARECEM SUPÉRFLUOS E NÃO SÃO:
 *
 *  · A foto precisa de `position` e `z-index`. Ordem de DOM não decide quem
 *    pinta em cima: elemento posicionado pinta acima de irmão não posicionado.
 *    Sem isso o site sobe por cima da moldura do aparelho.
 *
 *  · A foto precisa de `pointer-events: none`. Transparência não é buraco para
 *    o mouse — o pixel com alfa 0 continua recebendo clique, e a foto rouba
 *    tudo que era para o `<iframe>`. Sem esta linha o mockup vira figura.
 *
 *  · O `<iframe>` precisa do `clip-path` quando a peça tem contorno medido. O
 *    quadrilátero é a projeção da PLACA, e quando o mockup a recorta para
 *    preencher a tela, os cantos dela caem fora do vidro.
 *
 * O QUE NÃO VOLTA: uma camada de reflexo por cima do vidro. A ideia era separar
 * fotografia de render — numa cena real existe luz na sala. Só que estas peças
 * são frontais e recortadas, sem cena nenhuma, e um gradiente branco sobre um
 * site que também é claro em cima não lê como vidro: lê como mancha atravessada
 * na tela. Reflexo pede cena; sem cena, some.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import aparelhos from './aparelhos.json'
import { matrizDaTela, paraOAparelho, type Ponto, type Quad } from './homografia'

const props = withDefaults(
  defineProps<{
    /** Qual peça: `macbook`, `ipad` ou `iphone`. */
    aparelho: keyof typeof aparelhos
    /** O que carregar dentro da tela. */
    src: string
    /** Título do quadro embutido — vai para leitor de tela. */
    titulo: string
    /**
     * Id da seção que deve aparecer na tela.
     *
     * POR QUE NÃO ÂNCORA NA URL. `#secao` leva o navegador ao TOPO do elemento
     * e para ali — e como cada aparelho tem uma altura de tela diferente, o que
     * cabe abaixo varia: no tablet sobrava o rodapé da seção seguinte, e a tela
     * mostrava o fim de um assunto grudado no começo de outro.
     */
    mostrar?: string
    /** Cor sob a tela enquanto o conteúdo não pintou. */
    fundo?: string
  }>(),
  { mostrar: undefined, fundo: 'var(--color-canvas, #05161f)' },
)

const ficha = aparelhos[props.aparelho] as {
  arquivo: string
  tamanho: [number, number]
  quad: Quad
  recorte: Ponto[] | null
  viewport: [number, number]
}

const [W, H] = ficha.tamanho
const [vw, vh] = ficha.viewport

const matriz = computed(() => matrizDaTela(vw, vh, ficha.quad))

/* Peça sem contorno medido não precisa de recorte: a tela já é o próprio
   retângulo do quadro. Recortar à toa põe um polígono no caminho do ponteiro
   sem nenhum ganho. */
const recorte = computed(() => {
  if (!ficha.recorte?.length) return 'none'
  const pts = paraOAparelho(vw, vh, ficha.quad, ficha.recorte)
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`
})

const moldura = ref<HTMLElement | null>(null)
const tela = ref<HTMLIFrameElement | null>(null)
const escala = ref(1)
let observador: ResizeObserver | undefined
let vigia: MutationObserver | undefined
let vigiaDeDentro: MutationObserver | undefined

/* O TEMA TEM DE ATRAVESSAR O VIDRO.
   Quem troca para o tema claro vê a página clarear e os aparelhos continuarem
   escuros — e a leitura imediata é que aquilo ali é figura, não página. O
   quadro é da MESMA origem, então basta copiar o atributo da raiz de fora para
   a de dentro; trocar o `src` recarregaria o site a cada clique no tema. */
function espelharTema() {
  const dentro = tela.value?.contentDocument?.documentElement
  const fora = document.documentElement.dataset.tema
  if (!dentro || !fora) return
  // A comparação evita laço: escrever o mesmo valor dispararia o observador de
  // dentro, que chamaria esta função de novo, para sempre.
  if (dentro.dataset.tema !== fora) dentro.dataset.tema = fora

  /* O SITE DE DENTRO TAMBÉM DECIDE O TEMA, e decide DEPOIS: ele lê a
     preferência salva quando monta, em algum instante entre o `load` e o
     primeiro quadro pintado. Espelhar uma vez perdia a corrida e deixava um
     aparelho fora do tema no meio dos três. */
  if (!vigiaDeDentro) {
    vigiaDeDentro = new MutationObserver(espelharTema)
    vigiaDeDentro.observe(dentro, { attributes: true, attributeFilter: ['data-tema'] })
  }
}

/** Põe a seção pedida na tela e dispensa a animação de entrada lá dentro. */
function enquadrar() {
  const d = tela.value?.contentDocument
  const janela = tela.value?.contentWindow
  if (!d || !janela) return

  if (props.mostrar) {
    const alvo = d.getElementById(props.mostrar)
    if (alvo) {
      /* A BARRA FIXA DO SITE COME O TOPO DA TELA: o cabeçalho aparece assim que
         a página passa do hero e fica grudado no alto. A altura é MEDIDA, não
         chutada — ela muda com a escala de texto que o leitor escolher. */
      let topoOcupado = 0
      for (const el of d.querySelectorAll<HTMLElement>('body *')) {
        const st = janela.getComputedStyle(el)
        if (st.position !== 'fixed') continue
        const r = el.getBoundingClientRect()
        if (r.top <= 1 && r.height > 0 && r.width > janela.innerWidth * 0.6) {
          topoOcupado = Math.max(topoOcupado, r.height)
        }
      }

      /* A SEÇÃO COMEÇA NO TOPO DA TELA, sempre. Centralizar a que cabia
         parecia mais elegante e é pior: a metade da sobra vai para cima, e o
         que ocupa esse espaço é o FIM da seção anterior — a tela abre com um
         cartão cortado no meio de uma frase, e só depois vem o assunto. Do
         topo, o primeiro pixel já é o rótulo da seção pedida; o que sobra
         embaixo é o começo da seguinte, que é sempre um rótulo ou um título e
         lê como continuação, não como sujeira. */
      const alto = alvo.offsetTop - topoOcupado

      /* `behavior: 'instant'` NÃO É DETALHE: o site declara `scroll-behavior:
         smooth`, então atribuir posição vira ANIMAÇÃO, e qualquer coisa que
         role no meio do caminho a interrompe onde estiver. O resultado media
         148px de 2217 — a tela parava no hero e as três vitrines mostravam a
         mesma coisa. */
      janela.scrollTo({ top: Math.max(0, alto), behavior: 'instant' as ScrollBehavior })
    }
  }

  /* A CASCATA DE ENTRADA PRECISA SER DISPENSADA AQUI DENTRO. `AcqReveal` mantém
     cada peça em `opacity: 0` até cruzar a viewport, e desfaz isso uma vez só,
     por `IntersectionObserver`. Numa tela rolada por script o gatilho não é
     confiável: o observador nasce depois da rolagem, não vê movimento nenhum, e
     a tela fica com o título e mais nada. Numa vitrine a animação não tem
     função — ninguém rola esta tela para ser surpreendido. */
  for (const el of d.querySelectorAll<HTMLElement>('.acq-reveal-idle')) {
    el.style.transitionDelay = '0ms'
    el.classList.add('acq-reveal-in')
  }
}

function aoCarregar() {
  espelharTema()
  enquadrar()
  // Segunda e terceira passadas: o layout muda depois das fontes e da animação
  // de entrada, que alteram a altura das seções acima do alvo.
  setTimeout(enquadrar, 1200)
  setTimeout(enquadrar, 3600)
}

onMounted(() => {
  /* O `scale` sai do tamanho REAL da moldura, medido, e não de uma conta sobre
     a largura da janela: dentro de uma grade fluida a coluna final só existe
     depois do layout, e chutá-la erra em toda quebra. */
  const ajustar = () => {
    if (moldura.value) escala.value = moldura.value.clientWidth / W
  }
  observador = new ResizeObserver(ajustar)
  if (moldura.value) observador.observe(moldura.value)
  ajustar()

  tela.value?.addEventListener('load', aoCarregar)
  vigia = new MutationObserver(espelharTema)
  vigia.observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema'] })
})

onBeforeUnmount(() => {
  observador?.disconnect()
  vigia?.disconnect()
  vigiaDeDentro?.disconnect()
  tela.value?.removeEventListener('load', aoCarregar)
})
</script>

<template>
  <div ref="moldura" class="moldura" :style="{ aspectRatio: `${W} / ${H}` }">
    <div
      class="palco"
      :style="{ width: `${W}px`, height: `${H}px`, transform: `scale(${escala})` }"
    >
      <!-- Enquanto o quadro não pinta, o buraco fica na cor do site em vez de
           branco — um branco piscando no meio da tela é o que mais denuncia
           que ali tem página embutida. -->
      <div
        class="fundo"
        :style="{
          width: `${vw}px`,
          height: `${vh}px`,
          transform: matriz,
          clipPath: recorte,
          background: fundo,
        }"
      />

      <iframe
        ref="tela"
        class="tela"
        :src="src"
        :title="titulo"
        loading="lazy"
        :style="{ width: `${vw}px`, height: `${vh}px`, transform: matriz, clipPath: recorte }"
      />

      <img class="foto" :src="ficha.arquivo" alt="" :width="W" :height="H" />
    </div>
  </div>
</template>

<style scoped>
.moldura {
  position: relative;
  width: 100%;
}

/* O palco tem o tamanho NATURAL da foto e é reduzido por `scale`: assim toda a
   matemática continua em PIXEL DE FOTO, e os cantos medidos valem exatamente
   como foram medidos, qualquer que seja a largura da coluna. */
.palco {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
}

/* `transform-origin: 0 0` é obrigatório: o `matrix3d` leva o retângulo a partir
   da ORIGEM do elemento, e com a origem no centro (o padrão) a projeção pousa
   em qualquer lugar menos onde deveria. */
.fundo,
.tela {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
  border: 0;
}

.fundo {
  z-index: 1;
}

.tela {
  z-index: 2;
  /* Sem isto o Chrome desliga a interpolação na transformação de perspectiva e
     as diagonais saem serrilhadas. */
  backface-visibility: hidden;
}

.foto {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  display: block;
  max-width: none;
  pointer-events: none;
}
</style>
