<template>
  <div>
    <!-- 蒙版 -->
    <transition name="fade">
      <div
        v-if="isVisable"
        @click="close"
        class="w-screen h-screen bg-zinc-900/80 z-40 fixed top-0 left-0"
      ></div>
    </transition>
    <!-- 内容 -->
    <transition name="up">
      <div
        v-if="isVisable"
        class="max-w-[80%] max-h-[80%] overflow-auto fixed top-[10%] left-[50%] translate-x-[-50%] z-50 px-2 py-1.5 rounded-sm border dark:border-zinc-600 cursor-pointer bg-white dark:bg-zinc-800 xl:min-w-[35%]"
      >
        <!-- 标题 -->
        <div
          class="text-lg font-bold text-zinc-900 dark:text-zinc-200 mb-2"
          v-if="title"
        >
          {{ title }}
        </div>
        <!-- 内容 -->
        <div class="text-base text-zinc-900 dark:text-zinc-200 mb-2">
          <slot />
        </div>
        <!-- 按钮 -->
        <div
          class="flex justify-end"
          v-if="onConfirm || onCancel"
        >
          <Mbutton
            type="info"
            class="mr-2"
            @click="cancel"
            v-if="onCancel"
            >{{ cancelText || '取消' }}</Mbutton
          >
          <Mbutton
            type="primary"
            @click="confirm"
            v-if="onConfirm"
            >{{ confirmText || '确定' }}</Mbutton
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  confirmText?: string;
  cancelText?: string;
  title?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}
defineProps<Props>();
const emits = defineEmits(['onConfirm', 'onCancel', 'onClose']);
const isVisable = defineModel<boolean>();

const close = () => {
  isVisable.value = false;
  emits('onClose');
};

const confirm = () => {
  emits('onConfirm');
};
const cancel = () => {
  emits('onCancel');
  close();
};
</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.up-enter-active,
.up-leave-active {
  transition: all 0.3s;
}

.up-enter-from,
.up-leave-to {
  opacity: 0;
  transform: translate3d(-50%, 100px, 0);
}
</style>
