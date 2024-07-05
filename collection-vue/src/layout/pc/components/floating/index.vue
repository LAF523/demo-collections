<template>
  <div class="fixed bottom-10 right-2">
    <!-- 引导页 -->
    <div
      class="guide-start w-4 h-4 mb-1 bg-white dark:bg-zinc-900 border dark:border-0 border-zinc-200 rounded-full flex justify-center items-center cursor-pointer duration-200 group hover:shadow-lg"
    >
      <MsvgIcon
        name="guide"
        class="w-2 h-2"
        fillClass="fill-zinc-900 dark:fill-zinc-200 group-hover:fill-main "
      ></MsvgIcon>
    </div>
    <div
      class="guide-start w-4 h-4 mb-1 bg-white dark:bg-zinc-900 border dark:border-0 border-zinc-200 rounded-full flex justify-center items-center cursor-pointer duration-200 group hover:shadow-lg"
    >
      <MsvgIcon
        name="feedback"
        class="w-1.5 h-1.5 mr-1"
        fillClass="fill-zinc-900 dark:fill-zinc-300"
        @click="feedback"
      ></MsvgIcon>
    </div>
    <!-- 反馈 -->
    <Mpopover
      class="flex items-center guide-feedback"
      placement="left"
    >
      <template #reference>
        <div
          class="w-4 h-4 bg-white dark:bg-zinc-900 border dark:border-0 border-zinc-200 rounded-full flex justify-center items-center cursor-pointer duration-200 group hover:shadow-lg"
        >
          <MsvgIcon
            name="feedback"
            class="w-2 h-2"
            fillClass="fill-zinc-900 dark:fill-zinc-200 group-hover:fill-main "
          ></MsvgIcon>
        </div>
      </template>

      <div class="w-[140px] overflow-hidden">
        <div class="flex items-center p-1 cursor-pointer rounded hover:bg-zinc-100/60 dark:hover:bg-zinc-800">
          <MsvgIcon
            name="feedback"
            class="w-1.5 h-1.5 mr-1"
            fillClass="fill-zinc-900 dark:fill-zinc-300"
          ></MsvgIcon>
          <span class="text-zinc-800 dark:text-zinc-300 text-sm">立即吐槽</span>
        </div>
      </div>
    </Mpopover>
  </div>
</template>

<script setup lang="ts">
import { FEEDBACK_URL } from '@/constants/index.ts';

const feedback = () => {
  window.open(FEEDBACK_URL, '__blank');
};
</script>
