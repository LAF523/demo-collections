import { Outlet, useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import { useEffect } from 'react';
import { isLogin } from '@/common';
const LoginLayout: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isLogin()) {
      navigate('/main');
    }
  });
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
