import routers from '@/routes';
import { RouterProvider } from 'react-router-dom';
import usePernissionRouter from './hooks/usePernissionRouter';
import { isLogin } from './common';
import Login from '@/pages/login';
function App() {
  const r = usePernissionRouter(routers);
  return (
    <>
      {/* <React.StrictMode>{isLogin() ? <RouterProvider router={r} /> : <Login />}</React.StrictMode> */}
      {isLogin() ? <RouterProvider router={r} /> : <Login />}
    </>
  );
}

export default App;
