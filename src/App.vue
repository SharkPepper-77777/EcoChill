<template>
  <div id="app">
    <!-- 如果已登录，渲染主界面 -->
    <router-view v-if="isLoggedIn" />

    <!-- 如果未登录，渲染登录界面 -->
    <LoginView v-else />
  </div>
</template>

<script>
import LoginView from './views/LoginView.vue'; // 导入登录页面组件

export default {
  name: 'App',
  components: {
    LoginView,
  },
  computed: {
    // 从 Vuex Store 获取登录状态
    isLoggedIn() {
      //return this.$store.state.isLoggedIn;
     return true;
    },
  },
};
</script>

<style>
/* 全局样式 */
html, body {
  margin: 0; /* 移除默认的外边距 */
  padding: 0; /* 移除默认的填充 */
  height: 100%; /* 确保 body 填满整个视口高度 */
  background-color: #ECF5FC; /* 深蓝色背景 */
  color: #ccd6f6; /* 浅蓝色文字 */
  font-family: 'Poppins', sans-serif; /* 使用 Google Fonts 字体 */
}

#app {
  height: 100%; /* 确保 #app 填满整个视口高度 */
  font-family: 'Poppins', sans-serif; /* 使用 Google Fonts 字体 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ccd6f6; /* 浅蓝色文字 */
}
</style>