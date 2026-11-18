<script setup lang="ts">
// Landing (/). Todo el texto sale de LANDING en src/content/copy.ts.
// Cada botón que abre el registro lleva data-cta="registro" (lo usa el e2e).
// Dirección: arquitectura sobria de The Wall. Recursos propios sacados del logo: la W de líneas
// finas cruzadas (se dibuja en el hero y marca los pasos), los arcos del fondo del logo y el
// cajetín de presupuesto (el "primero presupuestamos" del VSL hecho objeto).
import { onBeforeUnmount, onMounted, ref, type Directive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandLogo from '@/components/BrandLogo.vue'
import CountdownTimer from '@/components/CountdownTimer.vue'
import RegistrationModal from '@/components/RegistrationModal.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import { BRAND_NAME, IS_LOCAL, PERSON_NAME, STORAGE_PREFIX, VSL_POSTER, VSL_POSTER_FALLBACK } from '@/config/funnel'
import { LANDING } from '@/content/copy'
import { captureFbParams } from '@/utils/fbclid'

const route = useRoute()
const router = useRouter()
const modalOpen = ref(false)
const showSticky = ref(false)

// Portada del video: Cloudinary → archivo local → recuadro oscuro
const poster = ref(VSL_POSTER || VSL_POSTER_FALLBACK)
function onPosterError() {
  poster.value = poster.value !== VSL_POSTER_FALLBACK ? VSL_POSTER_FALLBACK : ''
}

function openModal() {
  // Quien no calificó hace menos de 24 h vuelve a /sin-espacio
  if (!IS_LOCAL) {
    const disqAt = Number(localStorage.getItem(`${STORAGE_PREFIX}_disq_at`))
    if (disqAt && Date.now() - disqAt < 24 * 60 * 60 * 1000) {
      router.push('/sin-espacio')
      return
    }
  }
  modalOpen.value = true
}

// Aparición al entrar en pantalla (una sola vez)
const io =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-in')
              io?.unobserve(e.target)
            }
          }),
        { rootMargin: '0px 0px -10% 0px' },
      )
    : null
const vReveal: Directive<HTMLElement> = {
  mounted(el) {
    if (!io) return
    el.classList.add('reveal')
    io.observe(el)
  },
}

const onScroll = () => (showSticky.value = window.scrollY > 700)

onMounted(() => {
  captureFbParams()
  window.addEventListener('scroll', onScroll, { passive: true })
  // /?editar=1 (desde "Corregir mis datos") reabre el registro con lo guardado
  if (route.query.editar) modalOpen.value = true
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  io?.disconnect()
})

const pad = (n: number) => String(n).padStart(2, '0')
// Arcos del fondo del logo (centro abajo a la derecha)
const arcs = [140, 220, 300, 380, 460, 540]
</script>

