<script setup lang="ts">
/**
 * IMAGEM QUE MONTA EM CACOS — o retrato do Enzo, a assinatura dele e cada
 * selo de empresa/instituição em EXPERIENCIA/FORMACAO usam a MESMA peça, só
 * com dimensões diferentes (props). Cada uma reconstrói a própria imagem a
 * partir de dado espalhado na entrada; retrato e assinatura ficam vivos
 * depois (anel girando, brilho de scanner) — os selos usam `sem-moldura`,
 * só o quadro montando em cacos, sem esse resto (ver a prop, mais abaixo).
 *
 * POR QUE NÃO É COMPONENTE DE `src/lib`. São as únicas imagens pessoais do
 * site — nenhuma outra página da ACQUARIO retrata pessoa, assina com
 * caligrafia ou monta logo de terceiro em cacos. Peso na biblioteca sem um
 * uso fora deste currículo pra provar que o desenho generaliza — mesmo
 * raciocínio do `.hover-3d` da proposta Pimenta, que também ficou local.
 *
 * A GRADE DE CACOS. N×N caixinhas absolutas, cada uma mostrando só a fatia
 * dela da imagem. Cada caco nasce deslocado PRA FORA do centro da grade (na
 * direção caco→centro invertida) e gira um pouco; a animação devolve todos
 * a `translate(0,0) rotate(0)` na ordem de QUEM ESTÁ MAIS LONGE DO CENTRO
 * PRIMEIRO — os cacos de fora chegam antes, os do meio fecham por último,
 * como um foco que assenta de fora pra dentro.
 *
 * `background-size` EM PX, NÃO EM `%` — E A PROPORÇÃO DA IMAGEM SOBREVIVE.
 * `%` em `background-size` conta a partir da caixa do PRÓPRIO caco, não do
 * quadro inteiro — `800% 800%` fixo virava "a imagem espremida num quadrado
 * do tamanho do quadro" nos dois eixos igual, mesmo a imagem não sendo
 * quadrada. A conta certa é `object-fit: cover` feita à mão — escala único
 * fator (`COVER`), igual nos dois eixos, aplicado à imagem INTEIRA
 * (`COVER_W × COVER_H`, sempre a mesma pra todo caco); o que muda por caco é
 * só o deslocamento (`background-position`, em px negativo) até a fatia
 * dele. O corte, quando existe, sempre fica embaixo — o recorte nasce do
 * topo, nunca do centro, então um rosto no alto da foto nunca perde a
 * cabeça, e uma imagem cujo quadro já reproduz a proporção dela (a
 * assinatura, larga, contra um quadro largo) não corta nada.
 *
 * NÚMEROS ESCRITOS À MÃO, NÃO SORTEADOS — mesma doutrina do `AcqBolhas`:
 * `Array.from` com uma fórmula determinística, pra a página renderizar
 * igual toda vez.
 *
 * SOB `prefers-reduced-motion`, o CSS zera a animação de entrada (cacos já
 * nascem no lugar final, ver a media query abaixo) e o anel para de girar —
 * mesma doutrina do `AcqReveal`: nunca depender de movimento pra existir.
 *
 * MONTA QUANDO ENTRA NA TELA, NÃO QUANDO O COMPONENTE NASCE. A primeira
 * versão disparava a montagem no `mount` — ótimo pro retrato da capa (que já
 * está na tela), péssimo pros selos lá embaixo em EXPERIENCIA/FORMACAO: o
 * `animation-delay` mais longo é de meio segundo, e ninguém rola até lá em
 * meio segundo — a pessoa chegava e os cacos já estavam parados, montados,
 * sem o gesto nenhum. Mesmo `IntersectionObserver` de sempre-uma-vez do
 * `AcqReveal`: observa a raiz, quando ela cruza a tela liga a classe
 * `.pronto` (que é quem de fato liga a animação, ver `<style>`) e para de
 * observar — a montagem acontece exatamente na hora de quem rolou até ali.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    arquivo: string
    /** Largura/altura naturais do arquivo, em px — pra calcular o `cover` sem distorcer. */
    imgW: number
    imgH: number
    /** Tamanho do quadro final, em px. `altura` cai pra `largura` (quadro quadrado) se omitida. */
    largura?: number
    altura?: number
    /** Sem anel girando nem varredura — só o quadro montando em cacos. Os
     *  selos de empresa/instituição usam isto: um anel pensado pra moldura
     *  quase quadrada do retrato ficava esticado nos logos, que variam muito
     *  de proporção entre si. */
    semMoldura?: boolean
  }>(),
  { largura: 176, altura: undefined, semMoldura: false },
)

const N = 8
const QUADRO_W = props.largura
const QUADRO_H = props.altura ?? props.largura
const COVER = Math.max(QUADRO_W / props.imgW, QUADRO_H / props.imgH)
const COVER_W = props.imgW * COVER
const COVER_H = props.imgH * COVER
const TILE_W = QUADRO_W / N
const TILE_H = QUADRO_H / N

