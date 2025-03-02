<template>
  <div class="historical-reports-view">
    <!-- 搜索框和操作按钮 -->
    <div class="search-and-actions">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="输入报表编号搜索"
          class="search-input"
        />
        <button @click="handleSearch" class="search-button">搜索</button>
      </div>
      <button @click="handleBatchExport" class="batch-export-button">批量导出</button>
    </div>
    <!-- 表格 -->
    <table class="reports-table">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              :checked="isAllSelected"
              @change="toggleSelectAll"
            />
          </th>
          <th>报表编号</th>
          <th>生成时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="report in filteredReports"
          :key="report.id"
          :class="{ selected: selectedReports.includes(report.id) }"
        >
          <td>
            <input
              type="checkbox"
              :checked="selectedReports.includes(report.id)"
              @change="toggleSelect(report.id)"
            />
          </td>
          <td>{{ report.id }}</td>
          <td>{{ report.date }}</td>
          <td>
            <button @click="handleView(report)" class="action-button view-button">查看</button>
            <button @click="handleExport(report)" class="action-button export-button">导出</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'HistoricalReportsView',
  data() {
    return {
      searchQuery: '', // 搜索框内容
      selectedReports: [], // 选中的报表编号
      reports: [
        { id: '001', date: '2023-10-01 10:00' },
        { id: '002', date: '2023-10-02 11:00' },
        { id: '003', date: '2023-10-03 12:00' },
        { id: '004', date: '2023-10-04 13:00' },
        { id: '005', date: '2023-10-05 14:00' },
      ], // 报表数据
    };
  },
  computed: {
    // 过滤后的报表数据
    filteredReports() {
      return this.reports.filter((report) =>
        report.id.includes(this.searchQuery)
      );
    },
    // 是否全选
    isAllSelected() {
      return (
        this.filteredReports.length > 0 &&
        this.filteredReports.every((report) =>
          this.selectedReports.includes(report.id)
        )
      );
    },
  },
  methods: {
    // 处理搜索
    handleSearch() {
      console.log('搜索内容:', this.searchQuery);
    },
    // 处理查看
    handleView(report) {
      console.log('查看报表:', report);
      alert(`查看报表：${report.id}`);
    },
    // 处理导出
    handleExport(report) {
      console.log('导出报表:', report);
      alert(`导出报表：${report.id}`);
    },
    // 处理批量导出
    handleBatchExport() {
      if (this.selectedReports.length === 0) {
        alert('请先选择报表！');
      } else {
        console.log('批量导出报表:', this.selectedReports);
        alert(`批量导出报表：${this.selectedReports.join(', ')}`);
      }
    },
    // 切换选中状态
    toggleSelect(reportId) {
      if (this.selectedReports.includes(reportId)) {
        this.selectedReports = this.selectedReports.filter((id) => id !== reportId);
      } else {
        this.selectedReports.push(reportId);
      }
    },
    // 切换全选状态
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedReports = this.filteredReports.map((report) => report.id);
      } else {
        this.selectedReports = [];
      }
    },
  },
};
</script>

<style scoped lang="scss">
// .historical-reports-view {
//   padding: 20px;
//   background-color: #1c3a62; /* 深蓝色背景 */
//   border-radius: 12px; /* 圆角 */
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* 阴影效果 */
// }

.search-and-actions {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 20px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-input:focus {
  border-color: #4273c2;
}

.search-button {
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #4273c2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #3763c2;
}

.batch-export-button {
  padding: 10px 20px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.batch-export-button:hover {
  background-color: #059669;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.reports-table th,
.reports-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.reports-table th {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.reports-table td {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: white;
}

.reports-table tr.selected {
  background-color: rgba(255, 255, 255, 0.2);
}

.reports-table tr:hover {
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.action-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.view-button {
  background-color: #4d7fcf;
  color: white;
  margin-right: 10px;
}

.view-button:hover {
  background-color: #3f6ccd;
}

.export-button {
  background-color: #10b981;
  color: white;
}

.export-button:hover {
  background-color: #059669;
}
</style>