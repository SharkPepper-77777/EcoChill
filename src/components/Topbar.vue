<template>
  <div class="topbar">
    <!-- 左侧：页面标题 -->
    <div class="topbar-left">
      <h2>{{ activeMenuLabel }}</h2>
    </div>

    <!-- 中间：搜索框 -->
    <div class="topbar-center">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索..."
          class="search-input"
        />
        <button @click="handleSearch" class="search-button">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>

    <!-- 右侧：用户信息 -->
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
  data() {
    return {
      searchQuery: '', // 搜索框内容
    };
  },
  methods: {
    // 处理搜索
    handleSearch() {
      console.log('搜索内容:', this.searchQuery);
      alert(`搜索内容：${this.searchQuery}`);
    },
  },
};
</script>

<style scoped lang="scss">
.topbar {
  width: 100%;
  height: 60px;
  background-color: #d6deeb;
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
  color: #204677; /* 深蓝色 */
  letter-spacing: 1px; /* 增加字间距 */
  text-transform: uppercase; /* 转换为大写字母 */
}

.topbar-center {
  flex: 1; /* 占据剩余空间 */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px; /* 左右内边距 */
}

.search-box {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 300px; /* 限制搜索框最大宽度 */
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 16px 0 0 16px; /* 左侧圆角增大 */
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #3b82f6; /* 聚焦时边框颜色 */
}

.search-button {
  padding: 8px 12px;
  background-color: #4273c2;
  color: white;
  border: none;
  border-radius: 0 16px 16px 0; /* 右侧圆角增大 */
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #2f53a2; /* 悬停时背景色 */
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