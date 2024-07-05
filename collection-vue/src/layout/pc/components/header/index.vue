<template>
  <div class="w-full bg-white border-b border-b-zinc-200 px-2 py-1 dark:bg-zinc-800 dark:border-b-zinc-700">
    <div class="flex items-center">
      <img
        v-lazy
        class="h-4 cursor-pointer mr-2"
        src="https://m.imooc.com/static/wap/static/common/img/logo-small@2x.png"
        @click="goHome"
      />
      <HeaderSearch></HeaderSearch>
      <HeaderThem></HeaderThem>
      <HeaderMy class="mr-1"></HeaderMy>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderMy from './components/headerMy.vue';
import HeaderSearch from './components/headerSearch.vue';
import HeaderThem from './components/headerThem.vue';

const router = useRouter();
const goHome = () => {
  router.push('/');
};
</script>
