<script setup lang="ts">
/**
 * O CURRÍCULO DO ENZO, vestido pela casa.
 *
 * Mesma regra de neer-roberto/pimenta/demacol: nada de cor, fonte ou
 * componente escrito à mão — tudo sai de `src/lib`. Página única, sem
 * router, cinco âncoras (sobre, experiência, habilidades, formação,
 * projetos).
 *
 * NASCEU PORTFÓLIO (sobre + projetos, sem canal de contato) e virou
 * currículo completo — o resto das seções veio do PDF
 * `Enzo_Souto_CV_Atualizado.pdf`, reescrito para tela em `conteudo.ts`. Um
 * currículo sem jeito de responder não cumpre o que promete, então ganhou
 * `CONTATO` e o botão de baixar o PDF original no rodapé da capa.
 *
 * O CARGO SOB O TÍTULO (`HERO.papel`) digita sozinho — `width: 0 → Nch` em
 * `steps()`, puro CSS, sem JS. Sob `prefers-reduced-motion` a régua de
 * animação em `.papel` cai pra `none` (ver `<style>` abaixo) e o texto nasce
 * inteiro, mesma doutrina do `AcqReveal`.
 *
 * BILÍNGUE. `idioma` é um `ref` persistido (`localStorage`), e `C` é o
 * pacote de texto inteiro naquele idioma — `conteudo(idioma)`, em
 * `conteudo.ts`. Ler o idioma salvo ANTES de montar (não em `onMounted`)
 * pela mesma razão do `useTema`: se a leitura fosse depois da primeira
 * pintura, a página nasceria em português e trocaria pra inglês visivelmente
 * no primeiro quadro, para quem já tinha escolhido inglês antes.
 *
 * O PDF TEM DOIS ARQUIVOS, um por idioma — o clique no botão não baixa
 * direto: abre `.pdfAberto`, um modal pequeno que pergunta qual dos dois.
 */
import { computed, onBeforeUnmount, ref } from 'vue'
import AcqButton from '@/lib/base/AcqButton/AcqButton.vue'
import AcqCard from '@/lib/base/AcqCard/AcqCard.vue'
import AcqContainer from '@/lib/base/AcqContainer/AcqContainer.vue'
import AcqGrid from '@/lib/base/AcqGrid/AcqGrid.vue'
import AcqItemList from '@/lib/base/AcqItemList/AcqItemList.vue'
import AcqMeta from '@/lib/base/AcqMeta/AcqMeta.vue'
import AcqSection from '@/lib/base/AcqSection/AcqSection.vue'
import AcqSkipLink from '@/lib/base/AcqSkipLink/AcqSkipLink.vue'
import AcqStack from '@/lib/base/AcqStack/AcqStack.vue'
import AcqTag from '@/lib/base/AcqTag/AcqTag.vue'
import AcqA11y from '@/lib/base/AcqA11y/AcqA11y.vue'
import AcqCursorAgua from '@/lib/marca/AcqCursorAgua/AcqCursorAgua.vue'
import AcqEyebrow from '@/lib/marca/AcqEyebrow/AcqEyebrow.vue'
import AcqOnda from '@/lib/marca/AcqOnda/AcqOnda.vue'
import AcqReveal from '@/lib/base/AcqReveal/AcqReveal.vue'
import AcqFluxo from '@/lib/instrumento/AcqFluxo/AcqFluxo.vue'
import { useSecaoAtiva } from '@/lib/useSecaoAtiva'
import { useTema } from '@/lib/useTema'
import AmbienteLiquido from '@/componentes/AmbienteLiquido.vue'
import SecaoProjetos from './SecaoProjetos.vue'
import HexFerramentas from './HexFerramentas.vue'
import RetratoFragmentado from './RetratoFragmentado.vue'
import { CONTATO, PERCURSO, REDES, conteudo, type Idioma } from './conteudo'

const CHAVE_IDIOMA = 'enzo.idioma.v1'
function lerIdioma(): Idioma {
  try {
    const salvo = localStorage.getItem(CHAVE_IDIOMA)
    return salvo === 'en' ? 'en' : 'pt'
  } catch {
    return 'pt'
  }
}
const idioma = ref<Idioma>(lerIdioma())
const C = computed(() => conteudo(idioma.value))

