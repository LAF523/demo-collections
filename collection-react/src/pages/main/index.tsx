import { Button } from 'antd';
import Authorized from '@/components/authorized';
import { useNavigate } from 'react-router-dom';
import Context from '@/context';
import { useState } from 'react';
import ContextTest from '@/components/contextTest';
import ConditionBuilder from '@/components/condition';

const AuthButton = Authorized(Button);
const Main: React.FC = () => {
  const navigate = useNavigate();
  const [i18n] = useState({ name: 'jjj' });

  const handleClick = () => {
    // 第一种传参方式: 拼接 + useSearchParams接收
    navigate('/params?name="hhhhh');
    // 第二种传参方式: params(动态路由) + useParams()
    navigate('/params/这是name');
    // 第三种传参方式: state + useLocation
    navigate('/params', { state: { name: 'name' } });
  };

  return (
    <>
      <button>点击修改权限</button>
      <AuthButton authority={['ADD_USER']}>新增用户</AuthButton>
      <Button onClick={handleClick}></Button>
      <Context.Provider value={i18n}>
        <ContextTest />
      </Context.Provider>
      <ConditionBuilder />
    </>
  );
};
export default Main;
