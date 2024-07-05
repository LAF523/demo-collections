import { defineStore } from 'pinia';
import { categoryType } from './type.ts';
import { ALL_CATEGORY_ITEM, INT_CATEGORYS } from '@/constants/index.ts';
import { getCategory } from '@/service/main.ts';

export const useCategorysStore = defineStore(
  'categorys',
  () => {
    const state = ref<categoryType[]>(INT_CATEGORYS);

    const categorysState = computed(() => {
      return state;
    });
    const setCategorysState = (categorys: categoryType[]) => {
      state.value = categorys;
    };
    const fetchCategotys = async () => {
      const [data, err] = await getCategory();
      if (err) return;
      setCategorysState([ALL_CATEGORY_ITEM, ...data.categorys]);
    };

    return {
      state,
      categorysState,
      setCategorysState,
      fetchCategotys
    };
  },
  {
    persist: {
      key: 'categorysState',
      paths: ['state'],
      storage: localStorage
    }
  }
);
