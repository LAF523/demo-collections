import { defineStore } from 'pinia';
import { categoryType } from '../categorys/type';
import { ALL_CATEGORY_ITEM } from '@/constants';

export const useAppStore = defineStore('app', () => {
  const state = ref<{ currCategory: categoryType; searchVal: string; routerChangeType: 'none' | 'back' | 'push' }>({
    currCategory: ALL_CATEGORY_ITEM,
    searchVal: '',
    routerChangeType: 'none'
  });
  const appState = computed(() => {
    return state;
  });

  const setCurrCategory = (val: categoryType) => {
    state.value.currCategory = val;
  };
  const setSearchVal = (val: string) => {
    state.value.searchVal = val;
  };
  const setRouterChangeType = (val: 'none' | 'back' | 'push') => {
    state.value.routerChangeType = val;
  };
  return {
    appState,
    setCurrCategory,
    setSearchVal,
    setRouterChangeType
  };
});