<template>
  <div class="landing">
    <header class="topbar">
      <div class="wrap topbar__inner">
        <BrandLogo />
        <CountdownTimer />
      </div>
    </header>

    <!-- HERO: titular + portada del video -->
    <section class="hero" aria-labelledby="hero-title">
      <svg class="hero__arcs" viewBox="0 0 600 600" aria-hidden="true" preserveAspectRatio="xMaxYMax slice">
        <circle v-for="r in arcs" :key="r" cx="600" cy="600" :r="r" />
      </svg>

      <div class="wrap hero__inner">
        <div class="hero__copy">
          <h1 id="hero-title" class="hero__title">
            <span class="hero__line">{{ LANDING.headline }}</span>
            <span class="hero__accent">{{ LANDING.headlineAccent }}</span>
          </h1>
          <p class="hero__sub">{{ LANDING.sub }}</p>
          <div class="hero__cta">
            <button type="button" class="btn btn--lg" data-cta="registro" @click="openModal">
              <i class="fa-solid fa-play" aria-hidden="true"></i> {{ LANDING.cta }}
            </button>
            <p class="hero__note">{{ LANDING.ctaNote }}</p>
          </div>
        </div>

        <div class="hero__media">
          <button type="button" class="poster" data-cta="registro" :aria-label="LANDING.cta" @click="openModal">
            <img
              v-if="poster"
              class="poster__img"
              :src="poster"
              alt=""
              width="836"
              height="1025"
              fetchpriority="high"
              decoding="async"
              @error="onPosterError"
            />
            <span class="poster__play">
              <span class="poster__icon" aria-hidden="true"><i class="fa-solid fa-play"></i></span>
              <span class="poster__label">
                <strong>{{ LANDING.videoLabel }}</strong>
                <span>{{ LANDING.videoCaption }}</span>
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- BANDA: el orden en que trabajamos + obras reales -->
    <section class="order" aria-labelledby="order-title">
      <!-- La W del logo, grande: se dibuja al entrar en pantalla -->
      <svg v-reveal class="order__w" viewBox="0 0 100 76" aria-hidden="true">
        <path pathLength="1" d="M1 1l36 72L73 1" />
        <path pathLength="1" d="M31 1l29 72L99 1" />
      </svg>
      <div class="wrap order__inner">
        <h2 id="order-title" class="order__words">
          <template v-for="(w, i) in LANDING.order" :key="w">
            <span class="order__word"><span class="order__n" aria-hidden="true">{{ i + 1 }}</span>{{ w }}</span>
            <span v-if="i < LANDING.order.length - 1" class="order__sep" aria-hidden="true"></span>
          </template>
        </h2>

        <ul class="works" role="list">
          <li v-for="w in LANDING.works" :key="w.label" v-reveal class="works__item">
            <figure>
              <div class="works__frame">
                <img :src="w.photo" :alt="`${w.label}: obra de ${BRAND_NAME}`" :width="w.w" :height="w.h" loading="lazy" decoding="async" />
              </div>
              <figcaption>{{ w.label }}</figcaption>
            </figure>
          </li>
        </ul>
      </div>
    </section>

    <!-- PROCESO: los 4 pasos en fila + cajetín de costos -->
    <section class="method" aria-labelledby="steps-title">
      <div class="wrap">
        <h2 id="steps-title" v-reveal class="display method__title">{{ LANDING.steps.title }}</h2>

        <ol class="steps" role="list">
          <li v-for="(s, i) in LANDING.steps.items" :key="s.title" v-reveal class="step">
            <span class="step__num" aria-hidden="true">{{ pad(i + 1) }}</span>
            <h3 class="step__title"><span class="sr-only">Paso {{ i + 1 }}: </span>{{ s.title }}</h3>
            <p class="step__text">{{ s.text }}</p>
          </li>
        </ol>

        <div v-reveal class="ledger">
          <h3 class="ledger__title">{{ LANDING.budget.title }}</h3>
          <dl class="ledger__rows">
            <div v-for="r in LANDING.budget.rows" :key="r.label" class="ledger__row">
              <dt>{{ r.label }}</dt>
              <dd>{{ r.value }}</dd>
            </div>
          </dl>
          <p class="ledger__note">{{ LANDING.budget.note }}</p>
        </div>
      </div>
    </section>

    <!-- FRASE: banda greige -->
    <section class="quote" aria-label="La idea detrás de cómo trabajamos">
      <blockquote v-reveal class="wrap quote__inner">
        <p>{{ LANDING.quote }}</p>
        <footer>{{ PERSON_NAME }}, arquitecta</footer>
      </blockquote>
    </section>

    <!-- DAYANARA: foto + presentación corta -->
    <section class="about" aria-labelledby="about-title">
      <div class="wrap about__inner">
        <figure v-reveal class="about__figure">
          <img :src="LANDING.about.photo" :alt="`Área social diseñada por ${BRAND_NAME}`" width="900" height="1124" loading="lazy" decoding="async" />
        </figure>
        <div v-reveal class="about__copy">
          <h2 id="about-title" class="about__title">{{ LANDING.about.title }}</h2>
          <p class="about__text">{{ LANDING.about.text }}</p>
        </div>
      </div>
    </section>

    <!-- ¿ES PARA TI?: oscuro, sí / no en dos columnas + zona + CTA -->
    <section class="fit" aria-labelledby="fit-title">
      <div class="wrap">
        <h2 id="fit-title" v-reveal class="display fit__title">{{ LANDING.fit.title }}</h2>

        <div class="fit__cols">
          <div v-reveal class="fit__col">
            <h3>{{ LANDING.fit.yesTitle }}</h3>
            <ul role="list">
              <li v-for="t in LANDING.fit.yes" :key="t"><i class="fa-solid fa-check" aria-hidden="true"></i>{{ t }}</li>
            </ul>
          </div>
          <div v-reveal class="fit__col fit__col--no">
            <h3>{{ LANDING.fit.noTitle }}</h3>
            <ul role="list">
              <li v-for="t in LANDING.fit.no" :key="t"><i class="fa-solid fa-xmark" aria-hidden="true"></i>{{ t }}</li>
            </ul>
          </div>
        </div>

        <div v-reveal class="fit__close">
          <p class="fit__minimum">{{ LANDING.fit.minimum }}</p>
          <p class="fit__zones">{{ LANDING.fit.zones }}</p>
          <button type="button" class="btn btn--lg btn--light" data-cta="registro" @click="openModal">
            <i class="fa-solid fa-play" aria-hidden="true"></i> {{ LANDING.cta }}
          </button>
        </div>
      </div>
    </section>

    <SiteFooter :disclaimer="LANDING.disclaimer" />

    <!-- CTA fijo -->
    <Transition name="sticky">
      <div v-if="showSticky && !modalOpen" class="sticky" role="region" aria-label="Ver el video">
        <div class="sticky__copy">
          <strong>{{ LANDING.sticky.title }}</strong>
          <span>{{ LANDING.sticky.sub }}</span>
        </div>
        <button type="button" class="btn" data-cta="registro" @click="openModal">
          {{ LANDING.sticky.cta }} <i class="fa-solid fa-play" aria-hidden="true"></i>
        </button>
      </div>
    </Transition>

    <RegistrationModal :open="modalOpen" @close="modalOpen = false" />
  </div>
