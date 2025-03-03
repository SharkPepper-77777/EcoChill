<template>
  <div class="data-overview-view">
    <!-- 图表容器 -->
    <div class="charts-grid">
      <!-- 柱状图组 -->
      <div class="chart-group">
        <h2 class="group-title">柱状图</h2>
        <div class="group-content">
          <div ref="barChart1" class="chart"></div>
          <div ref="barChart2" class="chart"></div>
        </div>
      </div>

      <!-- 折线图组 -->
      <div class="chart-group">
        <h2 class="group-title">折线图</h2>
        <div class="group-content">
          <div ref="lineChart1" class="chart"></div>
          <div ref="lineChart2" class="chart"></div>
        </div>
      </div>

      <!-- 饼图组 -->
      <div class="chart-group">
        <h2 class="group-title">饼图</h2>
        <div class="group-content">
          <div ref="pieChart1" class="chart"></div>
          <div ref="pieChart2" class="chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'DataOverviewView',
  mounted() {
    this.initCharts(); // 初始化图表
  },
  methods: {
    // 初始化所有图表
    initCharts() {
      this.initBarChart(this.$refs.barChart1, '柱状图 1');
      this.initBarChart(this.$refs.barChart2, '柱状图 2');
      this.initLineChart(this.$refs.lineChart1, '折线图 1');
      this.initLineChart(this.$refs.lineChart2, '折线图 2');
      this.initPieChart(this.$refs.pieChart1, '饼图 1');
      this.initPieChart(this.$refs.pieChart2, '饼图 2');
    },

    // 初始化柱状图
    initBarChart(chartDom, title) {
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: title,
          left: 'center',
          textStyle: {
            fontSize: 14,
            color: '#fff', // 标题颜色
          },
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLine: {
            lineStyle: {
              color: '#6c757d', // 坐标轴颜色
            },
          },
          axisLabel: {
            color: '#fff', // 坐标轴文字颜色
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#6c757d', // 坐标轴颜色
            },
          },
          axisLabel: {
            color: '#fff', // 坐标轴文字颜色
          },
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#00b4ff' }, // 渐变起始颜色
                { offset: 1, color: '#0066ff' }, // 渐变结束颜色
              ]),
            },
          },
        ],
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%',
          containLabel: true,
        },
        backgroundColor: 'transparent', // 透明背景
      };

      myChart.setOption(option);

      // 动态更新柱状图数据
      setInterval(() => {
        const newData = Array.from({ length: 7 }, () => Math.random() * 200);
        myChart.setOption({
          series: [{ data: newData }],
        });
      }, 2000);
    },

    // 初始化折线图
    initLineChart(chartDom, title) {
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: title,
          left: 'center',
          textStyle: {
            fontSize: 14,
            color: '#fff', // 标题颜色
          },
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLine: {
            lineStyle: {
              color: '#6c757d', // 坐标轴颜色
            },
          },
          axisLabel: {
            color: '#fff', // 坐标轴文字颜色
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#6c757d', // 坐标轴颜色
            },
          },
          axisLabel: {
            color: '#fff', // 坐标轴文字颜色
          },
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'line',
            smooth: true, // 平滑曲线
            lineStyle: {
              color: '#00ff88', // 线条颜色
              width: 2,
            },
            itemStyle: {
              color: '#00ff88', // 点颜色
            },
          },
        ],
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%',
          containLabel: true,
        },
        backgroundColor: 'transparent', // 透明背景
      };

      myChart.setOption(option);

      // 动态更新折线图数据
      setInterval(() => {
        const newData = Array.from({ length: 7 }, () => Math.random() * 200);
        myChart.setOption({
          series: [{ data: newData }],
        });
      }, 2000);
    },

    // 初始化饼图
    initPieChart(chartDom, title) {
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: title,
          left: 'center',
          textStyle: {
            fontSize: 14,
            color: '#fff', // 标题颜色
          },
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: '搜索引擎' },
              { value: 735, name: '直接访问' },
              { value: 580, name: '邮件营销' },
              { value: 484, name: '联盟广告' },
              { value: 300, name: '视频广告' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            itemStyle: {
              color: function (params) {
                const colors = ['#00b4ff', '#0066ff', '#00ff88', '#ffcc00', '#ff6666'];
                return colors[params.dataIndex % colors.length];
              },
            },
          },
        ],
        backgroundColor: 'transparent', // 透明背景
      };

      myChart.setOption(option);

      // 动态更新饼图数据
      setInterval(() => {
        const newData = [
          { value: Math.random() * 1000, name: '搜索引擎' },
          { value: Math.random() * 1000, name: '直接访问' },
          { value: Math.random() * 1000, name: '邮件营销' },
          { value: Math.random() * 1000, name: '联盟广告' },
          { value: Math.random() * 1000, name: '视频广告' },
        ];
        myChart.setOption({
          series: [{ data: newData }],
        });
      }, 2000);
    },
  },
};
</script>

<style scoped lang="scss">
.data-overview-view {
  padding: 20px;
  background-color: #1a1a2e; // 深色背景
  min-height: 100vh;
  color: #fff;

  .charts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); // 2 列
    gap: 20px; // 图表之间的间距
  }

  .chart-group {
    background: linear-gradient(145deg, #16213e, #1a1a2e); // 渐变背景
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    .group-title {
      font-size: 18px;
      margin-bottom: 16px;
      color: #00b4ff; // 霓虹蓝色
      text-align: center;
    }

    .group-content {
      display: grid;
      grid-template-columns: repeat(2, 1fr); // 每组内 2 列
      gap: 16px;
    }

    .chart {
      height: 250px; // 固定高度
      background-color: rgba(255, 255, 255, 0.05); // 半透明背景
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>