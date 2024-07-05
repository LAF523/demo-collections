<template>
  <div>
    <span
      id="qqLoginBtn"
      v-show="false"
    ></span>
    <MsvgIcon
      class="w-4 cursor-pointer"
      name="qq"
      @click="onLogin"
    ></MsvgIcon>
  </div>
</template>

<script setup lang="ts">
import { send, wait, close } from './BroadcastChannel.ts';
// 指定登录的URL,url包含应用id和redirect_uri(在小窗体内用户qq登录成功之后跳转的地址)
const QQ_LOGIN_URL =
  'https://graph.qq.com/oauth2.0/authorize?client_id=101998494&response_type=token&scope=all&redirect_uri=https%3A%2F%2Fimooc-front.lgdsunday.club%2Flogin';

// 登录时打开窗体
const onLogin = () => {
  window.open(
    QQ_LOGIN_URL,
    'oauth2Login_10609',
    'height=525,width=585, toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes'
  );
  wait().then(() => {
    close();
  });
};

onMounted(() => {
  QC.Login(
    {
      btnId: 'qqLoginBtn' // 插入按钮的节点id
    }
    // 登录成功之后的回调，但是需要注意，这个回调只会在《登录回调页面中被执行》
    // 登录存在缓存，登录成功一次之后，下次进入会自动重新登录（即：触发该方法，所以我们应该在离开登录页面时，注销登录）
    // (data: object) => {
    //   console.log(data);
    // }
  );
  send({ msg: 'kkk' });
});
</script>
