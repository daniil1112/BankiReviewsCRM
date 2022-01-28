<template>
  <mdb-modal v-show="show" @close="$emit('close')">
    <mdb-modal-header>
      Добавить Банкомат
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-input v-model="dispenserMin" label="Банкомат (Короткое название)" />
      <mdb-input v-model="dispenser" label="Банкомат (полна улица без города)" />
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="add">Добавить</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
export default {
  name: "addDispenser",

  props:['show','bankId','townId'],


  computed:{
    user(){
      return this.$store.getters['auth/user']
    }
  },


  data(){
    return {
      dispenser: '',
      dispenserMin: ''
    }
  },


  methods:{
    async add(){
      const res = await this.$axios.post('service/select/addDispenserSelect', {
        user: this.user, text: this.dispenserMin, value: this.dispenser, bankId: this.bankId, townId: this.townId
      })

      if (res.data.result) {
        this.$notify.success({
          text: 'Успех',
          title: 'Банкомат добавлен'
        })
        // this.$emit('reload-select')
      }
    }
  }
}
</script>

<style scoped>

</style>