<template>
  <div>
    <PcNav v-if="!isMobile" />
    <MobileBar v-else />
    <div class="max-w-screen-xl mx-auto relative m-1 xl:mt-4">
      <List></List>
    </div>
    <MtriggerMenu
      v-if="isMobile"
      class="fixed bottom-6 m-auto left-0 right-0 w-[220px]"
    >
      <MtriggerMenuItem
        icon="home"
        iconClass="fill-zinc-900 dark:fill-zinc-200"
        path="/"
      >
        首页
      </MtriggerMenuItem>
      <MtriggerMenuItem
        v-if="state.token"
        icon="vip"
        iconClass="fill-zinc-400 dark:fill-zinc-500"
        textClass="text-zinc-400 dark:text-zinc-500"
        path="/vip"
        @click="onVipClick"
      >
        VIP
      </MtriggerMenuItem>
      <MtriggerMenuItem
        icon="profile"
        iconClass="fill-zinc-400 dark:fill-zinc-500"
        textClass="text-zinc-400 dark:text-zinc-500"
        @click="onMyClick"
      >
        {{ state.token ? '我的' : '去登录' }}
      </MtriggerMenuItem>
    </MtriggerMenu>
  </div>
</template>

<script setup lang="ts">
import List from './components/list/index.vue';
import PcNav from '@/layout/pc/components/pcNav/index.vue';
import MobileBar from '@/layout/mobile/components/mobileNav/index.vue';
import { isMobile } from '@/utils/flexible.ts';

import { useUserStore } from '@/stores/modules/user';
import { useAppStore } from '@/stores/modules/app';

const userStore = useUserStore();
const appStore = useAppStore();
const { setRouterChangeType } = appStore;
const { state } = userStore;
const router = useRouter();

const onVipClick = () => {};
const onMyClick = () => {
  if (state.token) {
    setRouterChangeType('push');
    router.push('/profile');
  } else {
    router.push('/login');
  }
};
</script>

<script lang="ts">
export default {
  name: 'Home'
};
</script>
