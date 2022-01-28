<template>
  <mdb-modal v-show="show" @close="$emit('close')">
    <mdb-modal-header>
      Добавить офис
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-input v-model="officeMin" label="Офис (Короткое название)" />
      <mdb-input v-model="office" label="Офис (полна улица без города)" />
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="add">Добавить</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
export default {
  name: "addOffice",

  props:['show','bankId','townId'],


  computed:{
    user(){
      return this.$store.getters['auth/user']
    }
  },


  data(){
    return {
      office: '',
      officeMin: ''
    }
  },


  methods:{
    async add(){
      const res = await this.$axios.post('service/select/addOfficeSelect', {
        user: this.user, text: this.officeMin, value: this.office, bankId: this.bankId, townId: this.townId
      })

      if (res.data.result) {
        this.$notify.success({
          text: 'Успех',
          title: 'Офис добавлен'
        })
        // this.$emit('reload-select')
      }
    }
  }
}
</script>

<style scoped>

</style>