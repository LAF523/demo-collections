<template>
  <div
    class="w-5 flex flex-col items-center justify-center mx-0.5"
    @click="onItemClick"
  >
    <MsvgIcon
      :name="icon"
      :fillClass="iconClass"
      class="w-2 h-2"
    ></MsvgIcon>
    <p
      class="text-sm mt-0.5"
      :class="textClass"
    >
      <slot />
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  iconClass: string;
  textClass?: string;
  path?: string;
}
const props = withDefaults(defineProps<Props>(), {
  textClass: `text-zinc-900 dark:text-zinc-200`
});
const emits = defineEmits(['click']);

const router = useRouter();

const onItemClick = () => {
  if (props.path) {
    router.push(`${props.path}`);
  }
  emits('click');
};
</script>
