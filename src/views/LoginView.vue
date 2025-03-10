<template>
  <div class="login-container">
    <div class="login-card">
      <!-- 左侧深蓝色矩形区域 -->
      <div class="left-section">
        <!-- 添加图片 -->
        <img src="@/assets/left-image.png" alt="Left Image" class="left-image">
      </div>

      <!-- 右侧登录操作区域 -->
      <div class="right-section">
        <!-- 顶部标题 -->
        <h1>登录</h1>

        <!-- 输入框部分 -->
        <div class="input-group">
          <div class="input-container">
            <i class="fas fa-user icon"></i>
            <div class="divider"></div> <!-- 竖线分割 -->
            <input type="text" v-model="username" placeholder="请输入账号" class="input-field" />
          </div>
          <div class="input-container">
            <i class="fas fa-lock icon"></i>
            <div class="divider"></div> <!-- 竖线分割 -->
            <input type="password" v-model="password" placeholder="请输入密码" class="input-field" />
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <!-- 选项部分 -->
        <div class="options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberPassword" />
            <span>记住密码</span>
          </label>
          <a href="#" class="forgot-password">忘记密码</a>
        </div>

        <!-- 登录按钮 -->
        <button class="login-button" @click="handleLogin">立即登录</button>

        <!-- 注册链接 -->
        <div class="register-link">
          <span>没有账号？</span>
          <a href="#" class="register">立即注册</a>
        </div>

        <!-- 错误提示 -->

      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const rememberPassword = ref(false);
    const errorMessage = ref('');
    const store = useStore();

    const handleLogin = async () => {
      try {
        const result = await store.dispatch('login', { username: username.value, password: password.value });
        if (result) {
          // 登录成功，可进行页面跳转等操作
          console.log('登录成功，准备跳转');
          // 假设使用vue-router进行跳转，示例如下
          // import { useRouter } from 'vue-router';
          // const router = useRouter();
          // router.push('/');
        } else {
          errorMessage.value = '用户名或密码错误';
        }
      } catch (error) {
        errorMessage.value = '登录过程中出现错误，请检查网络或稍后重试';
        console.error('登录错误：', error);
      }
    };

    onMounted(() => {
      // 组件挂载时的操作，这里可以不写内容
    });

    return {
      username,
      password,
      rememberPassword,
      errorMessage,
      handleLogin
    };
  }
};
</script>

<style scoped lang="scss">
/* 这里是你的样式代码，保持不变 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('@/assets/background.png');
  background-size: cover;
  background-position: center;
}

.login-card {
  display: flex;
  width: 800px;
  height: 400px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.left-section {
  width: 50%;
  background-color: #132a5000;
}

.left-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.right-section {
  width: 50%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.13);
  backdrop-filter: blur(5px);
}

h1 {
  color: white;
  font-size: 24px;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 20px;
}

.input-container {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  border: 1px solid white;
  border-radius: 5px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
}

.icon {
  color: white;
  margin-right: 10px;
}

.divider {
  width: 1px;
  height: 20px;
  background-color: white;
  margin-right: 10px;
}

.input-field {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  outline: none;
}

.input-field::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember-me {
  display: flex;
  align-items: center;
  color: white;
  font-size: 14px;
}

.remember-me input {
  margin-right: 5px;
}

.forgot-password {
  color: #93c5fd;
  text-decoration: none;
  font-size: 14px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #1e498a;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
}

.login-button:hover {
  background-color: #1d74d8;
}

.register-link {
  text-align: center;
  color: white;
  font-size: 14px;
}

.register-link.register {
  color: #93c5fd;
  text-decoration: none;
}

.error-message {
  color: #ff6b6b;
  font-size: 14px;
  margin-top: -5%;
  text-align: center;
}
</style>