</template>

<style scoped lang="scss">
// ── Movimiento ────────────────────────────────────────────────────────────────
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 700ms $ease-out,
    transform 700ms $ease-out;

  &.is-in {
    opacity: 1;
    transform: none;
  }
}

// Entrada del hero: una sola vez al cargar, escalonada
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}
.display {
  font-family: $font-display;
  font-size: clamp(2.1rem, 4.6vw, 3.4rem);
  font-weight: 400;
  line-height: 1.02;
  letter-spacing: 0;
  text-transform: uppercase;
}

// ── Encabezado ────────────────────────────────────────────────────────────────
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid rgba($line, 0.8);
  background: rgba($surface, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 64px;
  }
}

// ── Hero ──────────────────────────────────────────────────────────────────────
.hero {
  position: relative;
  overflow: hidden;
  padding: 40px 0 64px;

  &__arcs {
    position: absolute;
    right: 0;
    bottom: 0;
    width: min(70vw, 820px);
    height: 100%;
    pointer-events: none;

    circle {
      fill: none;
      stroke: $accent;
      stroke-width: 1;
      opacity: 0.35;
    }
  }

  &__inner {
    position: relative;
    display: grid;
    gap: 40px;
    align-items: center;

    @media (min-width: 900px) {
      grid-template-columns: 1.15fr 0.85fr;
      gap: 64px;
      min-height: calc(100svh - 64px - 104px);
    }
  }

  &__copy > * {
    animation: rise 800ms $ease-out both;
  }
  &__sub {
    animation-delay: 80ms !important;
  }
  &__cta {
    animation-delay: 160ms !important;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2.35rem, 5.4vw, 4.4rem);
    font-weight: 300;
    line-height: 0.98;
    letter-spacing: -0.005em;
    text-transform: uppercase;
  }
  &__line {
    display: block;
    color: $accent-text;
  }
  &__accent {
    display: block;
    font-weight: 500;
    color: $ink;
  }

  &__sub {
    max-width: 52ch;
    margin-top: 24px;
    color: $ink-muted;
    font-size: 1.1rem;
    text-wrap: pretty;
  }

  &__cta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-top: 32px;
  }
  &__note {
    color: $ink-muted;
    font-size: 0.875rem;
  }

  &__media {
    position: relative;
    justify-self: center;
    width: min(100%, 420px);
    padding: 0 0 28px 28px;
    animation: rise 900ms 120ms $ease-out both;
  }
}

