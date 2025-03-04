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

        <!-- 机组类型参数 -->
        <div class="section">
          <h3>机组参数</h3>
          <!-- 螺杆和基载机组 -->
          <div v-if="selectedUnitType === '螺杆' || selectedUnitType === '基载'">
            <div class="param-row">
              <div v-for="(param, index) in unitParams" :key="index" class="param-item">
                <label>{{ param.label }}:</label>
                <input :type="param.type" v-model="param.value" />
              </div>
            </div>
          </div>
          <!-- 双工况机组 -->
          <div v-if="selectedUnitType === '双工况'">
            <h4>制冷模式参数</h4>
            <div class="param-row">
              <div v-for="(param, index) in coolingModeParams" :key="index" class="param-item">
                <label>{{ param.label }}:</label>
                <input :type="param.type" v-model="param.value" />
              </div>
            </div>
            <h4>制冰模式参数</h4>
            <div class="param-row">
              <div v-for="(param, index) in iceModeParams" :key="index" class="param-item">
                <label>{{ param.label }}:</label>
                <input :type="param.type" v-model="param.value" />
              </div>
            </div>
          </div>
        </div>

        <!-- 储能装置参数 -->
        <div class="section">
          <h3>储能装置参数</h3>
          <div class="param-row">
            <div class="param-item">
              <label>最大蓄冰量:</label>
              <input type="number" v-model="storageParams.maxIceStorage" />
            </div>
            <div class="param-item">
              <label>冷量损失系数:</label>
              <input type="number" step="0.001" v-model="storageParams.coolingLossCoefficient" />
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
          <span class="unit-name">{{ unit.name }}</span>
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
                <span class="param-value">{{ unit.unitParams[index] }}</span>
              </div>
            </div>
          </div>
          <div v-if="unit.type === '双工况'">
            <div v-if="unit.currentMode === 'cooling'">
              <div class="params-grid cooling-mode-params">
            
                <div v-for="(param, index) in coolingModeParams" :key="index" class="param-row">
                  <span class="param-name">{{ param.label }}:</span>
                  <span class="param-value">{{ unit.coolingModeParams[index] }}</span>
                </div>
              </div>
            </div>
            <div v-if="unit.currentMode === 'ice'">
              <div class="params-grid ice-mode-params">
      
                <div v-for="(param, index) in iceModeParams" :key="index" class="param-row">
                  <span class="param-name">{{ param.label }}:</span>
                  <span class="param-value">{{ unit.iceModeParams[index] }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 占位符填充 -->
      <div v-for="i in placeholderCount" :key="`placeholder-${i}`" class="unit-card placeholder"></div>
    </div>

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
                <input :type="param.type" v-model="editUnitParams[index]" />
              </div>
            </div>
          </div>
          <div v-if="editUnitType === '双工况'">
            <h4>制冷模式参数</h4>
            <div class="param-row">
              <div v-for="(param, index) in coolingModeParams" :key="index" class="param-item">
                <label>{{ param.label }}:</label>
                <input :type="param.type" v-model="editUnitParams.coolingMode[index]" />
              </div>
            </div>
            <h4>制冰模式参数</h4>
            <div class="param-row">
              <div v-for="(param, index) in iceModeParams" :key="index" class="param-item">
                <label>{{ param.label }}:</label>
                <input :type="param.type" v-model="editUnitParams.iceMode[index]" />
              </div>
            </div>
          </div>
        </div>
        <div class="section">
          <h3>储能装置参数</h3>
          <div class="param-row">
            <div class="param-item">
              <label>最大蓄冰量:</label>
              <input type="number" v-model="editStorageParams.maxIceStorage" />
            </div>
            <div class="param-item">
              <label>冷量损失系数:</label>
              <input type="number" step="0.001" v-model="editStorageParams.coolingLossCoefficient" />
            </div>
          </div>
        </div>
        <button class="save-button" @click="saveEditedUnit">保存</button>
        <button class="delete-button" @click="deleteUnit">删除</button>
      </div>
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
      return remainder === 0? 0 : 3 - remainder;
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
    showEditModal(unitId) {
      const unit = this.units.find(u => u.id === unitId);
      if (unit) {
        this.showEditModalId = unitId;
        this.editUnitType = unit.type;
        // 初始化编辑参数
        if (unit.type === '螺杆' || unit.type === '基载') {
          this.editUnitParams = [...unit.unitParams];
        } else if (unit.type === '双工况') {
          this.editUnitParams = {
            coolingMode: [...unit.coolingModeParams],
            iceMode: [...unit.iceModeParams]
          };
        }
        this.editStorageParams = { ...unit.storageParams };
      }
    },
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
    deleteUnit() {
      const unitId = this.showEditModalId;
      const index = this.units.findIndex(u => u.id === unitId);
      if (index!== -1) {
        this.units.splice(index, 1);
      }
      this.showEditModalId = null;
    },
    toggleMode(unit) {
      unit.currentMode = unit.currentMode === 'cooling' ? 'ice' : 'cooling';
    }
  },
};
</script>

<style scoped>
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
  cursor: pointer;
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
.mode-toggle {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.mode-toggle:hover {
  background-color: #e0e0e0;
}
.toggle-icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
  margin-left: 8px;
  transition: background-color 0.3s;
}
.mode-toggle[mode="cooling"] .toggle-icon {
  background-color: #42b983;
}
.mode-toggle[mode="ice"] .toggle-icon {
  background-color: #3498db;
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

/* 编辑弹窗 */
.edit-modal {
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
.edit-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}
.edit-close {
  float: right;
  cursor: pointer;
  font-size: 24px;
  color: #666;
}

/* 保存和删除按钮样式 */
.save-button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px;
}
.save-button:hover {
  background-color: #3aa876;
}

.delete-button {
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.delete-button:hover {
  background-color: #c0392b;
}
</style>