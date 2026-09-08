<script setup lang="ts">
// PULAR PARA O CONTEÚDO. Ver ficha.ts, ao lado.
//
// A FORMA, e por que são duas camadas:
//   o contêiner POSICIONA (fixo no topo da janela, fora do fluxo);
//   o AcqVisuallyHidden RECORTA (invisível até o foco chegar no `<a>`).
// Assim o link revelado NÃO empurra a página: se o recorte voltasse ao fluxo
// no meio do documento, o primeiro `Tab` de cada visita deslocaria todo o
// conteúdo para baixo.
//
// É `<a href="#id">` de verdade, não `<button>` com script: navegação é
// `<a>`, o hash entra no histórico e a coisa funciona antes de o JavaScript
// carregar — que é justamente quando alguém está tabulando às cegas.
//
// O QUE ESTE COMPONENTE NÃO CONSERTA: o foco só vai para o destino se o
// destino for focável. `<main id="conteudo">` sem `tabindex="-1"` recebe o
// hash na URL e o foco fica onde estava — a pessoa vê a página rolar e
// continua tabulando dentro do menu. Chamar `.focus()` daqui não resolve:
// `focus()` em elemento não focável não faz nada. A regra é do chamador —
// está na ficha, sem gambiarra escondida aqui.
//
// O recorte NÃO é reescrito aqui: vem do `AcqVisuallyHidden`, peça do mesmo
// lote — é a mesma técnica que existe para não se repetir arquivo a arquivo.
import AcqVisuallyHidden from '../AcqVisuallyHidden/AcqVisuallyHidden.vue'

withDefaults(
  defineProps<{
    /** `id` do destino. O destino PRECISA ter `tabindex="-1"`. */
    target?: string
    /** O texto do link. Verbo primeiro: é o que o leitor de tela anuncia. */
    label?: string
  }>(),
  { target: 'conteudo', label: 'Pular para o conteúdo' },
)
</script>

<template>
  <div class="ac-sk" data-test="skip-link">
    <AcqVisuallyHidden as="div" focusable>
      <a class="ac-lk" :href="`#${target}`">{{ label }}</a>
    </AcqVisuallyHidden>
  </div>
</template>

<style scoped>
/* `fixed`, não `absolute`: com `absolute` o link se posiciona no topo do
   DOCUMENTO, e numa página já rolada ele aparece fora da janela — visível
   para ninguém, exatamente na hora em que alguém precisa dele. */
.ac-sk {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 90;
}

.ac-lk {
  display: inline-flex;
  align-items: center;
  /* 48dp: é link, e link se clica. */
  min-height: 48px;
  padding: 0 20px;
  margin: 8px;
  background: var(--color-card);
  border: 1px solid var(--color-accent);
  /* PÍLULA: altura fixa e pequena é o caso exato em que a curva máxima é
     segura — o mesmo raciocínio do botão de 48px de altura. */
  border-radius: var(--curva-pill);
  /* Revelado, o link sai do fluxo e flutua sobre o conteúdo de verdade — a
     mesma elevação de um diálogo ou de um menu, nunca a de repouso de uma
     superfície estática. É o único link comum do sistema que ganha a
     sombra reservada a sobreposição. */
  box-shadow: var(--elev-flutua);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: calc(13px * var(--acq-esc));
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: border-color var(--dur-rapido) var(--mov-onda);
}
.ac-lk:hover { border-color: var(--color-accent-text); }

@media (prefers-reduced-motion: reduce) {
  .ac-lk { transition: none; }
}
</style>
