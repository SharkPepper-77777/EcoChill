<template>
  <div class="home-container">
    <!-- 侧边栏 -->
    <AppSidebar :active-menu="activeMenu" @menu-change="handleMenuChange" @logout="handleLogout" />

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 顶部栏 -->
      <AppTopbar :active-menu-label="activeMenuLabel" :username="username" />

      <!-- 工作区域 -->
      <div class="workspace">
        <component :is="activeComponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from '@/components/Sidebar.vue';
import AppTopbar from '@/components/Topbar.vue';
import SchedulingPredictionView from '@/views/SchedulingPredictionView.vue';
import UnitCenterView from '@/views/UnitCenterView.vue';
import DataOverviewView from '@/views/DataOverviewView.vue';
import HistoricalReportsView from '@/views/HistoricalReportsView.vue';

export default {
  name: 'HomeView',
  components: {
    AppSidebar,
    AppTopbar,
    SchedulingPredictionView,
    UnitCenterView,
    DataOverviewView,
    HistoricalReportsView,
  },
  data() {
    return {
      activeMenu: 'schedulingPrediction', // 当前选中的菜单项
    };
  },
  computed: {
    // 当前选中的菜单项标签
    activeMenuLabel() {
      const labels = {
        schedulingPrediction: '调度预测',
        unitCenter: '机组中心',
        dataOverview: '数据总览',
        historicalReports: '历史报表',
      };
      return labels[this.activeMenu] || '';
    },
    // 当前选中的组件
    activeComponent() {
      const components = {
        schedulingPrediction: 'SchedulingPredictionView',
        unitCenter: 'UnitCenterView',
        dataOverview: 'DataOverviewView',
        historicalReports: 'HistoricalReportsView',
      };
      return components[this.activeMenu] || null;
    },
    // 用户名
    username() {
      return this.$store.state.user?.username || '用户';
    },
  },
  methods: {
    // 处理菜单切换
    handleMenuChange(menuName) {
      this.activeMenu = menuName;
    },
    // 退出登录
    handleLogout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped lang="scss">
.home-container {
  display: flex;
  height: 100vh;
  /* 确保填满整个视口高度 */
  // background-color: #0a192f;
  margin: 0;
  /* 移除默认的外边距 */
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.workspace {
  flex: 1;
  padding: 20px;
  background-color: #132843;
  border-radius: 8px;
  // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px;
  margin-top: 20px;
  /* 移除顶部外边距 */
  overflow-y: scroll;
  background-image: url('@/assets/workspace-bg.jpg'); // 添加背景图片
  background-size: cover; // 使背景图片覆盖整个容器
  background-position: center; // 背景图片居中
  background-repeat: no-repeat; // 不重复背景图片
}

.workspace::-webkit-scrollbar {
  width: 0px;
  /* 隐藏横向滚动条 */
  height: 0px;
  /* 隐藏纵向滚动条 */
}
</style>