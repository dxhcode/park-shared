<script setup lang="ts">
import { ref } from 'vue'
import { ConfigProvider, Segmented } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { adminAntdTheme } from '@park/theme'
import AuthDemo from './AuthDemo.vue'
import GalleryDemo from './GalleryDemo.vue'
import ShellDemo from './ShellDemo.vue'

const view = ref<'auth' | 'gallery' | 'shells'>('auth')
const viewOptions = [
  { label: '登录与布局', value: 'auth' },
  { label: '组件对照', value: 'gallery' },
  { label: '页面壳', value: 'shells' },
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
      <GalleryDemo v-else-if="view === 'gallery'" />
      <ShellDemo v-else />
    </div>
  </ConfigProvider>
</template>
