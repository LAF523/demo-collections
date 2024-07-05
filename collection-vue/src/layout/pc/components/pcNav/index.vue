<template>
  <div class="bg-white sticky top-0 left-0 w-full z-10 dark:bg-zinc-800">
    <ul
      class="w-[800px] relative flex flex-wrap justify-center overflow-x-auto px-[10px] py-1 text-xs text-zinc-600 duration-300 overflow-hidden mx-auto"
      :class="[isOpen ? 'h-[206px]' : 'h-[56px]']"
    >
      <li
        @click="hanleClick(index, item)"
        v-for="(item, index) of categorysState"
        :key="item.name"
        class="dark:text-zinc-500 dark:hover:text-zinc-300 shrink-0 px-1.5 py-0 z-10 duration-200 last:mr-4 text-zinc-900 text-base font-bold h-4 leading-4 cursor-pointer hover:bg-zinc-200 rounded mr-1 mb-1 dark:hover:bg-zinc-900"
        :class="{ 'text-zinc-900  dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-900 ': currIdx === index }"
      >
        {{ item.name }}
      </li>
      <li
        class="w-2 h-2 flex items-center justify-center absolute bottom-1.5 right-1 rounded cursor-pointer duration-200 hover:bg-zinc-200 dark:hover:bg-zinc-900"
        @click="changeNav"
      >
        <MsvgIcon
          :name="isOpen ? 'fold' : 'unfold'"
          class="w-1 h-1"
          fillClass="dark:fill-zinc-300"
        ></MsvgIcon>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useCategorysStore } from '@/stores/modules/categorys';
import { useAppStore } from '@/stores/modules/app';
import { categoryType } from '@/stores/modules/categorys/type.ts';

const { categorysState } = useCategorysStore();
const { setCurrCategory } = useAppStore();
const currIdx = ref<number>(0);
const isOpen = ref(false);

const hanleClick = (index: number, item: categoryType) => {
  setCurrCategory(item);
  currIdx.value = index;
};

const changeNav = () => {
  isOpen.value = !isOpen.value;
};
</script>
