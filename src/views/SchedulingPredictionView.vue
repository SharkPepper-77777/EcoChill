<template>
  <!-- 储能装置参数设置框 -->
  <div class="storage-settings">
    <div class="storage-header">
      <h3>储能装置设置</h3>
      <div class="param-row">
        <div class="param-item">
          <label for="max-ice-storage">最大蓄冰量:</label>
          <input id="max-ice-storage" type="number" v-model="tempStorageParams.maxIceStorage"
            @input="handleStorageParamChange" />
        </div>
        <div class="param-item">
          <label for="cooling-loss-coefficient">冷量损失系数:</label>
          <input id="cooling-loss-coefficient" type="number" step="0.001"
            v-model="tempStorageParams.coolingLossCoefficient" @input="handleStorageParamChange" />
        </div>
        <div class="param-item">
          <label for="max-cooling-capacity">最大供冷量:</label>
          <input id="max-cooling-capacity" type="number" v-model="tempStorageParams.maxCoolingCapacity"
            @input="handleStorageParamChange" />
        </div>
      </div>
    </div>
  </div>
  <!-- 顶部栏 -->
  <div class="top-bar">
    <span class="label">添加机组</span>
    <select v-model="selectedUnitType">
      <option value="基载螺杆式">基载螺杆式机组</option>
      <option value="基载离心式">基载离心式机组</option>
      <option value="双工况离心式">双工况离心式机组</option>
    </select>
    <button @click="showModal = true">添加</button>
  </div>

  <!-- 机组卡片展示区域 -->
  <div class="unit-list-container" style="overflow-y: auto;">
    <div class="unit-list">
      <div v-for="unit in units" :key="unit.id" class="unit-card" @click="showEditModal(unit)">
        <div class="card-header">
          <span class="unit-id">#{{ unit.id }}</span>
          <div v-if="unit.type === '双工况离心式'" class="mode-toggle" @click.stop="toggleMode(unit)"
            :style="modeToggleStyle(unit)">
            <span>{{ unit.currentMode === 'cooling' ? '制冷模式' : '制冰模式' }}</span>
          </div>
          <span class="unit-type">{{ unit.type }}</span>
        </div>

        <!-- 底部：机组参数 -->
        <div class="card-footer">
          <div v-if="unit.type === '基载螺杆式' || unit.type === '基载离心式'">
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
          <div v-if="unit.type === '双工况离心式'">
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
    </div>
    <!-- 占位符填充 -->
    <div v-for="i in placeholderCount" :key="`placeholder-${i}`" class="unit-card placeholder"></div>
  </div>
  <!-- 开始调度预测按钮 -->
  <button class="start-scheduling-button" @click="startSchedulingPrediction">开始调度预测</button>
  <!-- 编辑弹窗 -->
  <div v-if="showEditModalId" class="edit-modal">
    <div class="edit-modal-content">
      <div class="edit-modal-header">
        <span class="edit-unit-id">#{{ showEditModalId }}</span>
        <span class="edit-unit-type">{{ editUnitType }}</span>
        <span class="edit-close" @click="showEditModalId = null">&times;</span>
      </div>
      <div class="section">
        <!-- 根据机组类型动态显示参数 -->
        <div v-if="editUnitType === '基载螺杆式' || editUnitType === '基载离心式'">
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
        <div v-if="editUnitType === '双工况离心式'">
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

  <!-- 弹窗 -->
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="showModal = false">&times;</span>
      <h2>添加{{ selectedUnitType }}机组参数</h2>

      <!-- 机组类型参数 -->
      <div class="section">
        <h3>机组参数</h3>
        <!-- 螺杆和基载机组 -->
        <div v-if="selectedUnitType === '基载螺杆式' || selectedUnitType === '基载离心式'">
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
        <div v-if="selectedUnitType === '双工况离心式'">
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
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      selectedUnitType: '基载螺杆式', // 默认选择螺杆机组
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
      // 临时储能装置参数
      tempStorageParams: {
        maxIceStorage: 0,
        coolingLossCoefficient: 0.001,
        maxCoolingCapacity: 0
      },
      nextUnitId: 1, // 用于生成机组编号
      isLoading: false // 新增：用于显示加载状态
    };
  },
  computed: {
    ...mapGetters(['getTempUnits', 'getTempStorageParams']),
    units() {
      return this.getTempUnits;
    },
    // 计算占位符数量
    placeholderCount() {
      const remainder = this.units.length % 3;
      return remainder === 0 ? 0 : 3 - remainder;
    },
  },
  methods: {
    ...mapActions([
      'addTempUnit',
      'saveEditedTempUnit',
      'deleteTempUnit',
      'fetchTempUnits',
      'fetchTempStorageParams',
      'saveTempStorageParams',
      'startScheduling',
      'saveStorageParams' // 新增：用于将临时数据保存到正式数据
    ]),
    // 保存机组
    async saveUnit() {
      const unitData = {
        name: `机组${this.nextUnitId}`,
        type: this.selectedUnitType,
      };

      if (this.selectedUnitType === '基载螺杆式' || this.selectedUnitType === '基载离心式') {
        unitData.unitParams = this.unitParams.map(param => param.value);
      } else if (this.selectedUnitType === '双工况离心式') {
        unitData.coolingModeParams = this.coolingModeParams.map(param => param.value);
        unitData.iceModeParams = this.iceModeParams.map(param => param.value);
        unitData.currentMode = 'cooling'; // 双工况机组默认初始模式为制冷模式
      }

      try {
        await this.addTempUnit(unitData);
        await this.fetchTempUnits(); // 添加成功后重新获取临时机组数据
        this.nextUnitId++;
        this.showModal = false;
        console.log('机组添加成功');
      } catch (error) {
        console.error('机组添加失败:', error);
        // 可以在这里添加提示用户的逻辑，比如使用this.$message.error('机组添加失败')
      }
    },
    // 显示编辑弹窗
    showEditModal(unit) {
      console.log("showEditModal被调用, unit.id:", unit.id);
      this.showEditModalId = unit.id;
      this.editUnitType = unit.type;
      // 初始化编辑参数
      if (unit.type === '基载螺杆式' || unit.type === '基载离心式') {
        this.editUnitParams = [...unit.unitParams];
      } else if (unit.type === '双工况离心式') {
        this.editUnitParams = {
          coolingMode: [...unit.coolingModeParams],
          iceMode: [...unit.iceModeParams]
        };
      }
      this.editStorageParams = { ...unit.tempStorageParams };
    },
    // 保存编辑后的机组
    async saveEditedUnit() {
      const unitId = this.showEditModalId;
      const unit = this.units.find(u => u.id === unitId);
      if (unit) {
        if (unit.type === '基载螺杆式' || unit.type === '基载离心式') {
          unit.unitParams = [...this.editUnitParams];
        } else if (unit.type === '双工况离心式') {
          unit.coolingModeParams = [...this.editUnitParams.coolingMode];
          unit.iceModeParams = [...this.editUnitParams.iceMode];
        }
        unit.tempStorageParams = { ...this.editStorageParams };

        try {
          await this.saveEditedTempUnit(unit);
          await this.fetchTempUnits(); // 编辑成功后重新获取临时机组数据
          this.showEditModalId = null;
          console.log('机组编辑成功');
        } catch (error) {
          console.error('机组编辑失败:', error);
          // 可以在这里添加提示用户的逻辑，比如使用this.$message.error('机组编辑失败')
        }
      }
    },
    // 删除机组
    async deleteUnit() {
      const unitId = this.showEditModalId;
      try {
        await this.deleteTempUnit(unitId);
        await this.fetchTempUnits(); // 删除成功后重新获取临时机组数据
        this.showEditModalId = null;
        console.log('机组删除成功');
      } catch (error) {
        console.error('机组删除失败:', error);
        // 可以在这里添加提示用户的逻辑，比如使用this.$message.error('机组删除失败')
      }
    },
    // 切换双工况机组的模式
    toggleMode(unit) {
      unit.currentMode = unit.currentMode === 'cooling' ? 'ice' : 'cooling';
    },
    modeToggleStyle(unit) {
      return {
        backgroundColor: unit.currentMode === 'cooling' ? '#42b983' : '#3498db',
      };
    },
    // 开始调度预测方法，可根据实际需求实现具体逻辑
    async startSchedulingPrediction() {
      try {
        // 将临时储能参数保存到正式数据
        await this.saveStorageParams(this.tempStorageParams);
        await this.startScheduling();
        console.log('调度预测已启动');
        await this.fetchTempUnits();
        alert('调度预测已启动，请切换到相应界面查看结果');
      } catch (error) {
        console.error('启动调度预测失败:', error);
        alert('启动调度预测失败，请检查网络或联系管理员');
      }
    },
    // 处理临时储能装置参数变化
    handleStorageParamChange() {
      this.saveTempStorageParams(this.tempStorageParams)
        .then(() => {
          console.log('临时储能装置参数保存成功');
        })
        .catch((error) => {
          console.error('临时储能装置参数保存失败:', error);
          // 可以在这里添加提示用户的逻辑，比如使用this.$message.error('临时储能装置参数保存失败')
        });
    }
  },
  created() {
    this.isLoading = true;
    this.fetchTempUnits().then(() => {
      this.fetchTempStorageParams().then(() => {
        this.tempStorageParams = { ...this.getTempStorageParams };
        this.isLoading = false;
      });
    });
    this.fetchTempStorageParams().then(() => {
      const defaultParams = {
        maxIceStorage: 0,
        coolingLossCoefficient: 0.001,
        maxCoolingCapacity: 0
      };
      this.tempStorageParams = { ...this.getTempStorageParams, ...defaultParams };
      if (Object.keys(this.getTempStorageParams).length === 0) {
        this.saveTempStorageParams(defaultParams)
          .then(() => {
            console.log('默认临时储能装置参数已保存到后端');
          })
          .catch((error) => {
            console.error('保存默认临时储能装置参数失败:', error);
          });
      }
      this.isLoading = false;
    });
  },
  activated() {
    this.isLoading = true;
    this.fetchTempUnits().then(() => {
      this.fetchTempStorageParams().then(() => {
        this.tempStorageParams = { ...this.getTempStorageParams };
        this.isLoading = false;
      });
    });
  },
  beforeUnmount() {
    // 组件卸载时重置一些状态
    this.showEditModalId = null;
    this.editUnitParams = {};
    this.editStorageParams = {
      maxIceStorage: 0,
      coolingLossCoefficient: 0.001,
    };
    this.tempStorageParams = {
      maxIceStorage: 0,
      coolingLossCoefficient: 0.001,
      maxCoolingCapacity: 0
    };
  }
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
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 97%;
  height: 70px;
  /* 固定高度 */
}

