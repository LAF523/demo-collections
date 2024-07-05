<template>
  <MinfiniteList
    :isLoading="isLoading"
    @load="fetch"
    :isFinished="isFinished"
  >
    <Mwaterfall
      class="px-1"
      :data="cardInfos"
      :picturePreReading="true"
      :col="isMobile ? 2 : 5"
    >
      <template #default="{ item, width }">
        <CardItem
          ref="detailRef"
          :cardInfo="item"
          :width="width"
          @click="goItemDetail"
        ></CardItem>
      </template>
    </Mwaterfall>
  </MinfiniteList>
  <Transition
    :css="false"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <ItemDetail
      v-if="isDetailShow"
      :id="currentCard!.id"
    />
  </Transition>
</template>

<script setup lang="ts">
import gsap from 'gsap';
import { PexelsList, getPexelsList } from '@/service/main';
import CardItem from '../cardItem/index.vue';
import { CardInfo } from '../cardItem/type';
import { useAppStore } from '@/stores/modules/app/index.ts';
import { isMobile } from '@/utils/flexible.ts';
import ItemDetail from '../../../itemDetail/index.vue';

const { appState } = useAppStore();

const isLoading = ref(false);
const isFinished = ref(false);

const cardInfos = ref<CardInfo[]>([]);
const params = ref<PexelsList>({ page: 0, size: 20 });
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

const resetQuery = (newQuery: PexelsList) => {
  isLoading.value = false;
  cardInfos.value = [];
  params.value = newQuery;
  fetch();
};

watch([() => appState.value.currCategory, () => appState.value.searchVal], () => {
  resetQuery({
    page: 0,
    size: 20,
    categoryId: appState.value.currCategory.id,
    searchText: appState.value.searchVal
  });
});

const isDetailShow = ref(false);
const currentCard = ref<{
  id: string;
  center: {
    translateX: number;
    translateY: number;
  };
}>();

const goItemDetail = (card: {
  id: string;
  center: {
    translateX: number;
    translateY: number;
  };
}) => {
  currentCard.value = card;
  isDetailShow.value = true;
  // eslint-disable-next-line no-restricted-globals
  history.pushState(null, '', `/pints/${currentCard.value!.id}`);
};
useEventListener(window, 'popstate', () => {
  isDetailShow.value = false;
});

const beforeEnter = (el: gsap.TweenTarget) => {
  gsap.set(el, {
    scaleX: 0,
    scaleY: 0,
    transformOrigin: '0 0',
    translateX: currentCard.value!.center.translateX,
    translateY: currentCard.value!.center.translateY,
    opacity: 0
  });
};
const enter = (el: gsap.TweenTarget, done: gsap.Callback) => {
  gsap.to(el, {
    duration: 0.3,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    translateX: 0,
    translateY: 0,
    onComplete: done
  });
};
const leave = (el: gsap.TweenTarget) => {
  gsap.to(el, {
    duration: 0.3,
    scaleX: 0,
    scaleY: 0,
    x: currentCard.value!.center.translateX,
    y: currentCard.value!.center.translateY,
    opacity: 0
  });
};
</script>
