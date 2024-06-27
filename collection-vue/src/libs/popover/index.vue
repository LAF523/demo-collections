<template>
  <div
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
    @click="handleClick"
    @focus="handleFocus"
    @blur="handleBlur"
    class="relative cursor-pointer select-none"
  >
    <div v-bind="$attrs">
      <slot name="ignitor"></slot>
    </div>
    <Transition name="content">
      <div
        v-show="isShow"
        class="absolute p-1 z-20 bg-white border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
        :style="directionEnum[direction as keyof typeof directionEnum]"
      >
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
const directionEnum = {
  top: {
    transform: `translateY(-100%)`,
    top: 0
  },
  bottom: {},
  left: {
    transform: `translate(-100%,-50%)`,
    top: '50%'
  },
  leftTop: {
    transform: `translate(-100%,-100%)`,
    top: '0'
  },
  leftBottom: {
    transform: `translateX(-100%)`
  },
  right: {
    transform: `translateY(-50%)`,
    left: '100%',
    top: '50%'
  },
  rightTop: {
    transform: `translateY(-100%)`,
    left: '100%',
    top: 0
  },
  rightBottom: {
    left: '100%'
  }
};
</script>
<script setup lang="ts">
defineOptions({
  inheritAttrs: false
});
const { trigger, direction } = defineProps({
  trigger: {
    type: String,
    default: 'hover', // 默认鼠标移入展示
    validator: (val: string) => {
      const type = ['hover', 'click', 'focus'];
      const checkRes = type.includes(val);
      if (!checkRes) {
        throw new Error(`你的trigger必须是${type.join('、')}中的一个!`);
      }
      return checkRes;
    }
  },
  direction: {
    type: String,
    default: 'bottom', // 默认下方展示
    validator: (val: string) => {
      const type = Object.keys(directionEnum);
      const checkRes = type.includes(val);
      if (!checkRes) {
        throw new Error(`你的direction必须是${type.join('、')}中的一个!`);
      }
      return checkRes;
    }
  }
});

const isShow = ref(false);
const hoverWait = 100; // 移入目标转换时,卡片消失问题
let timer: any;
const handleEnter = () => {
  if (trigger === 'hover') {
    clearInterval(timer);
    isShow.value = true;
  }
};
const handleLeave = () => {
  if (trigger === 'hover') {
    timer = setTimeout(() => {
      isShow.value = false;
    }, hoverWait);
  }
};
const handleClick = () => {
  if (trigger === 'click') {
    isShow.value = !isShow.value;
  }
};
const handleFocus = () => {
  if (trigger === 'focus') {
    isShow.value = true;
  }
};
const handleBlur = () => {
  if (trigger === 'focus') {
    isShow.value = false;
  }
};
</script>

<style scoped lang="less">
.content-enter-active,
.content-leave-active {
  transition: 0.5s;
}

.content-enter-from,
.content-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}

.content-enter-to,
.content-leave-from {
  opacity: 1;
}
</style>
