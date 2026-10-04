<script setup lang="ts">
defineOptions({ name: 'ParkGlassCard' })

withDefaults(
  defineProps<{
    title?: string
    glow?: boolean
  }>(),
  {
    glow: true,
  },
)
</script>

<template>
  <section class="park-glass" :class="{ 'is-glow': glow }">
    <span class="park-glass__corner park-glass__corner--tl" aria-hidden="true" />
    <span class="park-glass__corner park-glass__corner--tr" aria-hidden="true" />
    <span class="park-glass__corner park-glass__corner--bl" aria-hidden="true" />
    <span class="park-glass__corner park-glass__corner--br" aria-hidden="true" />
    <header v-if="title || $slots.extra" class="park-glass__header">
      <h2 v-if="title">{{ title }}</h2>
      <div v-if="$slots.extra" class="park-glass__extra">
        <slot name="extra" />
      </div>
    </header>
    <div class="park-glass__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.park-glass {
  position: relative;
  border-radius: var(--park-radius-lg, 16px);
  background: var(--park-glass-bg, #fff);
  border: 1px solid var(--park-glass-border, rgba(14, 19, 32, 0.08));
  box-shadow: var(--park-shadow, 0 14px 40px rgba(14, 19, 32, 0.08));
  backdrop-filter: blur(var(--park-glass-blur, 14px));
  overflow: hidden;
}

.park-glass.is-glow {
  box-shadow:
    var(--park-shadow, 0 14px 40px rgba(14, 19, 32, 0.08)),
    var(--park-glow, none);
}

.park-glass__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px 0;
}

.park-glass__header h2 {
  margin: 0;
  font-size: 15px;
  letter-spacing: 0.06em;
  color: var(--park-color-text, #1a1d26);
}

.park-glass__extra {
  color: var(--park-color-text-secondary, #5c6578);
  font-size: 12px;
}

.park-glass__body {
  padding: 16px 18px 18px;
}

.park-glass__corner {
  position: absolute;
  width: 12px;
  height: 12px;
  pointer-events: none;
  border: 1.5px solid var(--park-color-primary, #1d39c4);
  opacity: 0.85;
}

.park-glass__corner--tl {
  top: 8px;
  left: 8px;
  border-right: 0;
  border-bottom: 0;
}

.park-glass__corner--tr {
  top: 8px;
  right: 8px;
  border-left: 0;
  border-bottom: 0;
}

.park-glass__corner--bl {
  bottom: 8px;
  left: 8px;
  border-right: 0;
  border-top: 0;
}

.park-glass__corner--br {
  right: 8px;
  bottom: 8px;
  border-left: 0;
  border-top: 0;
}
</style>

<style>
@import '../../../theme/src/surface.css';
</style>
