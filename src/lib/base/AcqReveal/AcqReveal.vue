<script setup lang="ts">
// REVELAÇÃO ESCALONADA NA ROLAGEM. Ver ficha.ts, ao lado.
//
// É AQUI QUE A DOUTRINA LÍQUIDA DA MARCA APARECE MAIS: a peça sobe com
// `var(--mov-onda)` e `var(--dur-lento)`, em cascata — cada filho atrasado em
// relação ao anterior por `stagger` milissegundos.
//
// `IntersectionObserver` com `unobserve`: dispara uma vez por filho e não
// pesa na rolagem. Escutar `scroll` faria o mesmo trabalho a cada quadro, na
// thread principal — é o que devolve engasgo no telefone.
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{ stagger?: number }>(), { stagger: 110 })

const root = ref<HTMLElement | null>(null)
let obs: IntersectionObserver | undefined

onMounted(() => {
  const el = root.value
  if (!el) return
  const kids = Array.from(el.children) as HTMLElement[]

  // Sob `prefers-reduced-motion: reduce` (ou sem `IntersectionObserver`), o
  // conteúdo NASCE visível. Não é ajuste fino: a cascata líquida é o MODO de
  // entrar, nunca a condição de existir.
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !('IntersectionObserver' in window)
  ) {
    kids.forEach((k) => k.classList.add('acq-reveal-in'))
    return
  }

  kids.forEach((k) => k.classList.add('acq-reveal-idle'))
  obs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const k = e.target as HTMLElement
        k.style.transitionDelay = `${kids.indexOf(k) * props.stagger}ms`
        k.classList.add('acq-reveal-in')
        obs?.unobserve(k)
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
  )
  kids.forEach((k) => obs!.observe(k))
})
onBeforeUnmount(() => obs?.disconnect())
</script>

<template>
  <div ref="root" data-test="reveal"><slot /></div>
</template>

<style>
/* Sem `scoped`: as classes são aplicadas nos filhos vindos do slot, não no
   elemento raiz deste componente. */
.acq-reveal-idle {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity var(--dur-lento) var(--mov-onda),
    transform var(--dur-lento) var(--mov-onda);
}
.acq-reveal-in {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .acq-reveal-idle {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
