import { isLogin } from '@/common';
import logout from '@/common/logout';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface RouterBeforeEachProps {
  children?: React.ReactNode;
}
/**
 * @message: 通过监听location.pathname的变化来进行鉴权
 * @since: 2024-01-16 16:23:45
 */
const RouterBeforeEach = <P extends object>(Comp: React.FC<P>) => {
  const Component = (props: P & RouterBeforeEachProps) => {
    const { children, ...rest } = props;
    const location = useLocation();

    useEffect(() => {
      if (!isLogin()) {
        logout();
      }
    }, [location.pathname]);
    return <Comp {...(rest as P)}>{children}</Comp>;
  };
  return Component;
};

export default RouterBeforeEach;
