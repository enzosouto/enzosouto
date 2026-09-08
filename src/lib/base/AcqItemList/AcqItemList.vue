<script setup lang="ts">
// Lista de capacidades ou passos. Ver ficha.ts, ao lado.
//
// A regra que mais importa não é visual: TODOS os itens precisam pertencer
// ao MESMO eixo de recorte. Três por tecnologia e um por fase do ciclo é o
// que faz uma lista parecer arbitrária.
export interface Item {
  title: string
  desc: string
  note?: string
}

withDefaults(
  defineProps<{
    items: Item[]
    numbered?: boolean
    columns?: number
    /**
     * NÍVEL do título de item — não o corpo dele, que é sempre o mesmo.
     *
     * Cravado em `h3`, a lista produziria salto `h1 → h3` quando aparecesse
     * diretamente sob o título de uma página. O nível certo depende de onde
     * a lista está, e componente não tem como saber isso.
     */
    titleLevel?: 2 | 3 | 4
  }>(),
  { numbered: true, columns: 1, titleLevel: 3 },
)
</script>

<template>
  <div
    class="ac-list"
    :style="{ '--cols': columns }"
    :class="{ grade: columns > 1 }"
    data-test="item-list"
  >
    <div v-for="(it, i) in items" :key="i" class="ac-item">
      <div v-if="numbered" class="ac-n">{{ String(i + 1).padStart(2, '0') }}</div>
      <component :is="`h${titleLevel}`" class="ac-tit">{{ it.title }}</component>
      <p>{{ it.desc }}</p>
      <p v-if="it.note" class="ac-note">{{ it.note }}</p>
    </div>
  </div>
</template>

<style scoped>
/* `columns` é TETO, não número fixo. A faixa mínima é a maior entre 228px e
   a largura exata de N colunas: assim nunca aparece uma coluna a mais que o
   declarado, e a grade ainda cai sozinha para menos colunas quando a tela
   encolhe. */
.ac-list.grade {
  --gap: 44px;
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(max(228px, calc((100% - (var(--cols) - 1) * var(--gap)) / var(--cols))), 1fr)
  );
  gap: 56px var(--gap);
}
.ac-item { text-align: left; }
/* Em coluna única a régua de 1px separa os itens; em grade o espaço já
   separa — a mesma regra do AcqSection. */
.ac-list:not(.grade) .ac-item { padding: 28px 0; border-top: 1px solid var(--color-soft); }
.ac-list:not(.grade) .ac-item:last-child { border-bottom: 1px solid var(--color-soft); }

.ac-n {
  font-family: var(--font-sans); font-weight: 600; font-size: calc(11px * var(--acq-esc)); letter-spacing: .06em;
  color: var(--color-accent-text); margin-bottom: 14px;
}
.ac-tit {
  font-family: var(--font-sans); font-weight: 500; font-size: calc(18px * var(--acq-esc)); letter-spacing: -.28px;
  color: var(--color-ink); margin: 0 0 11px;
}
p {
  font-family: var(--font-sans); font-weight: 400; font-size: calc(15px * var(--acq-esc)); line-height: 1.62;
  color: var(--color-dim); margin: 0; max-width: 60ch;
}
.ac-note { margin-top: 9px; color: var(--color-dimmer); }
</style>
