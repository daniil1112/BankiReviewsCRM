<template>
  <mdb-modal v-show="show" @close="$emit('close')">
    <mdb-modal-header>
      Добавить UserAgent
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-input type="textarea" v-model="userAgent" label="userAgent" />
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="check" color="success">Добавить</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
export default {
  name: "checkUserAgentModal",
  props: ['show'],

  computed:{
    user(){
      return this.$store.getters['auth/user']
    },
  },

  data(){
    return {
      userAgent: ''
    }
  },

  methods:{
    async check(){
      const {count} = (await this.$axios.post('/ip/checkUserAgent', {user: this.user,  userAgent: this.userAgent})).data

      if (!count || count === 0) return this.$notify.success({title: 'Не успользован'})
      return this.$notify.error({title: 'Использлован'})
    }
  }
}
</script>

<style scoped>

</style>