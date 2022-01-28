<template>
  <mdb-modal v-show="show" @close="$emit('close')">
    <mdb-modal-header>
      Проверка на бан
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-input v-model="link" label="Ссылка на отзыв" small="Долгая проверка из-за тормознутости сайта banki"/>
      <div>
        <ul>
          <li v-for="item in check">
            <span v-if="item.loading">{{item.link}} - <div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></span>
            <span v-else-if="!item.error">{{item.link}} - <span v-if="item.ban">Бан</span><span v-else>Не бан</span></span>
            <span v-else>{{item.link}} - Что-то пошло не так</span>
          </li>
        </ul>

      </div>

    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="checkBan">Проверить</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
export default {
  name: "checkBanModal",
  props:['show'],
  data(){
    return {
      link: '',
      check: []
    }
  },

  methods:{
    async checkBan(){
      const link = this.link
      this.link = ''
      this.check.push({
        link,
        loading: true
      })

      this.check = [...this.check]
      try {
        const {ban} = (await this.$axios.post('/parse/parse', {checkLink: link})).data
        this.check = this.check.filter(e => e.link !== link)
        this.check.push({
          link: link,
          loading: false,
          ban
        })
        this.check = [...this.check]
      }catch (e) {
        this.check = this.check.filter(e => e.link !== link)
        this.check.push({
          link: link,
          loading: false,
          error: true
        })
        this.check = [...this.check]
      }



      // if (ban) this.$notify.error({title: 'Бан'})
      // else this.$notify.success({title: 'Не бан'})
    }
  }
}
</script>

<style scoped>

</style>