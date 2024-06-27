<template>
  <div class="py-2 h-[80vh] flex flex-col">
    <h2 class="text-xl text-zinc-900 font-bold mb-2 px-1 dark:text-zinc-200">所有分类</h2>
    <ul class="overflow-y-scroll">
      <li
        class="text-lg text-zinc-900 px-1 py-1.5 duration-100 active:bg-zinc-100 dark:text-zinc-300 ... active:dark:bg-zinc-900"
        v-for="(item, index) of categorysState"
        :key="item.id"
        @click="emit('itemClick', index)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useCategorysStore } from '@/stores/modules/categorys/index.ts';

const { categorysState } = useCategorysStore();
const emit = defineEmits(['itemClick']);
</script>
