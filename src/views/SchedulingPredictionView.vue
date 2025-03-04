<template>
  <!-- 储能装置参数设置框 -->
  <div class="storage-settings">
    <div class="storage-header">
      <h3>储能装置设置</h3>
      <div class="param-row">
        <div class="param-item">
          <label for="max-ice-storage">最大蓄冰量:</label>
          <input id="max-ice-storage" type="number" v-model="storageParams.maxIceStorage" />
        </div>
        <div class="param-item">
          <label for="cooling-loss-coefficient">冷量损失系数:</label>
          <input id="cooling-loss-coefficient" type="number" step="0.001"
            v-model="storageParams.coolingLossCoefficient" />
        </div>
        <div class="param-item">
          <label for="max-cooling-capacity">最大供冷量:</label>
          <input id="max-cooling-capacity" type="number" v-model="storageParams.maxCoolingCapacity" />
        </div>
      </div>
    </div>
  </div>
  <!-- 顶部栏 -->
  <div class="top-bar">
    <span class="label">添加机组</span>
    <select v-model="selectedUnitType">
      <option value="螺杆">螺杆机组</option>
      <option value="基载">基载机组</option>
      <option value="双工况">双工况机组</option>
    </select>
    <button @click="showModal = true">添加</button>
  </div>

  <!-- 弹窗 -->
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="showModal = false">&times;</span>
      <h2>添加{{ selectedUnitType }}机组参数</h2>

      <!-- 机组类型参数 -->
      <div class="section">
        <h3>机组参数</h3>
        <!-- 螺杆和基载机组 -->
        <div v-if="selectedUnitType === '螺杆' || selectedUnitType === '基载'">
          <div class="param-row">
            <div v-for="(param, index) in unitParams" :key="index" class="param-item">
              <label>{{ param.label }}:</label>
              <template v-if="param.type === 'range'">
                <div class="range-inputs">
                  <input type="number" v-model="param.value.min" placeholder="最小值" />
                  <span class="range-separator">-</span>
                  <input type="number" v-model="param.value.max" placeholder="最大值" />
                </div>
              </template>
              <input v-else :type="param.type" v-model="param.value" />
            </div>
          </div>
        </div>
        <!-- 双工况机组 -->
        <div v-if="selectedUnitType === '双工况'">
          <h4>制冷模式参数</h4>
          <div class="param-row">
            <div v-for="(param, index) in coolingModeParams" :key="index" class="param-item">
              <label>{{ param.label }}:</label>
              <template v-if="param.type === 'range'">
                <div class="range-inputs">
                  <input type="number" v-model="param.value.min" placeholder="最小值" />
                  <span class="range-separator">-</span>
                  <input type="number" v-model="param.value.max" placeholder="最大值" />
                </div>
              </template>
              <input v-else :type="param.type" v-model="param.value" />
            </div>
          </div>
          <h4>制冰模式参数</h4>
          <div class="param-row">
            <div v-for="(param, index) in iceModeParams" :key="index" class="param-item">
              <label>{{ param.label }}:</label>
              <template v-if="param.type === 'range'">
                <div class="range-inputs">
                  <input type="number" v-model="param.value.min" placeholder="最小值" />
                  <span class="range-separator">-</span>
                  <input type="number" v-model="param.value.max" placeholder="最大值" />
                </div>
              </template>
              <input v-else :type="param.type" v-model="param.value" />
            </div>
          </div>
        </div>
      </div>
      <button class="save-button" @click="saveUnit">保存</button>
    </div>
  </div>

  <!-- 机组卡片展示 -->
  <div class="unit-list">
    <div v-for="unit in units" :key="unit.id" class="unit-card" @click="showEditModal(unit.id)">
      <!-- 顶部：编号和名称 -->
      <div class="card-header">
        <span class="unit-id">#{{ unit.id }}</span>
        <span class="unit-type">{{ unit.type }}</span> <!-- 这里修改为展示机组的type -->
        <div v-if="unit.type === '双工况'" class="mode-toggle" @click.stop="toggleMode(unit)">
          <span>{{ unit.currentMode === 'cooling' ? '制冷模式' : '制冰模式' }}</span>
          <i class="toggle-icon"></i>
        </div>
      </div>

      <!-- 底部：机组参数 -->
      <div class="card-footer">
        <div v-if="unit.type === '螺杆' || unit.type === '基载'">
          <div class="params-grid">
            <div v-for="(param, index) in unitParams" :key="index" class="param-row">
              <span class="param-name">{{ param.label }}:</span>
              <span class="param-value">
                <template v-if="param.type === 'range'">
                  {{ unit.unitParams[index].min }} - {{ unit.unitParams[index].max }}
                </template>
                <template v-else>
                  {{ unit.unitParams[index] }}
                </template>
              </span>
            </div>
          </div>
        </div>
        <div v-if="unit.type === '双工况'">
          <div v-if="unit.currentMode === 'cooling'">
            <div class="params-grid cooling-mode-params">
              <div v-for="(param, index) in coolingModeParams" :key="index" class="param-row">
                <span class="param-name">{{ param.label }}:</span>
                <span class="param-value">
                  <template v-if="param.type === 'range'">
                    {{ unit.coolingModeParams[index].min }} - {{ unit.coolingModeParams[index].max }}
                  </template>
                  <template v-else>
                    {{ unit.coolingModeParams[index] }}
                  </template>
                </span>
              </div>
            </div>
          </div>
          <div v-if="unit.currentMode === 'ice'">
            <div class="params-grid ice-mode-params">
              <div v-for="(param, index) in iceModeParams" :key="index" class="param-row">
                <span class="param-name">{{ param.label }}:</span>
                <span class="param-value">
                  <template v-if="param.type === 'range'">
                    {{ unit.iceModeParams[index].min }} - {{ unit.iceModeParams[index].max }}
                  </template>
                  <template v-else>
                    {{ unit.iceModeParams[index] }}
                  </template>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 占位符填充 -->
    <div v-for="i in placeholderCount" :key="`placeholder-${i}`" class="unit-card placeholder"></div>
  </div>
  <!-- 开始调度预测按钮 -->
  <button class="start-scheduling-button" @click="startSchedulingPrediction">开始调度预测</button>
  <!-- 编辑弹窗 -->
  <div v-if="showEditModalId" class="edit-modal">
    <div class="edit-modal-content">
      <span class="edit-close" @click="showEditModalId = null">&times;</span>
      <h2>编辑机组参数</h2>
      <div class="section">
        <h3>机组参数</h3>
        <!-- 根据机组类型动态显示参数 -->
        <div v-if="editUnitType === '螺杆' || editUnitType === '基载'">
          <div class="param-row">
            <div v-for="(param, index) in unitParams" :key="index" class="param-item">
              <label>{{ param.label }}:</label>
              <template v-if="param.type === 'range'">
                <div class="range-inputs">
                  <input type="number" v-model="editUnitParams[index].min" placeholder="最小值" />
                  <span class="range-separator">-</span>
                  <input type="number" v-model="editUnitParams[index].max" placeholder="最大值" />
                </div>
              </template>
              <input v-else :type="param.type" v-model="editUnitParams[index]" />
            </div>
          </div>
        </div>
        <div v-if="editUnitType === '双工况'">
          <h4>制冷模式参数</h4>
          <div class="param-row">
            <div v-for="(param, index) in coolingModeParams" :key="index" class="param-item">
              <label>{{ param.label }}:</label>
              <template v-if="param.type === 'range'">
                <div class="range-inputs">
                  <input type="number" v-model="editUnitParams.coolingMode[index].min" placeholder="最小值" />
                  <span class="range-separator">-</span>
                  <input type="number" v-model="editUnitParams.coolingMode[index].max" placeholder="最大值" />
                </div>
              </template>
              <input v-else :type="param.type" v-model="editUnitParams.coolingMode[index]" />
            </div>
          </div>
          <h4>制冰模式参数</h4>
          <div class="param-row">
            <div v-for="(param, index) in iceModeParams" :key="index" class="param-item">
              <label>{{ param.label }}:</label>
              <template v-if="param.type === 'range'">
                <div class="range-inputs">
                  <input type="number" v-model="editUnitParams.iceMode[index].min" placeholder="最小值" />
                  <span class="range-separator">-</span>
                  <input type="number" v-model="editUnitParams.iceMode[index].max" placeholder="最大值" />
                </div>
              </template>
              <input v-else :type="param.type" v-model="editUnitParams.iceMode[index]" />
            </div>
          </div>
        </div>
      </div>
      <button class="save-button" @click="saveEditedUnit">保存</button>
      <button class="delete-button" @click="deleteUnit">删除</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      selectedUnitType: '螺杆', // 默认选择螺杆机组
      showModal: false, // 控制添加弹窗显示
      showEditModalId: null, // 控制编辑弹窗显示，存储当前编辑机组的id
      editUnitType: null, // 存储当前编辑机组的类型
      // 用于存储编辑中的机组参数，初始化为空对象
      editUnitParams: {},
      editStorageParams: {
        maxIceStorage: 0,
        coolingLossCoefficient: 0.001,
      },
      // 螺杆和基载机组参数
      unitParams: [
        { label: '额定制冷量', type: 'number', value: 0 },
        { label: '输入功率', type: 'number', value: 0 },
        { label: 'PLR范围', type: 'range', value: { min: 0, max: 1 } },
        { label: '泵体数量', type: 'number', value: 0 },
        { label: '泵体耗电量', type: 'number', value: 0 },
        { label: '最大可输送冷量', type: 'number', value: 0 },
      ],
      // 双工况机组制冷模式参数
      coolingModeParams: [
        { label: '额定制冷量', type: 'number', value: 0 },
        { label: '输入功率', type: 'number', value: 0 },
        { label: 'PLR范围', type: 'range', value: { min: 0, max: 1 } },
        { label: '泵体数量', type: 'number', value: 0 },
        { label: '泵体耗电量', type: 'number', value: 0 },
        { label: '最大可输送冷量', type: 'number', value: 0 },
      ],
      // 双工况机组制冰模式参数
      iceModeParams: [
        { label: '额定制冷量', type: 'number', value: 0 },
        { label: '输入功率', type: 'number', value: 0 },
        { label: 'PLR范围', type: 'range', value: { min: 0, max: 1 } },
        { label: '泵体数量', type: 'number', value: 0 },
        { label: '泵体耗电量', type: 'number', value: 0 },
        { label: '最大可输送冷量', type: 'number', value: 0 },
      ],
      // 储能装置参数
      storageParams: {
        maxIceStorage: 0,
        coolingLossCoefficient: 0.001,
      },
      nextUnitId: 1, // 用于生成机组编号
    };
  },
  computed: {
    ...mapGetters(['getUnits']),
    units() {
      return this.getUnits;
    },
    // 计算占位符数量
    placeholderCount() {
      const remainder = this.units.length % 3;
      return remainder === 0 ? 0 : 3 - remainder;
    },
  },
  methods: {
    ...mapActions(['addUnit']),
    // 保存机组
    saveUnit() {
      const unitData = {
        id: this.nextUnitId++,
        name: `机组${this.nextUnitId}`,
        type: this.selectedUnitType,
        storageParams: { ...this.storageParams },
      };

      if (this.selectedUnitType === '螺杆' || this.selectedUnitType === '基载') {
        unitData.unitParams = this.unitParams.map(param => param.value);
      } else if (this.selectedUnitType === '双工况') {
        unitData.coolingModeParams = this.coolingModeParams.map(param => param.value);
        unitData.iceModeParams = this.iceModeParams.map(param => param.value);
        unitData.currentMode = 'cooling'; // 双工况机组默认初始模式为制冷模式
      }

      this.addUnit(unitData);
      this.showModal = false;
    },
    // 显示编辑弹窗
    showEditModal(unit) {
      this.showEditModalId = unit.id;
      this.editUnitType = unit.type;
      // 初始化编辑参数
      if (unit.type === '螺杆' || unit.type === '基载') {
        this.editUnitParams = [...unit.unitParams];
      } else if (unit.type === '双工况') {
        this.editUnitParams = {
          coolingMode: [...unit.coolingModeParams],
          iceMode: [...unit.iceModeParams],
        };
      }
      this.editStorageParams = { ...unit.storageParams };
    },
    // 保存编辑后的机组
    saveEditedUnit() {
      const unitId = this.showEditModalId;
      const unit = this.units.find(u => u.id === unitId);
      if (unit) {
        if (unit.type === '螺杆' || unit.type === '基载') {
          unit.unitParams = [...this.editUnitParams];
        } else if (unit.type === '双工况') {
          unit.coolingModeParams = [...this.editUnitParams.coolingMode];
          unit.iceModeParams = [...this.editUnitParams.iceMode];
        }
        unit.storageParams = { ...this.editStorageParams };
      }
      this.showEditModalId = null;
    },
    // 删除机组
    deleteUnit() {
      const unitId = this.showEditModalId;
      const index = this.units.findIndex(u => u.id === unitId);
      if (index !== -1) {
        this.units.splice(index, 1);
      }
      this.showEditModalId = null;
    },
    // 切换双工况机组的模式
    toggleMode(unit) {
      unit.currentMode = unit.currentMode === 'cooling' ? 'ice' : 'cooling';
    },
    // 开始调度预测方法，可根据实际需求实现具体逻辑
    startSchedulingPrediction() {
      //在这接入api后端调用
      alert('开始调度预测');
    }
  },
};
</script>

