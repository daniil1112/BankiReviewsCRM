<template>
  <mdb-modal v-show="show" @close="$emit('close')">
    <mdb-modal-header>
      Изменить IP
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-input type="textarea" v-model="ipString" label="Строка для ip" />
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="add" color="success">Добавить</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
export default {
  name: "updateIpModal",
  props: ['show', 'row'],

  data(){
    return {
      ipString: ''
    }
  },

  watch:{
    row(){
      this.ipString = this.row.string
    }
  },

  computed:{
    user(){
      return this.$store.getters['auth/user']
    }
  },

  methods:{
    async add(){
      let {user, ipString} = this

      const {success} = (await this.$axios.post('/ip/update', {user, ipString, _id: this.row._id})).data

      if (success){
        this.$notify.success({
          title: 'Изменено успешно'
        })
        this.$emit('reload')
        this.$emit('close')
        this.ipString = ''
      } else {
        this.$notify.error({
          title: 'Ошибка при узменении'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>