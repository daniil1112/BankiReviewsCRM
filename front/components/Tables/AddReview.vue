<template>
  <div>
    <mdb-table bordered responsive>
      <mdb-table-head>
        <tr>
          <th>#</th>
          <th>Создана запись</th>
          <th>Банк</th>
          <th>Адрес</th>
          <th>Канал(ы) взаимодействия</th>
          <th>Доп данные</th>
          <th>Пол</th>
          <th>Рекоммендуемый возраст</th>
          <th>Город</th>
          <th>Дата события</th>
          <th>Оценка</th>
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
            <span v-if="!editing(row)">{{getBankName(row)}}</span>
            <mdb-select v-else v-model="getUpdateRow(row).bankSelect"/>
          </td>
          <td>
            <p v-if="row.office">Офис - {{getOffice(row)}}</p>
            <p v-if="row.dispenser">Банкомат - {{getDispenser(row)}}</p>
          </td>
          <td>
            <ul v-if="!editing(row)">
              <li v-for="channel in row.channels">{{channel}}</li>
            </ul>
            <mdb-select multiple v-else v-model="getUpdateRow(row).channelsSelect"/>
          </td>
          <td>
            <span v-if="!editing(row)">{{row.info}}</span>
            <mdb-input v-else v-model="getUpdateRow(row).info" /></td>
          <td>
            <div v-if="!editing(row)">
              <span v-if="row.gender === 'm'">Мужской</span>
              <span v-else>Женский</span>
            </div>
            <mdb-select v-else v-model="getUpdateRow(row).genderSelect"/>
          </td>
          <td>
            <span v-if="!editing(row)">{{row.recommendedAge}}</span>
            <mdb-input type="number" v-else v-model="getUpdateRow(row).recommendedAge" :min="20" :max="100"/>
          </td>
          <td>
            <span v-if="!editing(row)">{{getTown(row)}}</span>
            <mdb-select v-else v-model="getUpdateRow(row).townSelect"/>
          </td>
          <td>
            <span v-if="!editing(row)">{{row.dateEvent}}</span>
            <mdb-input v-else v-model="getUpdateRow(row).dateEvent"/>
          </td>
          <td>
            <span v-if="!editing(row)">{{row.mark}}</span>
            <mdb-select v-else v-model="getUpdateRow(row).markSelect"/>
          </td>
          <td>
            <span v-if="!editing(row)">{{row.title}}</span>
            <mdb-input type="textarea" v-else v-model="getUpdateRow(row).title"/>
          </td>
          <td>
            <span v-if="!editing(row)">{{row.text}}</span>
            <mdb-input type="textarea" v-else v-model="getUpdateRow(row).text"/>
          </td>

          <td>
            <mdb-btn color="primary" rounded @click="setUpdateRow(row)">Изменить</mdb-btn>
            <mdb-btn color="danger" rounded @click="deleteRow(row)">Удалить</mdb-btn>
            <mdb-btn color="success" rounded @click="setNextStep(row)">На следующей шаг</mdb-btn>

<!--            <div v-else-if="editing(row)">-->
<!--              <mdb-btn color="green"  @click="saveUpdate(row)">Сохранить</mdb-btn>-->
<!--              <mdb-btn color="red"  @click="cancelUpdate(row)">Отменить</mdb-btn>-->
<!--            </div>-->

          </td>
        </tr>
      </mdb-table-body>
    </mdb-table>
    <mdb-btn @click="showAddRowModal = true">Добавить запись</mdb-btn>
    <add-row :show="showAddRowModal" @close="showAddRowModal = false" @reload-table="$emit('reload-table')"/>
    <update-row v-if='showUpdateRowModal' :show="showUpdateRowModal" :row="updateRow" @close="showUpdateRowModal = false" @reload-table="$emit('reload-table')"/>
  </div>

</template>

