<script setup lang="ts">
// Logo de The Wall (marca comercial de Construarqwall): la W de líneas finas cruzadas + wordmark.
// Redibujado en SVG desde el logo del cliente (el PNG que llegó es de baja resolución).
import { BRAND_NAME } from '@/config/funnel'

defineProps<{ light?: boolean }>()
</script>

<template>
  <span class="logo" :class="{ 'logo--light': light }" role="img" :aria-label="`${BRAND_NAME} · The Wall Estudio Arquitectónico`">
    <svg class="logo__mark" viewBox="0 0 100 76" aria-hidden="true">
      <path d="M1 1l36 72L73 1M31 1l29 72L99 1" />
    </svg>
    <span class="logo__text" aria-hidden="true">The Wall</span>
  </span>
</template>

<style scoped lang="scss">
.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: $accent-text;

  &__mark {
    width: 30px;
    height: 23px;

    path {
      fill: none;
      stroke: currentColor;
      stroke-width: 3.2;
    }
  }

  &__text {
    font-family: $font-display;
    font-size: 1.3rem;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    line-height: 1;
  }

  &--light {
    color: $accent;
  }
}
</style>
