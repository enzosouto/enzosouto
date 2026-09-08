<script setup lang="ts">
// TEXTO QUE SÓ EXISTE PARA O LEITOR DE TELA. Ver ficha.ts, ao lado.
//
// O RECORTE, e por que é este:
//   position:absolute      tira do fluxo sem tirar da árvore de acessibilidade
//   1px + margin:-1px      área mínima que não some da árvore
//   clip-path:inset(50%)   o recorte de verdade — some do desenho, fica no leitor
//   overflow:hidden        para o navegador que ignora clip-path em elemento inline
//   white-space:nowrap     texto longo sem isto quebra em uma letra por linha e
//                          alguns leitores anunciam letra por letra
//
// O QUE ESTÁ PROIBIDO, e é o motivo de a peça existir num lugar só:
//   `display:none` e `visibility:hidden` removem do leitor de tela também —
//   é o oposto do objetivo, e é o erro que mais aparece quando alguém
//   "esconde" um rótulo sem pensar na árvore de acessibilidade.
//   `width:0;height:0` faz parte dos leitores tratarem como conteúdo vazio e
//   pular o nó em silêncio.
//
// Escrito à mão, este recorte tende a virar variações sutilmente diferentes
// em cada arquivo que precisa dele — e a mais comum dessas variações esconde
// por `opacity: 0`, que deixa 1px de área clicável e mantém o elemento na
// ordem de foco. A peça existe para que a regra more num lugar antes que
// isso aconteça.
withDefaults(
  defineProps<{
    /**
     * O elemento. `span` dentro de linha de texto, `p` para frase própria,
     * `div` quando embrulha algo com foco (é o caso do `AcqSkipLink`).
     */
    as?: 'span' | 'div' | 'p'
    /**
     * Quando `true`, o conteúdo APARECE ao receber foco — o recorte só vale
     * enquanto ninguém está ali. É o que permite conteúdo alcançável por
     * teclado ficar fora do desenho. Revelado, o elemento volta ao fluxo
     * normal; quem precisa dele fixo no canto da janela posiciona o
     * contêiner por fora — é o que o `AcqSkipLink` faz.
     */
    focusable?: boolean
  }>(),
  { as: 'span', focusable: false },
)
</script>

<template>
  <component :is="as" class="ac-vh" :class="{ f: focusable }" data-test="visually-hidden">
    <slot />
  </component>
</template>

<style scoped>
.ac-vh {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  /* O recorte. `clip-path` também recorta o teste de ponteiro, então o 1px
     restante não é alvo de clique acidental. */
  clip-path: inset(50%);
  white-space: nowrap;
}

/* `:focus-within` e não só `:focus`: o elemento em si é `span`/`div`/`p` e
   não recebe foco — quem recebe é o `<a>` ou o `<button>` dentro dele.
   `:focus` fica para o caso de quem chama pôr `tabindex` no próprio
   elemento.
   A troca é instantânea, sem transição: animar a revelação de um alvo de
   teclado atrasaria a única pista de para onde o foco foi — e é por isso
   que este arquivo não lê nenhum `--dur-*` nem `--mov-*`. */
.ac-vh.f:focus,
.ac-vh.f:focus-within {
  position: static;
  width: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  clip-path: none;
  white-space: normal;
}
</style>
