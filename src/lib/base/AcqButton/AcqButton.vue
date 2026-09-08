<script setup lang="ts">
// Ação. Ver registry.ts → AcqButton.
// Vira <a> quando tem href e <button> quando não tem — nunca um div clicável.
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'outline' | 'text'
    href?: string
    size?: 'md' | 'sm'
    /** O `type` do `<button>`. Ignorado quando há `href`. O padrão é `button`
     *  de propósito: quem envia declara `submit`. Sem isso, formulário com mais
     *  de um campo não responde ao Enter — defeito silencioso. */
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { variant: 'primary', href: undefined, size: 'md', type: 'button' },
)

const tag = computed(() => (props.href ? 'a' : 'button'))
const attrs = computed(() => (props.href ? { href: props.href } : { type: props.type }))
</script>

<template>
  <component :is="tag" v-bind="attrs" :class="['btn', `v-${variant}`, `s-${size}`]" data-test="button">
    <slot />
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-family: var(--font-sans); font-weight: 700; font-size: calc(14px * var(--acq-esc));
  text-decoration: none; cursor: pointer;
  padding: 0 30px; height: 48px;
  border: 1px solid transparent;
  /* PÍLULA: a assinatura da marca. Altura fixa, então `pill` é seguro. */
  border-radius: var(--curva-pill);
  box-shadow: var(--elev-repouso);
  transition: background var(--dur-rapido) var(--mov-onda),
              border-color var(--dur-rapido) var(--mov-onda),
              color var(--dur-rapido) var(--mov-onda),
              box-shadow var(--dur-padrao) var(--mov-onda);
}
.s-sm { height: 36px; font-size: calc(12px * var(--acq-esc)); padding: 0 22px; }

/* TINTA ESCURA SOBRE O CIANO. Branco sobre #27A8C5 dá 2,80:1 e reprova — a peça
   original comete isso. `on-action` dá 7,15:1. */
.v-primary { background: var(--color-action); color: var(--color-on-action); }
.v-primary:hover { background: var(--color-action-hover); box-shadow: var(--elev-flutua); }

.v-outline { border-color: var(--color-hair); color: var(--color-ink); background: none; box-shadow: none; }
.v-outline:hover { border-color: var(--color-accent-text); }

.v-text { padding: 0; height: auto; border: none; background: none; box-shadow: none;
          color: var(--color-accent-text); font-weight: 500; }
.v-text:hover { color: var(--color-accent); }

/* PISO DE 48dp, SEM EXCEÇÃO — é o que a própria ficha promete (`a11y: "Alvo
   de 48dp em ponteiro grosso"`), sem carve-out por variant ou size. `sm` é
   "para cabeçalho fixo" na descrição da prop, mas o `text` aparece fora de
   cabeçalho — rodapé de formulário (AcqActions) e barra do AcqComposer — e um
   piso de 44 ali contradiria a doutrina do próprio sistema (ver o comentário
   do preset em `src/preset/index.ts`: "44px seria o piso só de peça de
   cabeçalho... e nenhuma das classes abaixo é isso"). */
@media (pointer: coarse) {
  .btn { min-height: 48px; }
}
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
</style>
