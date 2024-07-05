<template>
  <div class="relative h-screen bg-white dark:bg-zinc-800 text-center xl:bg-zinc-200">
    <!-- 头部图标：PC端 -->
    <div class="hidden pt-5 h-8 xl:block">
      <img
        v-lazy:autoBg
        class="m-auto"
        src="https://res.lgdsunday.club/signlogo.png"
        alt=""
      />
    </div>
    <!-- 头部图标：移动端 -->
    <div class="h-[111px] xl:hidden">
      <img
        v-lazy:autoBg
        class="dark:hidden"
        src="https://res.lgdsunday.club/login-bg.png"
        alt=""
      />
      <img
        v-lazy:autoBg
        class="h-5 absolute top-[5%] left-[50%] translate-x-[-50%]"
        src="https://m.imooc.com/static/wap/static/common/img/logo-small@2x.png"
        alt=""
        srcset=""
      />
    </div>

    <!-- 表单区 -->
    <div
      class="block px-3 mt-4 dark:bg-zinc-800 xl:bg-white xl:w-[388px] xl:dark:bg-zinc-900 xl:m-auto xl:mt-8 xl:py-4 xl:rounded-sm xl:shadow-lg"
    >
      <h3 class="mb-2 font-semibold text-base text-main dark:text-zinc-300 hidden xl:block">账号登录</h3>
      <!-- 表单 -->
      <VeeForm @submit="onLoginHandler">
        <VeeField
          class="dark:bg-zinc-800 dark:text-zinc-400 border-b-zinc-400 border-b-[1px] w-full outline-0 pb-1 px-1 text-base focus:border-b-main dark:focus:border-b-zinc-200 xl:dark:bg-zinc-900"
          name="username"
          type="text"
          placeholder="用户名"
          autocomplete="on"
          :rules="validateUsername"
          value="laf"
        />
        <VeeErrorMessage
          name="username"
          class="text-sm text-red-600 block mt-0.5 text-left"
        />
        <VeeField
          class="dark:bg-zinc-800 dark:text-zinc-400 border-b-zinc-400 border-b-[1px] w-full outline-0 pb-1 px-1 text-base focus:border-b-main dark:focus:border-b-zinc-200 xl:dark:bg-zinc-900"
          name="password"
          type="password"
          placeholder="密码"
          autocomplete="on"
          :rules="validatePassword"
          value="laflaflaf"
        />
        <VeeErrorMessage
          name="password"
          class="text-sm text-red-600 block mt-0.5 text-left"
        />

        <div class="pt-1 pb-3 leading-[0px] text-right">
          <a
            class="inline-block p-1 text-zinc-400 text-right dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 text-sm duration-400 cursor-pointer"
          >
            去注册
          </a>
        </div>

        <Mbutton
          class="w-full dark:bg-zinc-900 xl:dark:bg-zinc-800"
          :isActiveAnim="false"
        >
          登录
        </Mbutton>
      </VeeForm>

      <div class="flex justify-around mt-4">
        <!-- QQ -->
        <QQLogin />
        <!-- 微信 -->
        <MsvgIcon
          class="w-4 cursor-pointer"
          name="wexin"
        ></MsvgIcon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Form as VeeForm, Field as VeeField, ErrorMessage as VeeErrorMessage } from 'vee-validate';
import { validateUsername, validatePassword } from './validate.ts';
import QQLogin from '../qqLogin/index.vue';

import { useUserStore } from '@/stores/modules/user/index.ts';

const userStore = useUserStore();
const { userLogin } = userStore;
const router = useRouter();

const onLoginHandler = async () => {
  await userLogin();
  router.push('/');
};
</script>