<style>
/* 引入 Google 字体 */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}

/* 储能装置参数设置框 */
.storage-settings {
  margin-bottom: 30px;
  padding: 5%;
  /* 将 20px 改为 5%，根据父元素宽度调整内边距 */
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  /* 使内部文字水平居中 */
}

.storage-header {
  display: flex;
  align-items: center;
  gap: 5%;
  /* 将 20px 改为 5%，根据父元素宽度调整间距 */
  justify-content: center;
  /* 让标题和参数行在水平方向均匀分布 */
  flex-wrap: wrap;
  /* 允许换行 */
}

.storage-settings h3 {
  margin: 0;
  font-size: 4vw;
  /* 将 18px 改为 4vw，根据视口宽度调整字体大小 */
  font-weight: 500;
  color: #333;
}

.storage-settings .param-row {
  display: flex;
  gap: 5%;
  /* 将 20px 改为 5%，根据父元素宽度调整间距 */
  align-items: center;
  justify-content: center;
  /* 让每个参数项在水平方向均匀分布 */
}

.storage-settings .param-item {
  flex: 1;
  margin: 0 2%;
  /* 添加左右边距，使用百分比让布局更灵活 */
}

.storage-settings label {
  display: block;
  margin-bottom: 2%;
  /* 将 5px 改为 2%，根据父元素高度调整下边距 */
  font-size: 3vw;
  /* 将 14px 改为 3vw，根据视口宽度调整字体大小 */
  color: #555;
}

