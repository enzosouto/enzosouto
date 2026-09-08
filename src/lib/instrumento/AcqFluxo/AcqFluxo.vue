<script setup lang="ts">
/**
 * O FLUXO — etapas em fila, e uma gota percorrendo o caminho entre elas.
 *
 * Diz uma coisa que texto não diz bem: que existe MOVIMENTO de uma ponta à
 * outra, e em que sentido. "Fontes → Base única → Dashboard → Decisão" escrito
 * é uma lista; com a gota andando, é um percurso.
 *
 * AS GOTAS SAEM DESENCONTRADAS, e o desencontro é o efeito. Três gotas partindo
 * juntas leem como uma régua piscando: o olho vê pulso, não fluxo. Com atrasos
 * escalonados, a de trás sai quando a da frente já está no meio, e o caminho
 * inteiro parece ter uma corrente passando. O atraso é uma fração do ciclo, e
 * não um número solto, para o padrão continuar certo se o ciclo mudar.
 *
 * A ÚLTIMA ETAPA É A QUE IMPORTA. `destaque` acende a etapa final com a cor da
 * marca — num diagrama de caminho, o que interessa é onde ele CHEGA. Sem isso,
 * as quatro caixas têm o mesmo peso e a leitura vira inventário de passos.
 *
 * NO TELEFONE O CAMINHO VIRA VERTICAL. Quatro etapas em fila numa tela de
 * 390px dariam caixas de 70px com o texto quebrando em três linhas cada. De
 * cima para baixo, cada etapa fica legível e a gota desce em vez de atravessar
 * — o gesto se preserva porque ele é sobre PERCURSO, não sobre horizontal.
 *
 * `hrefs` É OPCIONAL, E POR ISSO NÃO QUEBRA QUEM JÁ USA O COMPONENTE. Sem a
 * prop (o caso da proposta Pimenta: fontes → base → dashboard → decisão),
 * cada etapa continua um `<div>` mudo — o diagrama é só leitura. Passando
 * `hrefs`, a etapa vira `<a>` pro índice correspondente; índice sem link
 * (`undefined`) continua `<div>`, então dá pra linkar só parte do percurso.
 */
withDefaults(defineProps<{
  /** As etapas, na ordem do percurso. */
  etapas: string[]
  /** Acende a última etapa com a cor da marca — o destino do caminho. */
  destaque?: boolean
  /** Duração de uma travessia. */
  ciclo?: number
  /** Destino de cada etapa, mesmo índice de `etapas`. Etapa sem link, sem entrada (ou `undefined`) — continua `<div>`. */
  hrefs?: (string | undefined)[]
}>(), { destaque: true, ciclo: 3.4, hrefs: undefined })
</script>

<template>
  <div class="fluxo" data-test="fluxo">
    <template v-for="(etapa, i) in etapas" :key="etapa">
      <!-- A etapa é texto de verdade: quem usa leitor de tela recebe a lista
           do percurso na ordem, que é a informação inteira. -->
      <component
        :is="hrefs?.[i] ? 'a' : 'div'"
        :href="hrefs?.[i]"
        class="passo"
        :class="{ fim: destaque && i === etapas.length - 1, link: hrefs?.[i] }"
      >
        <span>{{ etapa }}</span>
      </component>
      <!-- O trilho é decoração pura: a ordem já está no DOM. -->
      <div
        v-if="i < etapas.length - 1"
        class="trilho"
        aria-hidden="true"
        :style="{
          '--acq-ciclo': `${ciclo}s`,
          '--acq-atraso': `${(ciclo / Math.max(1, etapas.length - 1)) * i}s`,
        }"
      >
        <i class="gota" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.fluxo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
}

.passo {
  flex: 1 1 0;
  min-width: 0;
  padding: 14px 16px;
  border: 1px solid var(--color-hair);
  border-radius: var(--curva-lg);
  background: var(--color-card);
  color: var(--color-dim);
  font-size: calc(13.5px * var(--acq-esc));
  text-align: center;
  line-height: 1.35;
}

/* A ETAPA-LINK. Mesma caixa, com o toque de quem pode ser clicado: cursor,
   sobe 1px, régua acende — o mesmo vocabulário de `.links a.acesa` do
   cabeçalho, pra "isto leva a algum lugar" ler igual em qualquer canto da
   marca. */
.passo.link {
  display: block;
  text-decoration: none;
  cursor: pointer;
  transition: transform var(--dur-rapido) var(--mov-onda), border-color var(--dur-rapido) var(--mov-onda), color var(--dur-rapido) var(--mov-onda);
}
.passo.link:hover,
.passo.link:focus-visible {
  transform: translateY(-2px);
  border-color: var(--color-accent-text);
  color: var(--color-accent-text);
}
.passo.link:focus-visible {
  outline: 2px solid var(--color-accent-text);
  outline-offset: 2px;
}

/* O destino acende. Tinta e borda, não preenchimento: a etapa final é a mesma
   caixa das outras — o que muda é a voltagem, não a forma. */
.passo.fim {
  color: var(--color-accent-text);
  border-color: var(--color-accent-text);
}

.trilho {
  position: relative;
  flex: 0 1 64px;
  height: 1px;
  background: var(--color-hair);
  /* `visible` de propósito: a gota tem 6px e o trilho 1px — recortar comeria a
     gota inteira, que é a única coisa que se move aqui. */
  overflow: visible;
}

.gota {
  position: absolute;
  top: 50%;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 8px 2px var(--color-accent-bg);
  transform: translateY(-50%);
  animation: acq-gota var(--acq-ciclo) ease-in-out var(--acq-atraso) infinite;
}

@keyframes acq-gota {
  0% {
    left: 0;
    opacity: 0;
  }
  12% {
    opacity: 1;
  }
  88% {
    opacity: 1;
  }
  100% {
    left: calc(100% - 6px);
    opacity: 0;
  }
}

@media (max-width: 700px) {
  .fluxo {
    flex-direction: column;
    align-items: stretch;
  }

  /* Vertical, o trilho troca de eixo: altura fixa, largura de fio, centrado. */
  .trilho {
    flex: 0 0 34px;
    width: 1px;
    height: auto;
    margin-inline: auto;
  }

  .gota {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    animation-name: acq-gota-desce;
  }
}

@keyframes acq-gota-desce {
  0% {
    top: 0;
    opacity: 0;
  }
  12% {
    opacity: 1;
  }
  88% {
    opacity: 1;
  }
  100% {
    top: calc(100% - 6px);
    opacity: 0;
  }
}

/* Parado, o diagrama continua inteiro: as etapas e a linha que as liga são o
   desenho; a gota é o reforço. */
@media (prefers-reduced-motion: reduce) {
  .gota {
    animation: none;
    opacity: 0.6;
  }
}
</style>