.storage-header {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.storage-settings h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333333;
}

.storage-settings .param-row {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
}

.storage-settings .param-item {
  flex: 1;
  margin: 0 10px;
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
  height: 40px;
  /* 固定高度 */
}

/* 顶部栏 */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 97.5%;
  height: 50px;
  /* 固定高度 */
}

.top-bar .label {
  margin-right: 20px;
  font-size: 16px;
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
  background-color: #429db9;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.top-bar button:hover {
  background-color: #3a8ba8;
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
  width: 50%;
  max-height: 80%;
  /* 限制最大高度，防止弹窗过高超出屏幕 */
  overflow-y: auto;
  box-sizing: border-box;
  color: #3b81ba;
  /* 弹窗内容字体颜色 */
  /* 让 padding 不影响宽度计算 */
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
  margin: 0 5px;
}

.param-item label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
}

.param-item input {
  width: 80%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  height: 30px;
  /* 固定高度 */
}

/* 机组卡片展示区域容器样式 */
.unit-list-container {
  background-color: white;
  width: 98%;
  /* 可按需调整宽度百分比 */
  margin: 0 auto;
  padding: 1%;
  min-height: calc(2.5 * (150px + 20px));
  /* 使用 min-height，确保一开始占满两排卡片高度的区域，min-height: 340px; */
  max-height: calc(2.5 * (150px + 20px));
  /* 假设卡片高度 150px，间距 20px，两排高度，超出时滚动 */
}

