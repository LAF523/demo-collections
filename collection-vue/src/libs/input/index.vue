<template>
  <div class="relative">
    <input
      v-if="type === 'text'"
      class="border-gray-200 dark:border-zinc-600 dark:bg-zinc-800 duration-100 dark:text-zinc-400 border-[1px] outline-0 py-0.5 px-1 text-sm rounded-sm focus:border-blue-400 w-full"
      type="text"
      v-model="inputVal"
      :maxlength="max"
    />
    <textarea
      v-if="type === 'textarea'"
      v-model="inputVal"
      :maxlength="max"
      rows="5"
      class="border-gray-200 dark:border-zinc-600 dark:bg-zinc-800 duration-100 dark:text-zinc-400 border-[1px] outline-0 py-0.5 px-1 text-sm rounded-sm focus:border-blue-400 w-full"
    ></textarea>
    <span
      v-if="max"
      class="absolute right-1 bottom-0.5 text-zinc-400 text-xs"
      :class="{ 'text-red-700': currLen >= parseInt(max) }"
      >{{ currLen }} / {{ max }}</span
    >
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'text' | 'textarea';
  max?: string;
}
const inputVal = defineModel<string>();
withDefaults(defineProps<Props>(), {
  type: 'text'
});
const currLen = computed(() => Number(inputVal?.value?.length));
</script>
