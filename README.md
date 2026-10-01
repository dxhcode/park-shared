# park-shared

园区平台的共享前端库。`park-industry`、`park-campus`、`park-gov` 从这里拿主题、组件、登录壳、布局壳和模拟数据。各端自己的菜单、页面和真实接口仍留在各自仓库。

## 包

| 包 | 内容 |
| --- | --- |
| `@park/theme` | 管理端 / 大屏 CSS 变量，以及 ant-design-vue 4 的 `ThemeConfig` |
| `@park/components` | 页头与指标，加上 `LoginForm` / `LoginPage`、`AdminLayout`、`ScreenLayout` |
| `@park/mock` | 园区、企业、楼宇样例，分页与搜索，以及演示账号和本地会话 |

`playground` 是本地对照预览，不是平台应用。默认先走登录，进入布局壳后再退出；「组件对照」仍保留管理端与大屏并排。

## 本地命令

需要 Node.js 20+ 与 pnpm 10。

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm smoke
pnpm dev
```

`pnpm dev` 打开预览页。组件用 Vite library 模式打成 ESM；主题和模拟数据用 `tsc` 产出声明文件。

## 主题

两套令牌都在 `packages/theme/src/theme.css`：

- **admin**：浅色内容区，靛蓝主色，顶栏和强调色用墨色，细金线做点缀。选择器是 `:root` 和 `[data-park-theme="admin"]`。
- **screen**：深海军蓝底、青蓝辉光、玻璃拟态和发光描边。选择器是 `[data-park-theme="screen"]`，也可以加类名 `park-screen-bg`。

组件读的是 `--park-color-*`、`--park-glass-*`、`--park-glow`、`--park-sider-bg`、`--park-header-bg` 这些 CSS 变量，不绑定某一端。

管理端入口示例：

```ts
import { createApp } from 'vue'
import { ConfigProvider } from 'ant-design-vue'
import { adminAntdTheme, applyParkTheme } from '@park/theme'
import '@park/theme/theme.css'
import '@park/components/style.css'

applyParkTheme('admin')

// 模板里：
// <ConfigProvider :theme="adminAntdTheme">...</ConfigProvider>
```

大屏把 `applyParkTheme('admin')` 换成 `applyParkTheme('screen')`，`adminAntdTheme` 换成 `screenAntdTheme`。侧栏底色用 CSS 变量 `--park-sider-bg`，不要只依赖 Ant Design 的组件令牌。当前锁定的 ant-design-vue 4.2 还没有 `cssVar` 主题字段，跨端换肤以这份 CSS 变量为准。

## 组件

```ts
import {
  AdminLayout,
  AppLogo,
  EmptyState,
  GlassCard,
  KpiStat,
  LoginForm,
  LoginPage,
  PageHeader,
  ScreenLayout,
} from '@park/components'
import type { LoginPayload } from '@park/components'
```

记得同时引入 `@park/components/style.css`。默认文案是中文，例如空态「暂无数据」、登录按钮「进入工作台」。`@park/components` 把 `vue` 和 `ant-design-vue` 视为 peer。

| 组件 | 说明 |
| --- | --- |
| `AppLogo` | 标识和名称。`title` / `subtitle`，可用 `mark` 插槽换图标 |
| `PageHeader` | 页头。必填 `title`，可选 `eyebrow`、`subtitle` 和 `extra` 插槽 |
| `GlassCard` | 玻璃卡片。`title`、`glow`，正文默认插槽，右侧 `extra` |
| `EmptyState` | 空态。`title`、`description` 和 `action` 插槽 |
| `KpiStat` | 指标。`label`、`value`、`unit`、`trend`（百分比）、`hint` |
| `LoginForm` | 账号、密码、记住账号。校验通过后抛出 `submit` |
| `LoginPage` | 深色入口加玻璃卡片，内部放着 `LoginForm` |
| `AdminLayout` | 管理端壳：侧栏、顶栏、内容插槽。底色走主题变量 |
| `ScreenLayout` | 大屏壳：顶栏和内容插槽，自带 `data-park-theme="screen"` |

### 登录壳

`LoginPage` 自己铺深色背景和金、靛光斑，卡片区域固定为管理端浅色玻璃，方便在深底上填写。`submit` 的载荷是 `LoginPayload`：`username`、`password`、`remember`。

```vue
<LoginPage
  brand="滨江云栖科创园"
  :loading="loading"
  :error-message="errorMessage"
  :initial-username="remembered"
  @submit="onSubmit"
>
  <template #hint>演示账号见 @park/mock 的 demoCredentials</template>
</LoginPage>
```

`hint` 插槽放在按钮下方。`points` 插槽可换掉左侧三条说明。组件不内置口令，也不发请求。

### 布局壳

`AdminLayout` 不带菜单。侧栏用 `sider` 插槽，顶栏左侧用 `header`，右侧用 `extra`，页面放默认插槽。`v-model:collapsed` 控制收起。侧栏背景是 `--park-sider-bg`，顶栏是 `--park-header-bg`。

```vue
<AdminLayout v-model:collapsed="collapsed" title="滨江云栖科创园" subtitle="ADMIN">
  <template #sider>导航由各端自己放入</template>
  <template #extra>
    <span>{{ user?.displayName }}</span>
    <button type="button" @click="onLogout">退出登录</button>
  </template>
  <PageHeader title="工作台" />