<script>
import AddRow from "../../components/Modals/reviews/addRow";
import moment from 'moment'
import UpdateRow from "../Modals/reviews/updateRow";
import dateformat from 'dateformat'
export default {
  name: "AddReview",
  props: ['rows'],
  components:{UpdateRow, AddRow},

  data(){
    return {
      showAddRowModal: false,
      showUpdateRowModal: false,
      updateRow: false,
      updateRows:[]
    }
  },

  async mounted() {
    await this.$store.dispatch('select/loadAutoSelectBank')
  },

  computed:{

    filteredRows(){
      return this.rows.filter( e => !e.profile && e.step === 1)
    },
    bankSelect(){
      return this.$store.getters['select/newBankSelect']
    },
    townSelect(){
      return this.$store.getters['select/townSelectAll']
    },
    channelsSelect(){
      return this.$store.getters['select/channelsSelect']
    },
    dispenserSelect(){
      return this.$store.getters['select/dispenserSelectAll']
    },
    officeSelect(){
      return this.$store.getters['select/officeSelectAll']
    }
  },


  methods:{
    generateDate(iso){
      let date = new Date(iso)
      return  dateformat(date,'dd.mm.yyyy')
    },
    setUpdateRow(row){
      this.showUpdateRowModal = true;
      this.updateRow = row
    },
    momentSTR(iso){
      return moment(iso, 'YYYY-MM-DD HH:mm').format('L');
    },
    getProfile(row){
      return this.profiles.find(e => e._id === row.profile)
    },
    addUpdateRow(row){
      let bankSelect = [...this.bankSelect]
      bankSelect.forEach((e, i) => {
        if (e.value === row.bank) bankSelect[i].selected = true
      })
      let townSelect = [...this.townSelect]
      townSelect.forEach((e, i) => {
        if (e.value === row.town) townSelect[i].selected = true
      })
      const markSelect = [
        {text: 1, value: 1},
        {text: 2, value: 2},
        {text: 3, value: 3},
        {text: 4, value: 4},
        {text: 5, value: 5},
      ]

      markSelect.forEach((e, i) => {
        if (e.value === row.mark) markSelect[i].selected = true
      })
      const genderSelect = [
        {text: 'Мужчина', value: 'm'},
        {text: 'Женщина', value: 'f'},
      ]

      genderSelect.forEach((e, i) => {
        if (e.value === row.gender) genderSelect[i].selected = true
      })

      let channelsSelect = [...this.channelsSelect]
      channelsSelect.forEach((e, i) => {
        if (row.channels.some(n => e.value === n)) channelsSelect[i].selected = true
      })


      this.updateRows.push({
        bankSelect,
        townSelect,
        markSelect,
        genderSelect,
        channelsSelect,
        ...row
      })
    },
    editing(row){
      return this.updateRows.some(e => e._id === row._id)
    },
    getUpdateRow(row){
      return this.updateRows.find(e => e._id === row._id)
    },
    cancelUpdate(row){
      this.updateRows = this.updateRows.filter(e => e._id !== row._id)
    },
    prepareRowUpdate(row){
      let updateRow = this.getUpdateRow(row);

      if (updateRow.bankSelect.find(e => e.selected)) updateRow.bank = updateRow.bankSelect.find(e => e.selected).value

      delete updateRow.bankSelect

      if (updateRow.channelsSelect.some(e => e.selected)){
        let channelsSelect = updateRow.channelsSelect.filter(e => e.selected)
        updateRow.channels = []
        channelsSelect.forEach(e => updateRow.channels.push(e.value))
      }

      delete updateRow.channelsSelect


      if (updateRow.dateEvent.match('\\d{2}\\.\\d{2}\\.\\d{4}')) {
        let arr = updateRow.dateEvent.split('.');
        switch (arr[1]) {
          case '01':
            arr[1] = 'Января'
            break
          case '02':
            arr[1] = 'Февраля'
            break
          case '03':
            arr[1] = 'Марта'
            break
          case '04':
            arr[1] = 'Апреля'
            break
          case '05':
            arr[1] = 'Мая'
            break
          case '06':
            arr[1] = 'Июня'
            break
          case '07':
            arr[1] = 'Июля'
            break
          case '08':
            arr[1] = 'Августа'
            break
          case '09':
            arr[1] = 'Сентября'
            break
          case '10':
            arr[1] = 'Октября'
            break
          case '11':
            arr[1] = 'Ноября'
            break
          case '12':
            arr[1] = 'Декабря'
            break
        }

        updateRow.dateEvent = `${arr[0]} ${arr[1]} ${arr[2]}`
      }

      if (updateRow.genderSelect.some(e => e.selected)){
        updateRow.gender = updateRow.genderSelect.find(e => e.selected).value
      }
      delete updateRow.genderSelect

      if (updateRow.markSelect.some(e => e.selected)){
        updateRow.mark = updateRow.markSelect.find(e => e.selected).value
      }
      delete updateRow.markSelect

      if (updateRow.townSelect.some(e => e.selected)){
        updateRow.town = updateRow.townSelect.find(e => e.selected).value
      }
      delete updateRow.townSelect

      return updateRow
    },
    async saveUpdate(row){
      const updateRow = this.prepareRowUpdate(row)
      this.updateRows = this.updateRows.filter(e => e._id !== row._id)

      const result = await this.$axios.post('/table/updateReview', {user: 1, ...updateRow})

      if (result.data.result) this.$emit('reload-table')
    },

    async setNextStep(roww){
      const {row} = (await this.$axios.post('/table/setStep2', {user: this.$store.getters['auth/user'], _id: roww._id})).data
      if (row) this.$notify.success({
        title: 'Успех',
        message: 'Отзыв передан для создания профиля'
      })

      this.$emit('reload-table')
    },
    getBankName(row){
      if (this.bankSelect && this.bankSelect.find(e => e._id === row.bank)) return this.bankSelect.find(e => e._id === row.bank).text
      return ''
    },
    getDispenser(row) {
      if (this.dispenserSelect && row.dispenser){
        if (this.dispenserSelect.find(e => e._id === row.dispenser)) return this.dispenserSelect.find(e => e._id === row.dispenser).value
        return ''
      }
      return ''
    },
    getOffice(row) {
      if (this.officeSelect && row.office){
        if (this.officeSelect.find(e => e._id === row.office)) return this.officeSelect.find(e => e._id === row.office).value
        return ''
      }
      return ''
    },

    getTown(row) {
      if (this.townSelect && row.town){
        if (this.townSelect.find(e => e._id === row.town)) return this.townSelect.find(e => e._id === row.town).value
        return ''
      }
      return ''
    },

    async deleteRow(row) {
      const {success} = (await this.$axios.post('/table/deleteRow', {user: this.$store.getters['auth/user'], _id: row._id})).data
      if (success){
        this.$notify.success({
          title: 'Удалено'
        })
        this.$emit('reload-table')
      }
    }
  }
}
</script>

<style scoped>

</style>