<template>
  <div>
    <mdb-table bordered responsive>
      <mdb-table-head>
        <tr>
          <th>#</th>
          <th>Создана запись</th>
          <th>Доп данные</th>
          <th>Пол</th>
          <th>Рекоммендуемый возраст</th>
          <th>Заголовок</th>
          <th>Текст</th>
          <th>Действия</th>
        </tr>
      </mdb-table-head>
      <mdb-table-body>
        <tr v-for="row in filteredRows" >
          <td>{{row._id}}</td>
          <td>{{generateDate(row.dateSetText)}}</td>
          <td>
            <span>{{row.info}}</span>
          <td>
            <div>
              <span v-if="row.gender === 'm'">Мужской</span>
              <span v-else>Женский</span>
            </div>
          </td>
          <td>
            <span>{{row.recommendedAge}}</span>
          </td>
          <td>
            <span >{{row.title}}</span>
          </td>
          <td>
            <span >{{row.text}}</span>
          </td>

          <td>
            <mdb-btn @click="setShowAssignProfileModal(row)" @close="showAssignProfileModal = false" ><span v-if="!row.profile">Прикрепить профиль</span><span v-else>Изменить профиль</span></mdb-btn>
            <mdb-btn color="danger" rounded @click="unpinProfile(row)" v-if="row.profile">Открепить профиль</mdb-btn>
            <mdb-btn color="success" rounded @click="setNextStep(row)" v-if="row.profile">На следующей шаг</mdb-btn>
          </td>
        </tr>
      </mdb-table-body>
    </mdb-table>

    <assign-profile :show="showAssignProfileModal" :profiles="profiles" :row="updateRow" @close="showAssignProfileModal = false" @reload-table="$emit('reload-table')"/>

  </div>

</template>

<script>
import AddRow from "../../components/Modals/reviews/addRow";
import moment from 'moment'
import UpdateRow from "../Modals/reviews/updateRow";
import AssignProfile from "../Modals/profiles/assignProfile";
import dateformat from 'dateformat'
export default {
  name: "AddReview",
  props: ['rows'],
  components:{AssignProfile, UpdateRow, AddRow},

  data(){
    return {
      updateRow: false,
      showAssignProfileModal: false,
    }
  },

  async mounted() {
    await this.$store.dispatch('select/loadAutoSelectBank')
  },

  computed:{
    profiles(){
      return this.$store.getters['profile/allProfiles']
    },

    filteredRows(){
      return this.rows.filter( e => e.step === 2)
    },
    user(){
      return this.$store.getters['auth/user']
    },
  },


  methods:{
    setShowAssignProfileModal(row){
      this.showAssignProfileModal = true
      this.updateRow = row
    },
    generateDate(iso){
      let date = new Date(iso)
      return  dateformat(date,'dd.mm.yyyy')
    },
    momentSTR(iso){
      return moment(iso, 'YYYY-MM-DD HH:mm').format('L');
    },
    async setNextStep(row){
      const {user} = this
      const {success} = (await this.$axios.post('/table/setStep3', {user, _id: row._id})).data
      if (success) this.$notify.success({
        title: 'Успех',
        message: 'Отзыв передан для добавления'
      })

      this.$emit('reload-table')
    },
    async unpinProfile(row){
      const {user} = this
      const {success} = (await this.$axios.post('/profile/unpin', {user, _id: row._id})).data
      if (success){
        this.$notify.success({
          title: 'Профиль отпкреплен'
        })
        this.$emit('reload-profiles')
        this.$emit('reload-table')
      }
    }
  }
}
</script>

<style scoped>

</style>