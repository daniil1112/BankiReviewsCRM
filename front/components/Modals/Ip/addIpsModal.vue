<template>
  <mdb-modal v-show="show">
    <mdb-modal-header>
      Добавить IP адреса
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-input type="textarea" v-model="ipString" label="Строка для ip" />
      <a href="#" @click="addStandart">Добавить стандартную приписку</a>
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="add" color="success">Добавить</mdb-btn>
      <mdb-btn @click="$emit('close')" color="danger">Закрыть</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
export default {
  name: "addIpsModal",
  props: ['show'],

  data(){
    return {
      ipString: ''
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
      let lines = ipString.split('\n')
      const {success} = (await this.$axios.post('/ip/add', {user, lines})).data

      if (success){
        this.$notify.success({
          title: 'Адреса добавлены'
        })
        this.$emit('reload')
        this.$emit('close')
        this.ipString = ''
      } else {
        this.$notify.error({
          title: 'Ошибка при добавлении'
        })
      }
    },
    addStandart(){
      const prefix = ':65233:moiplansh028:H3o1SkD'
      this.ipString = this.ipString.split('\n').map((e) => e+prefix).join('\n')
    }
  }
}
</script>

<style scoped>

</style>