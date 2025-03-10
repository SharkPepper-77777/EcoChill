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
        <!-- 左侧容器：时间框和机组总数框 -->
        <div class="left-container">
          <!-- 时间框 -->
          <div class="data-time">
            <span class="data-label">数据生成时间</span>
            <span class="data-value">2023-10-25 14:30</span>
          </div>
          <!-- 机组总数框 -->
          <div class="unit-count">
            <span class="data-label">机组总数</span>
            <span class="data-value">7</span>
          </div>
        </div>
        <!-- 饼图框 -->
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
              { value: 3, name: '机组A', itemStyle: { color: '#748ffc' } },
              { value: 2, name: '机组B', itemStyle: { color: '#dbe4ff' } },
              { value: 2, name: '机组C', itemStyle: { color: '#a0a7fa' } },
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
              color: '#89aad7',
              fontSize: 17,
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
      // 生成三种机组的随机数据
      const dataA = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));
      const dataB = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));
      const dataC = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));

      // 计算总制冷量（三种机组制冷量之和）
      const totalData = dataA.map((value, index) => value + dataB[index] + dataC[index]);

      const option = {
        title: {
          text: '24H 制冷',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#60b0e8',
            fontWeight: 'bold'
          }
        },
        xAxis: {
          type: 'category',
          data: Array.from({ length: 24 }, (_, i) => `${i}:00`), // 生成 24 个时间点
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#252525', fontSize: 12 }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#252525', fontSize: 12 }
        },
        series: [
          // 柱状图部分 - 机组A
          {
            name: '机组A',
            type: 'bar',
            stack: '机组',
            itemStyle: {
              color: 'rgba(116, 143, 252, 0.6)', // 降低透明度
              barBorderRadius: [3, 3, 0, 0],
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 5,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            data: dataA
          },
          // 柱状图部分 - 机组B
          {
            name: '机组B',
            type: 'bar',
            stack: '机组',
            itemStyle: {
              color: 'rgba(219, 228, 255, 0.6)', // 降低透明度
              barBorderRadius: [3, 3, 0, 0],
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 5,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            data: dataB
          },
          // 柱状图部分 - 机组C
          {
            name: '机组C',
            type: 'bar',
            stack: '机组',
            itemStyle: {
              color: 'rgba(160, 167, 250, 0.6)', // 降低透明度
              barBorderRadius: [3, 3, 0, 0],
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 5,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            data: dataC
          },
          // 折线图部分 - 总制冷量
          {
            name: '总制冷量',
            type: 'line',
            smooth: true,
            lineStyle: { color: '#60b0e8', width: 3 }, // 加粗线条
            itemStyle: { color: '#60b0e8', borderWidth: 2, borderColor: '#fff' },
            symbol: 'circle',
            symbolSize: 8,
            data: totalData, // 使用总制冷量数据
            z: 10 // 确保折线图在柱状图上方
          }
        ],
        grid: { left: '10%', right: '10%', bottom: '13%', top: '23%', containLabel: true },
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontSize: 12,
            color: '#252525'
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
            color: '#3b5bdb',
            fontWeight: 'bold'
          }
        },
        xAxis: {
          type: 'category',
          data: Array.from({ length: 24 }, (_, i) => `${i}:00`), // 生成 24 个时间点
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#252525', fontSize: 12 }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#252525', fontSize: 12 }
        },
        series: [
          {
            data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 200)), // 生成 24 个随机数据点
            type: 'line',
            smooth: true,
            lineStyle: { color: '#3b5bdb', width: 2 },
            itemStyle: { color: '#3b5bdb', borderWidth: 2, borderColor: '#fff' },
            symbol: 'circle',
            symbolSize: 8,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(59, 91, 219, 0.3)' },
                { offset: 1, color: 'rgba(186,220,255, 0)' }
              ])
            }
          }
        ],
        grid: { left: '10%', right: '10%', bottom: '13%', top: '25%', containLabel: true }, // 调整 top 值
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
            color: '#748ffc',
            fontWeight: 'bold'
          }
        },
        xAxis: {
          type: 'category',
          data: Array.from({ length: 24 }, (_, i) => `${i}:00`), // 生成 24 个时间点
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#252525', fontSize: 12 }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#252525', fontSize: 12 }
        },
        series: [
          {
            name: '机组A',
            type: 'bar',
            stack: '机组',
            itemStyle: {
              color: '#748ffc',
              barBorderRadius: [3, 3, 0, 0],
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 5,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 2)) // 生成 24 个随机数据点
          },
          {
            name: '机组B',
            type: 'bar',
            stack: '机组',
            itemStyle: {
              color: '#dbe4ff',
              barBorderRadius: [3, 3, 0, 0],
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 5,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 2)) // 生成 24 个随机数据点
          },
          {
            name: '机组C',
            type: 'bar',
            stack: '机组',
            itemStyle: {
              color: '#a0a7fa',
              barBorderRadius: [3, 3, 0, 0],
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 5,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 2)) // 生成 24 个随机数据点
          }
        ],
        grid: { left: '10%', right: '10%', bottom: '13%', top: '25%', containLabel: true }, // 调整 top 值
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontSize: 12,
            color: '#252525'
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
            color: '#91a7ff',
            fontWeight: 'bold'
          }
        },
        xAxis: {
          type: 'category',
          data: Array.from({ length: 24 }, (_, i) => `${i}:00`), // 生成 24 个时间点
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#252525', fontSize: 12 }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#252525', fontSize: 12 }
        },
        series: [
          {
            data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)), // 生成 24 个随机数据点
            type: 'line',
            smooth: true,
            lineStyle: { color: '#91a7ff', width: 2 },
            itemStyle: { color: '#91a7ff', borderWidth: 2, borderColor: '#' },
            symbol: 'circle',
            symbolSize: 8,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(145,167,255, 0.3)' },
                { offset: 1, color: 'rgba(219,228,255, 0)' }
              ])
            }
          }
        ],
        grid: { left: '10%', right: '10%', bottom: '13%', top: '25%', containLabel: true }, // 调整 top 值
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
            color: '#a9a3ca',
            fontWeight: 'bold'
          }
        },
        xAxis: {
          type: 'category',
          data: Array.from({ length: 24 }, (_, i) => `${i}:00`), // 生成 24 个时间点
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#252525', fontSize: 12 }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#252525', fontSize: 12 }
        },
        series: [
          {
            data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 200)), // 生成 24 个随机数据点
            type: 'line',
            smooth: true,
            lineStyle: { color: '#a9a3ca', width: 2 },
            itemStyle: { color: '#a9a3ca', borderWidth: 2, borderColor: '#fff' },
            symbol: 'circle',
            symbolSize: 8,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(169,163,202, 0.3)' },
                { offset: 1, color: 'rgba(212,214, 234, 0)' }
              ])
            }
          }
        ],
        grid: { left: '10%', right: '10%', bottom: '13%', top: '25%', containLabel: true }, // 调整 top 值
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
  color: #252525;
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

    .data-container {
      width: 100%; // 占满左侧区域宽度
      display: flex;
      justify-content: flex-start; // 左对齐
      padding-left: 0; // 去除左侧内边距
    }

    .data-display {
      display: flex;
      justify-content: space-between; // 均匀分布三个框
      align-items: center;
      width: 92.5%; // 占满容器宽度
      padding: 0; // 去除内边距

      .data-item {
        padding: 2%;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 30%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: box-shadow 0.3s ease;

        &:hover {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }

        &:nth-child(1) {
          background: linear-gradient(135deg, #ffa2a2, #ff9696);

          .data-label,
          .data-value {
            color: #682e26;
          }
        }

        &:nth-child(2) {
          background: linear-gradient(135deg, #ffeaa4, #ffeb78);

          .data-label,
          .data-value {
            color: #805e00;
          }
        }

        &:nth-child(3) {
          background: linear-gradient(135deg, #95ffc1, #58ffa6);

          .data-label,
          .data-value {
            color: #2c632c;
          }
        }

        .data-label {
          font-size: 0.9em; // 使用百分比设置字体大小
          font-weight: bold;
        }

        .data-value {
          font-size: 2em; // 使用百分比设置字体大小
          font-weight: bold;
          margin-top: 2px;
        }
      }
    }

    .unit-pie-container {
      display: flex;
      align-items: center;
      gap: 20px;
      height: 50%;

      .left-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        width: 40%;

        .data-time,
        .unit-count {
          background: white;
          padding: 10px 20px;
          border-radius: 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: box-shadow 0.3s ease;
          height: 45%;
          margin-bottom: 10px;

          &:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          }

          .data-label {
            font-size: 0.7em;
            color: #0061bd;
            font-weight: bold;
          }

          .data-value {
            font-size: 1em;
            font-weight: bold;
            color: #0061bd;
          }
        }

        .data-time {
          margin-bottom: 10px;
        }

        .unit-count {
          margin-bottom: 0;
        }
      }

      .pie-chart {
        width: 50%;
        height: 100%;
        background: white;
        border-radius: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: box-shadow 0.3s ease;

        &:hover {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }
      }
    }
  }

  .right-section {
    width: 60%;

    .chart {
      width: 98.5%;
      height: 95%;
      background: white;
      border-radius: 20px;
      padding: 5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transition: box-shadow 0.3s ease;

      &:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      }
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
    background: linear-gradient(135deg, #ffffff, #f0f0f0); // 白色渐变背景
    border-radius: 20px; // 圆角改为 20px
    padding: 5px 5px 5px 5px; // 减少 padding-top 以减少标题与图之间的距离
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); // 添加阴影，悬浮效果
    transition: box-shadow 0.3s ease; // 添加过渡效果

    &:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); // 悬浮时阴影加深
    }

    &:nth-child(1) {
      background: linear-gradient(135deg, #ffffff, #ffffff); // 第一个框的渐变颜色
    }

    &:nth-child(2) {
      background: linear-gradient(135deg, #ffffff, #ffffff); // 第二个框的渐变颜色
    }

    &:nth-child(3) {
      background: linear-gradient(135deg, #ffffff, #ffffff); // 第三个框的渐变颜色
    }

    &:nth-child(4) {
      background: linear-gradient(135deg, #ffffff, #ffffff); // 第四个框的渐变颜色
    }
  }
}
</style>