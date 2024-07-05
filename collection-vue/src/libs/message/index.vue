<template>
  <Transition name="message">
    <div
      v-if="isShow"
      class="m-message fixed left-[50%] translate-x-[-50%] z-50 flex items-center px-2 py-1 rounded-sm border cursor-pointer"
      :class="styleEnum[type].containerClass"
      :style="{ top: `${top}px` }"
    >
      <MsvgIcon
        :name="styleEnum[type].icon"
        class="w-1.5 h-1.5 mr-1.5"
        :fillClass="styleEnum[type].fillClass"
      ></MsvgIcon>
      <span
        class="text-sm"
        :class="styleEnum[type].textClass"
      >
        {{ content ? content : type }}
      </span>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import MsvgIcon from '../svgIcon/index.vue';

const styleEnum = {
  // 警告
  warn: {
    icon: 'warn',
    fillClass: 'fill-warn-300',
    textClass: 'text-warn-300',
    containerClass: 'bg-warn-100 border-warn-200  hover:shadow-lg hover:shadow-warn-100'
  },
  // 错误
  error: {
    icon: 'error',
    fillClass: 'fill-error-300',
    textClass: 'text-error-300',
    containerClass: 'bg-error-100 border-error-200  hover:shadow-lg hover:shadow-error-100'
  },
  // 成功
  success: {
    icon: 'success',
    fillClass: 'fill-success-300',
    textClass: 'text-success-300',
    containerClass: 'bg-success-100 border-success-200  hover:shadow-lg hover:shadow-success-100'
  },
  info: {
    icon: 'success',
    fillClass: 'fill-success-300',
    textClass: 'text-success-300',
    containerClass: 'bg-success-100 border-success-200  hover:shadow-lg hover:shadow-success-100'
  }
};

const props = withDefaults(
  defineProps<{
    type: 'success' | 'warn' | 'info' | 'error';
    content?: string;
    duration?: number;
    top: number;
    hidden: () => void;
  }>(),
  {
    content: '',
    duration: 1000
  }
);

const isShow = ref(false);
const time = '0.5s';

const show = () => {
  isShow.value = true;
};

onMounted(() => {
  show();
  setTimeout(
    () => {
      // isShow.value = false;
      setTimeout(
        () => {
          // props.hidden();
        },
        parseFloat(time) * 1000
      );
    },
    props.duration + parseFloat(time) * 1000
  );
});
</script>

<style scoped>
.message-enter-active,
.message-leave-active {
  transition: all v-bind(time);
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translateY(v-bind(-(props.top + 50) + 'px'));
}
</style>
