let broadcastChannel: BroadcastChannel | null = null;
const NAME = 'LOGIN';
if (window.BroadcastChannel) {
  // broadcastChannel = new BroadcastChannel(NAME);
}

// 发送消息
export const send = (data: object) => {
  if (broadcastChannel) {
    broadcastChannel.postMessage(data);
  } else {
    localStorage.setItem(NAME, JSON.stringify(data));
  }
};
// 监听消息

export const wait = () => {
  return new Promise((resolve, reject) => {
    if (broadcastChannel) {
      broadcastChannel.onmessage = event => {
        resolve(event.data);
      };

      broadcastChannel.onmessageerror = event => {
        reject(event);
      };
    } else {
      window.onstorage = e => {
        if (e.key === NAME) {
          // 改变 promise 状态
          if (e.newValue !== null) {
            resolve(JSON.parse(e.newValue));
            return;
          }
          resolve(null);
        }
      };
    }
  });
};

// 断开连接
export const close = () => {
  if (broadcastChannel) {
    broadcastChannel.close();
    broadcastChannel = null;
  } else {
    localStorage.removeItem(NAME);
  }
};
