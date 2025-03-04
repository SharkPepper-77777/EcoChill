<template>
  <div>
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
            <input
              id="cooling-loss-coefficient"
              type="number"
              step="0.001"
              v-model="storageParams.coolingLossCoefficient"
            />
          </div>
          <div class="param-item">
            <label for="max-cooling-capacity">最大供冷量:</label>
            <input
              id="max-cooling-capacity"
              type="number"
              v-model="storageParams.maxCoolingCapacity"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 顶部栏 -->
    <div class="top-bar">
      <span class="label">添加机组</span>
      <select v-model="selectedUnitType">
        <option value="螺杆">螺杆式冷水机组</option>
        <option value="基载">基载离心式冷水机组</option>
        <option value="双工况">双工况离心式冷水机组</option>
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
              <div v-for="param in unitParams" :key="param.name" class="param-item">
                <label :for="param.name">{{ param.label }}:</label>
                <template v-if="param.type === 'range'">
                  <div class="range-inputs">
                    <input
                      type="number"
                      :id="`${param.name}-min`"
                      v-model="param.value[0]"
                      placeholder="最小值"
                    />
                    <span class="range-separator">~</span>
                    <input
                      type="number"
                      :id="`${param.name}-max`"
                      v-model="param.value[1]"
                      placeholder="最大值"
                    />
                  </div>
                </template>
                <input v-else :type="param.type" :id="param.name" v-model="param.value" />
              </div>
            </div>
          </div>
          <!-- 双工况机组 -->
          <div v-if="selectedUnitType === '双工况'">
            <h4>制冷模式参数</h4>
            <div class="param-row">
              <div v-for="param in coolingModeParams" :key="param.name" class="param-item">
                <label :for="param.name">{{ param.label }}:</label>
                <template v-if="param.type === 'range'">
                  <div class="range-inputs">
                    <input
                      type="number"
                      :id="`${param.name}-min`"
                      v-model="param.value[0]"
                      placeholder="最小值"
                    />
                    <span class="range-separator">~</span>
                    <input
                      type="number"
                      :id="`${param.name}-max`"
                      v-model="param.value[1]"
                      placeholder="最大值"
                    />
                  </div>
                </template>
                <input v-else :type="param.type" :id="param.name" v-model="param.value" />
              </div>
            </div>
            <h4>制冰模式参数</h4>
            <div class="param-row">
              <div v-for="param in iceModeParams" :key="param.name" class="param-item">
                <label :for="param.name">{{ param.label }}:</label>
                <template v-if="param.type === 'range'">
                  <div class="range-inputs">
                    <input
                      type="number"
                      :id="`${param.name}-min`"
                      v-model="param.value[0]"
                      placeholder="最小值"
                    />
                    <span class="range-separator">~</span>
                    <input
                      type="number"
                      :id="`${param.name}-max`"
                      v-model="param.value[1]"
                      placeholder="最大值"
                    />
                  </div>
                </template>
                <input v-else :type="param.type" :id="param.name" v-model="param.value" />
              </div>
            </div>
          </div>
        </div>

        <button @click="saveUnit">保存</button>
      </div>
    </div>

    <!-- 机组卡片展示 -->
    <div class="unit-list">
  <div v-for="unit in units" :key="unit.id" class="unit-card">
    <div class="card-header">
      <span class="unit-id">#{{ unit.id }}</span>
      <span class="unit-name">{{ unit.name }}</span>
    </div>

    <div class="card-body">
      <div class="unit-type">类型: {{ unit.type }}</div>
      
      <!-- 通用参数（螺杆和基载） -->
      <div v-if="unit.type !== '双工况'">
        <div class="params-grid">
          <div v-for="(value, key) in unit.unitParams" :key="key" class="param-row">
            <span class="param-name">{{ key }}:</span>
            <span class="param-value">{{ formatParamValue(value) }}</span>
          </div>
        </div>
      </div>

      <!-- 双工况参数 -->
      <div v-else>
        <h4>制冷模式参数</h4>
        <div class="params-grid">
          <div v-for="(value, key) in unit.coolingModeParams" :key="key" class="param-row">
            <span class="param-name">{{ key }}:</span>
            <span class="param-value">{{ formatParamValue(value) }}</span>
          </div>
        </div>

        <h4>制冰模式参数</h4>
        <div class="params-grid">
          <div v-for="(value, key) in unit.iceModeParams" :key="key" class="param-row">
            <span class="param-name">{{ key }}:</span>
            <span class="param-value">{{ formatParamValue(value) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 占位符填充 -->
  <div v-for="i in placeholderCount" :key="`placeholder-${i}`" class="unit-card placeholder"></div>
</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedUnitType: '螺杆', // 默认选择螺杆机组
      showModal: false, // 控制弹窗显示
      // 螺杆和基载机组参数
      unitParams: [
        { name: 'param1', label: '额定制冷量', type: 'number', value: 0 },
        { name: 'param2', label: '输入功率', type: 'number', value: 0 },
        { name: 'param3', label: 'PLR范围', type: 'range', value: [0, 1] }, // 修改为范围类型
        { name: 'param4', label: '泵体数量', type: 'number', value: 0 },
        { name: 'param5', label: '泵体耗电量', type: 'number', value: 0 },
        { name: 'param6', label: '最大可输送冷量', type: 'number', value: 0 },
      ],
      // 双工况机组制冷模式参数
      coolingModeParams: [
        { name: 'param1', label: '额定制冷量', type: 'number', value: 0 },
        { name: 'param2', label: '输入功率', type: 'number', value: 0 },
        { name: 'param3', label: 'PLR范围', type: 'range', value: [0, 1] }, // 修改为范围类型
        { name: 'param4', label: '泵体数量', type: 'number', value: 0 },
        { name: 'param5', label: '泵体耗电量', type: 'number', value: 0 },
        { name: 'param6', label: '最大可输送冷量', type: 'number', value: 0 },
        
      ],
      // 双工况机组制冰模式参数
      iceModeParams: [
        { name: 'param1', label: '额定制冷量', type: 'number', value: 0 },
        { name: 'param2', label: '输入功率', type: 'number', value: 0 },
        { name: 'param3', label: 'PLR范围', type: 'range', value: [0, 1] }, // 修改为范围类型
        { name: 'param4', label: '泵体数量', type: 'number', value: 0 },
        { name: 'param5', label: '泵体耗电量', type: 'number', value: 0 },
        { name: 'param6', label: '最大可输送冷量', type: 'number', value: 0 },
      ],
      // 储能装置参数
      storageParams: {
        maxIceStorage: 0,
        coolingLossCoefficient: 0.001,
        maxCoolingCapacity: 0, // 新增最大供冷量
      },
      // 机组列表
      units: [],
      nextUnitId: 1, // 用于生成机组编号
    };
  },
  computed: {
    // 计算占位符数量
    placeholderCount() {
      const remainder = this.units.length % 3;
      return remainder === 0 ? 0 : 3 - remainder;
    },
  },
  methods: {
    // 保存机组
    // 修改后的saveUnit方法
saveUnit() {
  const unitData = {
    id: this.nextUnitId++,
    name: `${this.selectedUnitType}机组${this.nextUnitId}`,
    type: this.selectedUnitType,
    storageParams: { ...this.storageParams }
  };

  if (this.selectedUnitType === '螺杆' || this.selectedUnitType === '基载') {
    unitData.unitParams = this.unitParams.reduce((acc, param) => {
      acc[param.label] = param.value;
      return acc;
    }, {});
  } else if (this.selectedUnitType === '双工况') {
    unitData.coolingModeParams = this.coolingModeParams.reduce((acc, param) => {
      acc[param.label] = param.value;
      return acc;
    }, {});
    unitData.iceModeParams = this.iceModeParams.reduce((acc, param) => {
      acc[param.label] = param.value;
      return acc;
    }, {});
  }

  this.units.push(unitData);
  this.showModal = false;
  this.resetParams(); // 添加重置参数的方法
},
methods: {
  formatParamValue(value) {
    return Array.isArray(value) ? value.join(' ~ ') : value;
  },
  resetParams() {
    // 重置所有参数输入框
    this.unitParams.forEach(param => {
      param.value = param.type === 'range' ? [0, 1] : 0;
    });
    this.coolingModeParams.forEach(param => {
      param.value = param.type === 'range' ? [0, 1] : 0;
    });
    this.iceModeParams.forEach(param => {
      param.value = param.type === 'range' ? [0, 1] : 0;
    });
  }
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
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.storage-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.storage-settings h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.storage-settings .param-row {
  display: flex;
  gap: 20px;
  align-items: center;
}

.storage-settings .param-item {
  flex: 1;
}

.storage-settings label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
}

.storage-settings input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* 顶部栏 */
.top-bar {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.top-bar .label {
  margin-right: 20px;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}
.top-bar select {
  padding: 8px 12px;
  margin-right: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}
.top-bar button {
  padding: 8px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
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
  background-color: #E8EEF6;
  padding: 20px;
  border-radius: 8px;
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}
.close {
  float: right;
  cursor: pointer;
  font-size: 24px;
  color: #666;
}
.section {
  margin-bottom: 20px;
}
.param-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}
.param-item {
  flex: 1 1 calc(33.33% - 10px);
}
.param-item label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
}
.param-item input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* 机组卡片展示 */
.unit-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 10px;
}
.unit-card {
  flex: 1 1 calc(33.33% - 20px);
  border: 1px solid #F4F7FB;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #F4F7FB;
}
.unit-card.placeholder {
  visibility: hidden; /* 占位符不可见 */
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.unit-id {
  font-size: 20px;
  font-weight: 500;
  color: #42b983;
}
.unit-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
.card-body {
  margin-bottom: 10px;
}
.unit-type {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}
.params-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.param-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.param-name {
  font-size: 14px;
  color: #555;
}
.param-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}
.card-footer {
  margin-top: 10px;
}
.range-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}
.range-inputs input {
  flex: 1;
  width: 100%;
}
.range-separator {
  color: #666;
}
</style>