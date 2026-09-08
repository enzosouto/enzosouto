<script setup lang="ts">
// Etiqueta de estado. Ver ficha.ts, ao lado.
//
// `tone` é ESTADO, e o vocabulário é o do sistema inteiro: `neutro | positivo
// | negativo` — o mesmo que `AcqRow`, `AcqMoney` e `AcqDelta` usam, e nada
// mais. `brand` é a exceção reservada para identidade — com uma família de
// tema só, ainda faz sentido separar "isto é a ACQUARIO" de "isto está
// vencido" para os dois nunca ocuparem a mesma cor por acidente.
//
// DELTA DE DOUTRINA: raio vem de `var(--curva-sm)` — a etiqueta é a peça mais
// pequena da escada, junto do badge. Sem sombra: cor e rótulo em texto corrido
// não saem do fluxo, então não têm altura a declarar.
//
// A ACQUARIO NÃO TEM COR PRÓPRIA DE ATENÇÃO — nem aqui, nem na risilva. Não
// existe um quarto tom entre `positivo` e `negativo`: "vence hoje" e "vencido
// há 4 dias" são os dois `negativo` — o que separa um do outro é a PALAVRA no
// rótulo e o PESO do `variant` (`solid` é o mais grave, `tinted` é metade), e
// a área do acento (`brand`) é identidade, nunca estado.
withDefaults(
  defineProps<{
    label: string
    tone?: 'neutro' | 'positivo' | 'negativo' | 'brand'
    variant?: 'solid' | 'tinted' | 'outline'
    icon?: string
  }>(),
  { tone: 'neutro', variant: 'tinted' },
)
</script>

<template>
  <span class="tg" :class="[`t-${tone}`, `v-${variant}`]" data-test="tag">
    <slot name="icon"><span v-if="icon" class="gl" aria-hidden="true">{{ icon }}</span></slot>
    {{ label }}
  </span>
</template>

<style scoped>
.tg {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 9px; border-radius: var(--curva-sm);
  font-family: var(--font-sans); font-weight: 500; font-size: calc(11px * var(--acq-esc)); white-space: nowrap;
}
.v-outline { background: none; border: 1px solid currentColor; }
.t-neutro { color: var(--color-dim); }
.v-tinted.t-neutro { background: var(--color-soft); }
.t-brand { color: var(--color-accent-text); }
.v-tinted.t-brand { background: var(--color-accent-bg); color: var(--color-on-accent-bg); }
/* `-text`, não o papel de área: `positivo`/`negativo` sozinhos, aqui, sobre o
   próprio tingimento de 16% (ou sobre canvas/card, no `outline`), reprovam
   4,5:1 no claro — achado pela auditoria de página nos dois temas
   (2026-08-13). Mesma separação que `accent`/`accent-text` já tem. */
.t-positivo { color: var(--color-positivo-text); }
.v-tinted.t-positivo { background: color-mix(in srgb, var(--color-positivo) 16%, transparent); }
.t-negativo { color: var(--color-negativo-text); }
.v-tinted.t-negativo { background: color-mix(in srgb, var(--color-negativo) 16%, transparent); }
/* ═══ ESTADO E IDENTIDADE NÃO PODEM TER UMA APARÊNCIA ═══
   `negativo` e `brand` dividiriam o mesmo sólido se os dois pintassem
   `action` cheio — mas aqui nem chegam a competir: a ACQUARIO não tem cor
   própria de atenção, então "vence hoje" e "vencido há 4 dias" são o MESMO
   tom (`negativo`) e o que separa um do outro é PESO, não matiz:

     negativo + solid    o mais grave  — vencido, cancelado
     negativo + tinted   metade do peso, mesma cor — vence hoje, em atraso leve
     brand               área do ACENTO — identidade nunca é estado

   `on-negativo` é a tinta sobre `negativo` cheio — nunca branco escolhido à
   mão. */
.v-solid.t-negativo { background: var(--color-negativo); color: var(--color-on-negativo); }
.v-solid.t-brand { background: var(--color-accent-bg); color: var(--color-on-accent-bg); }
/* `solid` faltava para `positivo` e `neutro` — a ficha promete doze
   combinações (`3 variant × 4 tone`) e só entregava oito; `tone="positivo"`
   com `variant="solid"` renderizava texto lima sem preenchimento nenhum,
   visualmente idêntico ao `outline` sem a borda. Achado pela revisão final
   (I7), 2026-08-13. */
.v-solid.t-positivo { background: var(--color-positivo); color: var(--color-on-positivo); }
.v-solid.t-neutro   { background: var(--color-soft);     color: var(--color-ink); }
.gl { line-height: 1; }
.ic, .gl, :deep(i) { flex: 0 0 auto; }
</style>
