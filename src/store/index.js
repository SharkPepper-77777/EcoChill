import { createStore } from 'vuex'

export default createStore({
  state: {
    isLoggedIn: false, // 登录状态
    user: null, // 用户信息
  },
  getters: {
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
  },
  actions: {
    login({ commit }, { username, password }) {
      // 模拟登录验证
      if (username === 'admin' && password === '1') {
        commit('login', { username }); // 登录成功，更新状态
        return true; // 返回登录成功
      } else {
        return false; // 返回登录失败
      }
    },
    logout({ commit }) {
      commit('logout'); // 登出
    },
  },
  modules: {
  }
})
