<template>
  <!-- 机组列表界面 -->
  <div v-if="!showUnitDetail">
    <div v-for="unit in allUnits" :key="unit.id" class="custom-unit-card" @click="showUnitDetailPage(unit.id)">
      <h3 class="card-title">#{{ unit.id }}</h3>
      <p class="card-type">类型: {{ unit.type }}</p>
      <!-- 显示部分通用参数示例，增加数据存在性判断 -->
      <p v-if="unit.unitParams && unit.unitParams.length > 0" class="card-param">
        额定制冷量: {{unit.unitParams.find(p => p.label === '额定制冷量')?.value || '无数据'}}
      </p>
      <p v-if="unit.coolingModeParams && unit.coolingModeParams.length > 0" class="card-param">
        制冷模式额定制冷量: {{unit.coolingModeParams.find(p => p.label === '额定制冷量')?.value || '无数据'}}
      </p>
      <!-- 增加提示，当某些关键数据不存在时 -->
      <p v-if="!(unit.unitParams && unit.unitParams.length > 0 || unit.coolingModeParams && unit.coolingModeParams.length > 0)"
        class="card-param">
        暂无更多参数信息
      </p>
    </div>
    <!-- 当没有机组数据时显示提示 -->
    <p v-if="allUnits.length === 0" class="no-units-message">暂无机组数据</p>
  </div>

  <!-- 机组详情界面 -->
  <div v-if="showUnitDetail && currentUnit">
    <div class="detail-container">
      <!-- 左边部分 -->
      <div class="left-section">
        <div class="top-info">
          <button class="back-button" @click="goBackToList">
            <i class="arrow-left"></i>
          </button>
          <span class="unit-id-center">#{{ currentUnit.id }}</span>
          <span class="unit-kind">{{ currentUnit.type }}</span>
        </div>
        <div class="unit-image">
          <img :src="currentUnit.imageUrl || ''" alt="机组图片">
          <!-- 当图片不存在时显示提示 -->
          <p v-if="!currentUnit.imageUrl" class="no-image-message">暂无机组图片</p>
        </div>
        <div class="param-table">
          <table>
            <tbody>
              <tr v-for="(paramObj, index) in currentUnitParams" :key="index">
                <td class="param-label">{{ paramObj.label }}:</td>
                <td class="param-value">
                  {{ paramObj.value }}
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 当参数表格为空时显示提示 -->
          <p v-if="!(currentUnitParams && currentUnitParams.length > 0)" class="no-params-message">暂无更多参数信息
          </p>
        </div>
        <div class="total-cooling-capacity">
          <span class="capacity-label">24h总制冷量:</span>
          <div class="cooling-values-box">
            <span v-for="(value, index) in get24hCoolingCapacity" :key="index">
              <span class="cooling-value-box">{{ value }}</span>
            </span>
          </div>
          <!-- 当总制冷量数据为空时显示提示 -->
          <p v-if="get24hCoolingCapacity.length === 0" class="no-cooling-capacity-message">暂无24h总制冷量数据</p>
        </div>
      </div>

      <!-- 右边部分 -->
      <div class="right-section">
        <div class="charts-top">
          <div class="daily-cooling-chart">
            <h3 class="section-title">24h制冷量</h3>
            <div id="daily-cooling-chart-container" class="chart-container"></div>
            <!-- 当图表数据不存在时显示提示，使用处理后的currentUnit24hCoolingData判断 -->
            <p v-if="currentUnit24hCoolingData.length === 0" class="no-chart-data-message">暂无24h制冷量图表数据</p>
          </div>
          <div class="daily-power-chart">
            <h3 class="section-title">24h用电量</h3>
            <div id="daily-power-chart-container" class="chart-container"></div>
            <!-- 当图表数据不存在时显示提示，使用处理后的currentUnit24hPowerData判断 -->
            <p v-if="currentUnit24hPowerData.length === 0" class="no-chart-data-message">暂无24h用电量图表数据</p>
          </div>
        </div>
        <div class="switch-chart-bottom">
          <h3 class="section-title">24h开关情况</h3>
          <div id="switch-chart-bottom-container" class="chart-container"></div>
          <!-- 当图表数据不存在时显示提示，使用处理后的currentUnit24hSwitchData判断 -->
          <p v-if="currentUnit24hSwitchData.length === 0" class="no-chart-data-message">暂无24h开关情况图表数据</p>
        </div>
      </div>
    </div>
  </div>
  <!-- 加载遮罩层 -->
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-spinner"></div>
    <p>数据加载中，请稍候...</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  computed: {
    ...mapGetters(['getScheduledUnits', 'getSelectedUnit']),
    allUnits() {
      return this.getScheduledUnits;
    },
    currentUnitParams() {
      const params = this.currentUnit?.unitParams || [];
      const labels = ['额定制冷量', '输入功率', 'PLR范围', '泵体数量', '泵体耗电量', '最大可输送冷量'];
      const result = labels.map((label, index) => {
        let value = '无数据';
        const paramValue = params[index];
        if (paramValue !== undefined) {
          if (typeof paramValue === 'object') {
            value = `min: ${paramValue.min}, max: ${paramValue.max}`;
          } else {
            value = paramValue;
          }
        }
        return { label, value };
      });
      console.log('currentUnitParams处理后的数据:', result); // 添加这行代码
      return result;
    },
    // 新增计算属性，获取当前机组24小时制冷量数据
    currentUnit24hCoolingData() {
      const data = this.currentUnit?.twenty_four_hours_data || [];
      return data.map(item => ({
        time: `${item.hour.toString().padStart(2, '0')}:00`,
        // 确认后端数据中制冷量的属性名是否正确，这里假设是cooling_capacity
        coolingCapacity: item.cooling_capacity
      }));
    },
    // 新增计算属性，获取当前机组24小时用电量数据
    currentUnit24hPowerData() {
      const data = this.currentUnit?.twenty_four_hours_data || [];
      return data.map(item => ({
        time: `${item.hour.toString().padStart(2, '0')}:00`,
        // 确认后端数据中用电量的属性名是否正确，这里假设是power_consumption
        powerConsumption: item.power_consumption
      }));
    },
    // 新增计算属性，获取当前机组24小时开关状态数据
    currentUnit24hSwitchData() {
      const data = this.currentUnit?.twenty_four_hours_data || [];
      return data.map(item => ({
        hour: item.hour,
        isOn: item.is_on
      }));
    },
    get24hCoolingCapacity() {
      if (this.currentUnit) {
        const totalCoolingCapacity = this.getTotal24hCoolingCapacity();
        return totalCoolingCapacity.toString().split('');
      }
      return [];
    },
    currentUnit() {
      return this.getSelectedUnit;
    }
  },
  data() {
    return {
      showUnitDetail: false,
      unitParams: [
        { label: '额定制冷量', type: 'number', value: 0 },
        { label: '输入功率', type: 'number', value: 0 },
        { label: 'PLR 范围', type: 'range', value: [0, 1] },
        { label: '泵体数量', type: 'number', value: 0 },
        { label: '泵体耗电量', type: 'number', value: 0 },
        { label: '最大可输送冷量', type: 'number', value: 0 },
      ],
      chartInstances: {
        dailyCoolingChart: null,
        dailyPowerChart: null,
        switchChartBottom: null
      },
      isLoading: false,
      errorMessage: '' // 新增，用于存储错误信息
    };
  },
  methods: {
    ...mapActions(['fetchScheduledUnits', 'getUnitById']),
    async showUnitDetailPage(unitId) {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const response = await axios.get(`http://localhost:3001/units/${unitId}`);
        const unit = response.data;
        console.log('后端返回的数据:', unit);
        if (unit.message === "Unit not found") {
          this.errorMessage = `未找到 ID 为 ${unitId} 的机组`;
          console.error(this.errorMessage);
        } else {
          // 提交到Vuex的mutation中
          this.$store.commit('setSelectedUnit', unit);
          this.showUnitDetail = true;
          this.$nextTick(() => {
            this.renderDailyCoolingChart();
            this.renderDailyPowerChart();
            this.renderSwitchChartBottom();
          });
        }
      } catch (error) {
        this.errorMessage = '获取机组数据失败，请检查网络或稍后重试';
        console.error(this.errorMessage, error);
      } finally {
        this.isLoading = false;
      }
    },
    getTotal24hCoolingCapacity() {
      if (this.currentUnit) {
        const dailyData = this.getDailyData();
        return dailyData.reduce((acc, item) => acc + item.coolingCapacity, 0);
      }
      return 0;
    },
    getDailyData() {
      return this.currentUnit?.twenty_four_hours_data || [];
    },
    renderDailyCoolingChart() {
      const dailyData = this.currentUnit24hCoolingData;
      console.log('处理后的24h制冷量数据:', dailyData);
      if (dailyData.length === 0) {
        console.warn('24h制冷量数据为空，无法渲染图表');
        return;
      }
      const times = dailyData.map(item => item.time);
      const coolingCapacities = dailyData.map(item => item.coolingCapacity);

      const chartDom = document.getElementById('daily-cooling-chart-container');
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: times
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '24h 制冷量',
            type: 'line',
            data: coolingCapacities,
            lineStyle: {
              color: '#42b983',
              width: 2,
              type: 'solid'
            },
            itemStyle: {
              color: '#42b983',
              borderColor: '#fff',
              borderWidth: 2
            }
          }
        ]
      };

      myChart.setOption(option);
      this.chartInstances.dailyCoolingChart = myChart;
    },
    renderDailyPowerChart() {
      const dailyData = this.currentUnit24hPowerData;
      if (dailyData.length === 0) {
        console.warn('24h用电量数据为空，无法渲染图表');
        return;
      }
      const times = dailyData.map(item => item.time);
      const powerConsumptions = dailyData.map(item => item.powerConsumption);

      const chartDom = document.getElementById('daily-power-chart-container');
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: times
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '24h 用电量',
            type: 'line',
            data: powerConsumptions,
            lineStyle: {
              color: '#1890ff',
              width: 2,
              type: 'solid'
            },
            itemStyle: {
              color: '#1890ff',
              borderColor: '#fff',
              borderWidth: 2
            }
          }
        ]
      };

      myChart.setOption(option);
      this.chartInstances.dailyPowerChart = myChart;
    },
    renderSwitchChartBottom() {
      const dailyData = this.currentUnit24hSwitchData;
      if (dailyData.length === 0) {
        console.warn('24h开关情况数据为空，无法渲染图表');
        return;
      }
      const hours = dailyData.map(item => item.hour);
      const switchStatus = dailyData.map(item => item.isOn ? 1 : 0);

      const chartDom = document.getElementById('switch-chart-bottom-container');
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: hours
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '24h 开关情况',
            type: 'bar',
            data: switchStatus,
            itemStyle: {
              color: function (params) {
                return params.value === 1 ? '#5cb85c' : '#d9534f';
              }
            }
          }
        ]
      };

      myChart.setOption(option);
      this.chartInstances.switchChartBottom = myChart;
    },
    goBackToList() {
      this.showUnitDetail = false;
      Object.values(this.chartInstances).forEach(chart => {
        if (chart) {
          echarts.dispose(chart);
        }
      });
      this.errorMessage = ''; // 清空错误信息
    },
    reRenderCharts() {
      if (this.currentUnit) {
        this.renderDailyCoolingChart();
        this.renderDailyPowerChart();
        this.renderSwitchChartBottom();
      }
    },
    async fetchData() {
      this.isLoading = true;
      try {
        await this.fetchScheduledUnits();
      } catch (error) {
        this.errorMessage = '获取数据失败，请检查网络或稍后重试';
        console.error(this.errorMessage, error);
      } finally {
        this.isLoading = false;
      }
    }
  },
  created() {
    this.fetchData();
  },
  activated() {
    this.fetchData();
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f4f9;
  color: #333;
  overflow: hidden;
  /* 隐藏body的滚动条 */
}