function trocarIdioma(novo: Idioma) {
  idioma.value = novo
  try {
    localStorage.setItem(CHAVE_IDIOMA, novo)
  } catch {
    // modo privado: vale só pra esta sessão
  }
}

// Os `id` das âncoras são os mesmos nos dois idiomas — só o rótulo muda —
// então dá pra escutar a rolagem uma vez só, fora da reatividade do idioma.
const { ativa } = useSecaoAtiva(C.value.NAV.map((n) => n.id))

// CLARO/ESCURO. `useTema` já existia (é dele que `main.ts` lê o tema salvo
// antes de montar); aqui só se pega `tema`/`trocarEsquema` pra ligar o botão
// do cabeçalho. `enzo-claro` já vinha pronto em `temas.gen.css` — a
// biblioteca sempre teve os dois esquemas por família, só nunca tinha botão
// pra trocar.
const { tema, trocarEsquema } = useTema()

function subtituloCargo(cargo: ReturnType<typeof conteudo>['EXPERIENCIA']['cargos'][number]) {
  return cargo.periodo ? `${cargo.cargo} · ${cargo.periodo}` : cargo.cargo
}

/* O TEXTO FIXO QUE NÃO MORA EM `conteudo.ts` — os quatro ou cinco rótulos
   de interface (botões, modal) que não fazem parte do "texto do currículo"
   em si. Pequeno o bastante pra não merecer entrar no pacote bilíngue de
   lá. */
const TEXTO_UI = {
  pt: {
    verExperiencia: 'Ver experiência ↓', verProjetos: 'Ver projetos ↓',
    pdf: 'PDF', certificacoes: 'Certificações', idiomas: 'Idiomas', emAndamento: 'em andamento', atual: 'atual',
    projetosLabel: 'projetos', projetosTitulo: 'Projetos pessoais de dados',
    modalTitulo: 'Baixar currículo em qual idioma?', modalPt: 'Português', modalEn: 'English', modalFechar: 'Fechar',
    temaClaro: 'Mudar para o modo claro', temaEscuro: 'Mudar para o modo escuro',
  },
  en: {
    verExperiencia: 'See experience ↓', verProjetos: 'See projects ↓',
    pdf: 'PDF', certificacoes: 'Certifications', idiomas: 'Languages', emAndamento: 'in progress', atual: 'current',
    projetosLabel: 'projects', projetosTitulo: 'Personal data projects',
    modalTitulo: 'Download the résumé in which language?', modalPt: 'Português', modalEn: 'English', modalFechar: 'Close',
    temaClaro: 'Switch to light mode', temaEscuro: 'Switch to dark mode',
  },
} as const
const T = computed(() => TEXTO_UI[idioma.value])

/* O MODAL DO PDF. Mesmo padrão de qualquer overlay da casa: Teleport pro
   fim do `<body>`, Esc fecha, clique fora fecha, rolagem da página trava
   enquanto ele está aberto. */
const pdfAberto = ref(false)
const PDF_URL = { pt: '/curriculo-enzo-souto.pdf', en: '/curriculo-enzo-souto-en.pdf' }

function abrirModalPdf() {
  pdfAberto.value = true
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onTeclaModalPdf)
}
function fecharModalPdf() {
  pdfAberto.value = false
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onTeclaModalPdf)
}
function onTeclaModalPdf(e: KeyboardEvent) {
  if (e.key === 'Escape') fecharModalPdf()
}
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onTeclaModalPdf)
  document.body.style.overflow = ''
})

/* O SELO DE EMPRESA/INSTITUIÇÃO — altura fixa, largura na proporção do
   logo (clampada, pra um logo bem largo tipo FIAP não virar uma barra). A
   mesma conta que o antigo `LogoInstituicao` fazia, agora alimentando o
   `RetratoFragmentado` (`sem-moldura`, só o quadro montando em cacos). */
