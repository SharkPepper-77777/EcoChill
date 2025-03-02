<template>
  <div class="data-overview-view">
    <h1>数据总览</h1>
    <p>这里是数据总览的内容。</p>

    <!-- 图表容器 -->
    <div class="charts-grid">
      <!-- 柱状图 1 -->
      <div ref="barChart1" class="chart"></div>
      <!-- 柱状图 2 -->
      <div ref="barChart2" class="chart"></div>
      <!-- 折线图 1 -->
      <div ref="lineChart1" class="chart"></div>
      <!-- 折线图 2 -->
      <div ref="lineChart2" class="chart"></div>
      <!-- 饼图 1 -->
      <div ref="pieChart1" class="chart"></div>
      <!-- 饼图 2 -->
      <div ref="pieChart2" class="chart"></div>
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
            fontSize: 14, // 标题字体大小
          },
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
          },
        ],
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
            fontSize: 14, // 标题字体大小
          },
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'line',
          },
        ],
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
            fontSize: 14, // 标题字体大小
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
          },
        ],
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

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .charts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 列 */
    gap: 20px; /* 图表之间的间距 */
  }

  .chart {
    height: 300px; /* 固定高度 */
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 10px; /* 内边距 */
  }
}
</style>