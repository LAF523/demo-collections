import { RouterProvider } from 'react-router-dom';
import React from 'react';
import routes from './routes';
function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={routes} />
    </React.StrictMode>
  );
}

export default App;
