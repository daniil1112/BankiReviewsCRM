<template>
  <div>
    <p v-show="false">{{user}}</p>
    <b-table-simple bordered responsive v-if="rows && rows.length > 0">
      <b-thead>
        <b-th>№</b-th>
        <b-th>Дата</b-th>
        <b-th>Дата размещения</b-th>
        <b-th>Банк</b-th>
        <b-th>Ссылка на отзыв</b-th>
        <b-th>email</b-th>
        <b-th>ФИО</b-th>
        <b-th>Логин</b-th>
        <b-th>Пароль</b-th>
        <b-th>Логин на банки</b-th>
        <b-th>Телефон</b-th>
        <b-th>IP</b-th>
        <b-th>User-Agent</b-th>
        <b-th>Доп инфо</b-th>
        <b-th>Город</b-th>
        <b-th>Оценка</b-th>
        <b-th>Заголовок</b-th>
        <b-th>Текст</b-th>
        <b-th>Вопрос</b-th>
        <b-th>Ответ</b-th>
        <b-th>Статус</b-th>
      </b-thead>
      <b-tbody>
        <b-tr v-for="row in rows">
          <b-td>{{row._id}}</b-td>
          <b-td>{{generateDate(row.dateSetText)}}</b-td>
          <b-td>
            <span v-if="row.reviewAddDate">{{generateFullDate(row.reviewAddDate)}}</span>
            <span v-else>Еще не добавлен</span>
          </b-td>
          <b-td>{{getBankName(row)}}</b-td>
          <b-td>{{row.reviewLink}}</b-td>
          <b-td>{{getMail(row)}}</b-td>
          <b-td>{{getFIO(row)}}</b-td>
          <b-td>{{getLogin(row)}}</b-td>
          <b-td>{{getPassword(row)}}</b-td>
          <b-td>{{getLogin(row)}}</b-td>
          <b-td>{{row.phone}}</b-td>
          <b-td>{{getIp(row)}}</b-td>
          <b-td>{{getUserAgent(row)}}</b-td>
          <b-td>{{row.info}}</b-td>
          <b-td>{{getTown(row)}}</b-td>
          <b-td>{{row.mark}}</b-td>
          <b-td>{{row.title}}</b-td>
          <b-td>{{row.text}}</b-td>
          <b-td>{{row.moderateAsk}}</b-td>
          <b-td>{{row.moderateAnswer}}</b-td>
          <b-td>{{getStatusText(row.moderateStatus)}}</b-td>
        </b-tr>

      </b-tbody>
    </b-table-simple>
  </div>

</template>

<script>
import dateformat from 'dateformat'
import moment from 'moment'
export default {
name: "datatable",

  computed:{
    rows(){
      return this.$store.getters['table/allTable']
    },
    profiles(){
      return this.$store.getters['profile/allProfiles']
    },
    bankSelect(){
      return this.$store.getters['select/newBankSelect']
    },
    ip(){
      return this.$store.getters['ip/allIps']
    },
    townSelect(){
      return this.$store.getters['select/townSelectAll']
    },
    user(){
      if (this.$store.getters['auth/user']) return parseInt(this.$store.getters['auth/user'])

    },

  },

  watch:{
    async user(){
      if (this.user){
        this.loadTable()
        this.loadProfiles()
        this.setIntervalReload()
      }
    }
  },

  mounted() {
    if (this.user){
      this.$store.dispatch('select/loadAutoSelectBank')
      this.loadTable()
      this.loadProfiles()
      this.loadIP()
      this.setIntervalReload()
    }
    if (localStorage.onlyToday === 'true'){
      this.onlyToday = true
    }
  },

  methods:{
    generateFullDate(iso){
      let date = new Date(iso)
      return  dateformat(date,'dd.mm.yyyy HH:MM:ss')
    },
    generateDate(iso){
      let date = new Date(iso)
      return  dateformat(date,'dd.mm.yyyy')
    },
    getStatusText(val){
      if (val === 1) return 'Ожидает проверку'
      if (val === 2) return 'Проверяется'
      if (val === 3) return 'Зачтен'
      if (val === 4) return 'Отклонен'
      // if (val === 5) return 'Принят'
    },
    getBankName(row){
      if (this.bankSelect && this.bankSelect.find(e => e._id === row.bank)) return this.bankSelect.find(e => e._id === row.bank).text
      return ''
    },
    getProfile(row) {
      if (this.profiles && row.profile) return this.profiles.find(e => e._id === row.profile)
    },
    getMail(row){
      if (this.getProfile(row)) return this.getProfile(row).mail
    },
    getFIO(row){
      if (this.getProfile(row)) return this.getProfile(row).FIO
    },
    getLogin(row){
      if (this.getProfile(row)) return this.getProfile(row).login
    },
    getPassword(row){
      if (this.getProfile(row)) return this.getProfile(row).password
    },
    getIp(row){
      if (row.ip && this.ip.find(e => e._id === row.ip)) return this.ip.find(e => e._id === row.ip).ip
    },
    getUserAgent(row){
      if (row.ip && this.ip.find(e => e._id === row.ip)) return this.ip.find(e => e._id === row.ip).userAgent
    },
    getTown(row) {
      if (this.townSelect.find(e => e._id === row.town)) return this.townSelect.find(e => e._id === row.town).value
    },
    momentSTR(iso){
      return moment(iso, 'YYYY-MM-DD HH:mm').format('L');
    },
    async loadTable(){
      await this.$store.dispatch('table/load',this.user)
    },

    async loadProfiles(){
      await this.$store.dispatch('profile/load')
    },
    async loadIP(){
      await this.$store.dispatch('ip/loadAll')
    },
    setIntervalReload(){
      this.$store.dispatch('table/setInterval')
      this.$store.dispatch('profile/setInterval')
      this.$store.dispatch('ip/setInterval')
    }
  }
}
</script>

<style scoped>

</style>