/* 机组列表样式调整 */
.unit-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
  /* 每行三个卡片 */
  gap: 20px;
}

.unit-card {
  flex: 1;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #F4F7FB;
  height: 150px;
  overflow: hidden;
  /* 隐藏超出部分 */
  display: -webkit-box;
  /* 结合 -webkit-line-clamp 使用，用于实现限制行数 */
  -webkit-line-clamp: 4;
  /* 限制显示 4 行，可根据实际需求调整 */
  -webkit-box-orient: vertical;
  /* 设置为垂直方向 */
  text-overflow: ellipsis;
  /* 超出部分显示省略号 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.unit-card.placeholder {
  visibility: hidden;
}

.unit-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.unit-id {
  font-size: 16px;
  font-weight: 500;
  color: #4293b9;
}

.unit-type {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.mode-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  /* 水平居中 */
  background-color: #a3c2f0;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 40%;
  height: 40px;
  /* 固定高度 */
}

.mode-toggle:hover {
  background-color: #e0e0e0;
}

.toggle-icon {
  display: inline-block;
  width: 20px;
  /* 固定宽度 */
  height: 20px;
  /* 固定高度 */
  border-radius: 50%;
  background-color: #ccc;
  margin-left: 8px;
  transition: background-color 0.3s;
}

.mode-toggle[mode="cooling"] .toggle-icon {
  background-color: #4260b9;
}

.mode-toggle[mode="ice"] .toggle-icon {
  background-color: #3498db;
}

.card-body {
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

/* 保存和删除按钮样式 */
.save-button {
  padding: 10px 20px;
  /* 将 10px 20px 改为 2%，根据父元素宽度调整内边距 */
  background-color: #42b1b9;
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

/* 开始调度预测按钮样式 */
.start-scheduling-button {
  padding: 1.2% 1.2%;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.5em;
  cursor: pointer;
  transition: background-color 0.3s;
  display: block;
  /* 改为块级元素，便于居中 */
  width: 18%;
  /* 调整宽度，根据需要修改 */
  margin: 20px auto;
  /* 上下边距 20px，水平居中 */
  background-image: url('../assets/button-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-color: transparent;
}

.start-scheduling-button:hover {
  background-color: #2980b9;
}

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
  z-index: 1000;
  /* 增加 z-index，确保弹窗在最上层显示 */
}

.edit-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  width: 500px;
  max-height: 90%;
  /* 限制最大高度，防止超出屏幕 */
  overflow-y: auto;
  /* 出现内容过多时显示滚动条 */
  box-sizing: border-box;
  /* 让 padding 不影响宽度计算 */
}

.edit-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.edit-unit-id {
  font-size: 16px;
  font-weight: 500;
  color: #429bb9;
}

.edit-unit-type {
  font-size: 14px;
  color: #666;
}

.edit-close {
  cursor: pointer;
  font-size: 24px;
  color: #666;
}

.mode-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 40%;
  height: 40px;
  color: white;
  /* 文字颜色设置为白色，确保在不同背景色下都能清晰显示 */
}
</style>