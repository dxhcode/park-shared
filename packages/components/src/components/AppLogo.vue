<script setup lang="ts">
defineOptions({ name: 'ParkAppLogo' })

withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
  }>(),
  {
    title: '智慧园区',
    subtitle: 'PARK SHARED',
  },
)
</script>

<template>
  <div class="park-logo">
    <span class="park-logo__mark" aria-hidden="true">
      <slot name="mark">
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M24 4 42 14.5v19L24 44 6 33.5v-19L24 4Z"
            stroke="currentColor"
            stroke-width="1.6"
          />
          <path
            d="M24 14 33 19.2v10.6L24 35l-9-5.2V19.2L24 14Z"
            stroke="currentColor"
            stroke-width="1.6"
          />
          <circle cx="24" cy="24" r="2.4" fill="currentColor" />
          <path d="M24 6.5v7.2M24 34.2V41.5M7.6 15.2l6.2 3.6M34.2 29.2l6.2 3.6M40.4 15.2l-6.2 3.6M13.8 29.2 7.6 32.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
        </svg>
      </slot>
    </span>
    <span class="park-logo__text">
      <strong>{{ title }}</strong>
      <em>{{ subtitle }}</em>
    </span>
  </div>
</template>

<style scoped>
.park-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: inherit;
}

.park-logo__mark {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: none;
  color: var(--park-color-highlight, #c6a15b);
  filter: drop-shadow(0 0 8px var(--park-color-glow, transparent));
}

.park-logo__mark :deep(svg) {
  width: 36px;
  height: 36px;
}

.park-logo__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.15;
}

.park-logo__text strong {
  font-family: var(--park-font-display, inherit);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.park-logo__text em {
  margin-top: 3px;
  font-style: normal;
  font-size: 10px;
  letter-spacing: 0.22em;
  color: var(--park-color-highlight, #c6a15b);
}
</style>
