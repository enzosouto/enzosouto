/**
 * A FAMÍLIA E OS DOIS TEMAS — sem Vue, carregável em Node puro.
 *
 * `scripts/gerar-temas.mjs` lê `src/tokens/temas/*.json` e emite
 * `familias.gen.ts` com a família embutida como LITERAL — zero import de
 * runtime, para carregar em Vite, em Node puro e no padrão esbuild+data-URL
 * que os scripts deste repositório usam por igual.
 *
 * Este arquivo só REEXPORTA o gerado. Ele existe (em vez de sumir e todo
 * consumidor importar `familias.gen` direto) porque `src/lib/useTema.ts`
 * importa exatamente deste caminho (`'../tokens/familias'`) — e é o nome
 * estável para qualquer futuro consumidor do lado do Vite. Quem está em Node
 * fora de um bundler (scripts de verificação) importa `familias.gen.ts`
 * DIRETO.
 */

export { familias, temas, acharTema, TEMA_PADRAO } from './familias.gen'
