<template>
  <div>
    <div v-if="!auth">
      <mdb-input v-model="code" label="Введите код для входа" />
      <mdb-btn @click="setAuthCode" >Войти</mdb-btn>

    </div>
    <div v-else>
      Вход произведен!

    </div>

  </div>
</template>

<script>

import Vue from 'vue'


export default {
  name: "Login",


  data(){
    return{
      auth: '',
      code: ''
    }
  },





  methods:{
    setAuth(auth){
      localStorage.auth = auth
      this.auth = auth
    },
    setAuthCode(){
      if (this.code === '5334') this.setAuth(1)
      if (this.code === '7891') this.setAuth(2)
      if (this.code === '17823') this.setAuth(3)
      if (this.code === '89012') this.setAuth(4)
      if (this.code === '09342') this.setAuth(5)
    }
  },


  mounted() {
    if (localStorage.auth) this.auth = localStorage.auth
  },


}
</script>

<style scoped>


</style>