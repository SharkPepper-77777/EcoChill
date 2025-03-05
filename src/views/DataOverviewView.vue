<template>
  <!-- 上半部分 -->
  <div class="upper-section">
    <!-- 左侧区域 -->
    <div class="left-section">
      <!-- 三个数据展示 -->
      <div class="data-display">
        <div class="data-item">
          <span class="data-label">总制冷</span>
          <span class="data-value">15678</span>
        </div>
        <div class="data-item">
          <span class="data-label">总用电量</span>
          <span class="data-value">2345</span>
        </div>
        <div class="data-item">
          <span class="data-label">用电成本</span>
          <span class="data-value">163</span>
        </div>
      </div>
      <!-- 机组总数和饼图 -->
      <div class="unit-pie-container">
        <div class="unit-count">
          <span class="data-label">机组总数</span>
          <span class="data-value">7</span>
        </div>
        <div ref="pieChart" class="pie-chart"></div>
      </div>
    </div>
    <!-- 右侧区域：24H 制冷折线图 -->
    <div class="right-section">
      <div ref="coolingLineChart" class="chart"></div>
    </div>
  </div>

  <!-- 下半部分 -->
  <div class="lower-section">
    <!-- 24h 购电量折线图 -->
    <div ref="purchaseLineChart" class="chart"></div>
    <!-- 24h 开关设备情况柱状图 -->
    <div ref="equipmentBarChart" class="chart"></div>
    <!-- 24h 购电成本折线图 -->
    <div ref="costLineChart" class="chart"></div>
    <!-- 24h 蓄冰量折线图 -->
    <div ref="iceLineChart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'DataOverviewView',
  mounted() {
    this.initCharts();
    window.addEventListener('resize', this.resizeCharts);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeCharts);
  },
  methods: {
    initCharts() {
      this.pieChart = echarts.init(this.$refs.pieChart);
      this.coolingLineChart = echarts.init(this.$refs.coolingLineChart);
      this.purchaseLineChart = echarts.init(this.$refs.purchaseLineChart);
      this.equipmentBarChart = echarts.init(this.$refs.equipmentBarChart);
      this.costLineChart = echarts.init(this.$refs.costLineChart);
      this.iceLineChart = echarts.init(this.$refs.iceLineChart);

      this.initPieChart();
      this.initCoolingLineChart();
      this.initPurchaseLineChart();
      this.initEquipmentBarChart();
      this.initCostLineChart();
      this.initIceLineChart();
    },
    resizeCharts() {
      this.pieChart.resize();
      this.coolingLineChart.resize();
      this.purchaseLineChart.resize();
      this.equipmentBarChart.resize();
      this.costLineChart.resize();
      this.iceLineChart.resize();
    },
    // 初始化饼图
    initPieChart() {
      const pieChart = echarts.init(this.$refs.pieChart);
      const option = {
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: '机组组成',
            type: 'pie',
            radius: '60%',
            data: [
              { value: 3, name: '机组A', itemStyle: { color: '#00ff88' } },
              { value: 2, name: '机组B', itemStyle: { color: '#ffcc00' } },
              { value: 2, name: '机组C', itemStyle: { color: '#00b4ff' } },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            label: {
              show: true, // 显示标签
              color: '#fff',
              fontSize: 12,
              // 可以根据需要调整标签位置，如设置为 'outside' 显示在饼图外侧
              position: 'outside',
            },
            labelLine: {
              length: 20, // 标签线长度
              length2: 10, // 第二段标签线长度，可按需调整
              smooth: 0.2 // 标签线弯曲度
            },
            backgroundColor: 'transparent',
          },
        ],
      };
      pieChart.setOption(option);
    },
    // 初始化 24H 制冷折线图
    initCoolingLineChart() {
      const option = {
        title: {
          text: '24H 制冷',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#fff',
            fontWeight: 'bold'
          }
        },
        xAxis: {
          type: 'category',
          data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#fff', fontSize: 12 }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#fff', fontSize: 12 }
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'line',
            smooth: true,
            lineStyle: { color: '#00c853', width: 2 },
            itemStyle: { color: '#00c853', borderWidth: 2, borderColor: '#fff' },
            symbol: 'circle',
            symbolSize: 8,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 200, 83, 0.3)' },
                { offset: 1, color: 'rgba(0, 200, 83, 0)' }
              ])
            }
          }
        ],
        grid: { left: '10%', right: '10%', bottom: '15%', containLabel: true },
        backgroundColor: 'transparent'
      };
      this.coolingLineChart.setOption(option);
    },
    // 初始化 24h 购电量折线图
    initPurchaseLineChart() {
      const option = {
        title: {
          text: '24h 购电量',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#fff',
            fontWeight: 'bold'
          }
        },
        xAxis: {
          type: 'category',
          data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#fff', fontSize: 12 }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#fff', fontSize: 12 }
        },
        series: [
          {
            data: [50, 80, 70, 90, 60, 100, 120],
            type: 'line',
            smooth: true,
            lineStyle: { color: '#ffd600', width: 2 },
            itemStyle: { color: '#ffd600', borderWidth: 2, borderColor: '#fff' },
            symbol: 'circle',
            symbolSize: 8,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 214, 0, 0.3)' },
                { offset: 1, color: 'rgba(255, 214, 0, 0)' }
              ])
            }
          }
        ],
        grid: { left: '10%', right: '10%', bottom: '15%', containLabel: true },
        backgroundColor: 'transparent'
      };
      this.purchaseLineChart.setOption(option);
    },
    // 初始化 24h 开关设备情况柱状图
    initEquipmentBarChart() {
      const option = {
        title: {
          text: '24h 开关设备情况',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#fff',
            fontWeight: 'bold'
          }
        },
        xAxis: {
          type: 'category',
          data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#fff', fontSize: 12 }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#fff', fontSize: 12 }
        },
        series: [
          {
            name: '机组A',
            type: 'bar',
            stack: '机组',
            itemStyle: {
              color: '#00c853',
              barBorderRadius: [3, 3, 0, 0],
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 5,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            data: [1, 1, 0, 1, 0, 1, 1]
          },
          {
            name: '机组B',
            type: 'bar',
            stack: '机组',
            itemStyle: {
              color: '#ffd600',
              barBorderRadius: [3, 3, 0, 0],
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 5,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            data: [0, 1, 1, 0, 1, 0, 1]
          },
          {
            name: '机组C',
            type: 'bar',
            stack: '机组',
            itemStyle: {
              color: '#0091ea',
              barBorderRadius: [3, 3, 0, 0],
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 5,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            data: [1, 0, 1, 1, 0, 1, 0]
          }
        ],
        grid: { left: '10%', right: '10%', bottom: '15%', containLabel: true },
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontSize: 12,
            color: '#fff'
          },
          formatter: function (params) {
            let result = params[0].name + '<br>';
            for (let i = 0; i < params.length; i++) {
              result += params[i].seriesName + ': ' + params[i].value + '<br>';
            }
            return result;
          }
        }
      };
      this.equipmentBarChart.setOption(option);
    },
    // 初始化 24h 购电成本折线图
    initCostLineChart() {
      const option = {
        title: {
          text: '24h 购电成本',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#fff',
            fontWeight: 'bold'
          }
        },
        xAxis: {
          type: 'category',
          data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#fff', fontSize: 12 }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#fff', fontSize: 12 }
        },
        series: [
          {
            data: [30, 50, 40, 60, 50, 70, 80],
            type: 'line',
            smooth: true,
            lineStyle: { color: '#ff6666', width: 2 },
            itemStyle: { color: '#ff6666', borderWidth: 2, borderColor: '#fff' },
            symbol: 'circle',
            symbolSize: 8,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 102, 102, 0.3)' },
                { offset: 1, color: 'rgba(255, 102, 102, 0)' }
              ])
            }
          }
        ],
        grid: { left: '10%', right: '10%', bottom: '15%', containLabel: true },
        backgroundColor: 'transparent'
      };
      this.costLineChart.setOption(option);
    },
    // 初始化 24h 蓄冰量折线图
    initIceLineChart() {
      const option = {
        title: {
          text: '24h 蓄冰量',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#fff',
            fontWeight: 'bold'
          }
        },
        xAxis: {
          type: 'category',
          data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#fff', fontSize: 12 }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#fff', fontSize: 12 }
        },
        series: [
          {
            data: [100, 150, 120, 130, 140, 160, 180],
            type: 'line',
            smooth: true,
            lineStyle: { color: '#0091ea', width: 2 },
            itemStyle: { color: '#0091ea', borderWidth: 2, borderColor: '#fff' },
            symbol: 'circle',
            symbolSize: 8,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 145, 234, 0.3)' },
                { offset: 1, color: 'rgba(0, 145, 234, 0)' }
              ])
            }
          }
        ],
        grid: { left: '10%', right: '10%', bottom: '15%', containLabel: true },
        backgroundColor: 'transparent'
      };
      this.iceLineChart.setOption(option);
    }
  }
};
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}

