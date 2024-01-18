import { checkPermission } from '@/common/pernission';
import { rootStore } from '@/stores';
import { useSelector } from 'react-redux';

interface AuthCompProps {
  authority: string | string[];
  children?: React.ReactNode;
}

/**
 * @message: 权限校验高阶组件,返回一个附带校验功能的组件
 * @since: 2024-01-15 17:45:13
 */
const Authorized = <P extends object>(Component: React.FC<P>) => {
  const AuthComponent = (props: P & AuthCompProps) => {
    const user = useSelector((state: rootStore) => state.user);
    const { authority, children, ...rest } = props;

    if (checkPermission(authority, user.role)) {
      return <Component {...(rest as P)}>{children} </Component>;
    }
    return null;
  };
  return AuthComponent;
};

export default Authorized;
