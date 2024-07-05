<template>
  <div>
    <div class="h-full bg-zinc-200 dark:bg-zinc-800 duration-400 overflow-auto xl:pt-1">
      <div
        class="relative max-w-screen-lg mx-auto bg-white dark:bg-zinc-900 duration-400 xl:rounded-sm xl:border-zinc-200 xl:dark:border-zinc-600 xl:border-[1px] xl:px-4 xl:py-2"
      >
        <!-- pc 端 -->
        <div class="relative text-lg font-bold text-center mb-4 dark:text-zinc-300 pt-3">
          <div
            class="absolute top-1/2 translate-y-[-50%] left-1 text-base"
            @click="onBack"
          >
            返回
          </div>
          个人资料
        </div>
        <div class="h-full w-full px-1 pb-4 text-sm mt-2 xl:w-2/3 xl:pb-0">
          <!-- 头像 -->
          <div class="py-1 xl:absolute xl:right-[16%] xl:text-center">
            <span class="w-8 inline-block mb-2 font-bold text-sm dark:text-zinc-300 xl:block xl:mx-auto">我的头像</span>
            <!-- 头像部分 -->

            <div
              class="relative w-[80px] h-[80px] group xl:cursor-pointer xl:left-[50%] xl:translate-x-[-50%]"
              @click="onAvatarClick"
            >
              <img
                v-lazy
                :src="avatar"
                alt=""
                class="rounded-[50%] w-full h-full xl:inline-block"
              />
              <div class="absolute top-0 rounded-[50%] w-full h-full bg-[rgba(0,0,0,.4)] xl:group-hover:block">
                <MsvgIcon
                  name="change-header-image"
                  class="w-2 h-2 m-auto mt-2"
                ></MsvgIcon>
                <div class="text-xs text-white dark:text-zinc-300 scale-90 mt-0.5">点击更换头像</div>
              </div>
            </div>
            <!-- 隐藏域 -->
            <input
              v-show="false"
              ref="inputFileTarget"
              type="file"
              accept=".png, .jpeg, .jpg, .gif"
              @change="onSelectImgHandler"
            />
            <p class="mt-1 text-zinc-500 dark:text-zinc-400 text-xs xl:w-10">
              支持 jpg、png、jpeg 格式大小 5M 以内的图片
            </p>
          </div>
          <!-- 用户名 -->
          <div class="py-1 xl:flex xl:items-center xl:my-1">
            <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">用户名</span>
            <Minput
              v-model="nickname"
              class="w-full"
              type="text"
              max="20"
            ></Minput>
          </div>
          <!-- 职位 -->
          <div class="py-1 xl:flex xl:items-center xl:my-1">
            <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">职位</span>
            <Minput
              v-model="title"
              class="w-full"
              type="text"
            ></Minput>
          </div>
          <!-- 公司 -->
          <div class="py-1 xl:flex xl:items-center xl:my-1">
            <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">公司</span>
            <Minput
              v-model="company"
              class="w-full"
              type="text"
            ></Minput>
          </div>
          <!-- 个人主页 -->
          <div class="py-1 xl:flex xl:items-center xl:my-1">
            <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">个人主页</span>
            <Minput
              v-model="homePage"
              class="w-full"
              type="text"
            ></Minput>
          </div>
          <!-- 个人介绍 -->
          <div class="py-1 xl:flex xl:my-1">
            <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">个人介绍</span>
            <Minput
              v-model="introduction"
              class="w-full"
              type="textarea"
              max="50"
            ></Minput>
          </div>
          <!-- 保存修改 -->
          <Mbutton
            class="w-full mt-2 mb-4 dark:text-zinc-300 dark:bg-zinc-800 xl:w-[160px] xl:ml-[50%] xl:translate-x-[-50%]"
            @click="onModify"
            :loading="loading"
            :isActiveAnim="false"
            >保存修改</Mbutton
          >
          <!-- 移动端退出登录 -->
          <Mbutton
            v-if="isMobile"
            class="w-full dark:text-zinc-300 dark:bg-zinc-800 xl:w-[160px] xl:ml-[50%] xl:translate-x-[-50%]"
            @click="onLogoutClick"
          >
            退出登录
          </Mbutton>
        </div>
      </div>
    </div>
    <Mdialog v-model="isShow">
      <Change
        :blob="currentBolb"
        @close="isShow = false"
      ></Change>
    </Mdialog>
  </div>
</template>

<script></script>

<script setup lang="ts">
import { ref } from 'vue';
import { isMobile } from '@/utils/flexible.ts';
import { confirm, message } from '@/libs/index.ts';
import { useUserStore } from '@/stores/modules/user/index.ts';
import { modifyUser } from '@/service/main.ts';
import Change from './components/change.vue';
import { useAppStore } from '@/stores/modules/app';

const userStore = useUserStore();
const { logout, state, setUserInfo } = userStore;
const router = useRouter();
const appStore = useAppStore();
const { setRouterChangeType } = appStore;

const nickname = ref(state.user.nickname);
const avatar = ref(state.user.avatar);
const company = ref(state.user.company);
const title = ref(state.user.title);
const homePage = ref(state.user.homePage);
const introduction = ref(state.user.introduction);
const loading = ref<boolean>(false);
// 隐藏域
const inputFileTarget = ref<HTMLInputElement>();
/**
 * 更换头像点击事件
 */
const isShow = ref<boolean>(false);
const onAvatarClick = () => {
  inputFileTarget.value?.click();
};

/**
 * 头像选择之后的回调
 */
const currentBolb = ref<any>();
const onSelectImgHandler = () => {
  const imgFile = inputFileTarget.value?.files?.[0];
  // 生成 blob 对象
  const blob = URL.createObjectURL(imgFile!);
  currentBolb.value = blob;
  isShow.value = true;
  if (inputFileTarget.value) {
    inputFileTarget.value.value = '';
  }
};

/**
 * 移动端：退出登录
 */
const onLogoutClick = () => {
  confirm({
    title: '确认',
    content: '确认退出登录吗',
    onConfirm: () => {
      logout();
    }
  });
};

const onModify = async () => {
  loading.value = true;
  const params = {
    nickname: nickname.value,
    avatar: avatar.value,
    company: company.value,
    title: title.value,
    homePage: homePage.value,
    introduction: introduction.value
  };
  const [_, err] = await modifyUser(params);
  if (err) {
    message({
      type: 'error',
      content: '修改失败!'
    });
  } else {
    setUserInfo({ ...state.user, ...params });
    message({
      type: 'success',
      content: '修改成功!'
    });
  }

  loading.value = false;
};

const onBack = () => {
  setRouterChangeType('back');
  router.back();
};
</script>
<script lang="ts">
export default {
  name: 'Profile'
};
</script>
