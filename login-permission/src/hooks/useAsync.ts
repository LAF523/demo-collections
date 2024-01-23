import { useState } from 'react';

interface State<T> {
  data: T | null;
  err: string;
  status: 'idle' | 'loading' | 'error' | 'success';
}
interface Return<T> extends Pick<State<T>, 'data' | 'err' | 'status'> {
  error: boolean;
  success: boolean;
  loading: boolean;
  run: (promise: Promise<T>, runConfig?: { retry: () => Promise<T> }) => void;
  retry: () => void;
  setData: (data: T) => void;
  setError: (err: string) => void;
}

const defaultState: State<null> = {
  data: null,
  err: '',
  status: 'idle'
};

interface DefaultConfig {
  throwError: boolean;
}

const defaultConfig: DefaultConfig = {
  throwError: false
};

const useAsync = <T>(initState?: Partial<State<T>>, initConfig?: Partial<DefaultConfig>): Return<T> => {
  const [state, setState] = useState<State<T>>({
    ...defaultState,
    ...(initState || {})
  });

  const config = {
    ...defaultConfig,
    ...(initConfig || {})
  };

  const setData = (data: T) => {
    setState({
      data,
      err: '',
      status: 'success'
    });
  };

  const setError = (err: string) => {
    setState({
      data: null,
      err,
      status: 'error'
    });
  };

  const [retry, setRetryFn] = useState<() => Promise<T> | void>(() => () => {});

  const run = (promise: Promise<T>, runConfig?: { retry: () => Promise<T> }) => {
    if (!promise || !promise.then) {
      console.error('请传入一个Promise');
      return;
    }

    setRetryFn(() => () => {
      if (runConfig?.retry) {
        run(runConfig.retry(), runConfig);
      }
    });

    setState({ ...state, status: 'loading' });

    return promise.then(
      (data: T) => {
        setData(data);
        return data;
      },
      (error: any) => {
        if (config.throwError) {
          throw error;
        }
        setError(error.toString());
        return error;
      }
    );
  };

  return {
    error: state.status === 'error',
    success: state.status === 'success',
    loading: state.status === 'loading',
    run,
    retry,
    setData,
    setError,
    ...state
  };
};

export default useAsync;