function tamanhoSelo(logo: { w: number; h: number }) {
  const altura = 56
  const largura = Math.min(Math.max(altura * (logo.w / logo.h), altura), altura * 3.5)
  return { largura, altura }
}
</script>

<template>
  <AcqSkipLink target="conteudo" />
  <AmbienteLiquido />

  <header class="topo">
    <a class="marca" href="#topo" aria-label="Enzo Souto, início do currículo">
      <img src="/logo-es.png" alt="Enzo Souto" class="assinatura-nav" />
    </a>
    <nav class="links" aria-label="Seções do currículo">
      <a
        v-for="n in C.NAV"
        :key="n.id"
        :href="`#${n.id}`"
        :class="{ acesa: ativa === n.id }"
        :aria-current="ativa === n.id ? 'true' : undefined"
        >{{ n.rotulo }}</a
      >
    </nav>
    <div class="idioma-toggle" role="group" aria-label="Idioma / Language">
      <button type="button" :class="{ ativo: idioma === 'pt' }" :aria-pressed="idioma === 'pt'" @click="trocarIdioma('pt')">PT</button>
      <button type="button" :class="{ ativo: idioma === 'en' }" :aria-pressed="idioma === 'en'" @click="trocarIdioma('en')">EN</button>
    </div>
    <button
      type="button"
      class="tema-toggle"
      :aria-label="tema.esquema === 'claro' ? T.temaEscuro : T.temaClaro"
      @click="trocarEsquema"
    >
      <svg v-if="tema.esquema === 'claro'" aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      </svg>
      <svg v-else aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
      </svg>
    </button>
    <AcqButton class="pdf-topo" variant="outline" size="sm" type="button" @click="abrirModalPdf">
      <AcqOnda />{{ T.pdf }}
    </AcqButton>
  </header>

  <main id="conteudo">
    <header id="topo" class="capa">
      <AcqContainer>
        <div class="retratos-capa">
          <RetratoFragmentado arquivo="/enzo-retrato.jpg" :img-w="1086" :img-h="1448" :largura="176" />
          <img src="/assinatura.png" alt="Enzo Souto" class="assinatura-capa" />
        </div>
        <AcqEyebrow :text="C.HERO.eyebrow" />
        <h1 class="tit">{{ C.HERO.titulo }}</h1>
        <p class="papel" :key="idioma" :style="{ '--letras': C.HERO.papel.length }">{{ C.HERO.papel }}</p>
        <AcqStack direction="row" gap="sm" justify="center" class="redes">
          <a
            v-for="r in REDES"
            :key="r.nome"
            class="rede"
            :href="r.url"
            target="_blank"
            rel="noopener"
            :aria-label="r.nome"
          >
            <img :src="r.icone" alt="" />
          </a>
        </AcqStack>
        <p class="lead">{{ C.HERO.lead }}</p>
        <AcqStack direction="row" gap="sm" justify="center" wrap class="acoes">
          <AcqButton variant="primary" href="#experiencia"><AcqOnda />{{ T.verExperiencia }}</AcqButton>
          <AcqButton variant="text" href="#projetos"><AcqOnda />{{ T.verProjetos }}</AcqButton>
        </AcqStack>
      </AcqContainer>
    </header>

    <AcqContainer width="page">
      <AcqSection id="sobre" :label="C.SOBRE.label" :title="C.SOBRE.titulo">
        <AcqReveal :stagger="70">
          <p v-for="p in C.SOBRE.paragrafos" :key="p" class="txt">{{ p }}</p>
        </AcqReveal>
      </AcqSection>

      <AcqSection id="experiencia" :label="C.EXPERIENCIA.label" :title="C.EXPERIENCIA.titulo">
        <AcqReveal :stagger="70">
          <p class="lead-secao">{{ C.EXPERIENCIA.lead }}</p>

          <!-- O CAMINHO, com a gota atravessando: as quatro casas, na ordem em
               que aconteceram — o mesmo componente que mostra o caminho do
               dado na proposta Pimenta, aqui mostrando um caminho de carreira.
               Clicável: cada etapa leva pro cartão dela, ali embaixo. -->
          <div class="percurso">
            <AcqFluxo
              :etapas="PERCURSO.map((p) => p.label)"
              :hrefs="PERCURSO.map((p) => `#${p.cargoId}`)"
            />
          </div>

          <AcqStack gap="lg" class="cargos">
            <AcqCard
              v-for="c in C.EXPERIENCIA.cargos"
              :id="c.id"
              :key="c.id"
              :title-level="3"
            >
              <template #title>
                <div class="cargo-cabecalho">
                  <RetratoFragmentado
                    :arquivo="c.logo.arquivo"
                    :img-w="c.logo.w"
                    :img-h="c.logo.h"
                    :largura="tamanhoSelo(c.logo).largura"
                    :altura="tamanhoSelo(c.logo).altura"
                    sem-moldura
                  />
                  <div class="cargo-nomes">
                    <h3 class="tit">{{ c.empresa }}</h3>
                    <p class="sub-propria">{{ subtituloCargo(c) }}</p>
                  </div>
                </div>
              </template>
              <template v-if="c.atual" #actions>
                <AcqTag :label="T.atual" tone="positivo" />
              </template>
              <AcqItemList :items="c.atividades" :numbered="false" :columns="2" :title-level="4" />
            </AcqCard>
          </AcqStack>
        </AcqReveal>
      </AcqSection>

      <AcqSection id="habilidades" :label="C.HABILIDADES.label" :title="C.HABILIDADES.titulo">
        <AcqReveal :stagger="70">
          <p class="lead-secao">{{ C.HABILIDADES.lead }}</p>
          <div class="habilidades-corpo">
            <AcqStack gap="lg" class="grupos">
              <div v-for="g in C.HABILIDADES.grupos" :key="g.nome" class="grupo">
                <AcqMeta as="p" role="label" class="grupo-nome">{{ g.nome }}</AcqMeta>
                <AcqStack direction="row" gap="xs" wrap class="pills">
                  <AcqTag v-for="item in g.itens" :key="item" :label="item" />
                </AcqStack>
              </div>
            </AcqStack>
            <HexFerramentas />
          </div>
        </AcqReveal>
      </AcqSection>

      <AcqSection id="formacao" :label="C.FORMACAO.label" :title="C.FORMACAO.titulo">
        <AcqReveal :stagger="70">
          <AcqStack gap="lg" class="academicas">
            <AcqCard
              v-for="a in C.FORMACAO.academicas"
              :key="a.id"
              :title-level="3"
            >
              <template #title>
                <div class="cargo-cabecalho">
                  <RetratoFragmentado
                    :arquivo="a.logo.arquivo"
                    :img-w="a.logo.w"
                    :img-h="a.logo.h"
                    :largura="tamanhoSelo(a.logo).largura"
                    :altura="tamanhoSelo(a.logo).altura"
                    sem-moldura
                  />
                  <div class="cargo-nomes">
                    <h3 class="tit">{{ a.titulo }}</h3>
                    <p class="sub-propria">{{ a.instituicao }} · {{ a.periodo }}</p>
                  </div>
                </div>
              </template>
              <template v-if="a.atual" #actions>
                <AcqTag :label="T.emAndamento" tone="positivo" />
              </template>
              <p class="txt-card dim">{{ a.desc }}</p>
            </AcqCard>
          </AcqStack>

          <div class="cert-card">
            <AcqCard :title="T.certificacoes" :title-level="3">
              <AcqItemList
                :items="C.FORMACAO.certificacoes.map((c) => ({ title: c.titulo, desc: `${c.instituicao} · ${c.ano}` }))"
                :numbered="false"
                :title-level="4"
              />
            </AcqCard>
          </div>

          <div class="idiomas">
            <AcqMeta as="p" role="label" class="grupo-nome">{{ T.idiomas }}</AcqMeta>
            <AcqStack direction="row" gap="sm" wrap>
              <AcqTag
                v-for="i in C.FORMACAO.idiomas"
                :key="i.idioma"
                :label="`${i.idioma} · ${i.nivel}`"
                tone="brand"
                variant="outline"
              />
            </AcqStack>
          </div>
        </AcqReveal>
      </AcqSection>

      <AcqSection id="projetos" :label="T.projetosLabel" :title="T.projetosTitulo">
        <SecaoProjetos :projetos="C.PROJETOS" :idioma="idioma" />
      </AcqSection>
    </AcqContainer>
  </main>

  <footer class="pe">
    <AcqStack gap="sm" align="center">
      <img src="/assinatura.png" alt="Enzo Souto" class="assinatura-rodape" />
      <span class="rodape-txt">{{ C.HERO.titulo }} · {{ C.HERO.papel }}</span>
      <AcqStack direction="row" gap="sm" wrap justify="center" class="contato">
        <a class="contato-link" :href="`mailto:${CONTATO.email}`">{{ CONTATO.email }}</a>
        <span class="contato-sep" aria-hidden="true">·</span>
        <a
          class="contato-link"
          :href="`https://wa.me/${CONTATO.telefone.replace(/\D/g, '')}`"
          target="_blank"
          rel="noopener"
          >{{ CONTATO.telefone }}</a
        >
        <span class="contato-sep" aria-hidden="true">·</span>
        <span class="contato-link contato-local">{{ CONTATO.local }}</span>
      </AcqStack>
    </AcqStack>
  </footer>

  <AcqA11y position="right" />
  <AcqCursorAgua />

  <!-- O MODAL DO PDF. Teleportado pro fim do <body>, mesmo padrão de
       qualquer sobreposição da casa: cobre a tela cheia sem herdar
       `overflow`/stacking context de nenhum ancestral. -->
  <Teleport to="body">
    <div v-if="pdfAberto" class="modal-fundo" @click.self="fecharModalPdf">
      <div class="modal-caixa" role="dialog" aria-modal="true" :aria-label="T.modalTitulo">
        <div class="modal-topo">
          <p class="modal-titulo">{{ T.modalTitulo }}</p>
          <button type="button" class="modal-fechar" :aria-label="T.modalFechar" @click="fecharModalPdf">✕</button>
        </div>
        <div class="modal-corpo">
          <a class="modal-opcao" :href="PDF_URL.pt" download @click="fecharModalPdf">
            <span class="modal-opcao-bandeira" aria-hidden="true">🇧🇷</span>
            {{ T.modalPt }}
          </a>
          <a class="modal-opcao" :href="PDF_URL.en" download @click="fecharModalPdf">
            <span class="modal-opcao-bandeira" aria-hidden="true">🇺🇸</span>
            {{ T.modalEn }}
          </a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.topo {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 22px;
  background: color-mix(in srgb, var(--color-canvas) 90%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-hair);
}
.marca {
  margin-right: auto;
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}
/* O MONOGRAMA "ES." NO LUGAR DO ACQR. Altura fixa, largura livre — é assim
   que qualquer marca de cabeçalho deste site já se comporta, e é o que
   preserva a proporção do traço em qualquer tela. */
