/**
 * QUAL SEÇÃO ESTÁ SENDO LIDA — para o item do menu acender junto.
 *
 * Devolve o `id` da seção que ocupa a faixa de leitura da tela. Um menu de
 * âncoras sem isso é um mapa sem "você está aqui": a pessoa rola por seis
 * assuntos e o menu continua igual do começo ao fim.
 *
 * A FAIXA DE LEITURA NÃO É A TELA INTEIRA, e essa é a decisão que faz a coisa
 * funcionar. Observando a viewport toda, duas ou três seções estão visíveis ao
 * mesmo tempo em qualquer rolagem, e o item ativo pisca entre elas. A margem
 * negativa (`-45%` em cima, `-50%` embaixo) estreita a observação a uma frente
 * de uns 5% da altura, mais ou menos onde o olho está: cada seção acende ao
 * cruzar essa linha e só apaga quando a seguinte a cruza.
 *
 * `IntersectionObserver` E NÃO EVENTO DE ROLAGEM. O evento dispara dezenas de
 * vezes por segundo e obriga a medir a posição de cada seção em cada disparo —
 * cada medição é um `getBoundingClientRect`, que força o navegador a
 * recalcular layout. O observador entrega só as MUDANÇAS, e as entrega fora do
 * caminho da pintura.
 *
 * O ESTADO SÓ MUDA PARA UM ID CONHECIDO. Ao sair de uma seção sem entrar em
 * outra — no rodapé, por exemplo — o último ativo continua aceso, em vez de o
 * menu apagar inteiro. Menu sem nada aceso lê como defeito.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useSecaoAtiva(ids: string[]) {
  const ativa = ref('')
  let observador: IntersectionObserver | undefined

  onMounted(() => {
    const alvos = ids
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => !!e)
    if (!alvos.length) return

    observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting && e.target.id) ativa.value = e.target.id
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    alvos.forEach((a) => observador!.observe(a))
  })

  onBeforeUnmount(() => observador?.disconnect())

  return { ativa }
}
