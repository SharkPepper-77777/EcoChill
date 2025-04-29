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
        <!-- 调度预测覆盖层 -->
        <div v-if="getIsScheduling" class="scheduling-overlay" :key="getIsScheduling">
          调度预测中...
        </div>
        <component :is="activeComponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { nextTick } from 'vue';
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
    HistoricalReportsView
  },
  data() {
    return {
      activeMenu: 'schedulingPrediction' // 当前选中的菜单项
    };
  },
  computed: {
    ...mapGetters(['getIsScheduling']),
    getIsScheduling() {
      const status = this.$store.getters.getIsScheduling;
      return status;
    },
    // 当前选中的菜单项标签
    activeMenuLabel() {
      const labels = {
        schedulingPrediction: '调度预测',
        unitCenter: '机组中心',
        dataOverview: '数据总览',
        historicalReports: '历史报表'
      };
      return labels[this.activeMenu] || '';
    },
    // 当前选中的组件
    activeComponent() {
      const components = {
        schedulingPrediction: SchedulingPredictionView,
        unitCenter: UnitCenterView,
        dataOverview: DataOverviewView,
        historicalReports: HistoricalReportsView
      };
      return components[this.activeMenu] || null;
    },
    // 用户名
    username() {
      return this.$store.state.user?.username || '用户';
    }
  },
  mounted() {
    if (this.getIsScheduling) {
      this.adjustOverlayHeight();
    }
  },
  watch: {
    getIsScheduling(newVal) {
      if (newVal) {
        this.adjustOverlayHeight();
      }
    },
    activeComponent() {
      let viewName = this.activeComponent?.name;
      if (viewName === undefined) {
        viewName = 'SchedulingPredictionView';
      }
      this.$nextTick(() => {
        this.$forceUpdate();
        this.adjustOverlayHeight(viewName);
      });
    }
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
    adjustOverlayHeight(viewName) {
      nextTick(() => {
        const workspace = document.querySelector('.workspace');
        if (workspace) {
          const overlay = document.querySelector('.scheduling-overlay');
          if (overlay) {
            const scrollHeight = workspace.scrollHeight;
            const clientHeight = workspace.clientHeight;
            let overlayHeight;
            if (viewName === 'SchedulingPredictionView' || viewName == undefined) {
              overlayHeight = scrollHeight;
            } else {
              overlayHeight = clientHeight;
            }
            overlay.style.height = `${overlayHeight}px`;
            console.log(`${viewName} 界面，设置覆盖层高度为:`, overlayHeight);
          }
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.home-container {
  display: flex;
  height: 100vh;
  margin: 0;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.workspace {
  flex: 1;
  padding: 20px;
  background-color: #ecf5fc;
  border-radius: 8px;
  margin: 20px;
  margin-top: 20px;
  overflow-y: scroll;
  position: relative;
}

.workspace::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

.scheduling-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  z-index: 999;
}
</style>