.storage-settings input {
  width: 100%;
  padding: 2%;
  /* 将 8px 改为 2%，根据父元素宽度调整内边距 */
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 3vw;
  /* 将 14px 改为 3vw，根据视口宽度调整字体大小 */
}

/* 顶部栏 */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  /* 使内部子元素在水平方向居中 */
  margin-bottom: 5%;
  /* 将 30px 改为 5%，根据父元素高度调整下边距 */
  padding: 3%;
  /* 将 15px 改为 3%，根据父元素宽度调整内边距 */
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  /* 使内部文字水平居中 */
}

.top-bar .label {
  margin-right: 5%;
  /* 将 20px 改为 5%，根据父元素宽度调整右边距 */
  font-size: 4vw;
  /* 将 18px 改为 4vw，根据视口宽度调整字体大小 */
  font-weight: 500;
  color: #333;
  text-align: center;
  /* 使内部文字水平居中 */
}

.top-bar select {
  padding: 2%;
  /* 将 8px 12px 改为 2%，根据父元素宽度调整内边距 */
  margin-right: 5%;
  /* 将 20px 改为 5%，根据父元素宽度调整右边距 */
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 3.5vw;
  /* 将 16px 改为 3.5vw，根据视口宽度调整字体大小 */
}

.top-bar button {
  padding: 2%;
  /* 将 8px 20px 改为 2%，根据父元素宽度调整内边距 */
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 3.5vw;
  /* 将 16px 改为 3.5vw，根据视口宽度调整字体大小 */
  cursor: pointer;
  transition: background-color 0.3s;
}