</AdminLayout>
```

`ScreenLayout` 适合大屏仓库套一层顶栏。`fill` 默认铺满视口；嵌进别的布局时设 `:fill="false"`。

## 模拟数据与登录会话

```ts
import {
  buildings,
  demoCredentials,
  enterprises,
  getCurrentUser,
  getParkOverview,
  getRememberedUsername,
  isAuthenticated,
  login,
  logout,
  mockQuery,
  parks,
  queryBuildings,
  queryEnterprises,
} from '@park/mock'

const page = queryEnterprises({ parkId: 'park-binjiang', status: '在园', page: 1, pageSize: 10 })
const overview = getParkOverview('park-binjiang')
const pending = mockQuery(page)

const session = await login('admin', 'admin123', { remember: true })
if (isAuthenticated()) {
  console.log(getCurrentUser()?.roleLabel)
}
logout()
```

内置三个园区：滨江云栖科创园、临港智造产业园、光谷生命科学园，以及对应企业和楼宇。统一社会信用代码和电话都是虚构的。`mockQuery` 只是加一点延迟，方便先接异步界面。

演示账号同样是虚构的，口令写在源码里，只给原型用：

| 用户名 | 密码 | 角色 | 显示名 |
| --- | --- | --- | --- |
| `admin` | `admin123` | 园区管理员 | 陈启明 |
| `operator` | `operator123` | 园区运营 | 林知夏 |

`login(username, password, options)` 只接受这两对。成功后把会话 JSON 写入 `localStorage` 键 `park-auth-session`（约 12 小时），里面有 `token`、`user`、`remember`、`issuedAt`、`expiresAt`。令牌形如 `park-demo.admin.…`，不是真实签名。`getCurrentUser`、`getSession`、`isAuthenticated` 会读这份会话；过期或损坏会清掉。`logout` 只删会话。

勾选记住账号时，用户名另外写到 `park-auth-remember`，可用 `getRememberedUsername()` 取回。退出登录不会清掉它。不勾选则会删掉这个键。没有 `localStorage` 时（例如部分 Node 脚本）退回进程内内存，接口不变。失败抛 `AuthMockError`，文案是「请输入账号和密码」或「账号或密码不正确」。

最小接法：

```ts
import { ref } from 'vue'
import type { LoginPayload } from '@park/components'
import { getCurrentUser, getRememberedUsername, isAuthenticated, login, logout } from '@park/mock'

const authed = ref(isAuthenticated())
const user = ref(getCurrentUser())
const remembered = getRememberedUsername() ?? ''

async function onSubmit(payload: LoginPayload) {
  const session = await login(payload.username, payload.password, { remember: payload.remember })
  user.value = session.user
  authed.value = true
}

function onLogout() {
  logout()
  authed.value = false
  user.value = null
}
```

## 兄弟仓库怎么引用

先把本仓库和平台仓库放在同级目录，并在本仓库执行 `pnpm install && pnpm build`，让 `dist` 存在。

### 本地路径

在 `park-industry`（campus、gov 相同）的 `package.json`：

```json
{
  "dependencies": {
    "@park/theme": "file:../park-shared/packages/theme",
    "@park/components": "file:../park-shared/packages/components",
    "@park/mock": "file:../park-shared/packages/mock",
    "ant-design-vue": "^4.2.6",
    "vue": "^3.5.0"
  }
}
```

`@park/theme` 与 `@park/components` 都把 `ant-design-vue` 视为 peer，`@park/components` 同时把 `vue` 视为 peer，由平台仓库自己安装。

### Git 子目录

pnpm 9 及以上可以用 `path:` 只装一个包。`&` 在 shell 里要加引号：

```bash
pnpm add "@park/theme@github:dxhcode/park-shared#main&path:/packages/theme"
pnpm add "@park/components@github:dxhcode/park-shared#main&path:/packages/components"
pnpm add "@park/mock@github:dxhcode/park-shared#main&path:/packages/mock"
```

也可以写进依赖：

```json
{
  "dependencies": {
    "@park/theme": "github:dxhcode/park-shared#main&path:/packages/theme",
    "@park/components": "github:dxhcode/park-shared#main&path:/packages/components",
    "@park/mock": "github:dxhcode/park-shared#main&path:/packages/mock"
  }
}
```

每个包的 `prepare` 会在安装时编译。包内的 `tsconfig` 不引用仓库根目录，所以子目录安装可以单独构建。组件包编译依赖 `esbuild`，消费方若使用 pnpm 10，需要允许 `esbuild` 的安装脚本。本地联调阶段优先用上面的 `file:` 路径。

## 不在这个仓库里

各端菜单和页面、真实鉴权接口、后端。这里的登录只是可复用的界面和本地演示会话。
