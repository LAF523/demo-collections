/**
 * @message: 鉴权
 * @param {string | string[]} authorize 所需权限 类型包含: 单个权限  或: ['||',"权限1","权限2"] 与: ["权限1","权限2"]
 * @param {string[]} current   当前有的权限
 * @return {Boolean}
 * @since: 2024-01-11 22:17:52
 */
export function checkPermission(authorize: string | string[] = '', current: string[] | string = '') {
  if (authorize === '') {
    return true;
  }
  const required = paramToOneType(authorize);

  if (required[0] === '||') {
    required.splice(0, 1);
    return required.some(item => current.includes(item));
  }
  return required.every(item => current.includes(item));
}

function paramToOneType(param: string | string[]) {
  let arr = [];
  // 参数归一化
  if (typeof param === 'string') {
    arr.push(param);
  } else {
    arr = param;
  }
  return arr;
}
