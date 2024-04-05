export interface User {
  id?: string,
  /**
   * 账户
   *
   * @type {string}
   * @memberof User
   */
  account: string,
  /**
   * 密码
   *
   * @type {string}
   * @memberof User
   */
  password: string,
  /**
   * 权限，1表示超级管理员，0表示校园管理员
   *
   * @type {(1|0)}
   * @memberof User
   */
  authority?: 1|0,
  /**
   * 学校定位
   *
   * @type {string}
   * @memberof User
   */
  school?: string,
  createTime?:string
}
