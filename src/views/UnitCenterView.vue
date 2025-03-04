<template>
  <div>
    <!-- 机组列表界面 -->
    <div v-if="!showUnitDetail" class="unit-list-page">
      <div class="unit-card-list">
        <div v-for="unit in filteredUnits" :key="unit.id" class="unit-card" @click="showUnitDetailPage(unit.id)">
          <h3 class="card-title">#{{ unit.id }}</h3>
          <p class="card-type">类型: {{ unit.type }}</p>
          <!-- 显示部分通用参数示例 -->
          <p v-if="unit.unitParams" class="card-param">额定制冷量: {{ unit.unitParams.param1 }}</p>
          <p v-if="unit.coolingModeParams" class="card-param">制冷模式额定制冷量: {{ unit.coolingModeParams.param1 }}</p>
        </div>
      </div>
    </div>

    <!-- 机组详情界面 -->
    <div v-if="showUnitDetail" class="unit-detail-page">
      <div class="detail-header">
        <button class="back-button" @click="goBackToList">
          <i class="arrow-left"></i>
        </button>
        <div class="header-middle">
          <span class="unit-name">{{ currentUnit.type }}</span>
        </div>
        <div class="header-right">
          <span class="unit-number">#{{ currentUnit.id }}</span>
        </div>
      </div>

      <div class="detail-content">
        <div class="params-section">
          <!-- 显示所有机组参数 -->
          <div v-if="currentUnit.type === '螺杆' || currentUnit.type === '基载'">
            <h3 class="section-title">机组参数</h3>
            <div class="param-grid">
              <!-- 遍历螺杆和基载机组的参数 -->
              <div v-for="(param, index) in unitParams" :key="index" class="param-row">
                <span class="param-name">{{ param.label }}:</span>
                <span class="param-value">{{ currentUnit.unitParams[index] }}</span>
              </div>
            </div>
          </div>
          <div v-if="currentUnit.type === '双工况'">
            <div class="mode-params">
              <h3 class="section-title">制冷模式参数</h3>
              <div class="param-grid">
                <!-- 遍历双工况机组制冷模式的参数 -->
                <div v-for="(param, index) in coolingModeParams" :key="index" class="param-row">
                  <span class="param-name">{{ param.label }}:</span>
                  <span class="param-value">{{ currentUnit.coolingModeParams[index] }}</span>
                </div>
              </div>
            </div>
            <div class="mode-params">
              <h3 class="section-title">制冰模式参数</h3>
              <div class="param-grid">
                <!-- 遍历双工况机组制冰模式的参数 -->
                <div v-for="(param, index) in iceModeParams" :key="index" class="param-row">
                  <span class="param-name">{{ param.label }}:</span>
                  <span class="param-value">{{ currentUnit.iceModeParams[index] }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="storage-params">
            <h3 class="section-title">储能装置参数</h3>
            <div class="param-grid">
              <div class="param-item">
                <span class="param-label">最大蓄冰量</span>
                <span class="param-value">{{ currentUnit.storageParams.maxIceStorage }}</span>
              </div>
              <div class="param-item">
                <span class="param-label">冷量损失系数</span>
                <span class="param-value">{{ currentUnit.storageParams.coolingLossCoefficient }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="charts-section">
          <!-- 模拟一整天的开关情况、用电量和制冷量 -->
          <div class="daily-data">
            <h3 class="section-title">一整天运行数据</h3>
            <div id="echarts-container" class="chart-container"></div>
          </div>
          <div class="switch-chart">
            <h3 class="section-title">24小时开关状态</h3>
            <div id="switch-chart-container" class="chart-container"></div>
          </div>
          <!-- 这里可以添加更多图表，比如饼图 -->
          <div class="pie-chart">
            <h3 class="section-title">示例饼图1</h3>
            <div id="pie-chart-container-1" class="chart-container"></div>
          </div>
          <div class="pie-chart">
            <h3 class="section-title">示例饼图2</h3>
            <div id="pie-chart-container-2" class="chart-container"></div>
          </div>
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
    }
  },
  data() {
    return {
      showUnitDetail: false,
      currentUnit: null,
      dailySwitchData: [],
      // 螺杆和基载机组参数
      unitParams: [
        { label: '额定制冷量', type: 'number', value: 0 },
        { label: '输入功率', type: 'number', value: 0 },
        { label: 'PLR范围', type: 'range', value: [0, 1] },
        { label: '泵体数量', type: 'number', value: 0 },
        { label: '泵体耗电量', type: 'number', value: 0 },
        { label: '最大可输送冷量', type: 'number', value: 0 },
      ],
      // 双工况机组制冷模式参数
      coolingModeParams: [
        { label: '额定制冷量', type: 'number', value: 0 },
        { label: '输入功率', type: 'number', value: 0 },
        { label: 'PLR范围', type: 'range', value: [0, 1] },
        { label: '泵体数量', type: 'number', value: 0 },
        { label: '泵体耗电量', type: 'number', value: 0 },
        { label: '最大可输送冷量', type: 'number', value: 0 },
      ],
      // 双工况机组制冰模式参数
      iceModeParams: [
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
        this.generateDailySwitchData();
        this.$nextTick(() => {
          this.renderChart();
          this.renderSwitchChart();
          this.renderPieChart(1);
          this.renderPieChart(2);
        });
      }
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
    renderChart() {
      if (this.currentUnit) {
        const dailyData = this.getDailyData(this.currentUnit.id);
        const times = dailyData.map(item => item.time);
        const powerConsumptions = dailyData.map(item => item.powerConsumption);
        const coolingCapacities = dailyData.map(item => item.coolingCapacity);

        const chartDom = document.getElementById('echarts-container');
        const myChart = echarts.init(chartDom);
        const option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['用电量', '制冷量']
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
              name: '用电量',
              type: 'line',
              data: powerConsumptions
            },
            {
              name: '制冷量',
              type: 'line',
              data: coolingCapacities
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
      const chartDom1 = document.getElementById('echarts-container');
      const chartDom2 = document.getElementById('switch-chart-container');
      const chartDom3 = document.getElementById('pie-chart-container-1');
      const chartDom4 = document.getElementById('pie-chart-container-2');
      if (chartDom1) echarts.dispose(chartDom1);
      if (chartDom2) echarts.dispose(chartDom2);
      if (chartDom3) echarts.dispose(chartDom3);
      if (chartDom4) echarts.dispose(chartDom4);
    },
    generateDailySwitchData() {
      if (this.currentUnit) {
        const dailyData = this.getDailyData(this.currentUnit.id);
        this.dailySwitchData = dailyData.map(item => item.status === '开启' ? 1 : 0);
      }
    },
    renderSwitchChart() {
      if (this.currentUnit) {
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const switchData = this.dailySwitchData;

        const chartDom = document.getElementById('switch-chart-container');
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
              name: '开关状态',
              type: 'bar',
              data: switchData,
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
    renderPieChart(index) {
      if (this.currentUnit) {
        const chartDom = document.getElementById(`pie-chart-container-${index}`);
        const myChart = echarts.init(chartDom);
        const option = {
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              name: '示例数据',
              type: 'pie',
              radius: '50%',
              data: [
                { value: 335, name: '直接访问' },
                { value: 310, name: '邮件营销' },
                { value: 234, name: '联盟广告' },
                { value: 135, name: '视频广告' },
                { value: 1548, name: '搜索引擎' }
              ]
            }
          ]
        };

        myChart.setOption(option);
      }
    }
  }
};
</script>

<style scoped>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f4f9;
  color: #333;
}

