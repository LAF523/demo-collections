<template>
  <!-- 路由组件 -->
  <router-view
    v-slot="{ Component }"
    :class="[isBeginMove ? `fixed top-0 left-0` : '']"
  >
    <!-- 动画过渡 -->
    <transition
      :name="transitionName"
      @before-enter="beforeEnter"
      @after-leave="afterLeave"
    >
      <!-- 缓存组件 -->
      <KeepAlive :include="cacheTask">
        <component
          :is="Component"
          :key="$route.fullPath"
        />
      </KeepAlive>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
const props = defineProps<{
  transitionName: 'push' | 'back' | 'none';
  rootName: string;
}>();
const router = useRouter();
const isBeginMove = ref(false);
const beforeEnter = () => {
  isBeginMove.value = true;
};
const afterLeave = () => {
  isBeginMove.value = false;
};

const cacheTask = ref([props.rootName]);
router.beforeEach(to => {
  const needCache = props.transitionName === 'push';
  const needPop = props.transitionName === 'back';
  if (needCache) {
    cacheTask.value.push(to.name as string);
  } else if (needPop) {
    cacheTask.value.pop();
  }
  const isHomePage = to.name === props.rootName;
  if (isHomePage) {
    clearTask();
  }
});
function clearTask() {
  cacheTask.value = [props.rootName];
}
</script>

<style lang="less">
// push页面时：新页面的进入动画
.push-enter-active {
  animation-name: push-in;
  animation-duration: 0.5s;
}
// push页面时：老页面的退出动画
.push-leave-active {
  animation-name: push-out;
  animation-duration: 0.5s;
}
// push页面时：新页面的进入动画
@keyframes push-in {
  0% {
    transform: translate(100%, 0);
  }

  100% {
    transform: translate(0, 0);
  }
}
// push页面时：老页面的退出动画
@keyframes push-out {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(-50%, 0);
  }
}

// 后退页面时：即将展示的页面动画
.back-enter-active {
  animation-name: back-in;
  animation-duration: 0.5s;
}
// 后退页面时：后退的页面执行的动画
.back-leave-active {
  animation-name: back-out;
  animation-duration: 0.5s;
}
// 后退页面时：即将展示的页面动画
@keyframes back-in {
  0% {
    width: 100%;
    transform: translate(-100%, 0);
  }

  100% {
    width: 100%;
    transform: translate(0, 0);
  }
}
// 后退页面时：后退的页面执行的动画
@keyframes back-out {
  0% {
    width: 100%;
    transform: translate(0, 0);
  }

  100% {
    width: 100%;
    transform: translate(50%, 0);
  }
}
</style>
