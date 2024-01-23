import { useNavigate } from 'react-router-dom';

const useUser = () => {
  const navigate = useNavigate();
  const logOut = () => {
    navigate('/');
  };

  return {
    logOut
  };
};

export default useUser;