.assinatura-nav {
  display: block;
  height: 32px;
  width: auto;
}
.links {
  display: flex;
  gap: 22px;
}
.links a {
  color: var(--color-dim);
  text-decoration: none;
  font-size: calc(13px * var(--acq-esc));
  font-weight: var(--acq-peso-forte);
  transition: color var(--dur-rapido) var(--mov-onda);
}
.links a:hover,
.links a:focus-visible {
  color: var(--color-ink);
}
.links a.acesa {
  color: var(--color-accent-text);
  position: relative;
}
.links a.acesa::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 2px;
  border-radius: var(--curva-pill);
  background: var(--color-accent);
}

.capa {
  min-height: 92svh;
  display: flex;
  align-items: center;
  padding-block: 108px 56px;
  text-align: center;
}
.retratos-capa {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}
.assinatura-capa {
  display: block;
  height: 46px;
  width: auto;
}

/* AS REDES. Mesmos crachás brancos com a marca em preto que os arquivos já
   trazem — sobre o fundo escuro da capa, o próprio branco já é o contraste;
   nada de inverter cor. O gesto no hover é o mesmo de qualquer link da
   marca: sobe 1px, acende a régua de foco. */
.redes {
  margin-top: 18px;
}
.rede {
  display: inline-flex;
  width: 40px;
  height: 40px;
  border-radius: var(--curva-pill);
  overflow: hidden;
  box-shadow: var(--elev-repouso);
  transition: transform var(--dur-rapido) var(--mov-onda), box-shadow var(--dur-rapido) var(--mov-onda);
}
.rede img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.rede:hover,
.rede:focus-visible {
  transform: translateY(-3px);
  box-shadow: var(--elev-flutua);
}
.rede:focus-visible {
  outline: 2px solid var(--color-accent-text);
  outline-offset: 2px;
}
.tit {
  margin: 20px auto 0;
  max-width: 20ch;
  font-weight: 800;
  font-size: calc(clamp(32px, 5vw, 54px) * var(--acq-esc));
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-ink);
}
.lead {
  margin: 24px auto 0;
  max-width: 54ch;
  font-size: calc(clamp(16.5px, 2vw, 20px) * var(--acq-esc));
  line-height: var(--acq-lh);
  font-weight: var(--acq-peso);
  color: var(--color-dim);
}
.acoes {
  margin-top: 40px;
}

