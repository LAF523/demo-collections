import { parseJwt } from '@/common/encrypt.ts';

export const isLogin = () => {
  // token中的name和本地存储的name一致 表示已经登录
  const tokenUser = parseJwt()?.username;
  const localUser = localStorage.getItem('user');
  return tokenUser === localUser && localUser !== null;
};

// 并发异步队列,控制异步任务的并发数
export const paralleTask = (tasks: any[], max = 4) => {
  if (tasks.length === 0) return;

  return new Promise((resolve, reject) => {
    let nextIndex = 0;
    let finishedIndex = 0;
    const len = tasks.length;
    for (let i = 0; i < max && i < len; i++) {
      _run();
    }

    function _run() {
      const task = tasks[nextIndex];
      nextIndex++;
      task()
        .then(() => {
          finishedIndex++;
          const isFinied = finishedIndex === len;
          if (isFinied) {
            resolve(0);
          }

          const hasTask = nextIndex < len;
          if (hasTask) {
            _run();
          }
        })
        .catch((err: any) => reject(err));
    }
  });
};
