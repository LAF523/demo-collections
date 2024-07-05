<template>
  <ul>
    <li
      v-for="item of data"
      :key="item"
      @click="$emit('item-click', item)"
      v-html="heightLight(searchVal, item)"
      class="py-1 pl-1 text-base font-bold text-zinc-500 rounded cursor-pointer duration-300 hover:bg-zinc-200 dark:hover:bg-zinc-900"
    ></li>
  </ul>
</template>

<script setup lang="ts">
interface Props {
  data: string[];
  searchVal: string;
}

const props = defineProps<Props>();
defineEmits(['item-click']);

const heightLight = (searchVal: string, item: string) => {
  const reg = new RegExp(searchVal, 'gi');
  return item.replaceAll(reg, `<span class="text-zinc-900 dark:text-zinc-200">${props.searchVal}</span>`);
};
</script>