/* O CARGO DIGITADO. `width` anda de 0 até `--letras` (em `ch`, a largura do
   caractere "0" — aproximação de monoespaçado boa o bastante pra texto
   curto) em `steps(--letras)`, cada passo revelando mais um caractere; o
   cursor é a régua da direita, piscando à parte em `step-end` pra não virar
   fade (que já é o gesto do `AcqReveal` — aqui o pedido era digitação). */
.papel {
  margin: 14px auto 0;
  min-height: 1.4em;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid var(--color-accent-text);
  width: 0;
  font-size: calc(15.5px * var(--acq-esc));
  font-weight: var(--acq-peso-forte);
  letter-spacing: 0.02em;
  color: var(--color-accent-text);
  animation:
    digitar 1.1s steps(var(--letras), end) 0.4s forwards,
    piscar 0.75s step-end infinite;
}
@keyframes digitar {
  to {
    /* `1ch` É A LARGURA DO "0", uma aproximação de monoespaçado — pra texto
       de verdade, com letras mais largas que "0" (o "m" de "Analyst", por
       exemplo), a soma fica um pouco curta e corta o fim da palavra. A
       folga fixa cobre a diferença sem precisar medir o texto de verdade. */
    width: calc(var(--letras) * 1ch + 8px);
  }
}
@keyframes piscar {
  50% {
    border-color: transparent;
  }
}
@media (prefers-reduced-motion: reduce) {
  .papel {
    width: auto;
    animation: none;
  }
}

