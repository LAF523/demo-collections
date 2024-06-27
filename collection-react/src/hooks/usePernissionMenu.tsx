import { rootStore } from '@/stores';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { checkPermission } from '@/common/pernission';

interface menuItem {
  name: string;
  icon: React.ReactElement;
  path?: string;
  element?: React.ReactElement;
  authority?: string[];
  menuItems?: menuItem[];
}
/**
 * @message: 根据路由和权限生成对应的menu
 * @param {any} role
 * @param {any} routes
 * @since: 2024-01-15 16:27:50
 */
function checkMenu(role: string[], routes: menuItem[] = []) {
  return routes.reduce((acc: any, curr: menuItem) => {
    // 父级导航还是子级菜单
    const isParentMenu = curr.menuItems && curr.menuItems.length > 0;
    let menu;
    if (isParentMenu) {
      menu = createParentMenu(role, curr);
    } else {
      menu = createSonMenu(role, curr);
    }
    menu && acc.push(menu);
    return acc;
  }, []);
}

function createParentMenu(role: string[], currMenu: menuItem) {
  const passItems = checkMenu(role, currMenu.menuItems);
  const hasPassItem = passItems.length > 0; // 该父级导航是否有鉴权通过的子级页面,有了才添加,否则整个导航都不展示
  if (hasPassItem) {
    return {
      label: currMenu.name,
      key: currMenu.path || currMenu.name,
      icon: currMenu.icon,
      children: passItems
    };
  }
}

function createSonMenu(role: string[], curr: menuItem) {
  const isPass = checkPermission(curr.authority, role);
  if (isPass) {
    return {
      label: curr.name,
      key: curr.path || curr.name,
      icon: curr.icon
    };
  }
}
const usePernissionMenu = routes => {
  const user = useSelector((state: rootStore) => state.user);

  const m = useMemo(() => {
    return checkMenu(user.role, routes);
  }, [user.role]);

  return m;
};

export default usePernissionMenu;
