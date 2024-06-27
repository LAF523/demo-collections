import { useInViewport, useUpdateEffect } from 'ahooks';
import { useRef } from 'react';

interface Props {
  isLoading: boolean;
  isFinished: boolean;
  children: React.ReactNode;
  load: () => void;
}

const InFiniteList: React.FC<Props> = ({ isLoading = false, isFinished = false, children, load }) => {
  const signRef = useRef(null);
  const [inviewport] = useInViewport(signRef);

  const emitLoad = () => {
    const needLoad = inviewport && !isFinished && !isLoading;
    if (needLoad) {
      load();
    }
  };

  useUpdateEffect(() => {
    emitLoad();
  }, [inviewport]);

  return (
    <>
      <div>
        <div>{children}</div>
        <div
          ref={signRef}
          style={{ textAlign: 'center' }}
        >
          {isLoading && <p>加载中</p>}
          {isFinished && <p>已经加载全部数据</p>}
        </div>
      </div>
      cd
    </>
  );
};

export default InFiniteList;
