<template>
  <div>
    <MtransitionRouterView
      :transitionName="appState.routerChangeType"
      rootName="Home"
    ></MtransitionRouterView>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app';

const { appState } = useAppStore();
</script>
