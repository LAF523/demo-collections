import { h, render } from 'vue';
import Message from './index.vue';

const ROW_SPACE = 10;
let allMessageWrap: HTMLDivElement[] = [];
let container: HTMLDivElement | null = null;
export const message = ({
  type,
  content,
  duration
}: {
  type: 'success' | 'error' | 'info' | 'warn';
  content?: string;
  duration?: number;
}) => {
  if (!container) {
    container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    // container.style.left = '50%';
    // container.style.transform = 'translateX(-50%)';
    container.style.zIndex = '9999';
    document.body.append(container);
  }
  const currTop = getTop(allMessageWrap);

  const messageWrap = document.createElement('div'); // 消息容器
  container.appendChild(messageWrap);
  allMessageWrap.push(messageWrap);

  const vnode = h(Message, {
    type,
    content,
    duration,
    top: currTop,
    hidden: remove
  });

  render(vnode, messageWrap);

  function remove() {
    messageWrap.style.top = '-100px';
    setTimeout(() => {
      render(null, messageWrap);
    }, 500);
    container!.removeChild(messageWrap);
    allMessageWrap = allMessageWrap.filter(item => item !== messageWrap);
    if (allMessageWrap.length === 0) {
      container!.remove();
      container = null;
    }
  }
};

function getTop(allMessageWrap: HTMLDivElement[]) {
  return allMessageWrap.reduce((acc: number, curr: HTMLDivElement) => {
    const msgEL = curr.querySelector('div');
    acc += msgEL!.offsetHeight + ROW_SPACE;
    return acc;
  }, 0);
}
