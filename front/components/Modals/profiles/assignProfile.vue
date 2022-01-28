<template>
  <mdb-modal v-show="show" @close="$emit('close')">
    <mdb-modal-header>
      Прикрепить профиль к отзыву
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-select v-model="profilesSelect" search v-show="profilesSelect && profilesSelect.length !== 0"/>
      <mdb-btn v-if="row && row.assigned">Открепить</mdb-btn>
      <p v-show="profilesSelect && profilesSelect.length === 0">Не найдено профилей для данного отзыва</p>
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="add" >Добавить</mdb-btn>
      <mdb-btn @click="$emit('close')" >Закрыть</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
export default {
  name: "assignProfile",
  props:['show',"profiles","row"],
  data(){
    return{
      profilesSelect: []
    }
  },



  computed:{
    profileId(){
      let res = 0;
      this.profilesSelect.forEach(e => {
        if (e.selected) res = e.value
      })
      return res
    },
    user(){
      return this.$store.getters['auth/user']
    },
  },


  watch:{
    row(){
      const gender = this.row.gender;
      this.profilesSelect = []
      if (!this.row.profile){
        this.profiles.forEach(e => {
          let genderShow = e.gender === 'm' ? 'Мужской' : 'Женский'
          if (!e.assigned && e.gender === gender) this.profilesSelect.push({
            text: `${e.FIO} (${e.mail} - ${e.age} лет - (${genderShow}))`,
            value: e._id
          })
        })
      }
      else {
        this.profiles.forEach(e => {
          let genderShow = e.gender === 'm' ? 'Мужской' : 'Женский'
          if (!e.assigned && e.gender === gender) this.profilesSelect.push({
            text: `${e.FIO} (${e.mail} - ${e.age} лет - (${genderShow}))`,
            value: e._id
          })
          else if (e._id === this.row.profile) this.profilesSelect.push({
            text: `${e.FIO} (${e.mail} - ${e.age} лет - (${genderShow}))`,
            value: e._id,
            selected: true
          })
        })
      }

    }
  },


  methods:{
    async add(){
      const { profileId, row, user} = this
      const res = await this.$axios.post('/profile/assign',{user, rowId: row._id, profileId})
      if (res.data && res.data.success){
        this.$emit('close')
        this.$notify.success({
          title: 'Профиль прикреплен'
        })
        this.$emit('reload-table')
      }
    },


  },

}
</script>

<style scoped>

</style>