.txt {
  color: var(--color-dim);
  font-size: calc(15px * var(--acq-esc));
  line-height: var(--acq-lh);
  max-width: 68ch;
  margin-inline: auto;
}
.txt + .txt {
  margin-top: 14px;
}
.lead-secao {
  margin: 0 auto 34px;
  max-width: 62ch;
  text-align: center;
  color: var(--color-dim);
  font-size: calc(16px * var(--acq-esc));
  line-height: var(--acq-lh);
}

/* ── Experiência ────────────────────────────────────────────────────────── */
.percurso {
  max-width: 640px;
  margin: 0 auto 48px;
}
.cargos {
  max-width: 860px;
  margin-inline: auto;
}
/* O SELO DA INSTITUIÇÃO ENTRA NO LUGAR DO PINO. `AmbienteLiquido` teleporta
   o pino de onda pra dentro de TODO `AcqCard` do site — aqui, nos cartões
   de emprego e nos de formação acadêmica, ele some, porque o cabeçalho já
   carrega o logo de verdade no mesmo canto. */
.cargos :deep(.acq-pin-cartao),
.academicas :deep(.acq-pin-cartao) {
  display: none;
}
.cargo-cabecalho {
  display: flex;
  align-items: center;
  gap: 14px;
}
/* O `RetratoFragmentado` nasceu pra ficar sozinho no alto da capa (por isso
   o `margin: 0 auto` dele) — aqui dentro, como item de uma linha flex ao
   lado do nome, essa margem automática vira o bug clássico de "margin:auto
   engole o espaço livre e centraliza o item": o selo ia pra bem longe do
   nome, com um vão enorme dos dois lados. Zera só neste contexto. */