.poster {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 416 / 510;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: $radius-md;
  background: $surface-dark;
  cursor: pointer;
  transition: transform 160ms $ease-out;

  &:active {
    transform: scale(0.985);
  }

  &__img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 900ms $ease-out;
  }

  &__play {
    position: absolute;
    right: 12px;
    bottom: 12px;
    left: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px 10px 10px;
    border-radius: $radius-md;
    background: rgba($surface-dark, 0.78);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: $ink-on-dark;
    text-align: left;
  }

  &__icon {
    display: grid;
    flex: none;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: $ink-on-dark;
    color: $ink;
    font-size: 0.9rem;
    transition: transform 200ms $ease-out;

    i {
      margin-left: 2px;
    }
  }

  &__label {
    display: flex;
    flex-direction: column;
    line-height: 1.3;

    strong {
      font-family: $font-display;
      font-size: 1.15rem;
      font-weight: 500;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }
    span {
      color: $ink-on-dark-muted;
      font-size: 0.85rem;
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover .poster__img {
      transform: scale(1.03);
    }
    &:hover .poster__icon {
      transform: scale(1.08);
    }
  }
}

// ── Banda: el orden ───────────────────────────────────────────────────────────
.order {
  position: relative;
  overflow: hidden;
  padding: 72px 0 80px;
  background: $surface-dark;
  color: $ink-on-dark;

  &__words {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px 22px;
    font-family: $font-display;
    font-size: clamp(1.7rem, 3.6vw, 2.7rem);
    font-weight: 300;
    line-height: 1.05;
    letter-spacing: 0.01em;
    text-transform: uppercase;
  }

  &__inner {
    position: relative;
  }

  &__w {
    position: absolute;
    top: 40px;
    right: max(24px, calc((100vw - #{$content-width}) / 2));
    width: min(28vw, 330px);
    overflow: visible;

    @media (max-width: 759px) {
      display: none;
    }

    path {
      fill: none;
      stroke: $accent;
      stroke-width: 0.22;
      opacity: 0.5;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      transition: stroke-dashoffset 1800ms $ease-in-out;
    }
    path + path {
      transition-delay: 250ms;
    }
    &.is-in path {
      stroke-dashoffset: 0;
    }
    // Sin observador (navegadores viejos) la W queda dibujada
    &:not(.reveal) path {
      stroke-dashoffset: 0;
    }
    &.reveal {
      opacity: 1;
      transform: none;
    }
  }

  &__word {
    display: inline-flex;
    align-items: baseline;
    gap: 10px;
  }

  &__n {
    color: $accent;
    font-size: 0.55em;
    font-weight: 400;
  }

  // Trazo diagonal de la W como separador
  &__sep {
    width: 1px;
    height: 1.1em;

    @media (max-width: 759px) {
      display: none;
    }

    background: $accent;
    transform: skewX(-26deg);
  }
}

.works {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 48px 0 0;
  padding: 0;
  list-style: none;

  @media (min-width: 760px) {
    gap: 24px;
  }

  figure {
    margin: 0;
  }

  &__frame {
    overflow: hidden;
    border-radius: $radius-sm;
    aspect-ratio: 3 / 2;

    @media (max-width: 759px) {
      aspect-ratio: 1;
    }
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  figcaption {
    margin-top: 10px;
    color: $ink-on-dark-muted;
    font-family: $font-display;
    font-size: 1rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  // Las fotos se revelan de abajo hacia arriba (clip-path) en vez de solo aparecer
  &__item.reveal {
    transform: none;

    .works__frame {
      clip-path: inset(100% 0 0 0);
      transition: clip-path 1000ms $ease-in-out;
    }
    &:nth-child(even) .works__frame {
      transition-delay: 90ms;
    }
    &.is-in .works__frame {
      clip-path: inset(0 0 0 0);
    }
  }
}

// ── Proceso ───────────────────────────────────────────────────────────────────
.method {
  padding: 96px 0;

  &__title {
    max-width: 24ch;
  }
}

.steps {
  display: grid;
  gap: 0;
  margin: 48px 0 0;
  padding: 0;
  list-style: none;

  @media (min-width: 760px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
}

.step {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 2px 16px;
  padding: 20px 0;
  border-top: 1px solid $line;

  @media (min-width: 760px) {
    display: block;
    padding: 24px 0 0;
    border-top: 1px solid $ink;
  }

  &__num {
    grid-row: span 2;
    display: block;
    font-family: $font-display;
    font-size: 2.6rem;
    font-weight: 300;
    line-height: 0.9;
    color: $accent-large;
    font-variant-numeric: lining-nums;

    @media (min-width: 760px) {
      margin-bottom: 20px;
      font-size: 3.4rem;
    }
  }

  &__title {
    font-family: $font-display;
    font-size: 1.5rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  &__text {
    margin-top: 4px;
    color: $ink-muted;
    text-wrap: pretty;
  }
}

// Cajetín de presupuesto: como el rótulo de un plano, en una fila
.ledger {
  margin-top: 56px;
  border: 1px solid $ink;
  background: $raised;

  &__title {
    padding: 10px 16px;
    border-bottom: 1px solid $ink;
    font-family: $font-display;
    font-size: 1.05rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  &__rows {
    display: grid;
    margin: 0;

    @media (min-width: 760px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 16px;
    border-bottom: 1px solid $line;

    @media (min-width: 760px) {
      flex-direction: column;
      gap: 4px;
      padding: 18px 20px;
      border-bottom: 0;

      & + & {
        border-left: 1px solid $line;
      }
    }

    dt {
      color: $ink-muted;
      font-size: 0.95rem;
    }
    dd {
      flex: none;
      margin: 0;
      font-family: $font-display;
      font-size: 1.6rem;
      font-weight: 500;
      line-height: 1.1;
      font-variant-numeric: tabular-nums;
    }
  }

  &__note {
    padding: 14px 16px;
    border-top: 1px solid $line;
    color: $ink;
    font-size: 0.95rem;
    text-wrap: pretty;

    @media (min-width: 760px) {
      padding: 14px 20px;
    }
  }
}

// ── Frase (banda greige) ──────────────────────────────────────────────────────
.quote {
  padding: 88px 0;
  background: $primary-soft;

  &__inner {
    margin: 0 auto;

    p {
      max-width: 26ch;
      font-family: $font-display;
      font-size: clamp(2.1rem, 5vw, 3.8rem);
      font-weight: 300;
      line-height: 1.02;
      text-transform: uppercase;
      text-wrap: balance;
    }
    p::before {
      content: '“';
      color: $accent-large;
    }
    p::after {
      content: '”';
      color: $accent-large;
    }

    footer {
      margin-top: 20px;
      color: $accent-text;
      font-family: $font-display;
      font-size: 1.05rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
  }
}

// ── Dayanara ──────────────────────────────────────────────────────────────────
.about {
  padding: 96px 0;
  background: $raised;

  &__inner {
    display: grid;
    gap: 32px;
    align-items: center;

    @media (min-width: 900px) {
      grid-template-columns: 0.8fr 1.2fr;
      gap: 72px;
    }
  }

  &__figure {
    margin: 0;

    img {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 4 / 5;
      object-fit: cover;
      border-radius: $radius-sm;
    }
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(1.9rem, 3.4vw, 2.6rem);
    font-weight: 400;
    line-height: 1.06;
    text-wrap: balance;
  }

  &__text {
    max-width: 44ch;
    margin-top: 16px;
    color: $ink-muted;
    font-size: 1.1rem;
    text-wrap: pretty;
  }
}

// ── ¿Es para ti? (oscuro, cierre) ─────────────────────────────────────────────
.fit {
  padding: 96px 0 112px;
  background: $surface-dark;
  color: $ink-on-dark;

  &__cols {
    display: grid;
    gap: 40px;
    margin-top: 48px;

    @media (min-width: 760px) {
      grid-template-columns: 1fr 1fr;
      gap: 64px;
    }
  }

  &__col {
    padding-top: 20px;
    border-top: 1px solid $accent;

    h3 {
      font-family: $font-display;
      font-size: 1.4rem;
      font-weight: 500;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    ul {
      display: grid;
      gap: 12px;
      margin: 16px 0 0;
      padding: 0;
      list-style: none;
    }
    li {
      display: grid;
      grid-template-columns: 22px 1fr;
      gap: 10px;
      font-size: 1.05rem;
      text-wrap: pretty;
    }
    i {
      margin-top: 6px;
      color: $accent;
      font-size: 0.9rem;
    }
  }
  &__col--no {
    border-top-color: rgba($accent, 0.4);

    li {
      color: $ink-on-dark-muted;
    }
    i {
      color: $ink-on-dark-muted;
    }
  }

  &__close {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-top: 64px;
  }
  &__minimum {
    font-family: $font-display;
    font-size: clamp(1.6rem, 3vw, 2.1rem);
    font-weight: 400;
    text-transform: uppercase;
  }
  &__zones {
    max-width: 62ch;
    margin-bottom: 24px;
    color: $ink-on-dark-muted;
    text-wrap: pretty;
  }
}

// Botón claro para fondos oscuros
.btn--light {
  background: $ink-on-dark;
  color: $ink;

  &:hover:not(:disabled) {
    background: #ffffff;
  }
}

// ── CTA fijo ──────────────────────────────────────────────────────────────────
.sticky {
  position: fixed;
  right: 12px;
  bottom: calc(12px + env(safe-area-inset-bottom));
  left: 12px;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 10px 10px 16px;
  border: 1px solid $line;
  border-radius: $radius-md;
  background: $raised;
  box-shadow: $shadow-modal;

  &__copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
    font-size: 0.8rem;
    color: $ink-muted;

    strong {
      overflow: hidden;
      color: $ink;
      font-size: 0.9rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .btn {
    flex: none;
  }

  @media (min-width: 900px) {
    right: auto;
    left: 50%;
    width: 560px;
    transform: translateX(-50%);
  }
}

.sticky-enter-active {
  transition:
    opacity 300ms $ease-out,
    translate 300ms $ease-out;
}
.sticky-leave-active {
  transition:
    opacity 180ms ease,
    translate 180ms ease;
}
.sticky-enter-from,
.sticky-leave-to {
  opacity: 0;
  translate: 0 16px;
}

// ── Movimiento reducido: sin desplazamientos, solo opacidad ───────────────────
@media (prefers-reduced-motion: reduce) {
  .reveal {
    transform: none;
    transition: opacity 400ms ease;
  }
  .hero__copy > *,
  .hero__media {
    animation: none;
  }
  .order__w path {
    stroke-dashoffset: 0;
    transition: none;
  }
  .works__item.reveal .works__frame {
    clip-path: none;
    transition: none;
  }
  .sticky-enter-from,
  .sticky-leave-to {
    translate: none;
  }
}
</style>
