import { createStore } from 'vuex';
import axios from 'axios';

// 提取基础 URL
const baseUrl = 'http://localhost:3001';

// 构建 API 端点对象（补充天气 API 端点）
const apiEndpoints = {
  login: `${baseUrl}/login`,
  register: `${baseUrl}/register`,
  tempUnits: `${baseUrl}/temp_units`,
  scheduledUnits: `${baseUrl}/scheduled_units`,
  storage: `${baseUrl}/storage`,
  tempStorage: `${baseUrl}/temp_storage`, // 新增临时储能设备参数API端点
  startScheduling: `${baseUrl}/start_scheduling`,
  unitById: `${baseUrl}/units/:unit_id`,
  unitsTotal: `${baseUrl}/units/total`, // 新增获取机组数据总和的端点
  searchLocations: `${baseUrl}/search-cities`, // 指向后端的搜索接口（与后端代码对应）
  weather: `${baseUrl}/get-weather`, // 新增天气 API 端点
  currentLocation: `${baseUrl}/current-location` // 新增获取当前城市的 API 端点
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
    }, // 新增临时储能设备参数状态
    searchLocationsResults: [], // 搜索到的地点列表（包含 areacode、name、country）
    selectedCity: null, // 新增：当前选中的城市
    selectedCityWeather: null, // 新增：选中城市的天气数据
    isWeatherLoading: false, // 新增：天气加载状态
    weatherError: null, // 新增：天气请求错误信息
    isScheduling: false, // 调度预测状态
    schedulingTimeLeft: 0 // 调度预测倒计时剩余时间
  },
  getters: {
    getIsLoggedIn: (state) => state.isLoggedIn,
    getUser: (state) => state.user,
    getTempUnits: (state) => state.tempUnits,
    getScheduledUnits: (state) => state.scheduledUnits,
    getStorageParams: (state) => state.storageParams,
    getTempStorageParams: (state) => state.tempStorageParams, // 新增获取临时储能设备参数的getter
    getSelectedUnit: (state) => state.selectedUnit,
    getUnitsTotalData: (state) => state.unitsTotalData,
    getSearchLocationsResults: (state) => state.searchLocationsResults,
    getSelectedCity: (state) => state.selectedCity, // 新增获取当前选中城市的 getter
    getSelectedCityWeather: (state) => state.selectedCityWeather, // 新增获取天气数据的getter
    getIsWeatherLoading: (state) => state.isWeatherLoading, // 新增获取天气加载状态的getter
    getWeatherError: (state) => state.weatherError, // 新增获取天气请求错误信息的 getter
    getIsScheduling: (state) => state.isScheduling,
    getSchedulingTimeLeft: (state) => state.schedulingTimeLeft
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
    setSearchLocationsResults(state, results) {
      console.log('原始 results 数据:', results); // 检查每个 location 是否有 path 字段
      state.searchLocationsResults = results.map(location => ({
        areacode: location.areacode,
        name: location.name,
        adm1: location.adm1,
      }));
      console.log('处理后 searchLocationsResults:', state.searchLocationsResults); // 检查 path 是否正确映射
    },
    // 新增天气相关的mutation
    SET_SELECTED_CITY(state, city) {
      state.selectedCity = city;
    },
    SET_WEATHER_DATA(state, weatherData) {
      state.selectedCityWeather = weatherData;
    },
    SET_WEATHER_LOADING(state, isLoading) {
      state.isWeatherLoading = isLoading;
    },
    SET_WEATHER_ERROR(state, error) {
      state.weatherError = error;
    },
    START_SCHEDULING(state) {
      state.isScheduling = true;
      state.schedulingTimeLeft = 30;
    },
    UPDATE_SCHEDULING_TIME(state) {
      if (state.schedulingTimeLeft > 0) {
        state.schedulingTimeLeft--;
      } else {
        state.isScheduling = false;
      }
    },
    STOP_SCHEDULING(state) {
      state.isScheduling = false;
      state.schedulingTimeLeft = 0;
    }
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
      commit('START_SCHEDULING');
      const countdownInterval = setInterval(() => {
        commit('UPDATE_SCHEDULING_TIME');
        if (!getters.getIsScheduling) {
          clearInterval(countdownInterval);
        }
      }, 1000);

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
        commit('STOP_SCHEDULING');
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
    async searchLocations({ commit }, keyword) {
      try {
        // 调用后端的搜索接口（需与后端 `/search-cities` 接口对应）
        const response = await axios.get(apiEndpoints.searchLocations, {
          params: {
            keyword, // 传递搜索关键字（后端会转为第三方 API 的 location 参数）
            items: 20, // 返回最多 20 条结果（与后端逻辑一致）
            area: 'china', // 搜索范围（可改为 'global' 搜索全球）
          },
        });

        // 后端应返回 { status: 200, cities: [...] }，提取 cities 数组
        if (response.data.status === 200) {
          commit('setSearchLocationsResults', response.data.cities);
        } else {
          // 后端返回错误时清空结果
          commit('setSearchLocationsResults', []);
          console.error('搜索失败:', response.data.message);
        }
      } catch (error) {
        // 网络错误时清空结果
        commit('setSearchLocationsResults', []);
        console.error('网络请求失败:', error.message);
      }
    },
    // 新增获取当前城市的 action
    async fetchCurrentLocation({ commit }) {
      try {
        const response = await axios.get(apiEndpoints.currentLocation);
        if (response.data) {
          commit('SET_SELECTED_CITY', response.data);
          return response.data;
        }
        return null;
      } catch (error) {
        console.error('获取当前城市信息失败:', error);
        return null;
      }
    },
    // 新增天气相关的action
    async fetchWeather({ commit, state }) {
      if (!state.selectedCity) {
        commit('SET_WEATHER_ERROR', '请先选择城市');
        return;
      }
      commit('SET_WEATHER_LOADING', true);
      commit('SET_WEATHER_ERROR', null); // 清除旧错误
      try {
        const params = {
          areacode: state.selectedCity.areacode
        };
        const response = await axios.get(apiEndpoints.weather, { params });
        commit('SET_WEATHER_DATA', response.data);
      } catch (error) {
        console.error('天气请求失败:', error);
        commit('SET_WEATHER_ERROR', '获取天气失败，请检查网络或重试');
      } finally {
        commit('SET_WEATHER_LOADING', false);
      }
    }
  },
  modules: {}
});    