<template>
  <Mpopover
    trigger="hover"
    direction="leftBottom"
    class="flex items-center"
  >
    <template #ignitor>
      <div
        class="relative flex items-center p-0.5 rounded-sm cursor-pointer duration-200 outline-none hover:bg-zinc-100 dark:hover:bg-zinc-900"
      >
        <img
          v-lazy:autoBg
          class="w-3 h-3 rounded-sm"
          src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic_source%2F0c%2Fef%2Fa0%2F0cefa0f17b83255217eddc20b15395f9.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651074011&t=ba5d64079381425813e4c269bcac1a1b"
        />
        <!-- 箭头 -->
        <MsvgIcon
          class="h-1.5 w-1.5 ml-0.5"
          name="down-arrow"
          fillClass="fill-zinc-900 dark:fill-zinc-300"
        ></MsvgIcon>
        <!-- vip -->
        <MsvgIcon
          name="vip"
          class="w-1.5 h-1.5 absolute right-[16px] bottom-0"
        ></MsvgIcon>
      </div>
    </template>
    <ul class="w-[140px] overflow-hidden">
      <li
        v-for="item in myContent"
        :key="item.name"
        class="flex items-center justify-start hover:bg-zinc-100/60 dark:hover:bg-zinc-800 rounded"
      >
        <MsvgIcon
          :name="item.icon"
          class="w-4 h-4 p-1 cursor-pointer rounded-sm duration-200 outline-none hover:bg-zinc-100/60"
          fillClass="fill-zinc-900 dark:fill-zinc-300"
        ></MsvgIcon>
        <span class="text-zinc-800 text-sm dark:text-zinc-300">{{ item.name }}</span>
      </li>
    </ul>
  </Mpopover>
</template>

<script setup lang="ts">
const myContent = [
  { id: 1, name: '个人资料', icon: 'profile', path: '/profile  ' },
  { id: 2, name: '升级vip', icon: 'vip-profile', path: '/member' },
  { id: 3, name: '退出登录', icon: 'logout', path: '/' }
];
</script>
