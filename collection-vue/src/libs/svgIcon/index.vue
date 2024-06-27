<template>
  <svg aria-hidden="true">
    <use
      :xlink:href="symbolId"
      :fill="props.color"
      :class="props.fillClass"
    />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  color?: string;
  fillClass?: string;
}>();
const symbolId = computed(() => {
  return `#icon-${props.name}`;
});
</script>
