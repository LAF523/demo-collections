import { checkPermission } from '@/common/pernission';
import { rootStore } from '@/stores';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

/**
 * @message: 根据路由和权限生成符合权限的路由
 * @param {string} role
 * @param {any} routers
 * @since: 2024-01-15 16:32:24
 */
function checkRoutes(role: string[], routers: any) {
  return routers.reduce((acc: any, curr: any) => {
    const isPass = checkPermission(curr.authority, role);
    if (isPass) {
      const hasChildren = curr.children && curr.children.length > 0;
      if (hasChildren) {
        acc.push({ ...curr, children: checkRoutes(role, curr.children) });
      } else {
        acc.push(curr);
      }
    }
    return acc;
  }, []);
}
const usePernissionRouter = routers => {
  const user = useSelector((state: rootStore) => state.user);

  const r = useMemo(() => {
    return { ...routers, routes: checkRoutes(user.role, routers.routes) };
  }, [routers, user.role]);

  return r;
};
export default usePernissionRouter;
