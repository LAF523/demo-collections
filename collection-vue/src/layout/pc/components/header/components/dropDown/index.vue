<template>
  <div>
    <div class="flex items-center text-xs mb-1 text-zinc-400">
      <p class="text-left">搜索历史</p>
      <Mbutton
        icon="delete"
        size="small"
        class="bg-white hover:bg-slate-300"
        color="text-zinc-400"
        @click="deleteAll"
      ></Mbutton>
    </div>
    <SearchHistory />
  </div>
  <div>
    <p class="text-left">热门精选</p>
  </div>
</template>

<script setup lang="ts">
import SearchHistory from './searchHistory.vue';
import { confirm } from '@/libs/index.ts';

const deleteAll = () => {
  confirm({
    title: '测试标题',
    content: '测试内容',
    onCancel: () => {},
    onConfirm: () => {}
  });
};
</script>
