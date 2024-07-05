import { defineStore } from 'pinia';
import { login, register, profile } from '@/service/main';
import { message } from '@/libs';

export const useUserStore = defineStore(
  'use',
  () => {
    const state = ref<{ token?: string; user?: any }>({
      token: '',
      user: {}
    });

    const setToken = (str: string) => {
      state.value.token = str;
    };
    const setUserInfo = (val: any) => {
      state.value.user = val;
    };

    const getUserInfo = async () => {
      const [data, err] = await profile();
      if (err) {
        return;
      }
      setUserInfo(data);
    };
    const userLogin = async () => {
      const [data, err] = await login({ username: 'laf', password: 'laf', loginType: 'username' });
      if (err) {
        return;
      }
      setToken(data.token);
      await getUserInfo();
    };

    const userRegister = async () => {
      const [_, err] = await register({ username: 'laf', password: 'laf' });
      if (err) {
        message({
          type: 'error',
          content: `注册失败${_}`
        });
      }
    };

    const logout = () => {
      // 清除缓存和store
      state.value = {};
      localStorage.setItem('user', '');
      // 重新加载页面
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    };

    return {
      state,
      setToken,
      setUserInfo,
      userLogin,
      getUserInfo,
      logout,
      userRegister
    };
  },
  {
    persist: {
      key: 'user',
      paths: ['state'],
      storage: localStorage
    }
  }
);
