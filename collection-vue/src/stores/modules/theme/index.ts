import { defineStore } from 'pinia';
import { THEME_LIGHT } from '@/constants';
import { ThemeType } from './types';

export default defineStore(
  'theme',
  () => {
    const state = ref<ThemeType>(THEME_LIGHT);
    const themeType = computed(() => {
      return state.value;
    });
    const setTheme = (val: ThemeType) => {
      state.value = val;
    };

    return {
      themeType,
      state,
      setTheme
    };
  },
  {
    persist: {
      key: 'theme',
      paths: ['state'],
      storage: localStorage
    }
  }
);