.unit-list-page {
  padding: 20px;
}

.unit-card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.unit-card {
  background-color: #fff;
  border: none;
  border-radius: 10px;
  padding: 20px;
  width: 21%;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.unit-card:hover {
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

.unit-detail-page {
  padding: 20px;
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 10px;
  padding: 15px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #2c3e50;
  margin-right: 20px;
}

.arrow-left::before {
  content: '←';
}

.header-middle {
  flex: 1;
  text-align: center;
}

.unit-name {
  color: #2c3e50;
  font-size: 24px;
  font-weight: bold;
}

.header-right {
  text-align: right;
}

.unit-number {
  color: #7f8c8d;
  font-size: 20px;
}

.detail-content {
  display: flex;
  gap: 20px;
}

.params-section {
  flex: 1;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.param-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.param-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 5px;
}

.param-label {
  font-weight: bold;
  color: #2c3e50;
}

.param-value {
  color: #7f8c8d;
}

.charts-section {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.daily-data,
.switch-chart,
.pie-chart {
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: calc((100% - 30px) / 4);
  /* 一排显示四个图表 */
}

.section-title {
  color: #2c3e50;
  font-size: 16px;
  margin-bottom: 5px;
}

.chart-container {
  width: 100%;
  height: 150px;
  /* 减小图表高度 */
}
</style>