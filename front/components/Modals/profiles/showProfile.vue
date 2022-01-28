<template>
  <mdb-modal v-show="show" @close="$emit('close')">
    <mdb-modal-header>
      Профиль
    </mdb-modal-header>
    <mdb-modal-body>
      <div v-if="profile">
        <mdb-input :value="profile.FIO" disabled @click.native="doCopy(profile.FIO)" label="ФИО"/>
        <mdb-input :value="profile.mail" disabled @click.native="doCopy(profile.mail)" label="Почта"/>
        <mdb-input :value="profile.password" disabled @click.native="doCopy(profile.password)" label="Пароль"/>
        <span>При нажатии на любое поле значение автоматически копируется</span>
      </div>
    </mdb-modal-body>
    <mdb-modal-footer>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
export default {
  name: "showProfile",
  props: ['show', 'row'],

  computed:{
    profiles(){
      return this.$store.getters['profile/allProfiles']
    },
    profile(){
      if (this.row && this.profiles && this.row.profile) return this.profiles.find(e => e._id === this.row.profile)
    }
  },

  methods:{
    doCopy: function (string) {
      this.$copyText(string).then(function (e) {
        // alert('Copied')
        // console.log(e)
      }, function (e) {
        // alert('Can not copy')
        // console.log(e)
      })
    },
  }
}
</script>

<style scoped>

</style>