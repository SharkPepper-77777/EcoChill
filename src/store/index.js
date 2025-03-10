import { createStore } from 'vuex';
import axios from 'axios';

// 提取基础 URL
const baseUrl = 'http://localhost:3001';

// 构建 API 端点对象
const apiEndpoints = {
  login: `${baseUrl}/login`,
  register: `${baseUrl}/register`,
  tempUnits: `${baseUrl}/temp_units`,
  scheduledUnits: `${baseUrl}/scheduled_units`,
  storage: `${baseUrl}/storage`,
  tempStorage: `${baseUrl}/temp_storage`, // 新增临时储能设备参数API端点
  startScheduling: `${baseUrl}/start_scheduling`,
  unitById: '${baseUrl}/units/:unit_id',
  unitsTotal: `${baseUrl}/units/total` // 新增获取机组数据总和的端点
};

export default createStore({
  state: {
    isLoggedIn: false, // 登录状态
    user: null, // 用户信息
    tempUnits: [], // 存储调度预测界面的临时机组数据
    nextTempUnitId: 1, // 用于生成临时机组编号
    scheduledUnits: [], // 存储点击开始调度预测后的数据
    nextScheduledUnitId: 1, // 用于生成正式记录的机组编号
    selectedUnit: null,
    unitsTotalData: null, // 新增，用于存储机组数据总和
    storageParams: {
      maxIceStorage: 0,
      coolingLossCoefficient: 0.001,
      maxCoolingCapacity: 0
    },
    tempStorageParams: {
      maxIceStorage: 0,
      coolingLossCoefficient: 0.001,
      maxCoolingCapacity: 0
    } // 新增临时储能设备参数状态
  },
  getters: {
    getIsLoggedIn: (state) => state.isLoggedIn,
    getUser: (state) => state.user,
    getTempUnits: (state) => state.tempUnits,
    getScheduledUnits: (state) => state.scheduledUnits,
    getStorageParams: (state) => state.storageParams,
    getTempStorageParams: (state) => state.tempStorageParams,// 新增获取临时储能设备参数的getter
    getSelectedUnit: (state) => state.selectedUnit,
    getUnitsTotalData: (state) => state.unitsTotalData
  },
  mutations: {
    login(state, user) {
      state.isLoggedIn = true;
      state.user = user;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    addTempUnit(state, unit) {
      state.tempUnits.push(unit);
    },
    setTempUnits(state, units) {
      state.tempUnits = units;
    },
    updateTempUnit(state, updatedUnit) {
      const index = state.tempUnits.findIndex(unit => unit.id === updatedUnit.id);
      if (index !== -1) {
        state.tempUnits[index] = updatedUnit;
      }
    },
    deleteTempUnit(state, unitId) {
      state.tempUnits = state.tempUnits.filter(unit => unit.id !== unitId);
    },
    addScheduledUnit(state, unit) {
      state.scheduledUnits.push(unit);
    },
    setScheduledUnits(state, units) {
      state.scheduledUnits = units;
    },
    updateScheduledUnit(state, updatedUnit) {
      const index = state.scheduledUnits.findIndex(unit => unit.id === updatedUnit.id);
      if (index !== -1) {
        state.scheduledUnits[index] = updatedUnit;
      }
    },
    deleteScheduledUnit(state, unitId) {
      state.scheduledUnits = state.scheduledUnits.filter(unit => unit.id !== unitId);
    },
    updateStorageParams(state, newParams) {
      state.storageParams = { ...state.storageParams, ...newParams };
    },
    startScheduling(state) {
      state.scheduledUnits = state.scheduledUnits.concat(state.tempUnits);
      state.tempUnits = [];
    },
    setTempStorageParams(state, params) {
      state.tempStorageParams = { ...state.tempStorageParams, ...params }; // 新增设置临时储能设备参数的mutation
    },
    setSelectedUnit(state, unit) {
      state.selectedUnit = unit;
    },
    setUnitsTotalData(state, data) {
      state.unitsTotalData = data;
    },
  },
  actions: {
    async login({ commit }, { username, password }) {
      try {
        const response = await axios.post(apiEndpoints.login, { username, password });
        if (response.data.success) {
          commit('login', { username });
          console.log('登录成功');
          return true;
        } else {
          console.log('登录失败：用户名或密码错误');
          return false;
        }
      } catch (error) {
        console.error('登录过程中出现错误：', error);
        return false;
      }
    },
    logout({ commit }) {
      try {
        commit('logout');
        console.log('登出成功');
      } catch (error) {
        console.error('登出过程中出现错误：', error);
      }
    },
    async fetchTempUnits({ commit }) {
      try {
        const response = await axios.get(apiEndpoints.tempUnits);
        commit('setTempUnits', response.data);
      } catch (error) {
        console.error('获取临时机组数据时出现错误：', error);
      }
    },
    async fetchScheduledUnits({ commit }) {
      try {
        const response = await axios.get(apiEndpoints.scheduledUnits);
        commit('setScheduledUnits', response.data);
      } catch (error) {
        console.error('获取正式记录的机组数据时出现错误：', error);
      }
    },
    async addTempUnit({ commit, state }, unitData) {
      try {
        const unit = {
          ...unitData,
          id: state.nextTempUnitId
        };
        const response = await axios.post(apiEndpoints.tempUnits, unit);
        commit('addTempUnit', response.data);
        state.nextTempUnitId++;
      } catch (error) {
        console.error('添加临时机组时出现错误：', error);
      }
    },
    async addScheduledUnit({ commit, state }, unitData) {
      try {
        const unit = {
          ...unitData,
          id: state.nextScheduledUnitId
        };
        const response = await axios.post(apiEndpoints.scheduledUnits, unit);
        commit('addScheduledUnit', response.data);
        state.nextScheduledUnitId++;
      } catch (error) {
        console.error('添加正式记录的机组时出现错误：', error);
      }
    },
    async saveEditedTempUnit({ commit }, unit) {
      try {
        const response = await axios.put(`${apiEndpoints.tempUnits}/${unit.id}`, unit);
        commit('updateTempUnit', response.data);
      } catch (error) {
        console.error('更新临时机组时出现错误：', error);
      }
    },
    async saveEditedScheduledUnit({ commit }, unit) {
      try {
        const response = await axios.put(`${apiEndpoints.scheduledUnits}/${unit.id}`, unit);
        commit('updateScheduledUnit', response.data);
      } catch (error) {
        console.error('更新正式记录的机组时出现错误：', error);
      }
    },
    async deleteTempUnit({ commit }, unitId) {
      try {
        await axios.delete(`${apiEndpoints.tempUnits}/${unitId}`);
        commit('deleteTempUnit', unitId);
      } catch (error) {
        console.error('删除临时机组时出现错误：', error);
      }
    },
    async deleteScheduledUnit({ commit }, unitId) {
      try {
        await axios.delete(`${apiEndpoints.scheduledUnits}/${unitId}`);
        commit('deleteScheduledUnit', unitId);
      } catch (error) {
        console.error('删除正式记录的机组时出现错误：', error);
      }
    },
    async fetchStorageParams({ commit }) {
      try {
        const response = await axios.get(apiEndpoints.storage);
        commit('updateStorageParams', response.data);
      } catch (error) {
        console.error('获取储能装置参数时出现错误：', error);
      }
    },
    async saveStorageParams({ commit }, params) {
      try {
        const response = await axios.put(apiEndpoints.storage, params);
        commit('updateStorageParams', response.data);
      } catch (error) {
        console.error('保存储能装置参数时出现错误：', error);
      }
    },
    async startScheduling({ commit, getters }) {
      try {
        const response = await axios.post(apiEndpoints.startScheduling);
        if (response.status === 200) {
          // 点击预测调度时，将临时储能参数保存到实际的storage中
          const tempStorageParams = getters.getTempStorageParams;
          commit('updateStorageParams', {
            ...tempStorageParams
          });
          console.log('开始调度预测成功');
        } else {
          console.log('开始调度预测失败');
        }
      } catch (error) {
        console.error('开始调度预测时出现错误：', error);
      }
    },
    async fetchTempStorageParams({ commit }) {
      try {
        const response = await axios.get(apiEndpoints.tempStorage);
        commit('setTempStorageParams', response.data);
      } catch (error) {
        console.error('获取临时储能设备参数时出现错误：', error);
      }
    },
    async saveTempStorageParams({ commit }, params) {
      try {
        const response = await axios.put(apiEndpoints.tempStorage, params);
        commit('setTempStorageParams', response.data);
      } catch (error) {
        console.error('保存临时储能设备参数时出现错误：', error);
      }
    },
    async getUnitById({ commit }, unitId) {
      try {
        const url = apiEndpoints.unitById.replace(':unit_id', unitId);
        const response = await axios.get(url);
        commit('setSelectedUnit', response.data);
        return response.data;
      } catch (error) {
        console.error(`获取 ID 为 ${unitId} 的机组数据时出现错误：`, error);
        return null;
      }
    },
    async fetchUnitsTotalData({ commit }) {
      console.log('fetchUnitsTotalData 被调用'); // 添加日志
      try {
        const response = await axios.get(apiEndpoints.unitsTotal);
        commit('setUnitsTotalData', response.data);
      } catch (error) {
        console.error('获取机组数据总和时出现错误：', error);
      }
    },
  },
  modules: {}
});