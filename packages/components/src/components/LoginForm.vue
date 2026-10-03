<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Alert, Button, Checkbox, Form, FormItem, Input, InputPassword } from 'ant-design-vue'
import type { LoginPayload } from '../types'

defineOptions({ name: 'ParkLoginForm' })

const props = withDefaults(
  defineProps<{
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

const formState = reactive({
  username: props.initialUsername,
  password: props.initialPassword,
  remember: props.initialRemember,
})

watch(
  () => [props.initialUsername, props.initialPassword, props.initialRemember] as const,
  ([username, password, remember]) => {
    formState.username = username
    formState.password = password
    formState.remember = remember
  },
)

const rules = {
  username: [{ required: true, whitespace: true, message: '请输入账号' }],
  password: [{ required: true, message: '请输入密码' }],
}

function onFinish(): void {
  emit('submit', {
    username: formState.username.trim(),
    password: formState.password,
    remember: formState.remember,
  })
}
</script>

<template>
  <Form
    class="park-login-form"
    layout="vertical"
    :model="formState"
    :rules="rules"
    :disabled="loading"
    name="park-login"
    @finish="onFinish"
  >
    <header class="park-login-form__intro">
      <p>PARK ACCESS</p>
      <h2>{{ title }}</h2>
      <span>{{ subtitle }}</span>
    </header>

    <Alert
      v-if="errorMessage"
      class="park-login-form__alert"
      type="error"
      show-icon
      :message="errorMessage"
    />

    <FormItem label="账号" name="username">
      <Input
        v-model:value="formState.username"
        size="large"
        placeholder="请输入账号"
        autocomplete="username"
        allow-clear
      >
        <template #prefix>
          <svg class="park-login-form__icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="3.2" stroke="currentColor" stroke-width="1.6" fill="none" />
            <path d="M5.5 19.2c1.2-3 3.4-4.4 6.5-4.4s5.3 1.4 6.5 4.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none" />
          </svg>
        </template>
      </Input>
    </FormItem>

    <FormItem label="密码" name="password">
      <InputPassword
        v-model:value="formState.password"
        size="large"
        placeholder="请输入密码"
        autocomplete="current-password"
      >
        <template #prefix>
          <svg class="park-login-form__icon" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="10.5" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.6" fill="none" />
            <path d="M8.2 10.5V8.2a3.8 3.8 0 0 1 7.6 0v2.3" stroke="currentColor" stroke-width="1.6" fill="none" />
          </svg>
        </template>
      </InputPassword>
    </FormItem>

    <FormItem name="remember" value-prop-name="checked" class="park-login-form__remember">
      <Checkbox v-model:checked="formState.remember">记住账号</Checkbox>
    </FormItem>

    <Button
      class="park-login-form__submit"
      type="primary"
      html-type="submit"
      size="large"
      block
      :loading="loading"
    >
      {{ submitText }}
    </Button>

    <div v-if="$slots.hint" class="park-login-form__hint">
      <slot name="hint" />
    </div>
  </Form>
</template>

<style scoped>
.park-login-form__intro p {
  margin: 0 0 6px;
  font-family: var(--park-font-display, inherit);
  font-size: 11px;
  letter-spacing: 0.22em;
  color: var(--park-color-highlight, #c6a15b);
}

.park-login-form__intro h2 {
  margin: 0;
  font-size: 26px;
  line-height: 1.2;
  color: var(--park-color-text, #1a1d26);
}

.park-login-form__intro span {
  display: block;
  margin-top: 8px;
  color: var(--park-color-text-secondary, #5c6578);
  font-size: 13px;
  line-height: 1.5;
}

.park-login-form__alert {
  margin-top: 16px;
}

.park-login-form :deep(.ant-form-item) {
  margin-bottom: 14px;
}

.park-login-form :deep(.ant-form-item-label > label) {
  color: var(--park-color-text, #1a1d26);
  font-size: 13px;
}

.park-login-form__icon {
  width: 16px;
  height: 16px;
  color: var(--park-color-text-secondary, #5c6578);
}

.park-login-form__remember {
  margin-bottom: 8px;
}

.park-login-form__submit {
  height: 44px;
  margin-top: 6px;
  font-weight: 600;
  letter-spacing: 0.12em;
}

.park-login-form__hint {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--park-color-border, rgba(14, 19, 32, 0.12));
}
</style>
