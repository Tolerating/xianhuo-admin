import { User } from '@/types/User';
import { request } from '@umijs/max';

/**
 * 登录
 *
 * @param {User} params
 */
const loginAdmin = (params: User) =>  request('/api/admin/login', {
  method: 'POST',
  data: params,
});

/**
 * 获取管理员信息
 *
 */
const getAdminInfo = ()=>  request('/api/admin/info', {
  method: 'GET',
});
export {
  loginAdmin,
  getAdminInfo
}
