<template>
  <mdb-modal v-show="show" @close="$emit('close')">
    <mdb-modal-header>
      Привязка IP
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-input :value="getBankName(row)" disabled  label="Банк"/>
      <mdb-input :value="getTown(row)" disabled  label="Город"/>
      <mdb-select v-model="ipSelectModel" label="Выбор ip" />
      <mdb-btn @click="save">Сохранить</mdb-btn>
    </mdb-modal-body>
  </mdb-modal>
</template>

<script>
export default {
  name: "assignIpModal",
  props: ['show', 'row'],

  computed:{
    user(){
      return this.$store.getters['auth/user']
    },
    ips(){
      return this.$store.getters['ip/allIps']
    },
    bankSelect(){
      return this.$store.getters['select/newBankSelect']
    },
    townSelect(){
      return this.$store.getters['select/townSelectAll']
    },
  },

  data(){
    return {
      ipSelectModel: []
    }
  },

  watch:{
    row(){
      this.ipSelectModel = [];
      this.ips.forEach(e => {
        if (!e.used) {
          this.ipSelectModel.push({
            text: `${e.ip} (${e.town})`,
            value: e._id
          })
        } else if (this.row.ip === e._id){
          this.ipSelectModel.push({
            text: `${e.ip} (${e.town})`,
            value: e._id,
            selected: true
          })
          console.log(this.row.ip === e._id)
        }

      })

    }
  },


  methods:{
    getBankName(row){
      if (this.bankSelect && this.bankSelect.find(e => e._id === row.bank)) return this.bankSelect.find(e => e._id === row.bank).text
      return ''
    },
    getTown(row) {
      if (this.townSelect && row.town){
        if (this.townSelect.find(e => e._id === row.town)) return this.townSelect.find(e => e._id === row.town).value
        return ''
      }
      return ''
    },
    async save(){
      let selected = this.ipSelectModel.find(e => e.selected)

      if (selected) selected = selected.value
      else return

      const {success} = (await this.$axios.post('/table/assignIp', {user: this.user, ip: selected, _id: this.row._id})).data

      if (success) this.$notify.success({
        title: 'Успешно прявязан ip'
      })
      else this.$notify.success({
        title: 'Ошибка привязки'
      })
    }
  }
}
</script>

<style scoped>

</style>