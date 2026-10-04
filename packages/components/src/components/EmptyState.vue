<script setup lang="ts">
import { Button } from 'ant-design-vue'
import type { EmptyTone, EmptyVariant } from '../types'

defineOptions({ name: 'ParkEmptyState' })

withDefaults(
  defineProps<{
    title?: string
    description?: string
    variant?: EmptyVariant
    tone?: EmptyTone
    primaryText?: string
    secondaryText?: string
  }>(),
  {
    title: '暂无数据',
    description: '当前条件下没有可展示的记录。',
    variant: 'empty',
    tone: 'auto',
    primaryText: '',
    secondaryText: '',
  },
)

const emit = defineEmits<{
  primary: []
  secondary: []
}>()
</script>

<template>
  <div
    class="park-empty"
    :data-variant="variant"
    :data-park-theme="tone === 'auto' ? undefined : tone"
    role="status"
  >
    <div class="park-empty__mark" aria-hidden="true">
      <slot name="icon">
        <svg class="park-empty__glyph" viewBox="0 0 64 64" fill="none">
          <template v-if="variant === 'search'">
            <circle cx="28" cy="28" r="12" stroke="currentColor" stroke-width="1.6" />
            <path d="M37 37l10 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            <path d="M23 28h10M28 23v10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </template>
          <template v-else-if="variant === 'error'">
            <path
              d="M32 12l18 32H14L32 12z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
            <path d="M32 26v10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            <circle cx="32" cy="40.5" r="1.2" fill="currentColor" />
          </template>
          <template v-else-if="variant === 'locked'">
            <rect x="18" y="28" width="28" height="20" rx="3" stroke="currentColor" stroke-width="1.6" />
            <path
              d="M24 28v-6a8 8 0 0 1 16 0v6"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
            <circle cx="32" cy="38" r="1.6" fill="currentColor" />
          </template>
          <template v-else-if="variant === 'done'">
            <circle cx="32" cy="32" r="16" stroke="currentColor" stroke-width="1.6" />
            <path
              d="M23 33l6 6 12-13"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </template>
          <template v-else>
            <circle cx="32" cy="32" r="18" stroke="currentColor" stroke-width="1.4" stroke-dasharray="3 3" />
            <circle cx="32" cy="32" r="10" stroke="currentColor" stroke-width="1.4" />
            <circle cx="32" cy="32" r="2.2" fill="currentColor" />
            <path
              d="M32 8v6M32 50v6M8 32h6M50 32h6"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
            />
          </template>
        </svg>
      </slot>
    </div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <div v-if="secondaryText || primaryText || $slots.secondary || $slots.primary || $slots.action" class="park-empty__actions">
      <slot name="secondary">
        <Button v-if="secondaryText" @click="emit('secondary')">{{ secondaryText }}</Button>
      </slot>
      <slot name="primary">
        <Button v-if="primaryText" type="primary" @click="emit('primary')">{{ primaryText }}</Button>
      </slot>
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
  padding: 32px 20px;
  border-radius: var(--park-radius-lg, 16px);
  border: 1px dashed var(--park-color-border, rgba(14, 19, 32, 0.18));
  background: var(--park-color-surface, #ffffff);
  box-shadow: var(--park-shadow, 0 10px 28px rgba(14, 19, 32, 0.05));
}

.park-empty__mark {
  display: grid;
  place-items: center;
  width: 84px;
  height: 84px;
  margin-bottom: 4px;
  border-radius: 50%;
  background: var(--park-ink, #0e1320);
  color: var(--park-header-text, #f4f7ff);
  box-shadow:
    0 0 0 4px color-mix(in srgb, var(--park-accent-line, #c6a15b) 55%, transparent),
    0 12px 24px rgba(14, 19, 32, 0.16);
}

.park-empty__glyph {
  width: 56px;
  height: 56px;
}

.park-empty h3 {
  margin: 4px 0 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--park-color-text, #1a1d26);
}

.park-empty p {
  margin: 0;
  max-width: 380px;
  font-size: 13px;
  line-height: 1.65;
  color: var(--park-color-text-secondary, #5c6578);
}

.park-empty__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

[data-park-theme='screen'] .park-empty,
.park-empty[data-park-theme='screen'] {
  border-style: solid;
  border-color: var(--park-glass-border, rgba(94, 234, 255, 0.38));
  background: var(--park-glass-bg, linear-gradient(155deg, rgba(20, 40, 82, 0.72), rgba(6, 12, 28, 0.62)));
  box-shadow:
    var(--park-shadow, 0 0 0 1px rgba(56, 189, 248, 0.16)),
    var(--park-glow, 0 0 24px rgba(34, 211, 238, 0.28));
  backdrop-filter: blur(var(--park-glass-blur, 18px));
}

[data-park-theme='screen'] .park-empty__mark,
.park-empty[data-park-theme='screen'] .park-empty__mark {
  background: radial-gradient(circle at 40% 32%, rgba(34, 211, 238, 0.35), rgba(8, 14, 32, 0.92) 64%);
  color: #67e8f9;
  box-shadow:
    0 0 0 1px rgba(94, 234, 255, 0.5),
    0 0 22px rgba(34, 211, 238, 0.38);
}

[data-park-theme='screen'] .park-empty :deep(.ant-btn-primary),
.park-empty[data-park-theme='screen'] :deep(.ant-btn-primary) {
  box-shadow: 0 0 16px rgba(34, 211, 238, 0.35);
}
</style>
