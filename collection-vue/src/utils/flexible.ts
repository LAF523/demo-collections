import { useWindowSize } from '@vueuse/core';
import { debounce } from 'lodash-es';
import { MOBILE_WIDTH } from '@/constants/index.ts';

const { width } = useWindowSize();

export const isMobile = computed(() => {
  // return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return width.value <= MOBILE_WIDTH;
});

// 设置响应式基准值
export const useRemUnit = () => {
  window.addEventListener(
    'resize',
    debounce(() => {
      highDefinition();
    }, 200)
  );
  document.addEventListener('DOMContentLoaded', () => {
    highDefinition();
  });
};

function getRemUnit() {
  const width = document.documentElement.clientWidth;
  const fontSize = Math.min(width / 10, 40);
  return fontSize;
}
function highDefinition(baseFontSize = getRemUnit()) {
  // 获取屏幕dpr
  // const dpr = needHighDefinition() ? window.devicePixelRatio || 1 : 1;
  // const scale = 1 / dpr;

  // 修改viewport缩放比例为1/dpr,将布局视口缩小,防止1px线,图片模糊
  // let viewPortEl = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
  // if (!viewPortEl) {
  //   // 没有就创建一个
  //   viewPortEl = document.createElement('meta');
  //   viewPortEl.name = 'viewport';
  //   const head = document.querySelector('head');
  //   head?.append(viewPortEl);
  // }
  // viewPortEl.setAttribute(
  //   'content',
  //   `width=device-width, initial-scale=${scale}, minimum-scale=${scale}, maximum-scale=${scale}`
  // );
  // 将基础字体大小,放大dpr倍数,保证元素比例大小正常
  document.documentElement.style.fontSize = `${baseFontSize / 1}px`;
}
// function needHighDefinition() {
//   const ua = navigator.userAgent;
//   const matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
//   const UCversion = ua.match(/U3\/((\d+|\.){5,})/i);
//   const isUCHd = UCversion && parseInt(UCversion[1].split('.').join(''), 10) >= 80;
//   const isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
//   if (!isIos && !(matches && Number(matches[1]) > 534) && !isUCHd) {
//     // 如果非iOS, 非Android4.3以上, 非UC内核, 就不执行高清, dpr设为1;
//     return false;
//   }
//   return true;
// }