.cargo-cabecalho :deep(.retrato) {
  margin: 0;
}
/* O SELO NÃO TEM TAMANHO FIXO (`tamanhoSelo` larga na proporção do próprio
   logo — FIAP é bem mais largo que a UniCEUB, que é bem mais larga que os
   selos quase quadrados de empresa). Por isso a legenda não desliza um
   número fixo de px pra alinhar sob o nome — ela mora no MESMO flex column
   que o título, `.cargo-nomes`, e segue a largura que sobrar sozinha. */
.cargo-nomes {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
/* O `.tit` e o `.sub-propria` AQUI SÃO MEUS, NÃO OS DO AcqCard. Conteúdo de
   slot carrega o atributo de escopo de QUEM CHAMA, não do componente — as
   regras `.hd .tit`/`.sub` do AcqCard não alcançam este `<h3>`/`<p>`, então
   o estilo precisa ser replicado aqui. */
.cargo-cabecalho .tit {
  margin: 0;
  font-size: calc(15px * var(--acq-esc));
  font-weight: 500;
  color: var(--color-ink);
}
.sub-propria {
  margin: 0;
  font-size: calc(12.5px * var(--acq-esc));
  font-weight: 400;
  color: var(--color-dim);
}
.academicas {
  max-width: 860px;
  margin: 0 auto 40px;
}
.cert-card {
  max-width: 520px;
  margin-inline: auto;
}
.pdf-topo {
  flex: 0 0 auto;
}

/* O SELETOR DE IDIOMA. Duas letras cada, igual a régua de segmento que
   qualquer troca de duas opções deste site usa (mesmo espírito do
   `AcqChipGroup` da biblioteca, só que pequeno o bastante pra não precisar
   dele). */
.idioma-toggle {
  flex: 0 0 auto;
  display: flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--color-hair);
  border-radius: var(--curva-pill);
  background: var(--color-card);
}
.idioma-toggle button {
  border: 0;
  background: none;
  cursor: pointer;
  padding: 5px 11px;
  border-radius: var(--curva-pill);
  font-family: var(--font-sans);
  font-size: calc(11.5px * var(--acq-esc));
  font-weight: var(--acq-peso-forte);
  letter-spacing: 0.03em;
  color: var(--color-dim);
  transition: background var(--dur-rapido) var(--mov-onda), color var(--dur-rapido) var(--mov-onda);
}
.idioma-toggle button.ativo {
  background: var(--color-accent);
  color: var(--color-canvas);
}
.idioma-toggle button:not(.ativo):hover {
  color: var(--color-ink);
}

/* O BOTÃO DE CLARO/ESCURO. Mesmo círculo de 30px do `.modal-fechar` — um
   ícone só, sem rótulo de texto (o `aria-label` já diz a ação; sol/lua já
   diz o estado). Troca de emoji em vez de classe ativa/inativa porque não
   há "opção errada" aqui, só o estado atual. */
.tema-toggle {
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-hair);
  border-radius: 50%;
  background: var(--color-card);
  color: var(--color-dim);
  cursor: pointer;
  transition: border-color var(--dur-rapido) var(--mov-onda), color var(--dur-rapido) var(--mov-onda), transform var(--dur-rapido) var(--mov-onda);
}
.tema-toggle:hover,
.tema-toggle:focus-visible {
  border-color: var(--color-accent-text);
  color: var(--color-accent-text);
  transform: translateY(-2px);
}

