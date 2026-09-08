<script setup lang="ts">
// PAINEL DE ACESSIBILIDADE DE LEITURA. Ver registry.ts → AcqA11y.
//
// A ARQUITETURA VEM DO ESPELHO E A DECISÃO CONTINUA CERTA: cada preferência é
// UMA CLASSE na raiz que REMAPEIA TOKEN. Nenhuma preferência mexe em
// elemento — é o que faz trinta linhas de CSS valerem para a página inteira,
// inclusive para componente que ainda não existe.
//
// O QUE MUDOU DE VERDADE, e por quê:
//
//   1. PREFIXO NOVO. As classes que esta peça liga na raiz são `acq-a-g`,
//      `acq-a-gg`, `acq-a-forte`, `acq-a-solto`, `acq-a-contraste`,
//      `acq-a-links`, `acq-a-parado` — o namespace do pacote, não o da
//      risilva. `src/tokens/a11y.ts` é quem declara o catálogo e o prefixo
//      (`a11yPrefix`); esta peça só lê.
//
//   2. NÃO EXISTE MAIS "fonte simples nos títulos". No espelho essa opção
//      trocava a serifa da marca (Playfair) pela sans nos títulos, para quem
//      tem dificuldade de decodificar letra de alto contraste. A ACQUARIO
//      não tem serifa — o sistema inteiro é `--font-sans` (Montserrat), do
//      título ao rótulo — então a opção não tem o que fazer: não existe
//      segunda fonte para trocar. Mantê-la seria um botão que liga uma classe
//      que remapeia um token (`--font-serif`) que este sistema não declara.
//      Remover é o certo; ficasse, seria opção fantasma.
//
//   3. TIPOGRAFIA DA PRÓPRIA CASCA é `--font-sans` em toda parte. O espelho
//      usava `--font-mono` no gatilho, no título do painel, nos rótulos de
//      grupo e no botão "voltar ao padrão" — clichê de dashboard que a
//      ACQUARIO não tem: `--font-mono` aqui só é legítimo dentro de um bloco
//      de código (`AcqCode`), nunca na casca de um painel.
//
// AS TRÊS COISAS QUE O PROTÓTIPO ORIGINAL DEIXOU ANOTADAS CONTINUAM FEITAS:
// persiste (síncrono, antes da primeira pintura), a preferência do sistema
// nasce marcada, e isto é disclosure — não diálogo: `aria-expanded` no botão,
// `aria-controls` na região, e o fundo continua utilizável de propósito,
// porque o leitor precisa VER o efeito enquanto ajusta.
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import {
  a11yEscalas,
  a11yGroups,
  a11yPrefix,
  a11yPrefs,
  a11yStorageKey,
  inA11yGroup,
} from '../../../tokens/a11y'

const props = withDefaults(
  defineProps<{
    /**
     * Onde as classes são aplicadas. `document` = a raiz do documento, que é
     * o caso normal. Um elemento é para demonstração dentro de moldura — a
     * bancada do livro precisa ajustar só o conteúdo do aparelho, não a
     * página do livro.
     */
    target?: 'document' | HTMLElement | null
    /**
     * Mostra o controle de tamanho do texto. Desligue em página cujo CSS não
     * consome a escala de `a11yEscalas`: controle que não faz nada é pior
     * que controle ausente.
     */
    showScale?: boolean
    /** Canto onde o botão mora. */
    position?: 'left' | 'right'
    /**
     * Onde o gatilho se ancora, e por consequência para onde o painel abre.
     * `bottom` é o caso real: no pé da página, abrindo para CIMA, onde o
     * polegar alcança. `top` existe para caixa de demonstração — o painel é
     * alto, e para cima ele escaparia por cima do conteúdo em volta.
     */
    anchor?: 'bottom' | 'top'
  }>(),
  { target: 'document', showScale: true, position: 'left', anchor: 'bottom' },
)

