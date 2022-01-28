<template>
  <div>
    <mdb-card-title>
      <mdb-btn @click="showCheckBanned = true">Проверка на бан</mdb-btn>
      <mdb-form-inline>
        <mdb-input type="checkbox" v-model = "StatusOne" id="hideStatusOne" label="Ожидает проверку"></mdb-input>
        <mdb-input type="checkbox" v-model = "StatusTwo" id="hideStatusTwo" label="Проверяется" ></mdb-input>
        <mdb-input type="checkbox" v-model = "StatusThree" id="hideStatusThree" label="Зачтен"></mdb-input>
        <mdb-input type="checkbox" v-model = "StatusFour" id="hideStatusFour" label="Отклонен" />
<!--        <mdb-input type="checkbox" v-model = "StatusFive" id="hideStatusFIve" label="Принят" />-->
      </mdb-form-inline>
      <p><mdb-input type="textarea" v-model="searchModel" label="Поиск"/></p>
    </mdb-card-title>
    <mdb-card-body>
      <mdb-table responsive>
        <mdb-table-head>
          <th>#</th>
          <th>Дата</th>
          <th>Дата добавления</th>
          <th>Банк</th>
          <th>Отзыв</th>
          <th>Профиль</th>
          <th>Заголовок</th>
          <th>Текст</th>
          <th>Вопрос модератора</th>
          <th>Ответ</th>
          <th>Стутус</th>
          <th>Действия</th>
        </mdb-table-head>
        <mdb-table-body>
          <tr v-for="row in filteredRows">
            <td>{{row._id}}</td>
            <td>{{generateDate(row.dateSetText)}}</td>
            <td>
              <span v-if="row.reviewAddDate">{{generateFullDate(row.reviewAddDate)}}</span>
              <span v-else>Еще не добавлен</span>
            </td>
            <td><a :href="getBankLink(row)" target="_blank">{{getBankName(row)}}</a> </td>
            <td><a :href="row.reviewLink" target="_blank">{{row.reviewLink}}</a></td>
            <td><a href="#" @click="showProfile(row)">Профиль</a></td>
            <td>
              <span  v-if="!fullText[row._id]">
                <span v-if="!mobile()" @dblclick="$set(fullText, row._id, true)">Открыть</span>
                  <mdb-btn v-else @click="$set(fullText, row._id, true)">Открыть</mdb-btn>
              </span>
              <span v-else>{{row.title}}</span>
            </td>
            <td>
              <span  v-if="!fullText[row._id]">
                <span v-if="!mobile()" @dblclick="$set(fullText, row._id, true)">Открыть</span>
                  <mdb-btn v-else @click="$set(fullText, row._id, true)">Открыть</mdb-btn>
              </span>
              <span v-else>{{row.text}}</span>
            </td>
            <td>
              <span v-if="!rowUpdate(row) && row.moderateAsk" @dblclick="pushUpdateRow(row)"> {{row.moderateAsk}}</span>
              <span v-else-if="!rowUpdate(row)" @dblclick="pushUpdateRow(row)">Добавить</span>
              <mdb-input type='textarea' v-else v-model="updateRows[getUpdateRowId(row)].moderateAsk"/>
            </td>
            <td>
              <span v-if="!rowUpdate(row) && row.moderateAnswer" @dblclick="pushUpdateRow(row)"> {{row.moderateAnswer}}</span>
              <span v-else-if="!rowUpdate(row)" @dblclick="pushUpdateRow(row)">Добавить</span>
              <mdb-input type='textarea' v-else v-model="updateRows[getUpdateRowId(row)].moderateAnswer"/>
            </td>
            <td>
              <span v-if="!rowUpdate(row)" @dblclick="pushUpdateRow(row)">{{getModerateStatus(row)}}</span>
              <mdb-select v-if="rowUpdate(row)" v-model="updateRows[getUpdateRowId(row)].moderateStatusSelect"/>
            </td>
            <td>
              <mdb-btn v-if="rowUpdate(row)" @click="cancelUpdate(row)">Отменить редактирование</mdb-btn>
              <mdb-btn color='success' v-if="rowUpdate(row)" @click="save(row)">Сохранить</mdb-btn>
            </td>

          </tr>
        </mdb-table-body>
      </mdb-table>
      <show-profile :show="showProfileModal" :row="selectedRow" @close="showProfileModal = false" />
      <check-ban-modal :show="showCheckBanned" @close="showCheckBanned = false"/>
      <client-only>
        <mdb-btn >{{mobile()}}</mdb-btn>
      </client-only>

    </mdb-card-body>
  </div>
</template>

