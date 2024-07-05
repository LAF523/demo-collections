<template>
  <div>
    <slot />
    <!-- 列表底部标志位 -->
    <div ref="signRef">
      <!-- 加载更多 -->
      <MsvgIcon
        v-show="isLoading"
        class="w-4 h-4 mx-auto animate-spin"
        name="infinite-load"
      ></MsvgIcon>
      <!-- 没有更多数据了 -->
      <p
        v-if="isFinished"
        class="text-center text-base text-zinc-400"
      >
        已经没有更多数据了!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';

const props = defineProps<{
  isFinished: boolean;
  isLoading: boolean;
}>();
const emits = defineEmits(['load']);

const isInViewPort = ref(false);
const signRef = ref(null);
useIntersectionObserver(signRef, ([{ isIntersecting }]) => {
  isInViewPort.value = isIntersecting;
  emitLoad();
});

function emitLoad() {
  const needLoad = isInViewPort.value && !props.isFinished && !props.isLoading;
  if (needLoad) {
    emits('load');
  }
}

watch(
  () => props.isLoading,
  () => {
    setTimeout(() => {
      emitLoad();
    }, 100);
  }
);
</script>
