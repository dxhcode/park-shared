<script setup lang="ts">
defineOptions({ name: 'ParkDetailSection' })

defineProps<{
  title: string
  hint?: string
}>()
</script>

<template>
  <section class="park-detail-section">
    <header class="park-detail-section__header">
      <div>
        <h2>{{ title }}</h2>
        <p v-if="hint">{{ hint }}</p>
      </div>
      <div v-if="$slots.extra" class="park-detail-section__extra">
        <slot name="extra" />
      </div>
    </header>
    <div class="park-detail-section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.park-detail-section {
  border-radius: var(--park-radius-lg, 16px);
  background: var(--park-color-surface, #ffffff);
  border: 1px solid var(--park-color-border, rgba(14, 19, 32, 0.12));
  box-shadow: 0 10px 28px rgba(14, 19, 32, 0.05);
}

.park-detail-section__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px 0;
}

.park-detail-section__header h2 {
  margin: 0;
  font-size: 15px;
  letter-spacing: 0.04em;
  color: var(--park-color-text, #1a1d26);
}

.park-detail-section__header p {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--park-color-text-secondary, #5c6578);
}

.park-detail-section__extra {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.park-detail-section__body {
  padding: 12px 18px 18px;
}

[data-park-theme='screen'] .park-detail-section {
  background: var(--park-glass-bg);
  border-color: var(--park-glass-border);
  box-shadow: var(--park-shadow), var(--park-glow);
  backdrop-filter: blur(var(--park-glass-blur));
}
</style>
