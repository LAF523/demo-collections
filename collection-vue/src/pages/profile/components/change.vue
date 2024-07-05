<template>
  <div class="overflow-auto flex flex-col items-center">
    <img
      class=""
      ref="imgRef"
      :src="blob"
    />

    <Mbutton
      class="mt-4 w-[80%] xl:w-1/2"
      @click="onConfirmClick"
      :isActiveAnim="false"
      >确定</Mbutton
    >
  </div>
</template>

<script setup lang="ts">
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import { isMobile } from '@/utils/flexible.ts';

defineProps<{
  blob: string;
}>();

const emits = defineEmits(['close']);
const cropper = ref();

/**
 * 关闭事件
 */
const close = () => {
  emits('close');
};
/**
 * 确定按钮点击事件
 */
const onConfirmClick = () => {
  cropper.value.getCroppedCanvas().toBlob((blob: any) => {
    // 裁剪后的 blob 地址
    URL.createObjectURL(blob);
    close();
  });
};

const imgRef = ref<HTMLCanvasElement>();
// 移动端配置对象
const mobileOptions = {
  // 将裁剪框限制在画布的大小
  viewMode: 1,
  // 移动画布，裁剪框不动
  dragMode: 'move',
  // 裁剪框固定纵横比：1:1
  aspectRatio: 1,
  // 裁剪框不可移动
  cropBoxMovable: false,
  // 不可调整裁剪框大小
  cropBoxResizable: false
};

// PC 端配置对象
const pcOptions = {
  // 裁剪框固定纵横比：1:1
  aspectRatio: 1
};

onMounted(() => {
  const options = isMobile ? mobileOptions : pcOptions;
  cropper.value = new Cropper(imgRef.value as HTMLCanvasElement, options);
});
</script>