const aberto = ref(false)
const raizEl = ref<HTMLElement | null>(null)
/** `useId()`, não literal: duas instâncias na mesma página (a ficha e a
 *  bancada de demonstração, por exemplo) produziriam `id` duplicado, e os
 *  dois gatilhos apontariam para o primeiro painel. `AcqAppShell` (`idBarra`)
 *  e `AcqComposer` (`idDica`) já usam `useId()` — `AcqA11y` tinha ficado fora
 *  do dialeto. Achado pela revisão final (M6), 2026-08-13. */
const idPainel = `acq-a11y-painel-${useId()}`

interface Estado {
  esc: string
  ligados: string[]
}

/** A preferência que o sistema operacional já declara. */
function pedidoPeloSistema(): string[] {
  if (typeof window === 'undefined' || !window.matchMedia) return []
  return a11yPrefs
    .filter((p) => p.daPreferenciaDoSistema && window.matchMedia(p.daPreferenciaDoSistema).matches)
    .map((p) => p.id)
}

/**
 * Lido no setup, não em `onMounted`: precisa valer antes da primeira pintura.
 * Estado salvo vence a preferência do sistema — quem mexeu no painel decidiu
 * depois. Quem nunca mexeu herda o que o aparelho já pede.
 *
 * SÓ A INSTÂNCIA `target="document"` LÊ/ESCREVE `localStorage`. A chave
 * (`a11yStorageKey`) não tem — e não pode ter — namespace por instância: um
 * elemento não tem identidade estável entre recargas para compor uma chave
 * com ele. Antes de existir uma instância global no livro isso não importava
 * (nada lia o que a demo gravava); depois que `App.vue` passou a montar
 * `<AcqA11y target="document">`, a mesma chave se tornaria a preferência da
 * PÁGINA INTEIRA sendo escrita pela caixa de demonstração — que diz, em
 * texto, "o painel abaixo ajusta só esta caixa". Achado pela re-revisão
 * (R5), 2026-08-13. Uma instância de moldura (a bancada, a ficha do próprio
 * componente) ajusta e esquece: o efeito dura enquanto a peça está montada,
 * nunca sobrevive a um recarregamento nem contamina o documento.
 */
function carregar(): Estado {
  const doSistema = { esc: '', ligados: pedidoPeloSistema() }
  if (props.target !== 'document' || typeof localStorage === 'undefined') return doSistema
  try {
    const cru = localStorage.getItem(a11yStorageKey)
    if (!cru) return doSistema
    const salvo = JSON.parse(cru) as Partial<Estado>
    return {
      esc: a11yEscalas.some((e) => e.id === salvo.esc) ? (salvo.esc as string) : '',
      // Filtra contra o catálogo: preferência removida numa versão futura
      // (a "fonte simples" desta mesma migração é o exemplo) não deve voltar
      // como classe órfã na raiz.
      ligados: Array.isArray(salvo.ligados)
        ? salvo.ligados.filter((id) => a11yPrefs.some((p) => p.id === id))
        : [],
    }
  } catch {
    // Estado corrompido não pode derrubar a página — é acessibilidade.
    return doSistema
  }
}

const estado = ref<Estado>(carregar())

const alvo = computed<HTMLElement | null>(() => {
  if (props.target === 'document') {
    return typeof document !== 'undefined' ? document.documentElement : null
  }
  return props.target ?? null
})

const todasAsClasses = [...a11yEscalas.map((e) => e.id), ...a11yPrefs.map((p) => p.id)]
  .filter(Boolean)
  .map((id) => a11yPrefix + id)

function aplicar() {
  const el = alvo.value
  if (!el) return
  el.classList.remove(...todasAsClasses)
  if (estado.value.esc) el.classList.add(a11yPrefix + estado.value.esc)
  for (const id of estado.value.ligados) el.classList.add(a11yPrefix + id)
}

function salvar() {
  if (props.target !== 'document') return // ver o comentário de `carregar()`.
  try {
    localStorage.setItem(a11yStorageKey, JSON.stringify(estado.value))
  } catch {
    // Modo privado ou cota cheia: a preferência vale para esta sessão e pronto.
  }
}

watch(estado, () => { aplicar(); salvar() }, { deep: true, immediate: true })
watch(alvo, aplicar)

