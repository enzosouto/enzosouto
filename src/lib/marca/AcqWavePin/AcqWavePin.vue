<script lang="ts">
/* Contador de módulo — mesma razão do AcqWave: dentro de `<script setup>` todo
   código de topo roda por INSTÂNCIA, e um contador ali não conta nada. */
let contador = 0
</script>

<script setup lang="ts">
/**
 * ACQWAVEPIN — O MESMO MECANISMO DO AcqWave, NUM CÍRCULO.
 *
 * Esta peça não reinventa nada: é o `AcqWave` com a máscara trocada. Lá o
 * recorte é o nome ACQUARIO; aqui é um disco. Tudo o mais é idêntico, e a
 * identidade é o ponto — a marca líquida e o ponto da marca são a MESMA água,
 * então um nunca destoa do outro.
 *
 * O QUE VEIO DE LÁ, INTEIRO:
 *   · a pilha de três camadas — máscara por fora, filtro no meio, movimento
 *     por dentro. Juntar duas delas quebra, e os dois defeitos foram medidos
 *     nesta página: `mask` no elemento que se move faz o recorte VIAJAR com a
 *     água (ela vaza para fora do disco), e `filter` no elemento que se move
 *     faz o Chrome descartar o `transform` (a maré não sobe).
 *   · a superfície é senoide DERIVANDO na horizontal, não borda reta com
 *     ruído. Três lâminas, comprimentos e velocidades diferentes, todos
 *     dividindo a largura para o laço não ter emenda.
 *   · `feTurbulence` + `feDisplacementMap` por cima, com a região do filtro
 *     declarada em unidade de usuário.
 *   · os três níveis de degradação: sem movimento, ponteiro grosso, desktop.
 *
 * O QUE MUDA, e é só isto: a maré aqui é CÍCLICA. No `AcqWave` a água sobe uma
 * vez, enche o nome e fica — a marca em repouso é a letra cheia. Num selo não
 * existe repouso: ele fica na tela o tempo todo, então a água enche, esvazia e
 * enche de novo. A amplitude leva a superfície para FORA do disco nas duas
 * pontas; parar no meio do caminho é o que produzia a meia-lua da primeira
 * versão.
 */
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: 'xs' | 'sm' | 'md' | 'lg'
    /** Liga a maré e a deriva. Sem isto o selo é um recorte parado. */
    animate?: boolean
    /** Segundos de um ciclo completo — encher, esvaziar, encher. */
    ciclo?: number
    /** O tom. `neutro` é a marca; os outros dois carregam sentido. */
    tone?: 'neutro' | 'positivo' | 'negativo'
    label?: string
  }>(),
  { size: 'md', animate: false, ciclo: 11, tone: 'neutro', label: undefined },
)

/* Sufixo de instância: `url(#id)` é global ao documento, e dois selos na mesma
   página com o mesmo id dividem máscara e filtro. `useId()` reinicia a cada app
   criado — o contador de módulo fecha esse buraco. */
const semente = `${String(useId() ?? '').replace(/[^A-Za-z0-9_-]/g, '')}-${++contador}`
const idLiquido = `acq-pin-liquido-${semente}`
const idLeve = `acq-pin-leve-${semente}`
const idDisco = `acq-pin-disco-${semente}`
const idAgua = `acq-pin-agua-${semente}`

/** O caminho de uma lâmina: senoide sobre três larguras do viewBox, fechada
 *  bem abaixo. O fecho vai a 500 porque a maré move o grupo inteiro — com um
 *  fecho raso, subir a água levantaria o FUNDO dela junto e abriria uma faixa
 *  vazia embaixo do disco. */
function caminho(base: number, amplitude: number, comprimento: number, fase: number) {
  const pontos: string[] = []
  for (let x = -100; x <= 200; x += 2) {
    const y = base + amplitude * Math.sin((2 * Math.PI * x) / comprimento + fase)
    pontos.push(`${x === -100 ? 'M' : 'L'}${x} ${y.toFixed(2)}`)
  }
  pontos.push('L200 500', 'L-100 500', 'Z')
  return pontos.join(' ')
}

/* As lâminas, do fundo para a frente. Comprimentos que dividem 100 (o laço) e
   velocidades diferentes (a profundidade). */
const LAMINAS = [
  { n: 3, amp: 5, comprimento: 100 / 3, fase: 2.3, velocidade: 0.55, tinta: 0.32 },
  { n: 2, amp: 7, comprimento: 50, fase: 1.1, velocidade: 0.75, tinta: 0.55 },
  { n: 1, amp: 9, comprimento: 100, fase: 0, velocidade: 1, tinta: 1 },
] as const

const laminas = computed(() =>
  LAMINAS.map((l) => ({
    ...l,
    d: caminho(50, l.amp, l.comprimento, l.fase),
    estilo: {
      '--acq-deriva': `${(props.ciclo * l.velocidade).toFixed(2)}s`,
      '--acq-tinta': String(l.tinta),
      /* cada lâmina entra na maré com atraso próprio: as três subindo coladas
         leem como um bloco, não como água */
      '--acq-atraso': `${(-l.n * 0.5).toFixed(2)}s`,
    },
  })),
)

