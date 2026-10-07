# Pages 发布流程

[返回总目录](./README.md)

三个平台的 GitHub Pages 站点从 `dist` 分支发布。该分支根目录是构建后的静态文件，不放源码。仓库设置需要人工选择一次：

1. 打开仓库 Settings → Pages。
2. Build and deployment 选择 **Deploy from a branch**。
3. Branch 选择 `dist`，文件夹选择 **/ (root)**，保存。

脚本只生成产物或推送 `dist` 分支，不调用 GitHub 的 Pages 设置接口。campus 的 README 写明：自动化令牌调用该接口会返回 403。下表的设置页需要登录且对该仓库有管理员权限才能打开。

保存后的站点：

| 仓库 | 入口 | 管理端 | 大屏 | Pages 设置页 |
| --- | --- | --- | --- | --- |
| park-campus | https://dxhcode.github.io/park-campus/ | https://dxhcode.github.io/park-campus/admin/ | https://dxhcode.github.io/park-campus/screen/ | https://github.com/dxhcode/park-campus/settings/pages |
| park-industry | https://dxhcode.github.io/park-industry/ | https://dxhcode.github.io/park-industry/admin/ | https://dxhcode.github.io/park-industry/screen/ | https://github.com/dxhcode/park-industry/settings/pages |
| park-gov | https://dxhcode.github.io/park-gov/ | https://dxhcode.github.io/park-gov/admin/ | https://dxhcode.github.io/park-gov/screen/ | https://github.com/dxhcode/park-gov/settings/pages |

应用内路由的 Vite `base` 已经写成上表的 `/仓库名/admin/` 与 `/仓库名/screen/`。源码分支改名或 Pages 未指向 `dist` 根目录时，静态资源和深链会对不上。首次保存后短时间 404，是 GitHub 还在做第一次部署。

park-shared 没有管理端或大屏，根 `package.json` 也没有 `pages:build`。缺口说明写明共享库没有 GitHub Pages 发布脚本，见 [GAPS.md](./shared/GAPS.md)。

## 产物长什么样

三个平台的 `pnpm pages:build` 都会清空仓库根目录的 `dist/`，先构建两个应用，再把它们的 `dist` 拷进汇总目录：

```text
dist/index.html     入口页，链到管理端和大屏
dist/admin/         管理端 Vite 产物
dist/screen/        大屏 Vite 产物
dist/404.html       深链刷新时回到对应单页应用
dist/.nojekyll      空文件
```

`.gitignore` 忽略了 `dist`，这份目录留在本地，真正上线的是推到 `dist` 分支上的同一批文件。三个脚本的汇总方式有差别，下面按仓库写。

## park-campus

