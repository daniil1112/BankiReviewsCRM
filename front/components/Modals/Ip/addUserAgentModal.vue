<template>
  <mdb-modal v-show="show" @close="$emit('close')">
    <mdb-modal-header>
      Добавить UserAgent
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-input type="textarea" v-model="userAgent" label="userAgent" />
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="add" color="success">Добавить</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
export default {
name: "addUserAgentModal",
  props:['show','row'],


  data(){
    return {
      userAgent: ''
    }
  },

  computed:{
    user(){
      return this.$store.getters['auth/user']
    },
  },

  mounted() {
    if (this.row.userAgent) this.userAgent = this.row.userAgent
  },

  watch:{
    row(){
      this.userAgent = this.row.userAgent
    }
  },

  methods:{
    async add(){
      const {success} = (await this.$axios.post('/ip/setUserAgent', {user: this.user, _id: this.row._id, userAgent: this.userAgent})).data
      if (success){
        this.$notify.success({
          title: 'UserAgent обновлен'
        })
        this.$emit('reload')
        this.$emit('close')
        this.ipString = ''
      } else {
        this.$notify.error({
          title: 'Ошибка'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>