<template>
  <!-- 机组列表界面 -->
  <div v-if="!showUnitDetail">
    <div v-for="unit in filteredUnits" :key="unit.id" class="custom-unit-card" @click="showUnitDetailPage(unit.id)">
      <h3 class="card-title">#{{ unit.id }}</h3>
      <p class="card-type">类型: {{ unit.type }}</p>
      <!-- 显示部分通用参数示例 -->
      <p v-if="unit.unitParams" class="card-param">额定制冷量: {{ unit.unitParams.param1 }}</p>
      <p v-if="unit.coolingModeParams" class="card-param">制冷模式额定制冷量: {{ unit.coolingModeParams.param1 }}</p>
    </div>
  </div>

  <!-- 机组详情界面 -->
  <div v-if="showUnitDetail">
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
        </div>
        <div class="param-table">
          <table>
            <tbody>
              <tr v-for="(param, index) in unitParams" :key="index">
                <td class="param-label">{{ param.label }}:</td>
                <td class="param-value">{{ currentUnit.unitParams[index] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="total-cooling-capacity">
          <span class="capacity-label">24h总制冷量:</span>
          <div class="cooling-values-box">
            <span v-for="(value, index) in get24hCoolingCapacity" :key="index">
              <span class="cooling-value-box">{{ value }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- 右边部分 -->
      <div class="right-section">
        <div class="charts-top">
          <div class="daily-cooling-chart">
            <h3 class="section-title">24h制冷量</h3>
            <div id="daily-cooling-chart-container" class="chart-container"></div>
          </div>
          <div class="daily-power-chart">
            <h3 class="section-title">24h用电量</h3>
            <div id="daily-power-chart-container" class="chart-container"></div>
          </div>
        </div>
        <div class="switch-chart-bottom">
          <h3 class="section-title">24h开关情况</h3>
          <div id="switch-chart-bottom-container" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as echarts from 'echarts';

export default {
  computed: {
    ...mapGetters(['getUnits']),
    units() {
      return this.getUnits;
    },
    // 新增计算属性用于过滤（这里目前没有实际过滤逻辑，可根据需求添加）
    filteredUnits() {
      return this.units.filter(unit => unit); // 简单过滤掉可能的空值，可按需修改
    },
    get24hCoolingCapacity() {
      if (this.currentUnit) {
        const totalCoolingCapacity = this.getTotal24hCoolingCapacity();
        return totalCoolingCapacity.toString().split('');
      }
      return [];
    },

  },
  data() {
    return {
      showUnitDetail: false,
      currentUnit: null,
      // 螺杆和基载机组参数
      unitParams: [
        { label: '额定制冷量', type: 'number', value: 0 },
        { label: '输入功率', type: 'number', value: 0 },
        { label: 'PLR范围', type: 'range', value: [0, 1] },
        { label: '泵体数量', type: 'number', value: 0 },
        { label: '泵体耗电量', type: 'number', value: 0 },
        { label: '最大可输送冷量', type: 'number', value: 0 },
      ]
    };
  },
  methods: {
    showUnitDetailPage(unitId) {
      this.currentUnit = this.units.find(unit => unit.id === unitId);
      if (this.currentUnit) {
        this.showUnitDetail = true;
        this.$nextTick(() => {
          this.renderDailyCoolingChart();
          this.renderDailyPowerChart();
          this.renderSwitchChartBottom();
        });
      }
    },
    getTotal24hCoolingCapacity() {
      if (this.currentUnit) {
        const dailyData = this.getDailyData(this.currentUnit.id);
        return dailyData.reduce((acc, item) => acc + item.coolingCapacity, 0);
      }
      return 0;
    },
    getDailyData(unitId) {
      // 模拟不同机组的一天运行数据
      const unitDailyDataMap = {
        1: [
          { time: '00:00', status: '开启', powerConsumption: 10, coolingCapacity: 50 },
          { time: '01:00', status: '开启', powerConsumption: 12, coolingCapacity: 55 },
          { time: '02:00', status: '开启', powerConsumption: 13, coolingCapacity: 58 },
          { time: '03:00', status: '关闭', powerConsumption: 0, coolingCapacity: 0 },
          { time: '04:00', status: '关闭', powerConsumption: 0, coolingCapacity: 0 },
          { time: '05:00', status: '开启', powerConsumption: 11, coolingCapacity: 52 },
          { time: '06:00', status: '开启', powerConsumption: 14, coolingCapacity: 60 },
          { time: '07:00', status: '开启', powerConsumption: 15, coolingCapacity: 62 },
          { time: '08:00', status: '开启', powerConsumption: 16, coolingCapacity: 65 },
          { time: '09:00', status: '开启', powerConsumption: 17, coolingCapacity: 68 },
          { time: '10:00', status: '开启', powerConsumption: 18, coolingCapacity: 70 },
          { time: '11:00', status: '开启', powerConsumption: 19, coolingCapacity: 72 },
          { time: '12:00', status: '开启', powerConsumption: 20, coolingCapacity: 75 },
          { time: '13:00', status: '开启', powerConsumption: 21, coolingCapacity: 78 },
          { time: '14:00', status: '开启', powerConsumption: 22, coolingCapacity: 80 },
          { time: '15:00', status: '开启', powerConsumption: 23, coolingCapacity: 82 },
          { time: '16:00', status: '开启', powerConsumption: 24, coolingCapacity: 85 },
          { time: '17:00', status: '开启', powerConsumption: 25, coolingCapacity: 88 },
          { time: '18:00', status: '开启', powerConsumption: 26, coolingCapacity: 90 },
          { time: '19:00', status: '开启', powerConsumption: 27, coolingCapacity: 92 },
          { time: '20:00', status: '开启', powerConsumption: 28, coolingCapacity: 95 },
          { time: '21:00', status: '开启', powerConsumption: 29, coolingCapacity: 98 },
          { time: '22:00', status: '关闭', powerConsumption: 0, coolingCapacity: 0 },
          { time: '23:00', status: '关闭', powerConsumption: 0, coolingCapacity: 0 }
        ],
        2: [
          { time: '00:00', status: '关闭', powerConsumption: 0, coolingCapacity: 0 },
          { time: '01:00', status: '关闭', powerConsumption: 0, coolingCapacity: 0 },
          { time: '02:00', status: '开启', powerConsumption: 8, coolingCapacity: 40 },
          { time: '03:00', status: '开启', powerConsumption: 9, coolingCapacity: 42 },
          { time: '04:00', status: '开启', powerConsumption: 10, coolingCapacity: 45 },
          { time: '05:00', status: '关闭', powerConsumption: 0, coolingCapacity: 0 },
          { time: '06:00', status: '关闭', powerConsumption: 0, coolingCapacity: 0 },
          { time: '07:00', status: '开启', powerConsumption: 11, coolingCapacity: 48 },
          { time: '08:00', status: '开启', powerConsumption: 12, coolingCapacity: 50 },
          { time: '09:00', status: '开启', powerConsumption: 13, coolingCapacity: 52 },
          { time: '10:00', status: '开启', powerConsumption: 14, coolingCapacity: 55 },
          { time: '11:00', status: '开启', powerConsumption: 15, coolingCapacity: 58 },
          { time: '12:00', status: '开启', powerConsumption: 16, coolingCapacity: 60 },
          { time: '13:00', status: '开启', powerConsumption: 17, coolingCapacity: 62 },
          { time: '14:00', status: '开启', powerConsumption: 18, coolingCapacity: 65 },
          { time: '15:00', status: '开启', powerConsumption: 19, coolingCapacity: 68 },
          { time: '16:00', status: '开启', powerConsumption: 20, coolingCapacity: 70 },
          { time: '17:00', status: '开启', powerConsumption: 21, coolingCapacity: 72 },
          { time: '18:00', status: '开启', powerConsumption: 22, coolingCapacity: 75 },
          { time: '19:00', status: '开启', powerConsumption: 23, coolingCapacity: 78 },
          { time: '20:00', status: '开启', powerConsumption: 24, coolingCapacity: 80 },
          { time: '21:00', status: '开启', powerConsumption: 25, coolingCapacity: 82 },
          { time: '22:00', status: '关闭', powerConsumption: 0, coolingCapacity: 0 },
          { time: '23:00', status: '关闭', powerConsumption: 0, coolingCapacity: 0 }
        ]
      };
      return unitDailyDataMap[unitId] || []; // 如果没有对应unitId的数据，返回空数组
    },
    renderDailyCoolingChart() {
      if (this.currentUnit) {
        const dailyData = this.getDailyData(this.currentUnit.id);
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
              name: '24h制冷量',
              type: 'line',
              data: coolingCapacities
            }
          ]
        };

        myChart.setOption(option);
      }
    },
    renderDailyPowerChart() {
      if (this.currentUnit) {
        const dailyData = this.getDailyData(this.currentUnit.id);
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
              name: '24h用电量',
              type: 'line',
              data: powerConsumptions
            }
          ]
        };

        myChart.setOption(option);
      }
    },
    renderSwitchChartBottom() {
      if (this.currentUnit) {
        const dailyData = this.getDailyData(this.currentUnit.id);
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const switchStatus = dailyData.map(item => item.status === '开启' ? 1 : 0);

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
              name: '24h开关情况',
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
      }
    },
    goBackToList() {
      this.showUnitDetail = false;
      this.currentUnit = null;
      // 销毁图表实例，以便下次重新渲染
      const chartDom1 = document.getElementById('daily-cooling-chart-container');
      const chartDom2 = document.getElementById('daily-power-chart-container');
      const chartDom3 = document.getElementById('switch-chart-bottom-container');
      if (chartDom1) echarts.dispose(chartDom1);
      if (chartDom2) echarts.dispose(chartDom2);
      if (chartDom3) echarts.dispose(chartDom3);
    }
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