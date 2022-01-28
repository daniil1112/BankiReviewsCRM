<template>
  <mdb-modal v-show="show" @close="$emit('close')">
    <mdb-modal-header>
      Добавить город
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-input v-model="town" label="Город" />
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="add">Добавить</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
export default {
name: "addTown",

  props:['show','bankId'],

  computed:{
    user(){
      return this.$store.getters['auth/user']
    }
  },


  data(){
    return {
      town: ''
    }
  },

  methods:{
    async add(){
      const res = await this.$axios.post('service/select/addTownSelect', {
        user: this.user, text: this.town, value: this.town, bankId: this.bankId
      })

      if (res.data.result) {
        this.$notify.success({
          text: 'Успех',
          title: 'Город добавлен'
        })
        // this.$emit('reload-select')
      }
    }
  }


}
</script>

<style scoped>

</style>