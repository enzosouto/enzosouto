/**
 * O ESTADO DO TEMA.
 *
 * Trocar de tema é UM atributo na raiz — `data-tema`. Não é prop de
 * componente, e isso é decisão: um componente que aceitasse `theme` criaria a
 * possibilidade de duas partes da tela em temas diferentes, que é bug caro e
 * silencioso.
 *
 * O alvo pode ser um elemento, e aí a troca vale só naquela sub-árvore — mesmo
 * mecanismo do `AcqA11y`, mesma razão.
 *
 * DELTA DE DOUTRINA contra o espelho: a risilva tem SEIS famílias × dois
 * esquemas = doze temas. A ACQUARIO tem UMA família com DOIS esquemas —
 * `enzo-escuro` (padrão) e `enzo-claro`. `trocarEsquema()` é por isso
 * a operação normal aqui: não existe "trocar de família" para alternar.
 */

import { computed, ref } from 'vue'
import { familias, temas, acharTema, TEMA_PADRAO } from '../tokens/familias'
import type { Tema } from '../tokens/tema'
import { corDoTema } from '../tokens/color'

// A família e a montagem dos dois temas moram em `tokens/familias.ts` — sem
// Vue, para o Node (scripts de verificação, MCP futuro) ler sem arrastar este
// arquivo. Aqui só se reexporta, para ninguém que já importava daqui precisar
// mudar o caminho.
export { familias, temas, acharTema, TEMA_PADRAO }

export const CHAVE = 'enzo.tema.v1'

/** As cores que a galeria do livro mostra num cartão. São as que
 *  DIFERENCIAM os dois esquemas. */
export function amostra(t: Tema) {
  const c = (p: Parameters<typeof corDoTema>[2]) => corDoTema(t.familia, t.esquema, p)
  return {
    canvas: c('canvas'), card: c('card'), ink: c('ink'), dim: c('dim'),
    accent: c('accent'), accentText: c('accent-text'), accentBg: c('accent-bg'),
    action: c('action'), onAction: c('on-action'),
  }
}

const ler = (): string => {
  if (typeof localStorage === 'undefined') return TEMA_PADRAO
  try {
    const s = localStorage.getItem(CHAVE)
    return s && acharTema(s) ? s : TEMA_PADRAO
  } catch {
    return TEMA_PADRAO
  }
}

/** Lido no módulo, não em `onMounted`: precisa valer antes da primeira
 *  pintura, senão a página nasce no tema padrão e PISCA para o do leitor. */
const atualId = ref(ler())

export function aplicarTema(el: HTMLElement, id: string) {
  el.dataset.tema = id
}

export function useTema() {
  const tema = computed(() => acharTema(atualId.value) ?? temas[0])

  function definir(id: string) {
    if (!acharTema(id)) throw new Error(`useTema: "${id}" não existe`)
    atualId.value = id
    if (typeof document !== 'undefined') aplicarTema(document.documentElement, id)
    try {
      localStorage.setItem(CHAVE, id)
    } catch {
      // modo privado: vale para esta sessão
    }
  }

  /** Troca o esquema SEM sair da identidade. É a operação normal aqui: com
   *  uma família só, "trocar de tema" e "trocar de esquema" são a mesma
   *  coisa. */
  function trocarEsquema() {
    definir(tema.value.par)
  }

  return { tema, temas, definir, trocarEsquema, amostra }
}

/** Aplica o tema guardado. Chamado no `main.ts`, antes de montar. */
export function iniciarTema() {
  if (typeof document !== 'undefined') aplicarTema(document.documentElement, atualId.value)
}
