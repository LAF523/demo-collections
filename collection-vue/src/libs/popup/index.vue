<template>
  <Teleport to="body">
    <Transition name="mask">
      <div
        v-if="modelValue"
        class="h-screen w-screen bg-slate-800/80 fixed top-0 left-0 z-50"
        @click="closePopup"
      ></div>
    </Transition>
    <Transition name="con">
      <div
        class="bg-white z-50 fixed bottom-0 w-screen dark:bg-zinc-800"
        v-if="modelValue"
        v-bind="$attrs"
      >
        <slot></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// const props = defineProps<{
//   modelValue: boolean;
// }>();
// const emit = defineEmits(['update:modelValue']);
const modelValue = defineModel<boolean>();
const closePopup = () => {
  modelValue.value = false;
};

// 锁定屏幕滚动
const isSrcollLock = useScrollLock(document.body);
watch(modelValue, isOpen => {
  if (isOpen) {
    isSrcollLock.value = true;
  } else {
    isSrcollLock.value = false;
  }
});
</script>

<style scoped>
.mask-enter-from,
.mask-leave-to {
  opacity: 0;
}

.mask-leave-active,
.mask-enter-active,
.con-leave-active,
.con-enter-active {
  transition: all 0.3s;
}

.con-enter-from,
.con-leave-to {
  transform: translateY(100%);
}
</style>