/* 卡片父元素，设置左对齐 */
div[v-if="!showUnitDetail"] {
  text-align: left;
}

.custom-unit-card {
  float: left;
  clear: none;
  /* 允许卡片在左侧相邻位置排列，不强制换行 */
  background-color: #fff;
  border: none;
  border-radius: 10px;
  padding: 20px;
  width: calc(25% - 20px);
  /* 增加左右间隙，使卡片间有横向空隙，可调整20px的值改变间隙大小 */
  margin: 0 10px 15px 0;
  /* 上下左右都设置间隙，使卡片间有纵向和横向空隙，可调整值改变间隙大小 */
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  display: inline-block;
  vertical-align: top;
}

.custom-unit-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card-title {
  color: #2c3e50;
  font-size: 20px;
  margin-bottom: 10px;
}

.card-type,
.card-param {
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 5px;
}

/* 修改 detail-container 样式，确保其占满父元素且处理好内部布局 */
.detail-container {
  display: flex;
  width: 100%;
  height: 100%;
  /* gap: 20px; */
  flex-wrap: wrap;
  /* 允许子元素换行，防止溢出 */
  align-items: stretch;
  /* 让子元素拉伸占满高度 */
}

.left-section {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border-right: none;
  /* 去除左边部分的右边框，消除分割线效果 */
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  /* 设置左边部分的圆角 */
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  /* 设置右边部分的圆角 */
}

