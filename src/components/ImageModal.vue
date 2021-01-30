<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div class="fixed z-20 inset-0 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!--
        Background overlay, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100"
          To: "opacity-0"
      -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-y-auto shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:flex-col sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                Pilih Gambar
              </h3>
              <div class="flex items-center space-x-5 mt-3">
                <div class="relative cursor-pointer p-2 bg-blue-100 text-center">
                  <input :disabled="loading.upload" type="file" @change="fileChange" accept="image/*" class="absolute opacity-0">
                  {{loading.upload? '...':'upload gambar'}}
                </div>
              </div>
            </div>
            <div class="mt-5 w-full">
              <div class="flex flex-wrap">
                <div v-for="(img, index) in imageLink" :key="index" @click="selectedIndex = index" :class="{'bg-blue-500': selectedIndex==index}" class="m-2 p-2 border rounded-md bg-gray-200">
                  <img :class="[imgSize]" :src="img">
                  <p :class="{'font-bold': selectedIndex==index}" class="text-center mt-1">gambar {{index}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" @click="selectImage" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:ml-3 sm:w-auto sm:text-sm bg-green-600 text-white hover:bg-green-700">
            Pilih
          </button>
          <button type="button" @click="$emit('cancel')" class="mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '../config.api'
import axios from 'axios'
export default {
  props: ['editorValue', 'editorInstance'],
  data(){
    return {
      imageLink: [],
      selectedIndex: null,
      uploadFile: '',
      imgSize: 'w-28',
      loading: {
        image: false,
        upload: false
      }
    }
  },
  methods: {
    getImage(){
      this.loading.image = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.get(`${API.URL}/image`, {headers})
        .then(res => {
          const img = res.data.images
          this.imageLink = img.map(val => API.URL.substring(0, API.URL.length-4)+val)
        })
        .catch(e => {
          console.log(e)
          alert('error')
        })
        .finally(() => this.loading.image = false)
    },
    uploadImage(){
      this.loading.upload = true

      const formData = new FormData()
      formData.append('image', this.uploadFile)

      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.post(`${API.URL}/image`, formData, {headers})
        .then(() => {
          this.getImage()
        })
        .catch(e => {
          console.log(e)
          alert('error')
        })
        .finally(() => {
          this.uploadFile = ''
          this.loading.upload = false
        })
        this.loading.upload = false
    },
    fileChange(e){
      if(e.target.files[0]){
        this.uploadFile = e.target.files[0]
        this.uploadImage()
      }
    },
    selectImage(){
      const imgUrl = this.imageLink[this.selectedIndex]
      const imgTag = `<img src="${imgUrl}" />`
      const content = this.editorValue + imgTag

      this.editorInstance.setContent(content, true)
      this.selectedIndex = null
      this.$emit('selectImage')
    }
  },
  mounted(){
    this.getImage()
  }
}
</script>

<style>

</style>