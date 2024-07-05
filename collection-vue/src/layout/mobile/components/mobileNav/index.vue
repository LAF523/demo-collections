<template>
  <div class="bg-white sticky top-0 left-0 z-10 flex dark:bg-zinc-900">
    <ul
      class="relative flex overflow-x-auto p-1 text-xs text-zinc-600 overflow-hidden"
      ref="menuWrapRef"
    >
      <li
        v-for="(item, index) of categorysState"
        :key="item.id"
        class="shrink-0 px-1.5 py-0.5 z-10 duration-200 dark:bg-zinc-900 ... dark:shadow-l-zinc"
        data-menuitem="true"
        :data-index="index"
        :class="{ 'text-zinc-50': currentIdx === index }"
        :ref="getNavigationItem"
        @click="handleMenuClick(index)"
      >
        {{ item.name }}
      </li>
      <li
        class="absolute h-[22px] bg-zinc-900 rounded-lg duration-200 dark:bg-zinc-800"
        :style="sliderStyle"
      ></li>
    </ul>
    <div class="z-20 h-4 px-1 flex items-center bg-white shadow-l-white">
      <MsvgIcon
        class="w-1.5 h-1.5"
        name="hamburger"
        @click="showMenuPopup"
      ></MsvgIcon>
    </div>
    <Mpopup v-model="isShow">
      <Menu @item-click="handlePopupClick"></Menu>
    </Mpopup>
  </div>
</template>

<script setup lang="ts">
import { useCategorysStore } from '@/stores/modules/categorys/index.ts';
import Menu from '../menu/index.vue';
import { useAppStore } from '@/stores/modules/app';

const { categorysState } = useCategorysStore();
const { setCurrCategory } = useAppStore();
const sliderStyle = ref<{ transform: string; width: string }>({
  transform: 'translateX(0)',
  width: '1.25rem'
});
const menuWrapRef = ref(null);
const { x: menuScollX } = useScroll(menuWrapRef);
const currentIdx = ref<number>(0);
let navigationItems: Element[] = [];
const getNavigationItem = (ref: Element | ComponentPublicInstance | null) => {
  navigationItems.push(ref as Element);
};
onBeforeUpdate(() => {
  // 在数据更新后,DOM更新前执行
  navigationItems = [];
});

const moveSlider = (sliderLeft: number, sliderWidth: number) => {
  sliderStyle.value = {
    transform: `translateX(${menuScollX.value + sliderLeft - 10}px)`,
    width: `${sliderWidth}px`
  };
};
const handleMenuClick = (index: number) => {
  currentIdx.value = index;
};
watch(currentIdx, idx => {
  const { left, width } = navigationItems[idx].getBoundingClientRect();
  moveSlider(left, width);
  setCurrCategory(categorysState.value[idx]);
});

const isShow = ref<boolean>(false);
const showMenuPopup = () => {
  isShow.value = true;
};
const closemenuPopup = () => {
  isShow.value = false;
};

const handlePopupClick = (index: number) => {
  currentIdx.value = index;
  closemenuPopup();
};
</script>
