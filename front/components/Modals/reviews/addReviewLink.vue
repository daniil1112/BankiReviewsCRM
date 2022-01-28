<template>
  <mdb-modal v-show="show">
    <mdb-modal-header>
      Ссылка на отзыв
    </mdb-modal-header>
    <mdb-modal-body v-if="show">
      <mdb-input v-model="link" label="Ссылка" />
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="save" >Сохранить</mdb-btn>
      <mdb-btn @click="$emit('close')" color="danger">Закрыть</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
export default {
  name: "addReviewLink",
  props: ['show','row'],

  computed:{
    user(){
      if (this.$store.getters['auth/user']) return parseInt(this.$store.getters['auth/user'])
    }
  },

  data(){
    return {
      link: ''
    }
  },

  methods:{
    async save(){
      const {user, link} = this

      const {success} = (await this.$axios.post('table/setLink', {user, link, _id: this.row._id})).data

      if (success) return this.$notify.success({title: 'Успех'})
      return this.$notify.error({title: 'Ошибка'})

    }
  }
}
</script>

<style scoped>

</style>