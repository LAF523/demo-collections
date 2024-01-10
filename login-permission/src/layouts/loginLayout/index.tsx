import { Outlet } from 'react-router-dom';
import styles from './index.module.less';
const LoginLayout: React.FC = () => {
  return (
    <>
      <div className={styles.wrap}>
        <h1>欢迎登录</h1>
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default LoginLayout;
