<template>
  <div>
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

        <!-- 通用参数 -->
        <div class="section">
          <h3>通用参数</h3>
          <div class="param-row">
            <div v-for="param in commonParams" :key="param.name" class="param-item">
              <label :for="param.name">{{ param.label }}:</label>
              <input :type="param.type" :id="param.name" v-model="param.value" />
            </div>
          </div>
        </div>

        <!-- 机组类型参数 -->
        <div class="section">
          <h3>机组参数</h3>
          <!-- 螺杆和基载机组 -->
          <div v-if="selectedUnitType === '螺杆' || selectedUnitType === '基载'">
            <div class="param-row">
              <div v-for="param in unitParams" :key="param.name" class="param-item">
                <label :for="param.name">{{ param.label }}:</label>
                <input :type="param.type" :id="param.name" v-model="param.value" />
              </div>
            </div>
          </div>
          <!-- 双工况机组 -->
          <div v-if="selectedUnitType === '双工况'">
            <h4>制冷模式参数</h4>
            <div class="param-row">
              <div v-for="param in coolingModeParams" :key="param.name" class="param-item">
                <label :for="param.name">{{ param.label }}:</label>
                <input :type="param.type" :id="param.name" v-model="param.value" />
              </div>
            </div>
            <h4>制冰模式参数</h4>
            <div class="param-row">
              <div v-for="param in iceModeParams" :key="param.name" class="param-item">
                <label :for="param.name">{{ param.label }}:</label>
                <input :type="param.type" :id="param.name" v-model="param.value" />
              </div>
            </div>
          </div>
        </div>

        <!-- 储能装置参数 -->
        <div class="section">
          <h3>储能装置参数</h3>
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
          </div>
        </div>

        <button @click="saveUnit">保存</button>
      </div>
    </div>

    <!-- 机组卡片展示 -->
    <div class="unit-list">
      <div v-for="unit in units" :key="unit.id" class="unit-card">
        <!-- 顶部：编号和名称 -->
        <div class="card-header">
          <span class="unit-id">#{{ unit.id }}</span>
          <span class="unit-name">{{ unit.name }}</span>
        </div>

        <!-- 中部：类型和通用参数 -->
        <div class="card-body">
          <div class="unit-type">类型: {{ unit.type }}</div>
          <div class="params-grid">
            <div v-for="(value, key) in unit.commonParams" :key="key" class="param-row">
              <span class="param-name">{{ key }}:</span>
              <span class="param-value">{{ value }}</span>
            </div>
          </div>
        </div>

        <!-- 底部：机组参数 -->
        <div class="card-footer">
          <div v-if="unit.type === '螺杆' || unit.type === '基载'">
            <div class="params-grid">
              <div v-for="(value, key) in unit.unitParams" :key="key" class="param-row">
                <span class="param-name">{{ key }}:</span>
                <span class="param-value">{{ value }}</span>
              </div>
            </div>
          </div>
          <div v-if="unit.type === '双工况'">
            <div class="params-grid">
              <div v-for="(value, key) in unit.coolingModeParams" :key="key" class="param-row">
                <span class="param-name">{{ key }}:</span>
                <span class="param-value">{{ value }}</span>
              </div>
            </div>
            <div class="params-grid">
              <div v-for="(value, key) in unit.iceModeParams" :key="key" class="param-row">
                <span class="param-name">{{ key }}:</span>
                <span class="param-value">{{ value }}</span>
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
      // 通用参数
      commonParams: [
        { name: 'ratedCoolingCapacity', label: '额定制冷量', type: 'number', value: 0 },
        { name: 'inputPower', label: '输入功率', type: 'number', value: 0 },
        { name: 'cop', label: 'COP', type: 'number', value: 0 },
        { name: 'coolingWaterFlow', label: '冷却水流量', type: 'number', value: 0 },
        { name: 'chilledWaterFlow', label: '冷冻水流量', type: 'number', value: 0 },
        { name: 'noiseLevel', label: '噪音水平', type: 'number', value: 0 },
      ],
      // 螺杆和基载机组参数
      unitParams: [
        { name: 'param1', label: '参数1', type: 'number', value: 0 },
        { name: 'param2', label: '参数2', type: 'number', value: 0 },
        { name: 'param3', label: '参数3', type: 'number', value: 0 },
        { name: 'param4', label: '参数4', type: 'number', value: 0 },
        { name: 'param5', label: '参数5', type: 'number', value: 0 },
        { name: 'param6', label: '参数6', type: 'number', value: 0 },
      ],
      // 双工况机组制冷模式参数
      coolingModeParams: [
        { name: 'coolingParam1', label: '制冷参数1', type: 'number', value: 0 },
        { name: 'coolingParam2', label: '制冷参数2', type: 'number', value: 0 },
        { name: 'coolingParam3', label: '制冷参数3', type: 'number', value: 0 },
        { name: 'coolingParam4', label: '制冷参数4', type: 'number', value: 0 },
        { name: 'coolingParam5', label: '制冷参数5', type: 'number', value: 0 },
        { name: 'coolingParam6', label: '制冷参数6', type: 'number', value: 0 },
      ],
      // 双工况机组制冰模式参数
      iceModeParams: [
        { name: 'iceParam1', label: '制冰参数1', type: 'number', value: 0 },
        { name: 'iceParam2', label: '制冰参数2', type: 'number', value: 0 },
        { name: 'iceParam3', label: '制冰参数3', type: 'number', value: 0 },
        { name: 'iceParam4', label: '制冰参数4', type: 'number', value: 0 },
        { name: 'iceParam5', label: '制冰参数5', type: 'number', value: 0 },
        { name: 'iceParam6', label: '制冰参数6', type: 'number', value: 0 },
      ],
      // 储能装置参数
      storageParams: {
        maxIceStorage: 0,
        coolingLossCoefficient: 0.001,
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
    saveUnit() {
      const unitData = {
        id: this.nextUnitId++,
        name: `机组${this.nextUnitId}`,
        type: this.selectedUnitType,
        commonParams: this.commonParams.reduce((acc, param) => {
          acc[param.name] = param.value;
          return acc;
        }, {}),
        storageParams: { ...this.storageParams },
      };

      if (this.selectedUnitType === '螺杆' || this.selectedUnitType === '基载') {
        unitData.unitParams = this.unitParams.reduce((acc, param) => {
          acc[param.name] = param.value;
          return acc;
        }, {});
      } else if (this.selectedUnitType === '双工况') {
        unitData.coolingModeParams = this.coolingModeParams.reduce((acc, param) => {
          acc[param.name] = param.value;
          return acc;
        }, {});
        unitData.iceModeParams = this.iceModeParams.reduce((acc, param) => {
          acc[param.name] = param.value;
          return acc;
        }, {});
      }

      this.units.push(unitData);
      this.showModal = false;
    },
  },
};
</script>

<style>
/* 引入 Google 字体 */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

body {
  font-family: 'Roboto', sans-serif;
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
  background-color: white;
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
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
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
</style>