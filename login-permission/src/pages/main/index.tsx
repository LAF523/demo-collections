import { Button } from 'antd';
import Authorized from '@/components/authorized';

const AuthButton = Authorized(Button);
const Main: React.FC = () => {
  console.log('main');

  return (
    <>
      <button>点击修改权限</button>
      <AuthButton authority={['ADD_USER']}>新增用户</AuthButton>
    </>
  );
};
export default Main;
