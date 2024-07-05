<template>
  <p>{{ formatTime }}</p>
</template>

<script setup lang="ts">
import dayjs from './utils.ts';

interface Props {
  downTime: number;
  format?: string;
  unit?: number;
}
const props = withDefaults(defineProps<Props>(), {
  format: 'HH:mm:ss',
  unit: 1000
});
const emits = defineEmits(['onFinish', 'change']);

let timer: any;
const duration = ref(0);

const close = () => {
  if (timer) {
    clearInterval(timer);
  }
};
const start = () => {
  close();
  timer = setInterval(() => {
    duration.value -= props.unit;
    emits('change', duration.value);
    if (duration.value <= 0) {
      close();
      emits('onFinish');
    }
  }, props.unit);
};

watch(
  () => props.downTime,
  (val: number) => {
    duration.value = val;
    start();
  },
  {
    immediate: true
  }
);

const formatTime = computed(() => {
  return dayjs.duration(duration.value).format(props.format);
});

onUnmounted(() => {
  close();
});
</script>
