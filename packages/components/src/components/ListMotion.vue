<script setup lang="ts">
defineOptions({ name: 'ParkListMotion' })

withDefaults(
  defineProps<{
    tag?: string
  }>(),
  {
    tag: 'div',
  },
)
</script>

<template>
  <TransitionGroup name="park-list" :tag="tag" appear>
    <slot />
  </TransitionGroup>
</template>
