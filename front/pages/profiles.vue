<template>
  <div>
    <mdb-table bordered>
      <mdb-table-head>
        <th>#</th>
        <th>Добавлен</th>
        <th>ФИО</th>
        <th>Дата рождения</th>
        <th>Возраст</th>
        <th>Пол</th>
        <th>Почта</th>
        <th>Пароль</th>
        <th>Использован в отзыве</th>
        <th>Брак</th>
        <th>Действия</th>

      </mdb-table-head>
      <mdb-table-body>
        <tr v-for="(profile, index) in profiles">
          <td>{{index+1}}</td>
          <td>{{generateDate(profile.dateAdd)}}</td>
          <td>{{profile.FIO}}</td>
          <td>{{profile.birthDate}}</td>
          <td>{{profile.age}}</td>
          <td>
            <span v-if="profile.gender === 'm'">Мужской</span>
            <span v-else>Женский</span>
          </td>
          <td>{{profile.mail}}</td>
          <td>{{profile.password}}</td>
          <td>
            <span v-if="profile.assigned">Да</span>
            <span v-else>Нет</span>
          </td>
          <td>
            <span v-if="profile.breakage">Да</span>
            <span v-else>Нет</span>
          </td>
          <td>
            <div v-if="!profile.assigned" >
              <mdb-btn rounded color="danger" @click="deleteRow(profile)">Удалить</mdb-btn>
              <mdb-btn rounded color="info" @click="updateRow(profile)">Изменить</mdb-btn>
            </div>
            <mdb-btn rounded color="info" v-if="profile.breakage" @click="updateBreakageRow(profile)">Изменить брак</mdb-btn>

          </td>
        </tr>
      </mdb-table-body>
    </mdb-table>
    <mdb-btn @click="addProfileModal = true" >Добавить профиль</mdb-btn>
    <AddProfile :show="addProfileModal" @close="addProfileModal = false" @reload-profiles="loadProfiles" />
    <update-profile :show="updateProfileModal" :row='updatingRow' @close="updateProfileModal = false" @reload-profiles="loadProfiles"/>
    <update-breakage-profile :show="updateBreakageProfileModal" :row="updatingRow" @close="updateBreakageProfileModal = false" />
  </div>
</template>

<script>
import moment from 'moment'
import AddProfile from "../components/Modals/profiles/addProfile";
import UpdateProfile from "../components/Modals/profiles/updateProfile";
import UpdateBreakageProfile from "../components/Modals/profiles/updateBreakageProfile";
import dateformat from 'dateformat'
export default {
  name: "profiles",
  components: {UpdateBreakageProfile, UpdateProfile, AddProfile},

  data(){
    return {
      addProfileModal: false,
      updateProfileModal: false,
      updateBreakageProfileModal: false,
      updatingRow: null
    }
  },

  async mounted() {

    setTimeout(() => {
      if (!this.user || parseInt(this.user) !== 2) return this.$router.push('/table')
    }, 1000)

    this.setIntervalReload()
    await this.loadProfiles()
  },



  computed:{
    user(){
      return this.$store.getters['auth/user']
    },
    profiles(){
      return this.$store.getters['profile/allProfiles']
    },
    firstDayOfWeek(){
      let week = []
      var curr = new Date;
      var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
      firstday.setDate(firstday.getDate() + 1)
      week.push(this.momentSTR(firstday))
      firstday.setDate(firstday.getDate() + 1)
      week.push(this.momentSTR(firstday))
      firstday.setDate(firstday.getDate() + 1)
      week.push(this.momentSTR(firstday))
      firstday.setDate(firstday.getDate() + 1)
      week.push(this.momentSTR(firstday))
      firstday.setDate(firstday.getDate() + 1)
      week.push(this.momentSTR(firstday))
      firstday.setDate(firstday.getDate() + 1)
      week.push(this.momentSTR(firstday))
      firstday.setDate(firstday.getDate() + 1)
      week.push(this.momentSTR(firstday))
      return week
    },
  },

  methods:{
    generateDate(iso){
      let date = new Date(iso)
      return  dateformat(date,'dd.mm.yyyy')
    },
    async loadProfiles(){
      await this.$store.dispatch('profile/load')
    },
    momentSTR(iso){
      return moment(iso, 'YYYY-MM-DD HH:mm').format('L');
    },
    async deleteRow(row){
      const {success} = (await this.$axios.post('/profile/deleteRow', {user: this.user, _id: row._id})).data
      if (success){
        this.$notify.success({
          title: 'Удалено'
        })
        await this.loadProfiles()
      }
    },
    updateRow(row) {

      this.updateProfileModal = true
      this.updatingRow = row

    },

    updateBreakageRow(row){
      this.updateBreakageProfileModal = true
      this.updatingRow = row
    },
    setIntervalReload(){
      this.$store.dispatch('table/setInterval')
      this.$store.dispatch('profile/setInterval')
    }
  }
}
</script>

<style scoped>

</style>