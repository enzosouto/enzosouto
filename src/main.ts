/**
 * A ENTRADA DO CURRÍCULO DO ENZO.
 *
 * Projeto próprio, extraído do monorepo da ACQUARIO — nasceu como uma das
 * entradas de build de lá (`enzo.ts`, irmã de `pimenta.ts`/`demacol.ts`),
 * mas o pedido foi este site não morar dentro do repositório da ACQUARIO.
 * `src/lib`, `src/tokens`, `src/componentes` e os `.css` da raiz são cópia
 * do que aquele monorepo chama de "livro" — só o fechamento de dependências
 * que `PaginaEnzo.vue` realmente usa, não a biblioteca inteira.
 */
import { createApp } from 'vue'
import { useTema } from '@/lib/useTema'
import PaginaEnzo from './enzo/PaginaEnzo.vue'
import './fontes.css'
import './style.css'
import './liquido.css'

useTema().definir('enzo-escuro')
createApp(PaginaEnzo).mount('#app')
