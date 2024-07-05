<template>
  <Header class="h-header"></Header>
  <div class="h-main">
    <Main></Main>
  </div>
  <Floating class="fixed bottom-5 right-1"></Floating>
</template>
<script setup lang="ts">
import Header from './components/header/index.vue';
import Floating from './components/floating/index.vue';
import Main from './components/main/index.vue';
</script>