const estilo = computed(() => ({
  '--acq-filtro': `url(#${idLiquido})`,
  '--acq-filtro-leve': `url(#${idLeve})`,
  /* instâncias diferentes em pontos diferentes do ciclo: uma lista inteira
     pulsando em uníssono lê como erro de renderização */
  '--acq-mare-atraso': `${(-(contador * 2.7) % props.ciclo).toFixed(2)}s`,
  '--acq-ciclo': `${props.ciclo}s`,
}))

const rotulo = computed(() => props.label ?? 'onda')
</script>

<template>
  <svg
    :class="['pin', `pin-${size}`, `tom-${tone}`, { correndo: animate }]"
    :style="estilo"
    viewBox="0 0 100 100"
    role="img"
    :aria-label="rotulo"
    data-test="wave-pin"
  >
    <title>{{ rotulo }}</title>

    <defs>
      <!-- O filtro completo. `fractalNoise` porque o ruído fractal é simétrico
           em torno do meio: a linha d'água ondula para os dois lados em vez de
           só descer. A região é declarada em unidade de usuário e cobre o curso
           inteiro da maré — em porcentagem ela sai da caixa do elemento ANTES
           do transform dos filhos, e corta a água quando ela sobe. -->
      <filter
        :id="idLiquido"
        filterUnits="userSpaceOnUse"
        x="-140"
        y="-200"
        width="400"
        height="900"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.03 0.06"
          numOctaves="2"
          seed="7"
          result="ruido"
        >
          <animate
            v-if="animate"
            attributeName="baseFrequency"
            dur="14s"
            values="0.03 0.06;0.045 0.04;0.03 0.06"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feDisplacementMap
          in="SourceGraphic"
          in2="ruido"
          scale="4"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      <!-- A versão leve, para dedo: uma oitava e ruído parado. -->
      <filter
        :id="idLeve"
        filterUnits="userSpaceOnUse"
        x="-140"
        y="-200"
        width="400"
        height="900"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.03 0.06"
          numOctaves="1"
          seed="7"
          result="ruido-leve"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="ruido-leve"
          scale="2"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      <!-- A MÁSCARA É O DISCO. É a única diferença de forma para o AcqWave,
           onde ela é o nome. Sem anel em volta: a marca é a água. -->
      <mask :id="idDisco">
        <circle cx="50" cy="50" r="50" fill="#fff" />
      </mask>

      <linearGradient :id="idAgua" x1="0" y1="0" x2="0" y2="1">
        <stop class="crista" offset="0%" />
        <stop class="fundo" offset="100%" />
      </linearGradient>
    </defs>

    <g :mask="`url(#${idDisco})`">
      <g class="liquido">
        <g v-for="l in laminas" :key="l.n" class="mare" :style="l.estilo">
          <path class="onda" :d="l.d" :fill="`url(#${idAgua})`" />
        </g>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.pin {
  display: inline-block;
  vertical-align: middle;
}
.pin-xs {
  width: 15px;
  height: 15px;
  transform: translateY(2px);
}
.pin-sm {
  width: 28px;
  height: 28px;
}
.pin-md {
  width: 48px;
  height: 48px;
}
.pin-lg {
  width: 88px;
  height: 88px;
}

/* O tom troca UMA variável e as duas pontas do gradiente leem dela. */
.tom-neutro {
  --acq-crista: var(--color-accent);
  --acq-fundo: var(--color-accent-text);
}
.tom-positivo {
  --acq-crista: var(--color-positivo);
  --acq-fundo: var(--color-positivo);
}
.tom-negativo {
  --acq-crista: var(--color-negativo);
  --acq-fundo: var(--color-negativo);
}
.crista {
  stop-color: var(--acq-crista);
}
.fundo {
  stop-color: var(--acq-fundo);
}

.liquido {
  filter: var(--acq-filtro);
}

/* A MARÉ — o eixo vertical. Sai de fora do disco por baixo, enche até sair por
   cima, e volta. Duas cheias por volta, com fundos diferentes: dois iguais em
   seguida devolvem a leitura de metrônomo. */
@keyframes acq-pin-mare {
  0% {
    transform: translateY(62px);
  }
  24% {
    transform: translateY(-62px);
  }
  44% {
    transform: translateY(46px);
  }
  66% {
    transform: translateY(-62px);
  }
  86% {
    transform: translateY(52px);
  }
  100% {
    transform: translateY(62px);
  }
}
.mare {
  transform-box: view-box;
  transform-origin: 0 0;
}
.correndo .mare {
  animation: acq-pin-mare var(--acq-ciclo) ease-in-out
    calc(var(--acq-mare-atraso) + var(--acq-atraso)) infinite;
}

/* A DERIVA — o eixo horizontal, em elemento próprio: os dois no mesmo elemento
   disputam `transform` e um dos movimentos some. */
@keyframes acq-pin-deriva {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100px);
  }
}
.onda {
  transform-box: view-box;
  transform-origin: 0 0;
  opacity: var(--acq-tinta);
}
.correndo .onda {
  animation: acq-pin-deriva var(--acq-deriva) linear infinite;
}

@media (pointer: coarse) {
  .liquido {
    filter: var(--acq-filtro-leve);
  }
}
@media (prefers-reduced-motion: reduce) {
  .correndo .mare,
  .correndo .onda {
    animation: none;
  }
}
</style>
