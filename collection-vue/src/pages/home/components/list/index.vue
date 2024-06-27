<template>
  <MinfiniteList
    v-model="isLoading"
    @load="fetch"
    :isFinished="isFinished"
  >
    <Mwaterfall
      class="px-1"
      :data="cardInfos"
      :picturePreReading="true"
      :col="5"
    >
      <template #default="{ item, width }">
        <CardItem
          :cardInfo="item"
          :width="width"
        ></CardItem>
      </template>
    </Mwaterfall>
  </MinfiniteList>
</template>

<script setup lang="ts">
import { getPexelsList } from '@/service/main';
import CardItem from '../cardItem/index.vue';
import { CardInfo } from '../cardItem/type';

const isLoading = ref(false);
const isFinished = ref(false);

const cardInfos = ref<CardInfo[]>([]);
const params = ref({ page: 0, size: 20 });
async function fetch() {
  if (isFinished.value) {
    return;
  }
  isLoading.value = true;
  params.value.page += 1;
  const [data, err] = await getPexelsList(params.value);
  if (err) {
    return;
  }
  cardInfos.value.push(...data.list);
  isFinished.value = cardInfos.value.length === data.total;
  isLoading.value = false;
}
</script>
