<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2>EcoChill</h2>
    </div>
    <ul class="sidebar-menu">
      <li
        v-for="item in menuItems"
        :key="item.name"
        :class="{ active: activeMenu === item.name }"
        @click="handleMenuClick(item.name)"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </li>
    </ul>
    <!-- 退出登录按钮 -->
    <div class="logout-section">
      <button @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
        <span>退出登录</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: {
    activeMenu: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      menuItems: [
        {
          name: 'schedulingPrediction',
          label: '调度预测',
          icon: 'fas fa-chart-line',
        },
        {
          name: 'unitCenter',
          label: '机组中心',
          icon: 'fas fa-cogs',
        },
        {
          name: 'dataOverview',
          label: '数据总览',
          icon: 'fas fa-database',
        },
        {
          name: 'historicalReports',
          label: '历史报表',
          icon: 'fas fa-file-alt',
        },
      ],
    };
  },
  methods: {
    handleMenuClick(menuName) {
      this.$emit('menu-change', menuName); // 触发菜单切换事件
    },
 handleLogout() {
  console.log('退出登录按钮被点击'); // 检查是否输出
  this.$emit('logout');
},
  },
};
</script>

<style scoped lang="scss">
.sidebar {
  width: 250px;
  background: linear-gradient(135deg, #274a76, #2d5e9e); /* 渐变色背景 */
  color: white;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.2); /* 右侧阴影 */
  display: flex;
  flex-direction: column;
  height: 100vh; /* 填满整个视口高度 */
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 24px;
  font-family: 'Poppins', sans-serif; /* 使用 Google Fonts 字体 */
  font-weight: 600; /* 字体粗细 */
  color: white;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 20px 0; /* 增加上下边距 */
  flex: 1; /* 填满剩余空间 */
}

.sidebar-menu li {
  padding: 15px 20px;
  margin: 10px 20px; /* 增加选项之间的距离 */
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease; /* 所有属性变化动画 */
  position: relative;
  border-radius: 8px; /* 设置圆角 */
}

.sidebar-menu li:hover {
  background-color: rgba(255, 255, 255, 0.1); /* 悬停背景色 */
  transform: translateY(-3px); /* 悬停时抬升效果 */
}

.sidebar-menu li.active {
  background-color: rgba(255, 255, 255, 0.2); /* 选中背景色 */
}

.sidebar-menu li.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background-color: #3b82f6; /* 左侧高亮条 */
}

.sidebar-menu li i {
  margin-right: 15px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8); /* 图标颜色 */
  transition: color 0.3s ease; /* 图标颜色变化动画 */
}

.sidebar-menu li:hover i {
  color: white; /* 悬停时图标颜色 */
}

.sidebar-menu li span {
  font-size: 16px;
  font-family: 'Poppins', sans-serif; /* 使用 Google Fonts 字体 */
  font-weight: 400; /* 字体粗细 */
  color: rgba(255, 255, 255, 0.8); /* 文字颜色 */
  transition: color 0.3s ease; /* 文字颜色变化动画 */
}

.sidebar-menu li:hover span {
  color: white; /* 悬停时文字颜色 */
}

.logout-section {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-section button {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1); /* 按钮背景色 */
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px; /* 设置圆角 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease; /* 背景色变化动画 */
}

.logout-section button:hover {
  background-color: rgba(255, 255, 255, 0.2); /* 悬停时按钮背景色 */
}

.logout-section button i {
  margin-right: 10px;
}
</style>