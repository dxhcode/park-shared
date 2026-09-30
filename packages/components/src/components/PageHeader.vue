<script setup lang="ts">
defineOptions({ name: 'ParkPageHeader' })

defineProps<{
  title: string
  subtitle?: string
  eyebrow?: string
}>()
</script>

<template>
  <header class="park-page-header">
    <div class="park-page-header__main">
      <p v-if="eyebrow" class="park-page-header__eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p v-if="subtitle" class="park-page-header__subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.extra" class="park-page-header__extra">
      <slot name="extra" />
    </div>
  </header>
</template>

<style scoped>
.park-page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 4px 0 16px;
  border-bottom: 1px solid var(--park-color-border, rgba(14, 19, 32, 0.12));
}

.park-page-header__main {
  min-width: 0;
  padding-left: 14px;
  border-left: 3px solid var(--park-color-highlight, #c6a15b);
}

.park-page-header__eyebrow {
  margin: 0 0 6px;
  font-family: var(--park-font-display, inherit);
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--park-color-primary, #1d39c4);
}

.park-page-header h1 {
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 700;
  color: var(--park-color-text, #1a1d26);
}

.park-page-header__subtitle {
  margin: 8px 0 0;
  max-width: 640px;
  color: var(--park-color-text-secondary, #5c6578);
  font-size: 14px;
  line-height: 1.6;
}

.park-page-header__extra {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}
</style>
