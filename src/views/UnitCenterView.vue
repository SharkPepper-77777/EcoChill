<template>
  <div>
    <!-- 机组列表界面 -->
    <div v-if="!showUnitDetail" class="unit-list-page">
      <h2>机组列表</h2>
      <div class="unit-card-list">
        <div v-for="unit in filteredUnits" :key="unit.id" class="unit-card" @click="showUnitDetailPage(unit.id)">
          <h3>{{ unit.name }}</h3>
          <p>类型: {{ unit.type }}</p>
          <!-- 显示部分通用参数示例 -->
          <p v-if="unit.unitParams">额定制冷量: {{ unit.unitParams.param1 }}</p>
          <p v-if="unit.coolingModeParams">制冷模式额定制冷量: {{ unit.coolingModeParams.param1 }}</p>
        </div>
      </div>
    </div>

    <!-- 机组详情界面 -->
    <div v-if="showUnitDetail" class="unit-detail-page">
      <button class="back-button" @click="goBackToList">返回</button>
      <h2>{{ currentUnit.name }} 详细信息</h2>

      <!-- 显示所有机组参数 -->
      <div v-if="currentUnit.type === '螺杆' || currentUnit.type === '基载'">
        <h3>机组参数</h3>
        <ul>
          <li v-for="(value, key) in currentUnit.unitParams" :key="key">{{ key }}: {{ value }}</li>
        </ul>
      </div>
      <div v-if="currentUnit.type === '双工况'">
        <h3>制冷模式参数</h3>
        <ul>
          <li v-for="(value, key) in currentUnit.coolingModeParams" :key="key">{{ key }}: {{ value }}</li>
        </ul>
        <h3>制冰模式参数</h3>
        <ul>
          <li v-for="(value, key) in currentUnit.iceModeParams" :key="key">{{ key }}: {{ value }}</li>
        </ul>
      </div>
      <h3>储能装置参数</h3>
      <ul>
        <li>最大蓄冰量: {{ currentUnit.storageParams.maxIceStorage }}</li>
        <li>冷量损失系数: {{ currentUnit.storageParams.coolingLossCoefficient }}</li>
      </ul>
      <!-- 模拟一整天的开关情况、用电量和制冷量 -->
      <h3>一整天运行数据</h3>
      <div id="echarts-container" style="width: 100%; height: 400px;"></div>
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
      currentUnit: null
    };
  },
  methods: {
    showUnitDetailPage(unitId) {
      this.currentUnit = this.units.find(unit => unit.id === unitId);
      this.showUnitDetail = true;
      this.$nextTick(() => {
        this.renderChart();
      });
    },
    getDailyData(unitId) {
      // 这里假设你有一个模拟的数据集来存储每个机组的运行数据
      const unitDailyDataMap = {
        1: [
          // 机组1的一天数据
          { time: '00:00', status: '开启', powerConsumption: 10, coolingCapacity: 50 },
          { time: '01:00', status: '开启', powerConsumption: 12, coolingCapacity: 55 },
          // 更多数据...
        ],
        2: [
          // 机组2的一天数据
          { time: '00:00', status: '关闭', powerConsumption: 0, coolingCapacity: 0 },
          { time: '01:00', status: '关闭', powerConsumption: 0, coolingCapacity: 0 },
          // 更多数据...
        ]
      };
      return unitDailyDataMap[unitId] || []; // 如果没有对应unitId的数据，返回空数组
    },
    renderChart() {
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

      option && myChart.setOption(option);
    },
    goBackToList() {
      this.showUnitDetail = false;
      this.currentUnit = null;
    }
  }
};
</script>

<style scoped>
.unit-list-page {
  padding: 20px;
}

.unit-card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.unit-card {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  cursor: pointer;
}

.unit-detail-page {
  padding: 20px;
}

.back-button {
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #0056b3;
}
</style>