<script>
import moment from 'moment'
import isMobile from 'ismobilejs'
import ShowProfile from "../Modals/profiles/showProfile";
import CheckBanModal from "../Modals/service/other/checkBanModal";
import dateformat from 'dateformat'
export default {
name: "modarateTable",
  components: {CheckBanModal, ShowProfile},
  props:['rows'],

  data(){
    return {
      showProfileModal: false,
      selectedRow: false,
      showCheckBanned: false,
      updateRows: [],
      StatusOne: true,
      StatusTwo: true,
      StatusThree: true,
      StatusFour: true,
      // StatusFive: true,
      searchModel: '',
      fullText:{}
    }
  },

  watch:{
    StatusOne(val){
      localStorage.StatusOne = val
    },
    StatusTwo(val){
      localStorage.StatusTwo = val
    },
    StatusThree(val){
      localStorage.StatusThree = val
    },
    StatusFour(val){
      localStorage.StatusFour = val
    },
    // StatusFive(val){
    //   localStorage.StatusFive = val
    // },
  },

  mounted() {
    setTimeout(()=> {
      if (localStorage.StatusOne && localStorage.StatusOne === "false") this.StatusOne = false
      if (localStorage.StatusTwo && localStorage.StatusTwo === "false") this.StatusTwo = false
      if (localStorage.StatusThree && localStorage.StatusThree === "false") this.StatusThree = false
      if (localStorage.StatusFour && localStorage.StatusFour === "false") this.StatusFour = false
      // if (localStorage.StatusFive && localStorage.StatusFive === "false") this.StatusFive = false
    },100)
  },

  computed:{
    filteredRows(){
      let res = this.rows
      res = res.filter(e => e.step === 4)
      if (!this.StatusOne) res = res.filter(e => e.moderateStatus !== 1)
      if (!this.StatusTwo) res = res.filter(e => e.moderateStatus !== 2)
      if (!this.StatusThree) res = res.filter(e => e.moderateStatus !== 3)
      if (!this.StatusFour) res = res.filter(e => e.moderateStatus !== 4)
      if (!this.StatusFive) res = res.filter(e => e.moderateStatus !== 5)

      if (this.searchModel) res = res.filter(e => e.text.toLowerCase().includes(this.searchModel) || e.title.toLowerCase().includes(this.searchModel) || e.reviewLink.toLowerCase().includes(this.searchModel) || this.searchModel.toLowerCase().includes(e.reviewLink))

      return res.reverse()
    },
    profiles(){
      return this.$store.getters['profile/allProfiles']
    },
    bankSelect(){
      return this.$store.getters['select/newBankSelect']
    },
    user(){
      return this.$store.getters['auth/user']
    },
  },

  methods:{
  mobile(){
    return isMobile(this.navigator).phone
  },
    generateFullDate(iso){
      let date = new Date(iso)
      return  dateformat(date,'dd.mm.yyyy HH:MM:ss')
    },
    getBankName(row){
      if (this.bankSelect && this.bankSelect.find(e => e._id === row.bank)) return this.bankSelect.find(e => e._id === row.bank).text
      return ''
    },
    getBankLink(row){
      if (this.bankSelect && this.bankSelect.find(e => e._id === row.bank)) return this.bankSelect.find(e => e._id === row.bank).link
      return ''
    },
    showProfile(row){
      this.selectedRow = row
      this.showProfileModal = true
    },
    getUpdateRowId(row){
      if (this.updateRows.findIndex(e => e._id === row._id) !== -1) return this.updateRows.findIndex(e => e._id === row._id)
    },
    rowUpdate(row){
      if (this.updateRows.findIndex(e => e._id === row._id) !== -1) return true
    },
    pushUpdateRow(row){
      console.log('dfdsfsdf')
      let moderateStatusSelect = [
        {text: 'Ожидает проверку', value: 1},
        {text: 'Проверяется', value: 2},
        {text: 'Зачтен', value: 3},
        {text: 'Отклонен', value: 4},
        // {text: 'Принят', value: 5},
      ]
      moderateStatusSelect.forEach((e, i)=> {
        if (e.value === row.moderateStatus) moderateStatusSelect[i].selected = true
      })
      this.updateRows.push({
        _id: row._id,
        moderateStatusSelect: moderateStatusSelect,
        moderateAsk: row.moderateAsk,
        moderateAnswer: row.moderateAnswer
      })
    },
    getModerateStatus(row){
      if (row.moderateStatus === 1) return 'Ожидает проверку'
      if (row.moderateStatus === 2) return 'Проверяется'
      if (row.moderateStatus === 3) return 'Зачтен'
      if (row.moderateStatus === 4) return 'Отклонен'
      // if (row.moderateStatus === 5) return 'Принят'
    },
    cancelUpdate(row){
      this.updateRows = this.updateRows.filter(e => e._id !== row._id)
    },
    generateDate(iso){
      let date = new Date(iso)
      return  dateformat(date,'dd.mm.yyyy')
    },
    momentSTR(iso){
      return moment(iso, 'YYYY-MM-DD HH:mm').format('L');
    },
    async save(row){
      const updateRow = this.updateRows[this.getUpdateRowId(row)]
      const moderateStatus = updateRow.moderateStatusSelect.find(e => e.selected).value

      const {success} = (await this.$axios.post('/table/updateModerate', {
        user: this.user,
        _id: updateRow._id,
        moderateStatus,
        moderateAnswer: updateRow.moderateAnswer,
        moderateAsk: updateRow.moderateAsk
      })) . data

      if (success){
        this.$notify.success({title: 'Изменено'})
        this.cancelUpdate(row)
        this.$emit('reload-table')
      } else {
        this.$notify.error({title: 'Что-то пошло не так!!!'})
      }

    }
  }
}
</script>

<style scoped>

</style>