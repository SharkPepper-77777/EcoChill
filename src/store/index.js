import { createStore } from 'vuex';

export default createStore({
  state: {
    isLoggedIn: false, // 登录状态
    user: null, // 用户信息
    units: [], // 机组列表
    nextUnitId: 1 // 用于生成机组编号
  },
  getters: {
    getIsLoggedIn: (state) => state.isLoggedIn,
    getUser: (state) => state.user,
    getUnits: (state) => state.units
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
    addUnit(state, unit) {
      state.units.push(unit);
      state.nextUnitId++;
    }
  },
  actions: {
    login({ commit }, { username, password }) {
      try {
        if (username === 'admin' && password === '1') {
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
    addUnit({ commit, state }, unitData) {
      const unit = {
        ...unitData,
        id: state.nextUnitId
      };
      commit('addUnit', unit);
    }
  },
  modules: {
  }
});