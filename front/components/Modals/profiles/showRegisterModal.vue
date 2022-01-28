<template>
  <mdb-modal v-show="show" @close="$emit('close')">
    <mdb-modal-header>
      Инфо
    </mdb-modal-header>
    <mdb-modal-body>
      <div v-if="profile">
        <mdb-input :value="profile.mail" disabled  @click.native="doCopy(profile.mail)" label="Почта"/>
        <mdb-input :value="profile.login" disabled @click.native="doCopy(profile.login)" label="Логин"/>
        <mdb-input :value="profile.password" disabled  @click.native="doCopy(profile.password)" label="Пароль"/>
        <mdb-input v-model="phone" label="Телефон" small="начинается с +7"/>
      </div>

    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="addPhone" color="success">Добавить</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
export default {
  name: "showRegisterModal",
  props:['show','row'],

  data(){
    return {
      phone: ''
    }
  },

  computed:{
    user(){
      return this.$store.getters['auth/user']
    },
    profiles(){
      return this.$store.getters['profile/allProfiles']
    },
    profile(){
      return this.profiles.find(e => e._id === this.row.profile)
    }
  },

  watch:{
    row(){
      if (this.row.phone) this.phone = this.row.phone
    }
  },


  methods:{
    doCopy: function (string) {
      this.$copyText(string).then(function (e) {
        alert('Copied')
        console.log(e)
      }, function (e) {
        alert('Can not copy')
        console.log(e)
      })
    },
    async addPhone(){
      const {success} = (await this.$axios.post('/table/setPhone', {user: this.user, _id: this.row._id, phone: this.phone})).data
      if (success){
        this.$notify.success({title: 'Успех'})
      } else {
        this.$notify.error({title: 'Ошибка'})
      }
    }
  }
}
</script>

<style scoped>

</style>