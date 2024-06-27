import { useIntersectionObserver } from '@vueuse/core';

function randomRgb() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
}

export default {
  mounted(el: HTMLImageElement, binding: { arg?: string }) {
    if (binding.arg === 'autoBg') {
      el.style.backgroundColor = randomRgb();
    }
    const imgSrc = el.src;
    el.src = '';
    const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
      if (isIntersecting) {
        el.src = imgSrc;
        stop();
      }
    });
  }
};
