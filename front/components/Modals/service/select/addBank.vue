<template>
  <mdb-modal v-show="show" @close="$emit('close')">
    <mdb-modal-header>
      Добавить банк
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-input v-model="bank" label="Банк"/>
      <mdb-input v-model="link" label="Ссылка"/>
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="add">Добавить</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
export default {
name: "addBank",
  props:['show'],


  computed:{
    user(){
      return this.$store.getters['auth/user']
    }
  },

  data(){
    return {
      bank: '',
      link: ''
    }
  },


  methods:{
    async add(){
      const res = await this.$axios.post('service/select/addBankSelect', {
        user: this.user, text: this.bank, value: this.bank, link: this.link
      })

      if (res.data.result) {
        this.$notify.success({
          text: 'Успех',
          title: 'Банк добавлен'
        })
        this.$emit('reload-select')
      }
    }
  }



}
</script>

<style scoped>

</style>