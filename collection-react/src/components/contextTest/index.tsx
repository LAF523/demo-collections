import Context from '@/context';
import { useContext } from 'react';

const Main: React.FC = () => {
  const data = useContext(Context);

  return <>{data.name}</>;
};
export default Main;
