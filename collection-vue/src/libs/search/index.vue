<template>
  <div
    class="group w-full relative rounded-xl border-white duration-500 hover:bg-red-100/40"
    ref="dropDownRef"
  >
    <MsvgIcon
      name="search"
      class="w-1.5 h-1.5 absolute translate-y-[-50%] top-[50%] left-2"
      color="#707070"
    ></MsvgIcon>
    <input
      v-model="inputVal"
      v-bind="$attrs"
      @focus="handleFocus"
      class="dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 dark:group-hover:bg-zinc-900 dark:group-hover:border-zinc-700 block w-full h-[44px] pl-4 text-sm outline-0 bg-zinc-100 caret-zinc-400 rounded-xl text-zinc-900 tracking-wide font-semibold border border-zinc-100 duration-500 group-hover:bg-white group-hover:border-zinc-200 focus:border-red-300"
    />
    <MsvgIcon
      name="input-delete"
      class="absolute right-5 w-1.5 h-1.5 top-[50%] translate-y-[-50%]"
      v-if="isShowClear"
      @click="handleClear"
    ></MsvgIcon>
    <Mbutton
      class="opacity-0 absolute translate-y-[-50%] top-[50%] rounded-[50%] right-0 group-hover:opacity-100 duration-500"
      icon="search"
      iconColor="#ffffff"
      fillClass="w-1.5 h-1.5"
      @click="handleSearch"
    />
    <!-- 下拉面板,传递dropDown具名插槽时才展示 -->
    <Transition name="history">
      <div
        v-if="slots.dropDown"
        v-show="isFocus"
        class="dark:bg-zinc-800 dark:border-zinc-600 max-h-[368px] p-2 border border-zinc-200 overflow-auto text-base z-20 absolute left-0 -bottom-8 w-full rounded-sm bg-white hover:shadow-2xl"
      >
        <slot name="dropDown"></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const slots = useSlots();
const inputVal = defineModel<string, 'trim'>('inputVal');
const props = withDefaults(
  defineProps<{
    showClear?: boolean;
  }>(),
  {
    showClear: () => true
  }
);
const emit = defineEmits(['search', 'clear', 'focus']);

const isShowClear = computed(() => {
  return props.showClear && !!inputVal.value?.length;
});
const handleClear = () => {
  inputVal.value = '';
  emit('clear');
};

const isFocus = ref<boolean>(false);
const handleFocus = () => {
  isFocus.value = true;
  emit('focus', inputVal.value);
};
const dropDownRef = ref();
onClickOutside(dropDownRef, () => {
  isFocus.value = false;
});

const handleSearch = () => {
  emit('search', inputVal.value);
};
</script>

<style scoped lang="less">
.history-enter-from,
.history-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.history-enter-to,
.history-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.history-enter-active,
.history-leave-active {
  transition: all 0.3s;
}
</style>
