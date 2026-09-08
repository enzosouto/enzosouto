/**
 * A projetiva que põe um retângulo nos quatro cantos de uma tela fotografada.
 *
 * `rotate` e `skew` não servem: são afins, e afim preserva paralelismo — que é
 * exatamente o que a perspectiva quebra. Só a projetiva de 8 parâmetros leva um
 * retângulo a um quadrilátero qualquer.
 *
 * ESTE ARQUIVO JÁ MOROU NO SITE, e a mudança para cá é o fim de um vaivém que
 * custou uma restauração. Ele nasceu em `src/lib` do site, foi apagado por uma
 * sincronização (aquela pasta é espelho do livro e é limpa antes de copiar),
 * renasceu em `src/componentes` — e só então ficou claro que a projetiva não é
 * do site: é do instrumento. Agora mora onde a sincronização o distribui em vez
 * de o apagar.
 */

export type Ponto = [number, number]
export type Quad = { te: Ponto; td: Ponto; bd: Ponto; be: Ponto }

/** Eliminação de Gauss com pivotamento parcial. */
function resolver(A: number[][], b: number[]): number[] {
  const n = b.length
  for (let i = 0; i < n; i++) {
    // Pivotamento: sem ele um pivô quase-zero explode o erro numérico, e um
    // quadrilátero com dois cantos quase alinhados produz exatamente esse caso.
    let melhor = i
    for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[melhor][i])) melhor = r
    ;[A[i], A[melhor]] = [A[melhor], A[i]]
    ;[b[i], b[melhor]] = [b[melhor], b[i]]

    if (Math.abs(A[i][i]) < 1e-12) throw new Error('quadrilátero degenerado')

    for (let r = i + 1; r < n; r++) {
      const f = A[r][i] / A[i][i]
      for (let c = i; c < n; c++) A[r][c] -= f * A[i][c]
      b[r] -= f * b[i]
    }
  }
  const x = new Array(n).fill(0)
  for (let i = n - 1; i >= 0; i--) {
    let s = b[i]
    for (let c = i + 1; c < n; c++) s -= A[i][c] * x[c]
    x[i] = s / A[i][i]
  }
  return x
}

/** Os oito coeficientes que levam `de` em `para`. */
function coeficientes(de: Ponto[], para: Ponto[]): number[] {
  const A: number[][] = []
  const b: number[] = []
  for (let i = 0; i < 4; i++) {
    const [x, y] = de[i]
    const [X, Y] = para[i]
    A.push([x, y, 1, 0, 0, 0, -x * X, -y * X])
    b.push(X)
    A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y])
    b.push(Y)
  }
  return resolver(A, b)
}

const cantosDoQuad = (q: Quad): Ponto[] => [q.te, q.td, q.bd, q.be]
const cantosDoRetangulo = (w: number, h: number): Ponto[] => [
  [0, 0],
  [w, 0],
  [w, h],
  [0, h],
]

/**
 * Leva o retângulo `w × h` aos quatro cantos e devolve o `matrix3d`.
 *
 * O `matrix3d` do CSS é COLUNA-MAIOR, e a coluna do meio (z) é a identidade
 * porque nada aqui tem profundidade: o que dá a perspectiva é a quarta linha
 * (g, h), que é o divisor.
 */
export function matrizDaTela(w: number, h: number, destino: Quad): string {
  const [a, b, c, d, e, f, g, hh] = coeficientes(cantosDoRetangulo(w, h), cantosDoQuad(destino))
  return `matrix3d(${[a, d, 0, g, b, e, 0, hh, 0, 0, 1, 0, c, f, 0, 1]
    .map((v) => (Math.abs(v) < 1e-10 ? 0 : Number(v.toFixed(8))))
    .join(',')})`
}

/**
 * Traz pontos da FOTO de volta ao retângulo do aparelho.
 *
 * É o que permite recortar o conteúdo pela forma real da tela. O quadrilátero
 * medido é a projeção da PLACA inteira, e quando o mockup recorta a placa para
 * preencher a tela (proporções diferentes), os cantos da placa caem FORA do
 * vidro: o conteúdo transborda por cima da moldura. O contorno do buraco,
 * medido no recorte, é a tela verdadeira — e `clip-path` trabalha em
 * coordenadas do elemento, não da foto, então os pontos precisam voltar.
 */
export function paraOAparelho(w: number, h: number, destino: Quad, pontos: Ponto[]): Ponto[] {
  const [a, b, c, d, e, f, g, hh] = coeficientes(cantosDoQuad(destino), cantosDoRetangulo(w, h))
  return pontos.map(([x, y]) => {
    const k = g * x + hh * y + 1
    return [(a * x + b * y + c) / k, (d * x + e * y + f) / k] as Ponto
  })
}
