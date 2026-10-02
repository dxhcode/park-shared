export interface LoginPayload {
  username: string
  password: string
  remember: boolean
}

/** 空态插画。各端按场景选用，不绑定具体业务。 */
export type EmptyVariant = 'empty' | 'search' | 'error' | 'locked' | 'done'

/** auto 跟随祖先的 data-park-theme；显式指定时本节点自己套主题变量。 */
export type EmptyTone = 'auto' | 'admin' | 'screen'
