# 园区项目文档

四个公开仓库组成一套园区前端原型：共享库，加上运营、产业、政府三个平台。每个平台是 pnpm monorepo，内有管理端 `admin-app` 和大屏 `screen-app`。界面使用 Vue 3、TypeScript、Vite 和 ant-design-vue。业务数据写在浏览器本地或仓库内的样例模块里。

三个平台用 GitHub Pages 从 `dist` 分支发布静态站点。共享库没有管理端或大屏应用，本地用 `playground` 对照主题和组件。

本目录集中存放说明。campus、industry、gov 的原文仍留在各自仓库，下面按仓库保存副本。本仓库根目录的 `README.md`、`DEMO.md`、`GAPS.md` 也保留；根目录 README 另外指向本页。另外三篇通用说明按收集时的代码整理。

## 仓库与演示

| 仓库 | 职责 | 源码 | 演示 |
| --- | --- | --- | --- |
| park-shared | 主题、组件、模拟数据、本地预览 | https://github.com/dxhcode/park-shared | 无 Pages 站点，本地执行 `pnpm dev` |
| park-campus | 园区运营：管理控制台、态势大屏 | https://github.com/dxhcode/park-campus | https://dxhcode.github.io/park-campus/ |
| park-industry | 产业运营：运营中台、产业驾驶舱 | https://github.com/dxhcode/park-industry | https://dxhcode.github.io/park-industry/ |
| park-gov | 政府管理：管理端、监管态势大屏 | https://github.com/dxhcode/park-gov | https://dxhcode.github.io/park-gov/ |

各平台站点下还有管理端和大屏：

| 平台 | 管理端 | 大屏 |
| --- | --- | --- |
| 运营 park-campus | https://dxhcode.github.io/park-campus/admin/ | https://dxhcode.github.io/park-campus/screen/ |
| 产业 park-industry | https://dxhcode.github.io/park-industry/admin/ | https://dxhcode.github.io/park-industry/screen/ |
| 政府 park-gov | https://dxhcode.github.io/park-gov/admin/ | https://dxhcode.github.io/park-gov/screen/ |

Pages 要能打开，对应仓库的 Settings → Pages 需选择 **Deploy from a branch**，Branch 为 `dist`，目录 `/ (root)`。构建和推送见 [Pages 发布流程](./Pages发布.md)。

## 演示账号

四个仓库的账号各自独立。同名人物在不同平台的用户名和密码并不相同。口令写在源码里，只供原型演示。

### park-shared

`playground` 与 `@park/mock` 使用下表。会话写入 `localStorage` 键 `park-auth-session`。来源：[`packages/mock/src/auth.ts`](../packages/mock/src/auth.ts)。

| 用户名 | 密码 | 角色 | 显示名 |
| --- | --- | --- | --- |
| `admin` | `admin123` | 园区管理员 | 陈启明 |
| `operator` | `operator123` | 园区运营 | 林知夏 |

### park-campus

会话键 `park-campus-session`。`loginWithDemo` 只要求账号非空，不核对密码；下表三个账号会带上姓名和职务，其他非空账号以「临时访客」进入。来源：`packages/shared/src/auth.ts`（[park-campus](https://github.com/dxhcode/park-campus/blob/main/packages/shared/src/auth.ts)）。

| 用户名 | 名片上的密码 | 姓名 | 职务 |
| --- | --- | --- | --- |
| `admin` | `park2026` | 林知夏 | 园区管理员 |
| `wuye` | `park2026` | 周启明 | 物业主管 |
| `caiwu` | `park2026` | 陈予安 | 收费专员 |

态势大屏默认可直接浏览。右上角「演示解锁」使用同一套账号。

### park-industry

会话键 `park-industry.session`。登录会核对用户名和密码。来源：`apps/admin-app/src/auth/accounts.ts`（[park-industry](https://github.com/dxhcode/park-industry/blob/main/apps/admin-app/src/auth/accounts.ts)）。

| 用户名 | 密码 | 姓名 | 角色 | 默认园区 |
| --- | --- | --- | --- | --- |
| `chenqm` | `demo123` | 陈启明 | 园区管理员 | 滨江云栖科创园 |
| `zhoulan` | `demo123` | 周岚 | 招商经理 | 临港智造产业园 |
| `liucheng` | `demo123` | 刘澄 | 签约专员 | 光谷生命科学园 |

### park-gov

会话键 `park-gov.session`。来源：`apps/admin-app/src/auth/accounts.ts`（[park-gov](https://github.com/dxhcode/park-gov/blob/main/apps/admin-app/src/auth/accounts.ts)）。

| 用户名 | 密码 | 姓名 | 单位与岗位 |
| --- | --- | --- | --- |
| `chenqm` | `Park@2026` | 陈启明 | 园区管理委员会 · 值班席 |
| `zhoulan` | `Park@2026` | 周岚 | 经济发展局 · 企业监管专员 |
| `liucheng` | `Park@2026` | 刘澄 | 规划建设局 · 空间监管专员 |

态势大屏不登录也能看。

## 通用说明

- [架构与目录结构](./架构与目录.md)
- [本地开发与构建](./本地开发与构建.md)
- [Pages 发布流程](./Pages发布.md)

## 各仓库原文

下列文件是各仓库对应提交中根目录 Markdown 的副本。`doc/shared/` 与提交 `a67d968` 的三份文档一致；本分支根目录 README 在此基础上增加了指向本页的链接。收集时的 `main` 提交：

| 目录 | 仓库 | 提交 |
| --- | --- | --- |
| [shared](./shared/README.md) | [dxhcode/park-shared](https://github.com/dxhcode/park-shared) | [`a67d968`](https://github.com/dxhcode/park-shared/commit/a67d968c5533332c136f6bddc502063816feb76f) |
| [campus](./campus/README.md) | [dxhcode/park-campus](https://github.com/dxhcode/park-campus) | [`c7a8892`](https://github.com/dxhcode/park-campus/commit/c7a889256d443690ac996ddc80a477be3216c490) |
| [industry](./industry/README.md) | [dxhcode/park-industry](https://github.com/dxhcode/park-industry) | [`dca533c`](https://github.com/dxhcode/park-industry/commit/dca533c7e88ae955914026770651ab126402a0f3) |
| [gov](./gov/README.md) | [dxhcode/park-gov](https://github.com/dxhcode/park-gov) | [`b21b237`](https://github.com/dxhcode/park-gov/commit/b21b237f1e85faec000f1ee9c8f8de36bdf634c6) |

四个仓库的 `main` 上，Markdown 只有各仓库根目录的 `README.md`、`DEMO.md`、`GAPS.md`。

### park-shared

- [README.md](./shared/README.md)：包说明、主题、组件、模拟数据、兄弟仓库引用方式
- [DEMO.md](./shared/DEMO.md)：演示路线与画面拼法
- [GAPS.md](./shared/GAPS.md)：阶段一缺口

### park-campus

- [README.md](./campus/README.md)：本地运行、登录、台账、大屏与 Pages
- [DEMO.md](./campus/DEMO.md)：现场讲解顺序
- [GAPS.md](./campus/GAPS.md)：阶段一缺口

### park-industry

- [README.md](./industry/README.md)：本地开发、登录、菜单、构建与发布
- [DEMO.md](./industry/DEMO.md)：演示脚本
- [GAPS.md](./industry/GAPS.md)：第一期缺口

### park-gov

- [README.md](./gov/README.md)：目录、登录、台账、大屏与 Pages
- [DEMO.md](./gov/DEMO.md)：演示脚本
- [GAPS.md](./gov/GAPS.md)：第一期缺口
