<template>
  <div>
    <Mpopover
      trigger="hover"
      direction="leftBottom"
    >
      <template #ignitor>
        <MsvgIcon
          :name="currIcon"
          class="w-4 h-4 p-1 cursor-pointer rounded-sm duration-200 outline-none hover:bg-zinc-100/60 dark:hover:bg-zinc-900"
          fillClass="fill-zinc-900 dark:fill-zinc-300"
        ></MsvgIcon>
      </template>
      <ul class="w-[140px] overflow-hidden">
        <li
          v-for="item in themes"
          :key="item.name"
          class="flex items-center justify-start hover:bg-zinc-100/60 dark:hover:bg-zinc-800 rounded"
          @click="store.setTheme(item.id)"
        >
          <MsvgIcon
            :name="item.icon"
            class="w-4 h-4 p-1 cursor-pointer rounded-sm duration-200 outline-none hover:bg-zinc-100/60 dark:fill-zinc-300"
            fillClass="fill-zinc-900 dark:fill-zinc-300"
          ></MsvgIcon>
          <span class="text-zinc-800 text-sm dark:text-zinc-300">{{ item.name }}</span>
        </li>
      </ul>
    </Mpopover>
  </div>
</template>

<script setup lang="ts">
import { THEME_DARK, THEME_LIGHT, THEME_SYSTEMS } from '@/constants';
import useThemeStore from '@/stores/modules/theme/index.ts';
import { ThemeType } from '@/stores/modules/theme/types';

const store = useThemeStore();
interface ThemeItem {
  id: ThemeType;
  name: string;
  icon: string;
}
const themes: ThemeItem[] = [
  { id: THEME_LIGHT, name: '极简白', icon: 'theme-light' },
  { id: THEME_DARK, name: '极简黑', icon: 'theme-dark' },
  { id: THEME_SYSTEMS, name: '跟随系统', icon: 'theme-system' }
];

const currIcon = computed(() => {
  const currItem = themes.find(item => item.id === store.themeType);
  return currItem?.icon;
});
</script>
