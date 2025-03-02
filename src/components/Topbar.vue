<template>
  <div class="topbar">
    <div class="topbar-left">
      <h2>{{ activeMenuLabel }}</h2>
    </div>
    <div class="topbar-right">
      <div class="user-info">
        <img src="@/assets/user-avatar.jpg" alt="用户头像" class="user-avatar" />
        <span>{{ username }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppTopbar',
  props: {
    activeMenuLabel: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.topbar {
  width: 100%;
  height: 60px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.topbar-left {
  padding-left: 20px; /* 左侧文字向左移动 */
}

.topbar-left h2 {
  margin: 0;
  font-size: 26px; /* 增大字体大小 */
  font-family: 'Poppins', sans-serif; /* 使用 Google Fonts 字体 */
  font-weight: 700; /* 字体粗细 */
  color: #1e3a8a; /* 深蓝色 */
  letter-spacing: 1px; /* 增加字间距 */
  text-transform: uppercase; /* 转换为大写字母 */
}

.topbar-right {
  display: flex;
  align-items: center;
  padding-right: 20px; /* 右侧内容向右移动 */
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%; /* 圆形头像 */
  margin-right: 10px;
}

.user-info span {
  font-family: 'Poppins', sans-serif; /* 使用 Google Fonts 字体 */
  font-weight: 400; /* 字体粗细 */
  color: #4b5563; /* 文字颜色 */
}
</style>