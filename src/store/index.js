import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import axios from 'axios'
import API from '../config.api'

Vue.use(Vuex)

const initialState = () => {
  return {
    isLoading: false,
    isLogin: false,
    isDoingTes: false,
    user: {
      email: '',
      role: ''
    },
    soal: {},
    alat_tes_id: 0,
    kelompokTesIndex: 0
  }
}

export default new Vuex.Store({
  state: initialState(),
  mutations: {
    resetState(state){
      Object.assign(state, initialState())
    },

    setLoading(state, loading){
      state.loading = loading
    },

    setUser(state, user){
      state.user = user
      state.isLogin = true
    },

    setTes(state, tes){
      state.isDoingTes = tes
    },

    setSoal(state, soal){
      state.soal = soal
    },
    
    setAlatTes(state, alat_tes_id){
      state.alat_tes_id = alat_tes_id
    },
    
    setKelompokTes(state, kelompokTesIndex){
      state.kelompokTesIndex = kelompokTesIndex
    },

    setJawaban(state, {index, jawaban}){
      let newSoal = JSON.parse(JSON.stringify(state.soal))
      newSoal.kelompok_tes[state.kelompokTesIndex].soal[index].jawaban = jawaban
      state.soal = newSoal
    },
  },
  actions: {
    getSoal({commit, state}){
      if(Object.keys(state.soal).length === 0){
        commit('setLoading', true)
        const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
        axios.get(`${API.URL}/soal/tes/${state.alat_tes_id}`, {headers})
          .then(res => {
            const alat_tes = res.data.doc.alat_tes
            commit('setSoal', alat_tes)
          })
          .catch(e => {
            console.log(e)
            alert('error: '+e.response.data.message)
          })
          .finally(() => {
            commit('setLoading', false)
          })
      }
    }
  },
  getters: {
    getSoals: (state) => {
      if(state.soal && state.soal.kelompok_tes.length) return state.soal.kelompok_tes[state.kelompokTesIndex].soal
      return []
    },
    getPetunjuk: (state) => {
      if(state.soal && state.soal.kelompok_tes.length) return state.soal.kelompok_tes[state.kelompokTesIndex].petunjuk
      return ''
    },
    getAlatTes: (state) => {
      if(state.soal) return state.soal.nama
      return ''
    },
    getKelompokTes: (state) => {
      if(state.soal && state.soal.kelompok_tes.length) return state.soal.kelompok_tes[state.kelompokTesIndex].nama
      return ''
    },
  },
  plugins: [createPersistedState()],
})
