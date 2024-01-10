import { getList } from '@/service/login.ts';
import { useState } from 'react';
import { queryUser } from '@/service/login.ts';
import { isLogin } from '@/common/index.ts';
const Main: React.FC = () => {
  const [listData, setListData] = useState<any[]>([]);
  const [obj, setObj] = useState<any>({});

  const handleClick = async () => {
    click1();
    const [data, err] = await getList();
    if (err || !data) return;
    setListData(data);
    // const [a, b] = await queryUser();
    // console.log(a, b);
    // setObj({ a, b });
    // console.log(isLogin());
  };
  const click1 = async () => {
    const [a, b] = await queryUser();
    setObj({ a, b });
  };
  return (
    <>
      首页
      <div>{JSON.stringify(obj)}</div>
      <button onClick={handleClick}>点击</button>
      {!!listData.length &&
        listData.map((item: number) => {
          return <div key={item}>{item}</div>;
        })}
    </>
  );
};
export default Main;
