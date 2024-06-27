<template>
  <button
    :class="[typeEnum[type], sizeEnum[size].button, { 'active:scale-105': isActiveAnim }]"
    class="text-sm text-center rounded duration-150 flex justify-center items-center"
    @click.stop="handleClick"
  >
    <MsvgIcon
      v-if="loading"
      name="loading"
      class="w-2 h-2 animate-spin mr-1"
    ></MsvgIcon>
    <MsvgIcon
      v-if="icon"
      :name="icon"
      :color="iconColor"
      :fillClass="fillClass"
      :class="[sizeEnum[size].icon]"
    ></MsvgIcon>
    <slot v-else></slot>
  </button>
</template>

<script lang="ts"></script>
<script setup lang="ts">
/* 通用button
参数:
  icon: icon按钮,文字按钮
  type: 风格 info,primary,main
  size: big normal small
  loading: 是否显示加载
事件:
  click: 点击
样式:
  鼠标点击: 放大
  鼠标移入: 高亮
*/

interface Props {
  icon?: string;
  type?: 'info' | 'primary' | 'main';
  size?: 'big' | 'normal' | 'small';
  loading?: boolean;
  isActiveAnim?: boolean;
  fillClass?: string;
  iconColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  type: 'main',
  size: 'normal',
  loading: false,
  isActiveAnim: true,
  fillClass: '',
  iconColor: ''
});
interface TypeEnum {
  info: string;
  main: string;
  primary: string;
}
type SizeEnum = {
  [key in 'big' | 'normal' | 'small']: {
    icon: string;
    button: string;
  };
};

const typeEnum: TypeEnum = {
  info: 'text-zinc-800 bg-zinc-200 hover:bg-zinc-300 active:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700',
  main: 'text-white  bg-main hover:bg-hover-main active:bg-main dark:bg-zinc-900 dark:hover:bg-zinc-700  dark:active:bg-zinc-700',
  primary:
    'text-white  bg-zinc-800 hover:bg-zinc-900 active:bg-zinc-800 dark:bg-zinc-900  dark:hover:bg-zinc-700  dark:active:bg-zinc-700'
};
const sizeEnum: SizeEnum = {
  big: props.icon ? { icon: 'w-4 h-4', button: 'w-8 h-8' } : { icon: '', button: 'w-8 h-5' },
  normal: props.icon
    ? {
        button: 'w-4 h-4',
        icon: 'w-1.5 h-1.5'
      }
    : {
        button: 'w-8 h-4 text-base',
        icon: ''
      },
  small: props.icon
    ? { icon: 'w-1.5 h-1.5', button: 'w-3 h-3' }
    : {
        button: 'w-7 h-3 text-base',
        icon: ''
      }
};

function validator(target: 'type' | 'size', range: string[]) {
  if (!range.includes(props[target])) {
    throw new Error(`你的 ${target} 必须是 ${range.join('、')} 中的一个`);
  }
}
validator('type', Object.keys(typeEnum));
validator('size', Object.keys(sizeEnum));

const emit = defineEmits(['click']);
function handleClick() {
  if (props.loading) {
    return;
  }
  emit('click');
}
</script>
