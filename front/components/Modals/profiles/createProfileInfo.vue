<template>
  <div v-if="profile">
    <mdb-input :value='profile.FIO.split(" ")[0]' @click.native="doCopy(profile.FIO.split(' ')[0])" label="Фамилия" disabled/>
    <mdb-input :value='profile.FIO.split(" ")[1]' @click.native="doCopy(profile.FIO.split(' ')[1])" label="Имя" disabled/>
    <mdb-input :value='profile.FIO.split(" ")[2]' @click.native="doCopy(profile.FIO.split(' ')[2])" label="Отчество" disabled/>
    <mdb-input :value='profile.birthDate' @click.native="doCopy(profile.birthDate)" label="Дата рождения" disabled />
  </div>
</template>

<script>
export default {
name: "createProfileInfo",
  props:['row'],


  computed:{
    profiles(){
      return this.$store.getters['profile/allProfiles']
    },
    profile(){
      return this.profiles.find(e => e._id === this.row.profile)
    }
  },

  methods:{
    doCopy: function (string) {
      this.$copyText(string).then(function (e) {

      }, function (e) {
      })
    },
  }
}
</script>

<style scoped>

</style>