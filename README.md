# park-shared

园区平台的共享前端库。`park-industry`、`park-campus`、`park-gov` 只从这里拿主题、少量组件和模拟主数据。登录、菜单、接口和各端页面留在各自仓库。

## 包

| 包 | 内容 |
| --- | --- |
| `@park/theme` | 管理端 / 大屏 CSS 变量，以及 ant-design-vue 4 的 `ThemeConfig` |
| `@park/components` | `PageHeader`、`GlassCard`、`EmptyState`、`KpiStat`、`AppLogo` |
| `@park/mock` | 园区、企业、楼宇样例，以及分页、搜索、按园过滤 |

`playground` 是本地对照预览，不是平台应用。

## 本地命令

需要 Node.js 20+ 与 pnpm 10。

```bash
pnpm install
pnpm build
pnpm smoke
pnpm dev
```

`pnpm dev` 打开预览页：左侧管理端，右侧大屏。组件用 Vite library 模式打成 ESM；主题和模拟数据用 `tsc` 产出声明文件。

## 主题

两套令牌都在 `packages/theme/src/theme.css`：

- **admin**：浅色内容区，靛蓝主色，顶栏和强调色用墨色，细金线做点缀。选择器是 `:root` 和 `[data-park-theme="admin"]`。
- **screen**：深海军蓝底、青蓝辉光、玻璃拟态和发光描边。选择器是 `[data-park-theme="screen"]`，也可以加类名 `park-screen-bg`。

组件读的是 `--park-color-*`、`--park-glass-*`、`--park-glow` 这些 CSS 变量，不绑定某一端。

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
import { AppLogo, EmptyState, GlassCard, KpiStat, PageHeader } from '@park/components'
```

记得同时引入 `@park/components/style.css`。默认文案是中文，例如空态「暂无数据」、标识「智慧园区」。

| 组件 | 说明 |
| --- | --- |
| `AppLogo` | 标识和名称。`title` / `subtitle`，可用 `mark` 插槽换图标 |
| `PageHeader` | 页头。必填 `title`，可选 `eyebrow`、`subtitle` 和 `extra` 插槽 |
| `GlassCard` | 玻璃卡片。`title`、`glow`，正文默认插槽，右侧 `extra` |
| `EmptyState` | 空态。`title`、`description` 和 `action` 插槽 |
| `KpiStat` | 指标。`label`、`value`、`unit`、`trend`（百分比）、`hint` |

## 模拟数据

```ts
import {
  buildings,
  enterprises,
  getParkOverview,
  mockQuery,
  parks,
  queryBuildings,
  queryEnterprises,
} from '@park/mock'

const page = queryEnterprises({ parkId: 'park-binjiang', status: '在园', page: 1, pageSize: 10 })
const overview = getParkOverview('park-binjiang')
const pending = mockQuery(page)
```

内置三个园区：滨江云栖科创园、临港智造产业园、光谷生命科学园，以及对应企业和楼宇。统一社会信用代码和电话都是虚构的。`mockQuery` 只是加一点延迟，方便先接异步界面。

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

`@park/theme` 把 `ant-design-vue` 视为 peer，`@park/components` 把 `vue` 视为 peer，由平台仓库自己安装。

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

登录、权限、真实接口、后端，以及三个平台的完整菜单和页面。
