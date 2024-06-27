<template>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { useCategorysStore } from '@/stores/modules/categorys';

const { fetchCategotys } = useCategorysStore();
fetchCategotys();
</script>
