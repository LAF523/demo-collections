import { THEME_DARK, THEME_LIGHT, THEME_SYSTEMS } from '@/constants';
import useThemeStore from '@/stores/modules/theme/index.ts';
import { ThemeType } from '@/stores/modules/theme/types';

// 监听主题切换
let mql: MediaQueryList = window.matchMedia('(prefers-color-scheme:dark)');
mql.onchange = () => {
  changeTheme(THEME_SYSTEMS);
};

function changeTheme(theme: ThemeType) {
  const htmlEl = document.querySelector('html');
  let targetTheme = 'light';
  switch (theme) {
    case THEME_DARK:
      targetTheme = THEME_DARK;
      break;
    case THEME_LIGHT:
      targetTheme = THEME_LIGHT;
      break;
    case THEME_SYSTEMS:
      targetTheme = mql.matches ? THEME_DARK : THEME_LIGHT;
      break;
    default:
      targetTheme = 'light';
  }
  if (htmlEl) {
    htmlEl.className = targetTheme;
  }
}

export const useTheme = () => {
  const store = useThemeStore();
  watch(() => store.themeType, changeTheme, {
    immediate: true
  });
};
