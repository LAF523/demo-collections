<template>
  <div>
    <!-- mask -->
    <transition name="fade">
      <div
        v-if="isShow"
        @click="closeHandler"
        class="w-screen h-screen bg-zinc-900/80 z-40 fixed top-0 left-0"
      ></div>
    </transition>
    <!-- 弹窗 -->
    <transition name="up">
      <div
        v-if="isShow"
        class="w-[80%] fixed top-1/3 left-[50%] translate-x-[-50%] z-50 px-2 py-1.5 rounded-sm border dark:border-zinc-600 cursor-pointer bg-white dark:bg-zinc-800 xl:w-[35%]"
      >
        <Mbutton
          size="small"
          class="absolute top-2 right-2 bg-white hover:bg-white text-slate-500 active:bg-white"
          @click="closeHandler"
        >
          关闭
        </Mbutton>

        <h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-200 mb-2">
          {{ title }}
        </h3>
        <div class="text-base text-zinc-900 dark:text-zinc-200 mb-2">{{ content }}</div>
        <div class="flex justify-end">
          <Mbutton
            @click="cancelHandler"
            type="info"
            class="mr-2"
            >{{ cancelText }}</Mbutton
          >
          <Mbutton
            @click="confirmHandler"
            type="primary"
            >{{ confirmText }}</Mbutton
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import Mbutton from '../button/index.vue';

export interface Props {
  title?: string;
  content: any;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  onClose?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  cancelText: '取消',
  confirmText: '确定',
  onCancel: () => {},
  onConfirm: () => {},
  onClose: () => {}
});
const isShow = ref<boolean>(false);
const duration = '0.5s';

const closeHandler = () => {
  isShow.value = false;
  setTimeout(
    () => {
      props.onClose();
    },
    parseFloat(duration) * 1000
  );
};
const show = () => {
  isShow.value = true;
};

const cancelHandler = () => {
  props.onCancel();
  closeHandler();
};

const confirmHandler = () => {
  props.onConfirm();
  closeHandler();
};

onMounted(() => {
  show();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all v-bind(duration);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.up-enter-active,
.up-leave-active {
  transition: all v-bind(duration);
}

.up-enter-from,
.up-leave-to {
  opacity: 0;
  transform: translate3d(-50%, 100px, 0);
}
</style>
