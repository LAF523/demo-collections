<template>
  <Msearch
    class="mr-1"
    v-model="searchVal"
    @change="handleInputChange"
    @clear="handleClear"
  >
    <template #dropDown>
      <searchTipsList
        v-show="!!searchVal"
        @item-click="handleHintClick"
        :data="hints"
        :searchVal="searchVal"
      ></searchTipsList>
      <DropDown />
    </template>
  </Msearch>
</template>

<script setup lang="ts">
import { getHint } from '@/service/main';
import searchTipsList from './searchTipsList.vue';
import { useAppStore } from '@/stores/modules/app/index.ts';
import DropDown from './dropDown/index.vue';

const { setSearchVal } = useAppStore();

const searchVal = ref<string>('');
const hints = ref<string[]>([]);

const fetchHint = async () => {
  const [data, err] = await getHint({ q: searchVal.value });
  if (err) {
    return;
  }
  hints.value = data.result;
};
const handleInputChange = useDebounceFn(() => {
  fetchHint();
}, 300);
const handleClear = () => {
  setSearchVal(searchVal.value);
};
const handleHintClick = (item: string) => {
  searchVal.value = item;
  setSearchVal(item);
};
</script>
