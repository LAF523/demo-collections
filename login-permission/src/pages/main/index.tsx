import { getList } from '@/service/login.ts';
import { useState } from 'react';
import { queryUser } from '@/service/login.ts';
import { checkPermission } from '@/common/pernission';
import { getRoleByBlocal } from '@/common/locallstorage';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '@/stores/user';

const Main: React.FC = () => {
  console.log('main');
  const [obj, setObj] = useState<any>({});
  const dispatch = useDispatch();

  const handleClick = async () => {
    const [data, err] = await getList();
    if (err || !data) return;
    const role = getRoleByBlocal();
    const hasPer = checkPermission(['&&', 'SHOW88', 'SHOW2'], role);
    console.log(hasPer);
    dispatch(
      setUserInfo({
        role: ['SHOW1']
      })
    );
  };
  const click1 = async () => {
    const [a, b] = await queryUser();
    setObj({ a, b });
  };

  return (
    <>
      <button onClick={handleClick}>点击修改权限</button>
    </>
  );
};
export default Main;
