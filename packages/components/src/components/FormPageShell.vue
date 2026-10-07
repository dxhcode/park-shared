<script setup lang="ts">
import { Button } from 'ant-design-vue'
import PageHeader from './PageHeader.vue'

defineOptions({ name: 'ParkFormPageShell' })

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    eyebrow?: string
    submitting?: boolean
    submitText?: string
    cancelText?: string
    sticky?: boolean
  }>(),
  {
    submitting: false,
    submitText: '保存',
    cancelText: '取消',
    sticky: true,
  },
)

const emit = defineEmits<{
  submit: []
  cancel: []
}>()
</script>

<template>
  <section class="park-form-shell">
    <PageHeader :title="title" :subtitle="subtitle" :eyebrow="eyebrow">
      <template v-if="$slots.extra" #extra>
        <slot name="extra" />
      </template>
    </PageHeader>
    <div class="park-form-shell__body">
      <slot />
    </div>
    <footer class="park-form-shell__actions" :class="{ 'is-sticky': sticky }">
      <slot name="actions">
        <Button :disabled="submitting" @click="emit('cancel')">{{ cancelText }}</Button>
        <Button type="primary" :loading="submitting" @click="emit('submit')">{{ submitText }}</Button>
      </slot>
    </footer>
  </section>
</template>

<style scoped>
.park-form-shell {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.park-form-shell__body {
  padding: 4px 2px 0;
}

.park-form-shell__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-radius: var(--park-radius, 10px);
  background: color-mix(in srgb, var(--park-color-surface, #ffffff) 92%, transparent);
  border: 1px solid var(--park-color-border, rgba(14, 19, 32, 0.12));
}

.park-form-shell__actions.is-sticky {
  position: sticky;
  bottom: 0;
  z-index: 5;
  border-top: 2px solid var(--park-color-accent, #0e1320);
  box-shadow: 0 -10px 28px rgba(14, 19, 32, 0.06);
  backdrop-filter: blur(12px);
}

[data-park-theme='screen'] .park-form-shell__actions {
  background: var(--park-glass-bg);
  border-color: var(--park-glass-border);
  box-shadow: var(--park-glow);
  backdrop-filter: blur(var(--park-glass-blur));
}

[data-park-theme='screen'] .park-form-shell__actions.is-sticky {
  border-top-color: var(--park-color-primary, #22d3ee);
}
</style>
