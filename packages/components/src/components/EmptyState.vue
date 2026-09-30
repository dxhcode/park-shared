<script setup lang="ts">
defineOptions({ name: 'ParkEmptyState' })

withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: '暂无数据',
    description: '当前条件下没有可展示的园区记录。',
  },
)
</script>

<template>
  <div class="park-empty" role="status">
    <div class="park-empty__mark" aria-hidden="true">
      <svg viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="28" stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 4" />
        <circle cx="40" cy="40" r="16" stroke="currentColor" stroke-width="1.4" />
        <circle cx="40" cy="40" r="3" fill="currentColor" />
        <path d="M40 8v8M40 64v8M8 40h8M64 40h8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
      </svg>
    </div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <div v-if="$slots.action" class="park-empty__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.park-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 28px 16px;
  border-radius: var(--park-radius-lg, 16px);
  border: 1px dashed var(--park-color-border, rgba(14, 19, 32, 0.16));
  background: color-mix(in srgb, var(--park-color-surface, #fff) 72%, transparent);
}

.park-empty__mark {
  width: 72px;
  height: 72px;
  color: var(--park-color-primary, #1d39c4);
  filter: drop-shadow(0 0 10px var(--park-color-glow, transparent));
}

.park-empty__mark svg {
  width: 100%;
  height: 100%;
}

.park-empty h3 {
  margin: 4px 0 0;
  font-size: 16px;
  color: var(--park-color-text, #1a1d26);
}

.park-empty p {
  margin: 0;
  max-width: 360px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--park-color-text-secondary, #5c6578);
}

.park-empty__action {
  margin-top: 8px;
}
</style>
