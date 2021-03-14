import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import axios from 'axios'
import API from '../config.api'
import router from '../router'

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
    soal: {
      kelompok_tes: [
        {
          soal: [],
          petunjuk: '',
          nama: ''
        }
      ]
    },
    time_passed: 0,
    alat_tes_id: 0,
    kelompokTesIndex: 0,
    sesi_aktif: null
  }
}

export default new Vuex.Store({
  state: initialState(),
  mutations: {
    resetState(state){
      Object.assign(state, initialState())
    },

    setLoading(state, loading){
      state.isLoading = loading
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

    setRagu(state, {index, ragu}){
      let newSoal = JSON.parse(JSON.stringify(state.soal))
      newSoal.kelompok_tes[state.kelompokTesIndex].soal[index].ragu = ragu
      state.soal = newSoal
    },

    setTimePassed(state, time){
      state.time_passed = time
    },

    addTimePassed(state){
      state.time_passed += 1
    },

    setSesiAktif(state, sesi){
      state.sesi_aktif = sesi
    }
  },

  actions: {
    submitTes({commit, state}){
      commit('setLoading', true)
      let jawaban = []
      state.soal.kelompok_tes.forEach(kelompok => {
        kelompok.soal.forEach(soalL => {
          let jwb = soalL.jawaban
          if(jwb == undefined) jwb = ''
          jawaban.push({
            soal_id: soalL.soal_id,
            jawaban: jwb
          })
        })
      })
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.post(`${API.URL}/soal/jawab`, {jawaban}, {headers})
        .then(() => {
          return axios.get(`${API.URL}/soal/submit/${state.alat_tes_id}`, {headers})
        })
        .then(() => {
          commit('setAlatTes', 0)
          commit('setTes', false)
          commit('setKelompokTes', 0)
          commit('setTimePassed', 0)
          commit('setSoal', initialState().soal)
          router.replace('/list-tes')
        })
        .catch(e => {
          console.log(e)
          alert('error: '+e.response.data.message)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },

    logout({commit}){
      commit('resetState')
      localStorage.removeItem('token')
      router.push('/login')
    }
  },
  getters: {
    getSoals: (state) => {
      if(state.soal){
        return state.soal.kelompok_tes[state.kelompokTesIndex].soal
      }
      return []
    },
    getPetunjuk: (state) => {
      if(state.soal){
        return state.soal.kelompok_tes[state.kelompokTesIndex].petunjuk
      }
      return ''
    },
    getJenisSoal: (state) => {
      if(state.soal){
        return state.soal.kelompok_tes[state.kelompokTesIndex].jenis_soal
      }
      return ''
    },
    getAlatTes: (state) => {
      if(state.soal) return state.soal.nama
      return ''
    },
    getKelompokTes: (state) => {
      if(state.soal){
        return state.soal.kelompok_tes[state.kelompokTesIndex].nama
      }
      return ''
    },
    getTimer: (state) => {
      return state.soal.kelompok_tes[state.kelompokTesIndex].waktu * 60
    },
  },
  plugins: [createPersistedState()],
})
