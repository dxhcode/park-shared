<script setup lang="ts">
import { ref } from 'vue'
import { ConfigProvider, Segmented } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { adminAntdTheme } from '@park/theme'
import AuthDemo from './AuthDemo.vue'
import GalleryDemo from './GalleryDemo.vue'

const view = ref<'auth' | 'gallery'>('auth')
const viewOptions = [
  { label: '登录与布局', value: 'auth' },
  { label: '组件对照', value: 'gallery' },
]
</script>

<template>
  <ConfigProvider :locale="zhCN" :theme="adminAntdTheme">
    <div class="app-root" :data-view="view">
      <div class="app-switch">
        <div class="app-switch__chip">
          <Segmented v-model:value="view" :options="viewOptions" />
        </div>
      </div>
      <AuthDemo v-if="view === 'auth'" />
      <GalleryDemo v-else />
    </div>
  </ConfigProvider>
</template>