/* O MODAL DO PDF. */
.modal-fundo {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 22px;
  background: color-mix(in srgb, black 70%, transparent);
  backdrop-filter: blur(6px);
}
.modal-caixa {
  width: 100%;
  max-width: 360px;
  background: var(--color-canvas);
  border: 1px solid var(--color-hair);
  border-radius: var(--curva-xl);
  box-shadow: var(--elev-flutua);
  overflow: hidden;
}
.modal-topo {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px 18px 16px 22px;
  border-bottom: 1px solid var(--color-hair);
}
.modal-titulo {
  flex: 1;
  margin: 0;
  font-weight: 700;
  font-size: calc(15px * var(--acq-esc));
  color: var(--color-ink);
  line-height: 1.35;
}
.modal-fechar {
  flex: 0 0 auto;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid var(--color-hair);
  background: var(--color-card);
  color: var(--color-dim);
  font-size: calc(13px * var(--acq-esc));
  line-height: 1;
  cursor: pointer;
  transition: color var(--dur-rapido) var(--mov-onda), border-color var(--dur-rapido) var(--mov-onda);
}
.modal-fechar:hover {
  color: var(--color-ink);
  border-color: var(--color-accent-text);
}
.modal-corpo {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
}
.modal-opcao {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border: 1px solid var(--color-hair);
  border-radius: var(--curva-lg);
  background: var(--color-card);
  color: var(--color-ink);
  text-decoration: none;
  font-weight: 600;
  font-size: calc(14px * var(--acq-esc));
  transition: transform var(--dur-rapido) var(--mov-onda), border-color var(--dur-rapido) var(--mov-onda);
}
.modal-opcao:hover,
.modal-opcao:focus-visible {
  transform: translateY(-2px);
  border-color: var(--color-accent-text);
}
.modal-opcao-bandeira {
  font-size: 20px;
  line-height: 1;
}

/* ── Formação ───────────────────────────────────────────────────────────── */
.txt-card {
  margin: 0;
  color: var(--color-ink);
  font-size: calc(15px * var(--acq-esc));
  line-height: var(--acq-lh);
}
.txt-card.dim {
  margin-top: 8px;
  color: var(--color-dim);
  font-size: calc(13.5px * var(--acq-esc));
}
.idiomas {
  margin-top: 40px;
  text-align: center;
}
.idiomas .grupo-nome {
  display: block;
  margin-bottom: 14px;
}

/* ── Habilidades ────────────────────────────────────────────────────────── */
.habilidades-corpo {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 48px;
  max-width: 1180px;
  margin-inline: auto;
}
.grupos {
  flex: 1 1 auto;
  max-width: 640px;
}
@media (max-width: 1080px) {
  .habilidades-corpo {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .grupos {
    max-width: 640px;
    margin-inline: auto;
  }
}
.grupo-nome {
  display: block;
  margin-bottom: 12px;
}
/* AS PÍLULAS GANHAM UM TOQUE AO PASSAR O MOUSE — pequeno de propósito
   (a régua acende, sobe 1px), porque são inertes por natureza (nada clica,
   nada filtra): o movimento é só o "oi" da marca, não um convite a agir. */
.pills :deep(.tg) {
  transition: transform var(--dur-rapido) var(--mov-onda), border-color var(--dur-rapido) var(--mov-onda);
}
.pills :deep(.tg):hover {
  transform: translateY(-2px);
  border-color: var(--color-accent-text);
}

.pe {
  padding: 52px 22px calc(52px + env(safe-area-inset-bottom));
  text-align: center;
  border-top: 1px solid var(--color-hair);
}
.rodape-txt {
  color: var(--color-dim);
  font-size: calc(12.5px * var(--acq-esc));
}
.assinatura-rodape {
  display: block;
  height: 34px;
  width: auto;
  opacity: 0.9;
}
.contato {
  margin-top: 4px;
}
.contato-link {
  color: var(--color-dim);
  text-decoration: none;
  font-size: calc(12.5px * var(--acq-esc));
  transition: color var(--dur-rapido) var(--mov-onda);
}
a.contato-link:hover,
a.contato-link:focus-visible {
  color: var(--color-accent-text);
}
.contato-local {
  cursor: default;
}
.contato-sep {
  color: var(--color-hair);
  font-size: calc(12.5px * var(--acq-esc));
}

@media (max-width: 940px) {
  .links {
    display: none;
  }
  .topo {
    gap: 14px;
  }
}
</style>