脚本：[scripts/pages-build.mjs](https://github.com/dxhcode/park-campus/blob/main/scripts/pages-build.mjs)。根 `package.json` 只有 `pages:build`，没有 `pages:publish`。

```bash
pnpm pages:build
```

脚本依次执行：

1. 删除仓库根 `dist/` 后重建。
2. `pnpm --filter @park/admin-app build`。
3. `pnpm --filter @park/screen-app build`。
4. 把 `apps/admin-app/dist` 拷到 `dist/admin/`，把 `apps/screen-app/dist` 拷到 `dist/screen/`。
5. 把 `pages/index.html`、`pages/404.html` 拷到 `dist/` 根。
6. 写入空的 `dist/.nojekyll`。

`pages/404.html` 在路径匹配 `/park-campus/(admin|screen)` 时，把完整路径记入 `sessionStorage` 键 `park-campus-gh-path`，再跳到对应应用入口。匹配不到则回到 `/park-campus/`。

这个仓库的脚本到生成 `dist/` 为止。把该目录推上 `dist` 分支、以及在网页里选定分支，都不在 `scripts/` 里。现有站点的分支和目录要求写在 [campus README](./campus/README.md) 的「构建与 GitHub Pages」。

## park-industry

构建脚本：[scripts/pages-build.mjs](https://github.com/dxhcode/park-industry/blob/main/scripts/pages-build.mjs)。发布脚本：[scripts/pages-publish.mjs](https://github.com/dxhcode/park-industry/blob/main/scripts/pages-publish.mjs)。

```bash
pnpm pages:build
pnpm pages:publish
```

`pages:build`：

1. 删除仓库根 `dist/`。
2. `pnpm --filter admin-app build`，再 `pnpm --filter screen-app build`。
3. 拷贝两个应用的 `dist` 到 `dist/admin/`、`dist/screen/`，拷贝 `pages/index.html`。
4. 把一段内联回退页写到 `dist/404.html`。路径以 `/park-industry/admin/` 或 `/park-industry/screen/` 开头时，改写成该应用的 `index.html` 能接住的 `?/` 形式；否则回到 `/park-industry/`。
5. 写入 `dist/.nojekyll`。
6. 读取两个 `index.html`，确认里面包含 `/park-industry/admin/` 与 `/park-industry/screen/`。缺少时抛错，不继续。

`pages:publish` 在构建之前检查 `git status --porcelain`。工作区有未提交改动时打印「请先提交」并退出码 1。通过后：

1. 再执行一次 `node scripts/pages-build.mjs`。
2. 删掉 `dist/.git`（若存在），在 `dist/` 里 `git init -b dist`。
3. `git add -A`，以作者 `park-industry pages <pages@localhost>` 提交，说明是 `chore: publish GitHub Pages bundle`。
4. `git push --force <origin 的 URL> HEAD:dist`。
5. 删除 `dist/` 里这次临时初始化的 `.git`。

强制推送会覆盖远端 `dist` 分支上的历史。手改该分支会在下一次发布时被盖掉。脚本结束时打印三个站点地址，并提醒到仓库设置里把 Pages 指到 `dist` 根目录。

## park-gov

脚本目录：

- [scripts/pages-build.mjs](https://github.com/dxhcode/park-gov/blob/main/scripts/pages-build.mjs)
- [scripts/pages-portal.html](https://github.com/dxhcode/park-gov/blob/main/scripts/pages-portal.html)
- [scripts/pages-preview.mjs](https://github.com/dxhcode/park-gov/blob/main/scripts/pages-preview.mjs)
- [scripts/pages-publish.mjs](https://github.com/dxhcode/park-gov/blob/main/scripts/pages-publish.mjs)

```bash
pnpm pages:build
pnpm pages:preview
PAGES_PUBLISH=1 pnpm pages:publish
```

不带 `PAGES_PUBLISH=1` 时，`pnpm pages:publish` 只打印构建、推送和 Pages 设置步骤，退出码 0，不改远端。

`pages:build`：

1. 清空并重建仓库根 `dist/`。
2. `pnpm --filter admin-app build`，再 `pnpm --filter screen-app build`。
3. 拷贝到 `dist/admin/`、`dist/screen/`，并各复制一份 `index.html` 为该目录下的 `404.html`。
4. 把 `scripts/pages-portal.html` 写成 `dist/index.html`。
5. 写入根上的 `dist/404.html`：从路径里找到 `park-gov` 之后的 `admin` 或 `screen`，其余段放到查询参数 `?p=/...`，再 `location.replace` 到对应应用。无法判断时进管理端。
6. 写入 `dist/.nojekyll`。

`pages:preview` 用 Node 的 `http` 模块托管这份 `dist/`。默认端口 `4173`，只接受 `/park-gov` 前缀；访问 `/` 会 302 到 `/park-gov/`。文件不存在时，`/screen` 回 `screen/index.html`，`/admin` 回 `admin/index.html`，其余回入口页。

`PAGES_PUBLISH=1 pnpm pages:publish`：

1. 先执行 `pnpm pages:build`。
2. 若远端已有 `dist`，`git fetch origin dist`，再 `git worktree add --detach` 到临时目录。若还没有该分支，从当前 `HEAD` 建临时 worktree，并在其中 `git checkout --orphan`。
3. 在 worktree 里 `git read-tree --empty`，删掉除 `.git` 以外的文件，把刚生成的 `dist/` 内容拷进去。
4. 有差异才提交，说明是 `chore: 发布园区政府管理平台 Pages 静态产物`，然后 `git push origin HEAD:dist`。内容没变则跳过提交。
5. 在 `finally` 里移除 worktree。首次发布时创建的临时本地分支也会删掉。

这条推送没有 `--force`。远端 `dist` 若含有本地这棵树没有的提交，push 会按 Git 的普通快进规则拒绝。产业仓库的发布脚本则是强制推送。

脚本注释和帮助文本里的手工等价步骤是：

1. `pnpm pages:build`
2. 把 `dist/` 里的文件放到 `dist` 分支根目录并提交
3. `git push origin dist`
4. 在仓库设置里把 Pages 指到该分支的 `/ (root)`

## 发布时不要做的事

三个平台的 `.gitignore` 都忽略了 `dist`。源码提交走 `main`（或当前开发分支）。`dist` 分支只接收上面的静态产物。把源码和 `node_modules` 推进 `dist`，Pages 不会按 Vite 项目去编译，站点会缺入口或资源路径错误。

改完页面后的顺序是：在源码分支提交，再在对应平台仓库执行该仓库的 `pages:build`（产业、政府还可以用各自的 `pages:publish`）。共享库的 `pnpm build` 只编译 `packages/*`，不会更新任何平台的 Pages 站点。