body {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #1a1a2e;
  color: #fff;
  padding: 20px;
  margin: 0;
}

.upper-section {
  display: flex;
  height: 45%;

  .left-section {
    width: 40%;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .data-display {
      display: flex;
      justify-content: space-around; // 使数据项均匀分布
      align-items: center; // 垂直居中对齐
      padding: 0; // 去除多余内边距
      height: auto; // 根据内容自动调整高度
    }

    .data-item {
      background: rgba(255, 255, 255, 0.1);
      padding: 10px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      // 增大宽度以占据更多空间
      width: 30%;
      // 可适当调整高度
      height: auto;
    }

    .data-label {
      font-size: 14px;
      color: #00b4ff;
    }

    .data-value {
      font-size: 18px;
      font-weight: bold;
      // 可以根据需要添加一些上下间距
      margin-top: 5px;
    }



    .unit-pie-container {
      display: flex;
      align-items: center;
      justify-content: space-around;
      /* 让机组总数和饼图均匀分布 */
      height: auto;
      /* 根据内容自动调整高度 */
      gap: 20px;

      .unit-count {
        background: rgba(255, 255, 255, 0.1);
        padding: 10px 20px;
        border-radius: 20px;
        text-align: center;
        // 添加以下样式
        display: flex;
        flex-direction: column;
        align-items: center;
        height: auto;

        /* 根据内容自动调整高度 */
        .data-label {
          font-size: 14px;
          color: #00b4ff;
        }

        .data-value {
          font-size: 18px;
          font-weight: bold;
        }
      }

      .pie-chart {
        width: 50%;
        /* 增大饼图尺寸 */
        height: 200px;
      }
    }
  }

  .right-section {
    width: 60%;

    .chart {
      width: 100%;
      height: 100%;
    }
  }
}

.lower-section {
  display: grid;
  grid-template-columns: repeat(2, 49%);
  grid-template-rows: repeat(2, 49%);
  gap: 20px;
  height: 55%;

  .chart {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 5px;
  }
}
</style>