<template>
  <div class="fixed left-0 top-0 w-screen h-screen text-xl bg-slate-500 z-20">
    {{ id || $route.params.id }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>
