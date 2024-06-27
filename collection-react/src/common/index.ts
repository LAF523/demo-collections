import { parseJwt } from '@/common/encrypt.ts';

export const isLogin = () => {
  // token中的name和本地存储的name一致 表示已经登录
  const tokenUser = parseJwt()?.username;
  const localUser = localStorage.getItem('user');
  return tokenUser === localUser && localUser !== null;
};

export type CallBackprops = {
  res: any[]; // 结果数组
  finishedIndex: number; // 已完成任务的数量
  nextIndex: number; // 下一个要执行的任务的索引
  task: () => Promise<any>; // 当前正在执行的任务
};
export type TaskCallback = (info: CallBackprops) => void;
// 并发异步队列,控制异步任务的并发数
export const paralleTask = (tasks: (() => Promise<any>)[] | [], max = 4, callback?: TaskCallback) => {
  if (tasks.length === 0) return;

  return new Promise(resolve => {
    let nextIndex = 0;
    let finishedIndex = 0;
    const len = tasks.length;
    for (let i = 0; i < max && i < len; i++) {
      _run();
    }

    function _run() {
      const task = tasks[nextIndex];
      nextIndex++;
      task().then((data: any) => {
        finishedIndex++;
        callback && callback({ res: data, finishedIndex, nextIndex, task });

        const isFinied = finishedIndex === len;
        if (isFinied) {
          resolve(0);
        }

        const hasTask = nextIndex < len;
        if (hasTask) {
          _run();
        }
      });
    }
  });
};