.top-bar button:hover {
  background-color: #3aa876;
}

/* 弹窗 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 5%;
  /* 将 20px 改为 5%，根据父元素宽度调整内边距 */
  border-radius: 8px;
  width: 80%;
  /* 将 600px 改为 80%，根据视口宽度调整宽度 */
  max-height: 80vh;
  overflow-y: auto;
}

.close {
  float: right;
  cursor: pointer;
  font-size: 5vw;
  /* 将 24px 改为 5vw，根据视口宽度调整字体大小 */
  color: #666;
}

.section {
  margin-bottom: 5%;
  /* 将 20px 改为 5%，根据父元素高度调整下边距 */
}

.param-row {
  display: flex;
  flex-wrap: wrap;
  gap: 2%;
  /* 将 10px 改为 2%，根据父元素宽度调整间距 */
  margin-bottom: 2%;
  /* 将 10px 改为 2%，根据父元素高度调整下边距 */
}

.param-item {
  flex: 1 1 calc(33.33% - 2%);
  /* 将 10px 改为 2%，根据父元素宽度调整间距 */
  margin: 0 1%;
  /* 添加左右边距，使用百分比让布局更灵活 */
}

.param-item label {
  display: block;
  margin-bottom: 2%;
  /* 将 5px 改为 2%，根据父元素高度调整下边距 */
  font-size: 3vw;
  /* 将 14px 改为 3vw，根据视口宽度调整字体大小 */
  color: #555;
}