.top-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #2c3e50;
}

.arrow-left::before {
  content: '←';
}

.unit-id-center {
  color: #2c3e50;
  font-size: 20px;
  text-align: center;
  flex: 1;
}

.unit-kind {
  color: #2c3e50;
  font-size: 20px;
}

.unit-image {
  width: 100%;
  height: 150px;
  /* 适当降低图片高度，避免内容过多导致溢出 */
  overflow: hidden;
  margin-bottom: 10px;
}

.unit-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.param-table {
  width: 100%;
  margin-bottom: 10px;
}

.param-table table {
  width: 100%;
  border-collapse: collapse;
}

.param-table td {
  padding: 5px 0;
  border-bottom: 1px solid #e0e0e0;
}

.param-label {
  font-weight: bold;
  color: #2c3e50;
  width: 50%;
}

.param-value {
  color: #7f8c8d;
}

.total-cooling-capacity {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;
  overflow: hidden;
  /* 防止总制冷量部分内容溢出 */
}

.capacity-label {
  font-weight: bold;
  margin-right: 10px;
}

.cooling-values-box {
  display: inline-block;
}

.cooling-value-box {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 8px;
  margin-right: 5px;
  display: inline-block;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  overflow: hidden;
  /* 防止右边部分内容溢出 */
}

.charts-top {
  flex: 1;
  display: flex;
  gap: 10px;
}

.daily-cooling-chart,
.daily-power-chart {
  flex: 1;
  background-color: #fff;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  /* 防止图表部分内容溢出 */
}

.switch-chart-bottom {
  background-color: #fff;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  /* 防止图表部分内容溢出 */
}

.section-title {
  color: #2c3e50;
  font-size: 16px;
  margin-bottom: 5px;
}

.chart-container {
  width: 100%;
  height: 150px;
  overflow: hidden;
  /* 防止图表容器内容溢出 */
}
</style>