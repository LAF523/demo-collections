import React from 'react';
import routers from '@/routes';
import { RouterProvider } from 'react-router-dom';
import usePernissionRouter from './hooks/usePernissionRouter';
function App() {
  const r = usePernissionRouter(routers);
  return (
    <>
      <React.StrictMode>
        <RouterProvider router={r} />
      </React.StrictMode>
    </>
  );
}

export default App;