.param-item input {
  width: 100%;
  padding: 2%;
  /* 将 8px 改为 2%，根据父元素宽度调整内边距 */
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 3vw;
  /* 将 14px 改为 3vw，根据视口宽度调整字体大小 */
}

/* 机组卡片展示 */
.unit-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5%;
  /* 将 20px 改为 5%，根据父元素宽度调整间距 */
  padding: 2%;
  /* 将 10px 改为 2%，根据父元素宽度调整内边距 */
  height: auto;
  /* 去除固定高度，让内容自动撑开 */
  overflow-y: auto;
  /* 允许垂直滚动 */
}

.unit-card {
  flex: 1 1 calc(33.33% - 5%);
  /* 将 20px 改为 5%，根据父元素宽度调整间距 */
  border: 1px solid #ddd;
  padding: 3%;
  /* 将 15px 改为 3%，根据父元素宽度调整内边距 */
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #F4F7FB;
}

.unit-card.placeholder {
  visibility: hidden;
  /* 占位符不可见 */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2%;
  /* 将 10px 改为 2%，根据父元素高度调整下边距 */
}

.unit-id {
  font-size: 4vw;
  /* 将 20px 改为 4vw，根据视口宽度调整字体大小 */
  font-weight: 500;
  color: #42b983;
}

.unit-name {
  font-size: 3.5vw;
  /* 将 16px 改为 3.5vw，根据视口宽度调整字体大小 */
  font-weight: 500;
  color: #333;
}