const CACOS = Array.from({ length: N * N }, (_, i) => {
  const r = Math.floor(i / N)
  const c = i % N
  const cx = (N - 1) / 2
  const cy = (N - 1) / 2
  const dx = c - cx
  const dy = r - cy
  const dist = Math.sqrt(dx * dx + dy * dy)
  const distMax = Math.sqrt(cx * cx + cy * cy)
  return {
    r,
    c,
    bgX: -(c * TILE_W),
    bgY: -(r * TILE_H),
    fora: dist === 0 ? 0 : 26 + dist * 5,
    dirX: dist === 0 ? 0 : dx / dist,
    dirY: dist === 0 ? 0 : dy / dist,
    giro: (r + c) % 2 === 0 ? 10 : -10,
    // de fora pra dentro: quem está mais longe do centro chega primeiro
    atraso: ((distMax - dist) / distMax) * 0.5,
  }
})

const raiz = ref<HTMLElement | null>(null)
const pronto = ref(false)
let obs: IntersectionObserver | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    pronto.value = true
    return
  }
  const el = raiz.value
  if (!el || !('IntersectionObserver' in window)) {
    pronto.value = true
    return
  }
  obs = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue
        pronto.value = true
        obs?.disconnect()
      }
    },
    { threshold: 0.2 },
  )
  obs.observe(el)
})
onBeforeUnmount(() => obs?.disconnect())
</script>

<template>
  <div ref="raiz" class="retrato" :class="{ pronto }" :style="{ width: `${QUADRO_W}px`, height: `${QUADRO_H}px` }">
    <div v-if="!semMoldura" class="anel" aria-hidden="true" />
    <div v-if="!semMoldura" class="brilho" aria-hidden="true" />
    <div class="cacos">
      <div
        v-for="ca in CACOS"
        :key="`${ca.r}-${ca.c}`"
        class="caco"
        :style="{
          left: `${ca.c * TILE_W}px`,
          top: `${ca.r * TILE_H}px`,
          width: `${TILE_W}px`,
          height: `${TILE_H}px`,
          backgroundImage: `url(${arquivo})`,
          backgroundSize: `${COVER_W}px ${COVER_H}px`,
          backgroundPosition: `${ca.bgX}px ${ca.bgY}px`,
          animationDelay: `${ca.atraso}s`,
          '--fx': `${ca.dirX * ca.fora}px`,
          '--fy': `${ca.dirY * ca.fora}px`,
          '--giro': `${ca.giro}deg`,
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.retrato {
  position: relative;
  margin: 0 auto;
}

/* O ANEL — conic-gradient girando devagar atrás do quadro, como um radar. */
.anel {
  position: absolute;
  inset: -10px;
  border-radius: 30%;
  background: conic-gradient(from 0deg, var(--color-accent), transparent 30%, transparent 70%, var(--color-accent));
  animation: girar 7s linear infinite;
  filter: blur(0.5px);
}
.anel::after {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: inherit;
  background: var(--color-canvas);
}

.cacos {
  position: absolute;
  inset: 0;
  border-radius: 26%;
  overflow: hidden;
  box-shadow: var(--elev-flutua);
}
/* REPOUSO = O QUADRO "from" DA ANIMAÇÃO, ESCRITO DIRETO — antes de
   `.pronto`, o caco já nasce espalhado e invisível (não precisa de
   `animation-fill-mode: backwards` pra seguir os valores do primeiro
   quadro: eles JÁ SÃO o CSS de base). `.pronto` é quem acrescenta a
   animação por cima, disparada pelo `IntersectionObserver`. */
.caco {
  position: absolute;
  background-repeat: no-repeat;
  transform: translate(var(--fx), var(--fy)) rotate(var(--giro)) scale(0.55);
  opacity: 0;
  filter: brightness(2.4) saturate(0);
}
.pronto .caco {
  animation-name: assentar;
  animation-duration: 0.65s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  animation-fill-mode: forwards;
}
@keyframes assentar {
  0% {
    transform: translate(var(--fx), var(--fy)) rotate(var(--giro)) scale(0.55);
    opacity: 0;
    filter: brightness(2.4) saturate(0);
  }
  60% {
    filter: brightness(1.6) saturate(0.6);
  }
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 1;
    filter: brightness(1) saturate(1);
  }
}

/* A VARREDURA — uma faixa clara passando por cima em loop, feita de
   scanner, não de badalação: lenta, baixa opacidade, sem repetir seguido. */
.brilho {
  position: absolute;
  inset: 0;
  border-radius: 26%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}
.brilho::before {
  content: '';
  position: absolute;
  inset: -40% -10%;
  background: linear-gradient(100deg, transparent 42%, color-mix(in srgb, var(--color-accent) 55%, white) 50%, transparent 58%);
  opacity: 0.55;
  animation: varrer 4.6s ease-in-out infinite;
  animation-delay: 1.4s;
}
@keyframes varrer {
  0%,
  28% {
    transform: translateX(-120%);
  }
  50%,
  100% {
    transform: translateX(120%);
  }
}

@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  /* Sem redução, o repouso É o quadro espalhado (ver `.caco` acima) — sob
     redução isso teria de ficar assim pra sempre, porque `.pronto` também
     não chega a animar nada. Por isso a foto/logo nasce JÁ montada aqui:
     mesmo transform/opacity/filter do fim da animação, sem passar pelo
     meio. */
  .caco {
    transform: none;
    opacity: 1;
    filter: none;
  }
  .anel {
    animation: none;
  }
  .brilho::before {
    animation: none;
    opacity: 0;
  }
}
</style>
