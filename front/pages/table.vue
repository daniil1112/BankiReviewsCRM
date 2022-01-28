<template>
  <div>

    <p v-show="false">{{user}}</p>
    <mdb-input type="checkbox" id="checkbox1" name="check1" v-model="onlyToday" label="Только записи за сегодня" @change="toggleOnlyToday"/>

    <assign-profile :show="ShowAssignModal" @close="ShowAssignModal = false" :profiles="selectProfiles" :rows="assignRow"/>

    <add-review v-show="user===1" :rows="rows" @reload-table="loadTable"/>
    <assign-profile-table v-show="user===2" :rows="rows" @reload-table="loadTable" @reload-profiles="loadProfiles"/>
    <add-technical v-show="user===3" :rows="rows" @reload-table="loadTable" />
    <modarate-table v-show="user===4" :rows="rows" @reload-table="loadTable" />
  </div>
</template>


<script>
import moment from 'moment'
import AddRow from "../components/Modals/reviews/addRow";
import AssignProfile from "../components/Modals/profiles/assignProfile";
import Datatable from "../components/Tables/datatable";
import AddReview from "../components/Tables/AddReview";
import AssignProfileTable from "../components/Tables/AssignProgileTable";
import AddTechnical from "../components/Tables/addTechnical";
import ModarateTable from "../components/Tables/modarateTable";

export default {
  name: 'Table',
  components: {ModarateTable, AddTechnical, AssignProfileTable, AddReview, Datatable, AssignProfile, AddRow},
  data(){
    return {
      showAddRowModal: false,
      showUpdateReviewModal: false,
      selectedRow: false,
      onlyToday: false,
      rowsUpdateActive: [],
      changes:{},
      ShowAssignModal: false,
      assignRow: null,
    }
  },



  computed:{
    rows(){
      return this.$store.getters['table/allTable']
    },
    filteredData(){
      let res = this.rows
      if (this.onlyToday){
        res = res.filter(e => this.momentSTR(e.dateSetText) === this.today)
      }
      return res
    },
    today(){
      return this.momentSTR(new Date())
    },
    selectProfiles(){
      let selectProfiles = []
      this.profiles.forEach(e => {
        let gender = e.gender === 'm' ? 'Мужчина' : 'Женщина'
        if (!e.assigned) selectProfiles.push({value: e._id, text: `${e.FIO} (${e.age} лет ${gender})`})
      })
      return selectProfiles
    },
    user(){
      if (this.$store.getters['auth/user']) return parseInt(this.$store.getters['auth/user'])
    },
    profiles(){
      return this.$store.getters['profile/allProfiles']
    }
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


  async mounted(){
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
    updateRows(data){
      console.log(data)
    },
    momentSTR(iso){
      return moment(iso, 'YYYY-MM-DD HH:mm').format('L');
    },
    editReviewText(row){
      // this.selectedRow = row;
      // this.showUpdateReviewModal = true
      this.rowsUpdateActive.push(row._id);

      let townSelect = [
        {text:'Москва' , value: 'Москва'},
        {text:'Санкт-Петербург' , value: 'Санкт-Петербург'},
        {text:'Ростов-на-Дону' , value: 'Ростов-на-Дону'}
      ]
      let bankSelect = [
          {text:'ТКБ' , value: 'ТКБ'},
          {text:'Возрождение' , value: 'Возрождение'},
          {text:'Дом.рф' , value: 'Дом.рф'}
      ]
      let markSelect = [
        {text:'1' , value: 1},
        {text:'2' , value: 2},
        {text:'3' , value: 3},
        {text:'4' , value: 4},
        {text:'5' , value: 5},
      ]
      let dateEvent = row.dateEvent
      if (dateEvent) {
        dateEvent = dateEvent.replace(' Января ','.01.')
        dateEvent = dateEvent.replace(' Февраля ','.02.')
        dateEvent = dateEvent.replace(' Марта ','.03.')
        dateEvent = dateEvent.replace(' Апреля ','.04.')
        dateEvent = dateEvent.replace(' Мая ','.05.')
        dateEvent = dateEvent.replace(' Июня ','.06.')
        dateEvent = dateEvent.replace(' Июля ','.07.')
        dateEvent = dateEvent.replace(' Августа ','.08.')
        dateEvent = dateEvent.replace(' Сентября ','.09.')
        dateEvent = dateEvent.replace(' Октября ','.10.')
        dateEvent = dateEvent.replace(' Ноября ','.11.')
        dateEvent = dateEvent.replace(' Декабря ','.12.')
      }

      bankSelect.forEach((e,i) => {
        if (e.value === row.bank) bankSelect[i].selected=true
      })
      townSelect.forEach((e,i) => {
        if (e.value === row.town) townSelect[i].selected=true
      })
      markSelect.forEach((e,i) => {
        if (e.value === row.mark) markSelect[i].selected=true
      })

      console.log(bankSelect)
      this.changes[row._id] = {
        ...row,
        bankSelect,
        townSelect,
        markSelect
      }
      this.changes[row._id].dateEvent = dateEvent
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
    toggleOnlyToday(){
      // this.onlyToday = !this.onlyToday;
      localStorage.onlyToday = `${this.onlyToday}`
    },
    changing(row){
      return this.rowsUpdateActive.some( e => e === row._id)
    },
    assignProfile(row){
      this.ShowAssignModal = true
      this.assignRow = row

    },
    getProfile(row){
      return this.profiles.find(e => e._id === row.profile)
    },
    getLogin(str){
      if (typeof str === 'string'){
        return str.split('@')[0]
      }
    },
    setIntervalReload(){
      this.$store.dispatch('table/setInterval')
      this.$store.dispatch('profile/setInterval')
      this.$store.dispatch('ip/setInterval')
    }
  }

}
</script>