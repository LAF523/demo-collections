<template>
  <div class="h-full overflow-auto bg-white dark:bg-zinc-800 duration-500">
    <PcNav></PcNav>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import PcNav from '../pcNav/index.vue';
</script>
