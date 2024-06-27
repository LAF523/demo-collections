import { useLocation } from 'react-router-dom';

const Main: React.FC = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const params = useParams();
  const location = useLocation();

  return <>{location.state.name}</>;
};
export default Main;
