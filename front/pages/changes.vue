<template>
  <mdb-card>
    <mdb-card-title>
      <mdb-form-inline>
        <mdb-input type="checkbox" v-model="hideSome" id="hidesomeid" label="Только зачтения/незачтения" />
        <mdb-input type="checkbox" v-model="hideBanAndAccept" id="hidesomeidsdfsd" label="Остальные статусы" />
      </mdb-form-inline>
    </mdb-card-title>
    <mdb-card-body>
      <b-table-simple>
        <b-thead>
          <b-tr>
            <b-th>#</b-th>
            <b-th>Дата</b-th>
            <b-th>Банк</b-th>
            <b-th>Отзыв</b-th>
            <b-th>Изменение </b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr v-for="item in filteredChanges">
            <b-td>{{item.review}}</b-td>
            <b-td>{{parseDate(item.date)}}</b-td>
            <b-td>{{getBankName(getRow(item))}}</b-td>
            <b-td><a v-if="getRow(item) && getRow(item).reviewLink" :href="getRow(item).reviewLink">Отзыв</a></b-td>
            <b-td><span>{{getChangeText(item.from)}}</span>  -> <span>{{getChangeText(item.to)}}</span></b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </mdb-card-body>
  </mdb-card>

</template>

<script>
import moment from 'moment'
export default {
name: "changessda",


  data(){
    return {
      hideSome: false,
      hideBanAndAccept: false
    }
  },




  watch:{
    async user(){
      if (this.user){
        await this.loadTable()
        await this.loadProfiles()
        this.setIntervalReload()
      }
    },
    hideSome(val){
      localStorage.hideSomeChanges = val
    },
    hideBanAndAccept(val){
      localStorage.hideBanAndAccept = val
    }
  },

  async mounted() {
    setTimeout(() => {
      if (localStorage.hideSomeChanges && localStorage.hideSomeChanges === 'true') this.hideSome = true
      if (localStorage.hideBanAndAccept && localStorage.hideBanAndAccept === 'true') this.hideBanAndAccept = true
    },100)
    this.loadChanges()
    if (this.user){
      this.loadTable()
      this.loadProfiles()
      this.loadIP()
      this.setIntervalReload()
    }
  },

  computed:{
    bankSelect(){
      return this.$store.getters['select/newBankSelect']
    },
    rows(){
      return this.$store.getters['table/allTable']
    },
    user(){
      return this.$store.getters['auth/user']
    },
    changes(){
      return this.$store.getters['changes/changes']
    },
    filteredChanges(){
      let res = this.changes
      if (this.hideSome) res = res.filter(e => e.to === 3 || e.to === 4 || e.from === 3 || e.from === 4)
      if (this.hideBanAndAccept) res = res.filter(e => e.to === 1 || e.to === 2  || e.from === 1 || e.from === 2 )
      return res
    }
  },
  
  methods:{
    async loadIP(){
      await this.$store.dispatch('ip/loadAll')
    },
    getChangeText(val){
      if (val === 1) return 'Ожидает проверку'
      if (val === 2) return 'Проверяется'
      if (val === 3) return 'Зачтен'
      if (val === 4) return 'Отклонен'
      // if (val === 5) return 'Принят'
    },
    parseDate(date){
      let dateRow = moment(date)
      moment.locale('ru')

      return dateRow.format('LLL');
    },
    getBankName(row){
      if (!row) return
      if (this.bankSelect && this.bankSelect.find(e => e._id === row.bank)) return this.bankSelect.find(e => e._id === row.bank).text
      return ''
    },
    getRow(change){
      return this.rows.find(e => e._id === change.review)
    },
    setIntervalReload(){
      this.$store.dispatch('table/setInterval')
      this.$store.dispatch('profile/setInterval')
      this.$store.dispatch('ip/setInterval')
    },
    async loadChanges(){
      await this.$store.dispatch('changes/loadChanges')
    },
    async loadTable(){
      await this.$store.dispatch('table/load',this.user)
    },

    async loadProfiles(){
      await this.$store.dispatch('profile/load')
    },
  }
}
</script>

<style scoped>

</style>