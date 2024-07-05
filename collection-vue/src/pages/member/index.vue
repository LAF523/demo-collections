<template>
  <div class="h-full bg-zinc-200 dark:bg-zinc-800 duration-400 xl:pt-1">
    <div
      class="max-w-screen-lg mx-auto bg-white dark:bg-zinc-900 duration-400 xl:rounded-sm xl:border-zinc-200 xl:dark:border-zinc-600 xl:border-[1px] xl:px-4"
    >
      <div class="py-2 px-1">
        <h2 class="text-center text-[34px] font-bold tracking-widest text-yellow-600">精选VIP</h2>
        <p class="text-center text-lg text-yellow-500">升级精选VIP，畅想所有内容</p>
        <div
          class="flex justify-between mt-5 overflow-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent"
        >
          <PayMenuItem
            v-for="item in vipPayListData"
            :key="item.id"
            :hot="item.isHot"
            :select="item.id === currentPayData.id"
            :data="item"
            @click="onChangeCurrentPay"
          ></PayMenuItem>
        </div>
        <p class="mt-1 text-sm text-zinc-500">{{ currentPayData.desc }}</p>
        <!-- 支付 -->
        <McountDown :downTime="60 * 1000"></McountDown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from '@/libs/message';
import PayMenuItem from './components/payMenuItem/index.vue';
import { getVip } from '@/service/main';

const currentPayData = ref();
const vipPayListData = ref<any>([]);
const onChangeCurrentPay = (item: any) => {
  currentPayData.value = item;
};

onMounted(async () => {
  const [data, err] = await getVip();
  if (err) {
    message({ type: 'error', content: err });
  }
  vipPayListData.value = data;
});
</script>
<script lang="ts">
export default {
  name: 'Member'
};
</script>

<style scoped></style>
