import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentCity: '',
    currentCityArr: '',
  },
  mutations: {
    updateCurrentCity(state, newCity) {
      state.currentCity = newCity
    },
    updateCurrentCityArr(state, newCityArr) {
      state.currentCityArr = newCityArr
    },
  }
})

export default store

