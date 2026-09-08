<script setup lang="ts">
/**
 * A GALERIA DE PROJETOS.
 *
 * Cada projeto é uma seção própria, cheia largura. O principal
 * (`destaque: true`, hoje o Skitz Stats Archive) roda dentro do mockup de
 * MacBook (`AcqAparelho`, já existe em `src/lib`); os demais usam a janela
 * de navegador — mesmo vocabulário de `PaginaPimenta.vue` e do
 * `src/neer/SecaoProjetos.vue` — só que agora em retângulo largo, 16:9,
 * ocupando a seção inteira em vez de dividir espaço numa grade de três.
 *
 * SEM MODAL: a prévia já é grande o bastante para não precisar de tela
 * cheia; quem quer o site de verdade clica em "Abrir ↗" e vai para lá.
 *
 * `projetos` E `idioma` VÊM DE FORA. `PROJETOS` deixou de ser export fixo
 * de `conteudo.ts` quando o currículo ficou bilíngue — mora dentro de
 * `conteudo(idioma)`, ao lado do resto do texto daquele idioma. `idioma`
 * sozinho só troca os dois rótulos fixos que este arquivo escrevia à mão
 * ("projeto principal", "Abrir").
 */
import AcqButton from '@/lib/base/AcqButton/AcqButton.vue'
import AcqAparelho from '@/lib/instrumento/AcqAparelho/AcqAparelho.vue'
import AcqReveal from '@/lib/base/AcqReveal/AcqReveal.vue'
import type { Idioma, Projeto } from './conteudo'

const props = defineProps<{ projetos: Projeto[]; idioma: Idioma }>()
const ROTULOS = { pt: { principal: 'projeto principal', abrir: 'Abrir' }, en: { principal: 'main project', abrir: 'Open' } }
</script>

<template>
  <AcqReveal :stagger="90" class="projetos">
    <section v-for="p in props.projetos" :key="p.id" class="projeto">
      <p class="projeto-rotulo">{{ p.destaque ? ROTULOS[idioma].principal : p.tag }}</p>
      <h3 class="projeto-titulo">{{ p.titulo }}</h3>

      <AcqAparelho
        v-if="p.destaque"
        aparelho="macbook"
        :src="p.url"
        :titulo="p.titulo"
        class="projeto-mockup"
      />
      <div v-else class="janela">
        <div class="navegador-barra">
          <span class="navegador-bolhas" aria-hidden="true"><i /><i /><i /></span>
          <span class="navegador-url">{{ p.url.replace('https://', '') }}</span>
        </div>
        <div class="janela-tela">
          <iframe class="janela-frame" :src="p.url" :title="p.titulo" aria-hidden="true" tabindex="-1" loading="lazy" />
        </div>
      </div>

      <p class="projeto-desc">{{ p.descricao }}</p>
      <AcqButton :href="p.url" target="_blank" rel="noopener" class="projeto-abrir">
        {{ ROTULOS[idioma].abrir }} {{ p.titulo }} ↗
      </AcqButton>
    </section>
  </AcqReveal>
</template>

<style scoped>
.projetos {
  display: flex;
  flex-direction: column;
  gap: 88px;
}

.projeto {
  max-width: 980px;
  margin-inline: auto;
  text-align: center;
}

.projeto-rotulo {
  margin: 0;
  color: var(--color-accent-text);
  font-size: calc(12.5px * var(--acq-esc));
  font-weight: var(--acq-peso-forte);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.projeto-titulo {
  margin: 6px 0 0;
  color: var(--color-ink);
  font-size: calc(clamp(20px, 2.6vw, 28px) * var(--acq-esc));
  font-weight: 800;
}

/* O MOCKUP DO PRINCIPAL: o aparelho de MacBook já é, por natureza, um
   retângulo horizontal — aqui ele ocupa a seção inteira. */
.projeto-mockup {
  margin-top: 26px;
}

/* A JANELA DE NAVEGADOR dos demais — mesmo vocabulário do MacBook do
   principal (moldura + prévia viva), só que sem aparelho fotografado: aqui
   o retângulo largo 16:9 já basta pra diferenciar do principal sem
   competir com ele. */
.janela {
  margin-top: 26px;
  border: 1px solid var(--color-hair);
  border-radius: var(--curva-xl);
  background: color-mix(in srgb, var(--color-card) 92%, var(--color-canvas));
  box-shadow: var(--elev-flutua);
  overflow: hidden;
}
.navegador-barra {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--color-hair);
  background: var(--color-card);
}
.navegador-bolhas {
  display: flex;
  gap: 7px;
  flex: 0 0 auto;
}
.navegador-bolhas i {
  display: block;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--color-soft);
}
.navegador-url {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  background: var(--color-soft);
  color: var(--color-dim);
  font-size: calc(12.5px * var(--acq-esc));
  padding: 6px 14px;
  border-radius: var(--curva-pill);
}

/* O RETÂNGULO GRANDE NA HORIZONTAL — 16:9, cheio da largura da seção. */
.janela-tela {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--color-card);
}
/* DECORATIVO, SEM INTERAÇÃO: quem quer navegar dentro do site clica em
   "Abrir ↗", não nesta prévia — o clique aqui não pode roubar o scroll da
   página vitrine para dentro do site estrangeiro. */
.janela-frame {
  display: block;
  width: 400%;
  height: 400%;
  border: 0;
  transform: scale(0.25);
  transform-origin: top left;
  pointer-events: none;
}

.projeto-desc {
  margin: 24px auto 0;
  max-width: 62ch;
  color: var(--color-dim);
  font-size: calc(14.5px * var(--acq-esc));
  line-height: var(--acq-lh);
}
.projeto-abrir {
  margin-top: 20px;
}

.projeto + .projeto {
  padding-top: 88px;
  border-top: 1px solid var(--color-hair);
}

@media (max-width: 780px) {
  .projetos {
    gap: 64px;
  }
  .projeto + .projeto {
    padding-top: 64px;
  }
}
</style>
