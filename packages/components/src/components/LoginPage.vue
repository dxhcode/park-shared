<script setup lang="ts">
import AppLogo from './AppLogo.vue'
import GlassCard from './GlassCard.vue'
import LoginForm from './LoginForm.vue'
import type { LoginPayload } from '../types'

defineOptions({ name: 'ParkLoginPage' })

withDefaults(
  defineProps<{
    brand?: string
    brandSubtitle?: string
    headline?: string
    description?: string
    loading?: boolean
    errorMessage?: string
    initialUsername?: string
    initialPassword?: string
    initialRemember?: boolean
    title?: string
    subtitle?: string
    submitText?: string
  }>(),
  {
    brand: '智慧园区',
    brandSubtitle: 'SHARED',
    headline: '进入园区工作台',
    description: '深色入口配玻璃卡片。账号校验交给调用方，本壳不连接后端。',
    loading: false,
    errorMessage: '',
    initialUsername: '',
    initialPassword: '',
    initialRemember: false,
    title: '账号登录',
    subtitle: '演示环境，口令只用于原型。',
    submitText: '进入工作台',
  },
)

const emit = defineEmits<{
  submit: [payload: LoginPayload]
}>()
</script>

<template>
  <div class="park-login">
    <div class="park-login__bg" aria-hidden="true">
      <span class="park-login__orb park-login__orb--indigo" />
      <span class="park-login__orb park-login__orb--gold" />
      <span class="park-login__grid" />
    </div>
    <div class="park-login__layout">
      <section class="park-login__hero">
        <AppLogo :title="brand" :subtitle="brandSubtitle" />
        <p class="park-login__kicker">演示入口</p>
        <h1>{{ headline }}</h1>
        <p class="park-login__lead">{{ description }}</p>
        <ul class="park-login__points">
          <slot name="points">
            <li>管理员与运营两套演示身份</li>
            <li>会话写入本地，刷新后仍在</li>
            <li>记住账号只留下用户名</li>
          </slot>
        </ul>
      </section>
      <div class="park-login__stage">
        <div class="park-login__card-wrap" data-park-theme="admin">
          <GlassCard class="park-login__card" :glow="true">
            <LoginForm
              :loading="loading"
              :error-message="errorMessage"
              :initial-username="initialUsername"
              :initial-password="initialPassword"
              :initial-remember="initialRemember"
              :title="title"
              :subtitle="subtitle"
              :submit-text="submitText"
              @submit="emit('submit', $event)"
            >
              <template v-if="$slots.hint" #hint>
                <slot name="hint" />
              </template>
            </LoginForm>
          </GlassCard>
        </div>
        <p class="park-login__foot">不会连接真实后端</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.park-login {
  position: relative;
  isolation: isolate;
  min-height: var(--park-layout-min-height, 100vh);
  overflow: hidden;
  color: #f4f7ff;
  background:
    radial-gradient(ellipse at 12% 0%, rgba(29, 57, 196, 0.45), transparent 46%),
    radial-gradient(ellipse at 88% 10%, rgba(198, 161, 91, 0.28), transparent 42%),
    linear-gradient(165deg, #070b16 0%, #10182c 48%, #070b14 100%);
}

.park-login__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.park-login__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(244, 247, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(244, 247, 255, 0.05) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse at center, #000 30%, transparent 78%);
}

.park-login__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(8px);
}

.park-login__orb--indigo {
  top: -80px;
  left: -40px;
  width: 340px;
  height: 340px;
  background: radial-gradient(circle, rgba(47, 84, 235, 0.55), transparent 68%);
}

.park-login__orb--gold {
  right: -60px;
  bottom: -100px;
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, rgba(198, 161, 91, 0.38), transparent 70%);
}

.park-login__layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 440px);
  gap: 48px;
  align-items: center;
  width: min(1120px, calc(100% - 48px));
  min-height: inherit;
  margin: 0 auto;
  padding: 48px 0;
}

.park-login__hero :deep(.park-logo__text strong) {
  color: #f4f7ff;
  font-size: 18px;
}

.park-login__kicker {
  margin: 28px 0 10px;
  font-family: var(--park-font-display, inherit);
  font-size: 12px;
  letter-spacing: 0.28em;
  color: #c6a15b;
}

.park-login__hero h1 {
  margin: 0;
  max-width: 520px;
  font-size: 48px;
  line-height: 1.15;
  letter-spacing: 0.04em;
}

.park-login__lead {
  max-width: 460px;
  margin: 16px 0 0;
  color: rgba(244, 247, 255, 0.72);
  font-size: 15px;
  line-height: 1.7;
}

.park-login__points {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
}

.park-login__points :deep(li) {
  position: relative;
  padding-left: 18px;
  color: rgba(244, 247, 255, 0.84);
  font-size: 14px;
}

.park-login__points :deep(li)::before {
  content: '';
  position: absolute;
  top: 0.55em;
  left: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #c6a15b;
  box-shadow: 0 0 10px rgba(198, 161, 91, 0.8);
}

.park-login__stage {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.park-login__card-wrap {
  background: transparent !important;
  background-image: none !important;
  color: var(--park-color-text, #1a1d26);
}

.park-login__card {
  box-shadow:
    0 28px 80px rgba(0, 0, 0, 0.42),
    0 0 0 1px rgba(198, 161, 91, 0.38);
}

.park-login__foot {
  margin: 14px 0 0;
  text-align: center;
  color: rgba(244, 247, 255, 0.55);
  font-size: 12px;
  letter-spacing: 0.12em;
}

@media (max-width: 860px) {
  .park-login__layout {
    grid-template-columns: 1fr;
    gap: 28px;
    width: min(480px, calc(100% - 32px));
    padding: 28px 0 36px;
  }

  .park-login__hero h1 {
    font-size: 34px;
  }

  .park-login__points {
    display: none;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .park-login__orb--indigo,
  .park-login__orb--gold {
    animation: park-login-float 9s ease-in-out infinite;
  }

  .park-login__orb--gold {
    animation-delay: -3s;
  }
}

@keyframes park-login-float {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 16px, 0);
  }
}
</style>
