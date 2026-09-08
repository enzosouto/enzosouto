<script setup lang="ts">
/**
 * A SUPERFÍCIE DE CONTEÚDO DO SISTEMA — e a peça que mais inverte o espelho.
 *
 * A ficha do `RiCard` (risilva) descreve a própria peça como "régua de 1px,
 * sem sombra, sem raio além do teto". Aqui as três viram o oposto: raio
 * `var(--curva-xl)` — o teto da escala de curva, reservado a cartão e painel
 * — e sombra `var(--elev-repouso)`, a elevação de quem fica parado sobre o
 * canvas.
 *
 * E A RÉGUA DE 1PX PERMANECE. Não por apego ao espelho: por FÍSICA do tema
 * escuro. Medido nas famílias desta biblioteca, no esquema escuro a
 * diferença de luminosidade entre `card` e `canvas` (ΔL) fica abaixo do que
 * qualquer olho separa por valor sozinho — e a sombra, que é preta, quase
 * desaparece sobre um fundo que já é quase preto (a força da sombra escala
 * por esquema, mas nenhum multiplicador faz preto brilhar sobre preto).
 * Régua e sombra fazem TRABALHOS DIFERENTES: a régua é o que separa a
 * superfície de verdade, em qualquer esquema e para qualquer curva de
 * contraste; a sombra é o que dá PROFUNDIDADE — o "isto está por cima do
 * canvas" que só a luz simulada carrega, e que a régua sozinha não diz. Tirar
 * a régua "para limpar", achando que ela é decoração esquecida do espelho,
 * quebra exatamente o caso em que ela importa: o escuro, onde a sombra
 * sozinha não chega perto de sustentar a elevação.
 *
 * NÃO EMBRULHA o Card do PrimeVue — mesma razão do espelho, medida no
 * `risilva_financeiro`: 13 arquivos, 10 `:deep(.p-card-*)` para desfazer
 * sombra, recuo e raio que a peça de terceiro já trazia errados para este
 * sistema. Árvore de partes que você não desenhou é árvore contra a qual
 * você vai brigar — vale para o espelho reto e vale, do mesmo jeito, aqui.
 *
 * NÃO EXISTE prop `gap`, e não vai existir: se o caso pede outro ritmo
 * interno, a resposta é `density`, que já tem três valores.
 */
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    /** `normal` é o respiro padrão; `tight` é para cartão dentro de cartão;
     *  `flush` é zero, para quando o filho já tem o próprio recuo (tabela). */
    density?: 'normal' | 'tight' | 'flush'
    /** `accent` acende a régua da esquerda. Um por tela, no máximo — se dois
     *  cartões destacam, nenhum destaca. */
    tone?: 'neutro' | 'accent'
    /** Vira `<button>` de largura cheia. Sem isto o cartão é `<section>` e
     *  não recebe foco nenhum. */
    clickable?: boolean
    as?: 'section' | 'article' | 'div'
    /**
     * NÍVEL do título, não estilo dele — o corpo tipográfico é sempre o
     * mesmo. O nível certo depende de onde o cartão está, e o componente não
     * tem como saber isso sozinho: sob uma seção `h2` o título é `h3`; solto
     * sob o `h1` da página é `h2`. Cravado, o cartão produziria salto na
     * estrutura de títulos — defeito que leitor de tela anuncia como nível
     * faltando.
     */
    titleLevel?: 2 | 3 | 4
  }>(),
  { density: 'normal', tone: 'neutro', as: 'section', titleLevel: 3 },
)
</script>

<template>
  <component :is="as" class="c" :class="[`d-${density}`, `t-${tone}`, { click: clickable }]" data-test="card">
    <header v-if="title || $slots.title || $slots.actions" class="hd">
      <div class="tt">
        <slot name="title">
          <component :is="`h${titleLevel}`" v-if="title" class="tit">{{ title }}</component>
        </slot>
        <p v-if="subtitle" class="sub">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="ac"><slot name="actions" /></div>
    </header>
    <div class="bd"><slot /></div>
    <footer v-if="$slots.foot" class="ft"><slot name="foot" /></footer>
  </component>
</template>

<style scoped>
/* A RÉGUA É MECANISMO, NÃO REFORÇO — ver o comentário grande acima. No
   esquema escuro desta biblioteca, ΔL(card, canvas) sozinho não separa a
   superfície; a régua de 1px é o que garante o corte mesmo quando a sombra
   quase não aparece. */
.c {
  background: var(--color-card);
  border: 1px solid var(--color-hair);
  border-radius: var(--curva-xl);
  box-shadow: var(--elev-repouso);
}
.t-accent { border-left: 2px solid var(--color-accent); }

.click {
  cursor: pointer;
  transition: border-color var(--dur-rapido) var(--mov-onda);
}
.click:hover { border-color: var(--color-dimmer); }

.hd { display: flex; align-items: flex-start; gap: 14px; padding: 24px 26px 0; }
.tt { flex: 1; min-width: 0; }
.hd .tit {
  margin: 0;
  font-family: var(--font-sans);
  font-size: calc(15px * var(--acq-esc));
  font-weight: 500;
  color: var(--color-ink);
}
.sub {
  margin: 5px 0 0;
  font-family: var(--font-sans);
  font-size: calc(12.5px * var(--acq-esc));
  font-weight: 400;
  color: var(--color-dim);
}
.ac { flex: 0 0 auto; }

.bd { padding: 24px 26px; font-family: var(--font-sans); color: var(--color-ink); }
.hd + .bd { padding-top: 16px; }

/* `tight`: cartão dentro de cartão — o mesmo raio, respiro menor. */
.d-tight .hd { padding: 14px 16px 0; }
.d-tight .bd { padding: 14px 16px; }

/* `flush`: o filho já tem recuo próprio (tabela, lista). */
.d-flush .bd { padding: 0; }
.d-flush .hd { padding: 18px 20px 0; }

.ft { padding: 0 26px 20px; }
.d-tight .ft { padding: 0 16px 14px; }

@media (prefers-reduced-motion: reduce) {
  .click { transition: none; }
}
</style>