const ligado = (id: string) => estado.value.ligados.includes(id)
function alternar(id: string) {
  estado.value.ligados = ligado(id)
    ? estado.value.ligados.filter((x) => x !== id)
    : [...estado.value.ligados, id]
}
function zerar() {
  estado.value = { esc: '', ligados: pedidoPeloSistema() }
}

const quantos = computed(
  () => estado.value.ligados.length + (estado.value.esc ? 1 : 0),
)

/** Esc fecha de qualquer lugar, e clique fora também — enquanto está aberto. */
function noDocumento(e: KeyboardEvent | MouseEvent) {
  if (e instanceof KeyboardEvent) {
    if (e.key === 'Escape') aberto.value = false
    return
  }
  if (raizEl.value && !raizEl.value.contains(e.target as Node)) aberto.value = false
}
onMounted(() => {
  document.addEventListener('keydown', noDocumento)
  document.addEventListener('pointerdown', noDocumento)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', noDocumento)
  document.removeEventListener('pointerdown', noDocumento)
  // Sair da tela não deve deixar a raiz suja com as classes.
  alvo.value?.classList.remove(...todasAsClasses)
})

const gruposVisiveis = computed(() =>
  a11yGroups.filter((g) => (g.id === 'texto' ? props.showScale : inA11yGroup(g.id).length > 0)),
)

/**
 * Preso à janela quando ajusta o documento; absoluto quando ajusta um
 * elemento. Dentro de uma moldura de aparelho, `fixed` escaparia da moldura.
 */
const fixo = computed(() => props.target === 'document')
</script>

<template>
  <div ref="raizEl" class="a11y" :class="[`p-${position}`, `a-${anchor}`, { aberto, fixo }]" data-test="a11y">
    <button
      class="gatilho"
      type="button"
      :aria-expanded="aberto"
      :aria-controls="idPainel"
      @click="aberto = !aberto"
    >
      <!-- Símbolo universal de acesso. `aria-hidden` porque a palavra ao lado já
           diz o que é — leitor de tela não deve anunciar duas vezes. -->
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
           stroke-width="1.7" stroke-linecap="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="6.7" r="1.5" fill="currentColor" stroke="none" />
        <path d="M6.9 9.6h10.2" />
        <path d="M12 9.6v4.1" />
        <path d="M12 13.7 9.7 18.3" />
        <path d="M12 13.7l2.3 4.6" />
      </svg>
      <span>Acessibilidade</span>
      <!-- Quantos ajustes estão ativos. Sem isso o leitor não sabe se o que ele
           está vendo é o padrão ou a escolha dele de outra visita. -->
      <b v-if="quantos">{{ quantos }}</b>
    </button>

    <!-- Região, não diálogo. Ver o comentário do topo do arquivo. -->
    <div v-show="aberto" :id="idPainel" class="painel" aria-label="Ajustes de acessibilidade">
      <div class="topo">
        <p class="ptit">acessibilidade</p>
        <button class="fechar" type="button" aria-label="Fechar ajustes" @click="aberto = false">
          ✕
        </button>
      </div>

      <div v-for="g in gruposVisiveis" :key="g.id" class="grupo">
        <p class="rot">{{ g.label }}</p>

        <div v-if="g.id === 'texto'" class="seg" role="group" aria-label="Tamanho do texto">
          <button
            v-for="e in a11yEscalas"
            :key="e.id || 'normal'"
            type="button"
            :aria-pressed="estado.esc === e.id"
            @click="estado.esc = e.id"
          >
            {{ e.label }}
          </button>
        </div>

        <label v-for="p in inA11yGroup(g.id)" :key="p.id" class="lin">
          <span>
            {{ p.label }}
            <small>{{ p.hint }}</small>
          </span>
          <input type="checkbox" :checked="ligado(p.id)" @change="alternar(p.id)" />
          <span class="sw" aria-hidden="true" />
        </label>
      </div>

      <button class="zerar" type="button" @click="zerar">voltar ao padrão</button>
    </div>
  </div>
</template>

