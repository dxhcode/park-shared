import { theme, type ConfigProviderProps } from 'ant-design-vue'
import { adminTokens, screenTokens } from './tokens.js'

export type ParkAntdTheme = NonNullable<ConfigProviderProps['theme']>

const fontFamily = adminTokens.fontFamily

/**
 * 管理端：浅色内容区，顶栏用墨色，主色用靛蓝。
 * 组件级令牌只使用 ant-design-vue@4.2 已声明的字段。
 * 侧栏底色请配 CSS 变量 --park-sider-bg（theme.css）。
 */
export const adminAntdTheme: ParkAntdTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: adminTokens.colorPrimary,
    colorInfo: '#2f54eb',
    colorLink: adminTokens.colorPrimary,
    colorText: adminTokens.colorText,
    colorTextSecondary: adminTokens.colorTextSecondary,
    colorBgLayout: adminTokens.colorBg,
    colorBgContainer: '#ffffff',
    colorBorder: '#e4e8f2',
    colorBorderSecondary: '#eef1f8',
    borderRadius: adminTokens.radius,
    fontFamily,
    fontSize: 14,
    controlHeight: 36,
    wireframe: false,
  },
  components: {
    Layout: {
      colorBgHeader: adminTokens.headerBg,
      colorBgBody: adminTokens.colorBg,
      colorBgTrigger: '#101628',
    },
    Menu: {
      colorItemTextSelected: adminTokens.colorPrimary,
      colorItemBgSelected: '#e8eeff',
      colorItemBgHover: '#f3f6ff',
      radiusItem: 8,
    },
  },
}

/** 大屏：深色算法 + 青色主色，配合 theme.css 的玻璃与辉光。 */
export const screenAntdTheme: ParkAntdTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: screenTokens.colorPrimary,
    colorInfo: screenTokens.colorAccent,
    colorLink: screenTokens.colorHighlight,
    colorText: screenTokens.colorText,
    colorTextSecondary: screenTokens.colorTextSecondary,
    colorBgBase: '#05070f',
    colorBgLayout: '#05070f',
    colorBgContainer: '#0c1428',
    colorBgElevated: '#121c36',
    colorBorder: '#1e3a5f',
    colorBorderSecondary: '#16304f',
    borderRadius: 10,
    fontFamily: screenTokens.fontFamily,
    fontSize: 14,
    controlHeight: 36,
    wireframe: false,
  },
  components: {
    Layout: {
      colorBgHeader: '#070d1c',
      colorBgBody: '#05070f',
      colorBgTrigger: '#0c1830',
    },
    Menu: {
      colorItemText: 'rgba(231, 246, 255, 0.78)',
      colorItemTextHover: '#e7f6ff',
      colorItemTextSelected: '#67e8f9',
      colorItemBg: '#080e20',
      colorItemBgHover: 'rgba(59, 130, 246, 0.22)',
      colorItemBgSelected: 'rgba(34, 211, 238, 0.16)',
      colorSubItemBg: '#060b18',
      radiusItem: 8,
    },
  },
}

export const parkAntdThemes = {
  admin: adminAntdTheme,
  screen: screenAntdTheme,
} as const
