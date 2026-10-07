<script setup lang="ts">
defineOptions({ name: 'ParkRouteMotion' })

withDefaults(
  defineProps<{
    /** 与 @park/theme 的 parkMotion.routeFade / routeSlide 相同。 */
    name?: 'park-route-fade' | 'park-route-slide'
  }>(),
  {
    name: 'park-route-fade',
  },
)
</script>

<template>
  <div class="park-route-motion">
    <Transition :name="name" mode="out-in">
      <slot />
    </Transition>
  </div>
</template>

<style>
@import '../../../theme/src/motion.css';
</style>
