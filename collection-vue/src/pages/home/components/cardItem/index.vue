<template>
  <div
    class="bg-white dark:bg-zinc-900 xl:dark:bg-zinc-800 rounded pb-1"
    :class="[`w-[${width}px]`]"
    @click="handleClick"
  >
    <div class="relative w-full rounded cursor-zoom-in group">
      <img
        v-lazy:autoBg
        class="w-full rounded bg-transparent"
        :src="cardInfo.photo"
        :style="{ height: width ? `${(width / cardInfo.photoWidth) * cardInfo.photoHeight}px` : 'auto' }"
        ref="imgRef"
      />
      <div
        class="hidden opacity-0 w-full h-full bg-zinc-900/50 absolute top-0 left-0 rounded duration-300 group-hover:opacity-100 xl:block"
      >
        <Mbutton class="absolute top-1.5 left-1.5">分享</Mbutton>
        <Mbutton
          class="absolute top-1.5 right-1.5"
          icon="heart"
          fillClass="fill-zinc-900 dark:fill-zinc-200"
          type="info"
        ></Mbutton>
        <Mbutton
          class="absolute bottom-1.5 left-1.5 bg-zinc-100/70"
          icon="download"
          size="small"
          fillClass="fill-zinc-900 dark:fill-zinc-200"
          type="info"
          @click="handleDownLoad"
        ></Mbutton>
        <Mbutton
          class="absolute bottom-1.5 right-1.5 bg-zinc-100/70"
          icon="full"
          size="small"
          fillClass="fill-zinc-900 dark:fill-zinc-200"
          type="info"
          @click="onImgFullScreen"
        ></Mbutton>
      </div>
    </div>
    <p class="text-sm mt-1 font-bold text-zinc-900 dark:text-zinc-300 line-clamp-2 px-1">{{ cardInfo.title }}</p>
    <div class="flex items-center mt-1 px-1">
      <img
        v-lazy:autoBg
        class="h-2 w-2 rounded-full"
        :src="cardInfo.avatar"
        alt=""
      />
      <span class="text-sm text-zinc-500 ml-1">{{ cardInfo.author }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { download } from '@/utils/download';
import { CardInfo } from './type';

const props = defineProps<{
  cardInfo: CardInfo;
  width?: number;
}>();
const emits = defineEmits(['click']);

const imgRef = ref(null);

const { enter: onImgFullScreen } = useFullscreen(imgRef);

const handleDownLoad = () => {
  // window.open(props.cardInfo.photoDownLink);
  // window.location.href = props.cardInfo.photoDownLink;
  download(String(Date.now()), props.cardInfo.photoDownLink);
};

const {
  x: imgContainerX,
  y: imgContainerY,
  width: imgContainerWidth,
  height: imgContainerHeight
} = useElementBounding(imgRef);
const imgContainerCenter = computed(() => {
  return {
    translateX: imgContainerX.value + imgContainerWidth.value / 2,
    translateY: imgContainerY.value + imgContainerHeight.value / 2
  };
});

const handleClick = () => {
  emits('click', {
    id: props.cardInfo.id,
    center: imgContainerCenter
  });
};
</script>