<style scoped>
.a11y { position: absolute; z-index: 30; }
.a11y.fixo { position: fixed; }
.a-bottom { bottom: 16px; }
.a-top { top: 16px; }
.p-left { left: 16px; }
.p-right { right: 16px; }

.gatilho {
  display: inline-flex; align-items: center; gap: 9px;
  min-height: 44px; padding: 0 16px 0 13px;
  border-radius: var(--curva-pill);
  background: var(--color-card); color: var(--color-ink);
  border: 1px solid var(--color-hair); cursor: pointer;
  box-shadow: var(--elev-repouso);
  font-family: var(--font-sans); font-weight: 500; font-size: calc(12.5px * var(--acq-esc)); letter-spacing: .01em;
  transition: border-color var(--dur-rapido) var(--mov-onda), background var(--dur-rapido) var(--mov-onda);
}
.gatilho:hover { border-color: var(--color-accent-text); background: var(--color-soft); }
.gatilho:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; box-shadow: var(--elev-repouso), var(--elev-foco); }
.gatilho svg { width: 22px; height: 22px; flex: 0 0 auto; color: var(--color-accent); }
.gatilho b {
  min-width: 18px; height: 18px; display: grid; place-items: center;
  background: var(--color-accent-bg); color: var(--color-accent);
  font-size: calc(10px * var(--acq-esc)); font-weight: 500; border-radius: var(--curva-pill);
}

.painel {
  position: absolute; left: 0;
  width: 330px; max-height: 70vh; overflow-y: auto;
  border-radius: var(--curva-xl);
  background: var(--color-card); border: 1px solid var(--color-hair);
  /* Sai do fluxo, então flutua — o oposto do espelho, onde overlay não tinha
     sombra própria. Ver o capítulo Curvas e sombras. */
  box-shadow: var(--elev-flutua);
}
.p-right .painel { left: auto; right: 0; }
/* Abre para o lado oposto da âncora — é o único jeito de não cobrir o
   conteúdo que motivou o ajuste. */
.a-bottom .painel { bottom: calc(100% + 10px); }
.a-top .painel { top: calc(100% + 10px); }

.topo {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; border-bottom: 1px solid var(--color-soft);
  position: sticky; top: 0; background: var(--color-card);
  border-radius: var(--curva-xl) var(--curva-xl) 0 0;
}
.topo .ptit {
  margin: 0; font-family: var(--font-sans); font-size: calc(11px * var(--acq-esc));
  letter-spacing: .1em; text-transform: uppercase; color: var(--color-dim); font-weight: 500;
}
.fechar {
  min-width: 44px; min-height: 44px; background: none; border: 0; cursor: pointer;
  border-radius: var(--curva-md);
  color: var(--color-dim); font-size: calc(14px * var(--acq-esc));
}
.fechar:hover { color: var(--color-ink); background: var(--color-soft); }

.grupo { padding: 14px 16px; border-bottom: 1px solid var(--color-soft); }
.rot {
  margin: 0 0 10px; font-family: var(--font-sans); font-size: calc(10.5px * var(--acq-esc));
  letter-spacing: .12em; text-transform: uppercase; font-weight: 500; color: var(--color-dimmer);
}

.seg { display: flex; gap: 6px; }
.seg button {
  flex: 1; min-height: 44px; cursor: pointer;
  border-radius: var(--curva-pill);
  background: var(--color-soft); border: 1px solid var(--color-hair); color: var(--color-dim);
  font-family: var(--font-sans); font-weight: 500; font-size: calc(12px * var(--acq-esc));
}
.seg button[aria-pressed='true'] {
  background: var(--color-accent-bg); color: var(--color-accent-text);
  border-color: var(--color-accent-text);
}

/* Cada linha é um alvo de 44dp, e o rótulo inteiro é clicável — no dedo, mirar
   um interruptor de 20px é o mesmo que não ter interruptor. */