.unit-type {
  /* 新增的样式类，用于设置展示机组类型的样式 */
  font-size: 3.5vw;
  /* 将 16px 改为 3.5vw，根据视口宽度调整字体大小 */
  font-weight: 500;
  color: #333;
}

.mode-toggle {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  padding: 1%;
  /* 将 4px 8px 改为 1%，根据父元素宽度调整内边距 */
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.mode-toggle:hover {
  background-color: #e0e0e0;
}

.toggle-icon {
  display: inline-block;
  width: 3vw;
  /* 将 12px 改为 3vw，根据视口宽度调整宽度 */
  height: 3vw;
  /* 将 12px 改为 3vw，根据视口宽度调整高度 */
  border-radius: 50%;
  background-color: #ccc;
  margin-left: 2%;
  /* 将 8px 改为 2%，根据父元素宽度调整左边距 */
  transition: background-color 0.3s;
}

.mode-toggle[mode="cooling"] .toggle-icon {
  background-color: #42b983;
}

.mode-toggle[mode="ice"] .toggle-icon {
  background-color: #3498db;
}

.card-body {
  margin-bottom: 2%;
  /* 将 10px 改为 2%，根据父元素高度调整下边距 */
}

.unit-type {
  font-size: 3vw;
  /* 将 14px 改为 3vw，根据视口宽度调整字体大小 */
  color: #666;
  margin-bottom: 2%;
  /* 将 10px 改为 2%，根据父元素高度调整下边距 */
}

.params-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2%;
  /* 将 8px 改为 2%，根据父元素宽度调整间距 */
}

.param-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.param-name {
  font-size: 3vw;
  /* 将 14px 改为 3vw，根据视口宽度调整字体大小 */
  color: #555;
}

.param-value {
  font-size: 3vw;
  /* 将 14px 改为 3vw，根据视口宽度调整字体大小 */
  color: #333;
  font-weight: 500;
}

.card-footer {
  margin-top: 2%;
  /* 将 10px 改为 2%，根据父元素高度调整上边距 */
}
.range-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-modal-content {
  background-color: white;
  padding: 5%;
  /* 将 20px 改为 5%，根据父元素宽度调整内边距 */
  border-radius: 8px;
  width: 80%;
  /* 将 600px 改为 80%，根据视口宽度调整宽度 */
  max-height: 80vh;
  overflow-y: auto;
}

.edit-close {
  float: right;
  cursor: pointer;
  font-size: 5vw;
  /* 将 24px 改为 5vw，根据视口宽度调整字体大小 */
  color: #666;
}

/* 保存和删除按钮样式 */
.save-button {
  padding: 2%;
  /* 将 10px 20px 改为 2%，根据父元素宽度调整内边距 */
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 3.5vw;
  /* 将 16px 改为 3.5vw，根据视口宽度调整字体大小 */
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 2%;
  /* 将 10px 改为 2%，根据父元素宽度调整右边距 */
}

.save-button:hover {
  background-color: #3aa876;
}

.delete-button {
  padding: 2%;
  /* 将 10px 20px 改为 2%，根据父元素宽度调整内边距 */
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 3.5vw;
  /* 将 16px 改为 3.5vw，根据视口宽度调整字体大小 */
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: #c0392b;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 2%;
  /* 将 8px 改为 2%，根据父元素宽度调整间距 */
}

.range-inputs input {
  flex: 1;
  width: 100%;
}

.range-separator {
  color: #666;
}

/* 开始调度预测按钮样式 */
.start-scheduling-button {
  padding: 2%;
  /* 将 10px 20px 改为 2%，根据父元素宽度调整内边距 */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 3.5vw;
  /* 将 16px 改为 3.5vw，根据视口宽度调整字体大小 */
  cursor: pointer;
  transition: background-color 0.3s;
  display: inline-block;
  width: 30%;
  /* 调整宽度为 30%，根据需要修改 */
  background-image: url('../assets/button-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-color: transparent;
}

.start-scheduling-button:hover {
  background-color: #2980b9;
}
</style>