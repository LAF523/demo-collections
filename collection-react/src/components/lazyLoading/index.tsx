import { Spin } from 'antd';
import { Suspense } from 'react';

const LazyLoading = (Element: React.FC) => {
  return (
    <Suspense fallback={<Spin />}>
      <Element />
    </Suspense>
  );
};

export default LazyLoading;