.lin {
  display: flex; align-items: center; gap: 12px;
  min-height: 44px; padding: 5px 0; cursor: pointer;
}
.lin > span:first-child {
  flex: 1; font-weight: 400; font-size: calc(13.5px * var(--acq-esc)); line-height: 1.4; color: var(--color-ink);
}
.lin small {
  display: block; margin-top: 3px; font-size: calc(11px * var(--acq-esc)); font-weight: 400;
  color: var(--color-dimmer); line-height: 1.45;
}
/* O input real fica invisível mas PRESENTE: é ele que o leitor de tela anuncia
   e o teclado alcança. O desenho é a casca ao lado. */
.lin input {
  position: absolute; width: 1px; height: 1px; opacity: 0;
  margin: 0; pointer-events: none;
}
.sw {
  flex: 0 0 auto; width: 38px; height: 22px; position: relative;
  background: var(--color-soft); border: 1px solid var(--color-hair);
  border-radius: var(--curva-pill);
  transition: background var(--dur-rapido) var(--mov-onda), border-color var(--dur-rapido) var(--mov-onda);
}
.sw::after {
  content: ''; position: absolute; top: 3px; left: 3px;
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--color-dimmer); transition: transform var(--dur-rapido) var(--mov-onda), background var(--dur-rapido) var(--mov-onda);
}
.lin input:checked ~ .sw {
  background: var(--color-accent-bg); border-color: var(--color-accent-text);
}
.lin input:checked ~ .sw::after {
  transform: translateX(16px); background: var(--color-accent);
}
/* O foco tem de aparecer na CASCA, já que o input está escondido. */
.lin input:focus-visible ~ .sw {
  outline: 2px solid var(--color-accent); outline-offset: 3px;
}

.zerar {
  width: 100%; min-height: 44px; cursor: pointer;
  background: none; border: 0; color: var(--color-dim);
  border-radius: 0 0 var(--curva-xl) var(--curva-xl);
  font-family: var(--font-sans); font-weight: 500; font-size: calc(12px * var(--acq-esc)); letter-spacing: .02em;
}
.zerar:hover { color: var(--color-action); background: var(--color-soft); }

/* No telefone o painel é folha que sobe do rodapé: o polegar alcança, e não
   sobra canto inalcançável. O botão sobe acima da barra de ação fixa. */
@media (max-width: 560px) {
  .a11y.a-bottom { bottom: 86px; left: 14px; right: auto; }

  /* OS SELETORES REPETEM A ÂNCORA DE PROPÓSITO — `.a-bottom .painel` e
     `.p-right .painel`, e não só `.painel`.

     A primeira versão deste bloco escrevia `.painel { bottom: 0 }`, uma classe
     só, e perdia por ESPECIFICIDADE para `.a-bottom .painel { bottom: calc(100%
     + 10px) }` lá de cima — media query não desempata especificidade. Com a
     posição já trocada para `fixed`, aquele `100%` passou a medir a JANELA em
     vez do botão: o painel abria 854px acima do rodapé de uma tela de 844px,
     inteiro fora de vista. Medido em 13/08/2026 a 390px: `y: -588`.

     O sintoma é cruel porque o botão respondia ao toque, o `aria-expanded`
     virava `true` e nada aparecia — quem usa o recurso não tinha como saber se
     o painel estava quebrado ou se o toque não pegou. */
  .a-bottom .painel,
  .a-top .painel,
  .p-right .painel {
    position: fixed;
    inset: auto 0 0 0;
    width: auto;
    /* `svh` e não `vh`: a barra do navegador do telefone entra e sai, e `vh`
       mede a tela sem ela — o fim da lista de opções ficaria embaixo da barra. */
    max-height: 76svh;
    border-radius: var(--curva-xl) var(--curva-xl) 0 0;
    border-left: 0; border-right: 0; border-bottom: 0;
    /* O indicador de gesto do aparelho cobre a última opção sem isto. */
    padding-bottom: env(safe-area-inset-bottom);
  }
  .topo { border-radius: var(--curva-xl) var(--curva-xl) 0 0; }
}

@media (pointer: coarse) {
  .gatilho, .fechar, .seg button, .lin, .zerar { min-height: 48px; }
}

@media (prefers-reduced-motion: reduce) {
  .gatilho, .sw, .sw::after { transition: none; }
}
</style>
