<template>
  <div>
    <mdb-table>
      <mdb-table-head>
        <th>#</th>
        <th>Дата добавления</th>
        <th>Банк</th>
        <th>Город</th>
        <th>Оценка</th>
        <th>IP</th>
        <th>Действия</th>
      </mdb-table-head>
      <mdb-table-body>
        <tr v-for="row in FilteredRows">
          <td>{{row._id}}</td>
          <td>{{generateDate(row.dateSetText)}}</td>
          <td>{{getBankName(row)}}</td>
          <td>{{getTown(row)}}</td>
          <td>{{row.mark}}</td>
          <td>{{getIp(row)}}</td>
          <td>
            <mdb-btn @click="showAssignIp(row)">Добавить профиль IP</mdb-btn>
            <mdb-btn v-if="row.ip" @click="showIpInfo(row)">Данные об IP</mdb-btn>
            <mdb-btn v-if="row.ip" @click="showRegisterInfo(row)">Регистрация</mdb-btn>
            <mdb-btn v-if="row.phone" @click="profileAndReviewInfo(row)">Профиль/Отзыв</mdb-btn>
            <mdb-btn v-if="row.ip" @click="setShowAddLinkModal(row)">Прикрепить ссылку</mdb-btn>
            <mdb-btn v-if="row.reviewLink" @click="setNextStep(row)">К следущему шагу</mdb-btn>
            <mdb-btn @click="setBreakage(row)" color="danger">Брак</mdb-btn>
            <mdb-btn v-if='row.ip' @click="unsignIp(row)">Открепить IP</mdb-btn>
          </td>
        </tr>
      </mdb-table-body>
    </mdb-table>
    <assign-ip-modal :show="showAssignIpModal" :row="selectedRow" @close="showAssignIpModal = false"/>
    <ip-info-modal :show="showIpInfoModal" :row="selectedRow" @close="showIpInfoModal = false"/>
    <show-register-modal :show="showRegisterModal" :row="selectedRow" @close="showRegisterModal = false" />
    <all-info :show="showProfileAndReviewInfo" :row="selectedRow" @close="showProfileAndReviewInfo = false" />
    <add-review-link :show="showAddLinkModal" :row="selectedRow" @close="showAddLinkModal = false" />
  </div>

</template>

<script>
import moment from 'moment'
import AssignIpModal from "../Modals/Ip/assignIpModal";
import IpInfoModal from "../Modals/Ip/ipInfoModal";
import ShowRegisterModal from "../Modals/profiles/showRegisterModal";
import AllInfo from "../Modals/reviews/allInfo";
import AddReviewLink from "../Modals/reviews/addReviewLink";
import dateformat from 'dateformat'
export default {
name: "addTechnical",
  components: {AddReviewLink, AllInfo, ShowRegisterModal, IpInfoModal, AssignIpModal},
  props: ['rows'],

  computed:{
    FilteredRows(){
      return this.rows.filter(e => e.step === 3)
    },
    bankSelect(){
      return this.$store.getters['select/newBankSelect']
    },
    townSelect(){
      return this.$store.getters['select/townSelectAll']
    },
    ipSelect(){
      return this.$store.getters['ip/allIps']
    },
    user(){
      return this.$store.getters['auth/user']
    }
  },

  data(){
    return {
      selectedRow: false,
      showAssignIpModal: false,
      showIpInfoModal: false,
      showRegisterModal: false,
      showProfileAndReviewInfo: false,
      showAddLinkModal: false
    }
  },


  methods:{
    profileAndReviewInfo(row){
      this.showProfileAndReviewInfo = true
      this.selectedRow = row
    },
    showRegisterInfo(row){
      this.selectedRow = row
      this.showRegisterModal = true
    },
    setShowAddLinkModal(row){
      this.selectedRow = row
      this.showAddLinkModal = true
    },
    showIpInfo(row){
      this.selectedRow = row
      this.showIpInfoModal = true
    },
    showAssignIp(row){
      this.selectedRow = row
      this.showAssignIpModal = true
    },

    momentSTR(iso){
      return moment(iso, 'YYYY-MM-DD HH:mm').format('L');
    },

    generateDate(iso){
      let date = new Date(iso)
      return  dateformat(date,'dd.mm.yyyy')
    },
    getBankName(row){
      if (this.bankSelect && this.bankSelect.find(e => e._id === row.bank)) return this.bankSelect.find(e => e._id === row.bank).text
      return ''
    },
    getBankLink(row){
      if (this.bankSelect && this.bankSelect.find(e => e._id === row.bank)) return this.bankSelect.find(e => e._id === row.bank).link
      return ''
    },
    getTown(row) {
      if (this.townSelect && row.town){
        if (this.townSelect.find(e => e._id === row.town)) return this.townSelect.find(e => e._id === row.town).value
        return ''
      }
      return ''
    },
    getIp(row){
      if (this.ipSelect && row.ip){
        if (this.ipSelect.find(e => e._id === row.ip)) return this.ipSelect.find(e => e._id === row.ip).ip
        return ''
      }
      return ''
    },
    async setBreakage(row){
      const {success} = (await this.$axios.post('/table/setBreakage', {user: this.user, _id: row._id})).data
      if (success) return this.$notify.success({title: 'Успех'})
      return this.$notify.error({ title: 'Ошибка' })
    },
    async setNextStep(roww){
      const {row} = (await this.$axios.post('/table/setStep4', {user: this.$store.getters['auth/user'], _id: roww._id})).data
      if (row) this.$notify.success({
        title: 'Успех',
        message: 'Отзыв передан для проверки'
      })

      this.$emit('reload-table')
    },
    async unsignIp(row){
      const {success} = (await this.$axios.post('/table/unsignIp', {user: this.user, _id: row._id})).data
      if (success) return this.$notify.success({title: 'Успех'})
      return this.$notify.error({ title: 'Ошибка' })
    }
  }
}
</script>

<style scoped>

</style>