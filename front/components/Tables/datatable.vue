<template>
  <b-table-simple no-border-collapse responsive stickyHeader class="table">
    <b-thead>
      <b-th class="sticky-header">#</b-th>
      <b-th class="sticky-header">Создана запись</b-th>
      <b-th class="sticky-header">Банк</b-th>
      <b-th class="sticky-header">email</b-th>
      <b-th class="sticky-header">Фио</b-th>
      <b-th class="sticky-header">Логин</b-th>
      <b-th class="sticky-header">Пароль</b-th>
      <b-th class="sticky-header">Ip</b-th>
      <b-th class="sticky-header">Телефон</b-th>
      <b-th class="sticky-header">UserAgent</b-th>
      <b-th class="sticky-header">Доп данные</b-th>
      <b-th class="sticky-header">Пол</b-th>
      <b-th class="sticky-header">Рекоммендуемый возраст</b-th>
      <b-th class="sticky-header">Город</b-th>
      <b-th class="sticky-header">Дата события</b-th>
      <b-th class="sticky-header">Оценка</b-th>
      <b-th class="sticky-header">Заголовок</b-th>
      <b-th class="sticky-header">Текст</b-th>
      <b-th class="sticky-header">Вопрос модератора</b-th>
      <b-th class="sticky-header">Ответ модератору</b-th>
      <b-th class="sticky-header">Cтатус</b-th>
    </b-thead>
    <b-tbody>
      <b-tr v-if="rows && rows.length > 0" v-for="row in rows">
        <b-td>{{row._id}}</b-td>
        <b-td>{{generateDate(row.dateSetText, 'YYYY-MM-DD HH:mm')}}</b-td>
        <b-td>{{row.bank}}</b-td>
        <b-td>
          <span v-if="row.profile && getProfile(row)">{{getProfile(row).mail}}</span>
        </b-td>
        <b-td>
          <span v-if="row.profile && getProfile(row)">{{getProfile(row).FIO}}</span>
        </b-td>
        <b-td>
          <span v-if="row.profile && getProfile(row)">{{getLogin(getProfile(row).mail)}}</span>
        </b-td>
        <b-td>
          <span v-if="row.profile && getProfile(row)">{{getLogin(getProfile(row).password)}}</span>
        </b-td>
        <b-td></b-td>
        <b-td></b-td>
        <b-td></b-td>
        <b-td>
          {{row.info}}
        </b-td>
        <b-td>
            <span v-if="row.gender === 'm'">Мужской</span>
            <span v-else>Женский</span>
        </b-td>
        <b-td>{{row.recommendedAge}}</b-td>
        <b-td>{{row.town}}</b-td>
        <b-td>{{row.dateEvent}}</b-td>
        <b-td>{{row.mark}}</b-td>
        <b-td>{{row.title}}</b-td>
        <b-td>{{row.text}}</b-td>
        <b-td></b-td>
        <b-td></b-td>
        <b-td>
          <div>
            <span v-if="!getProfile(row)">Ожидает заполнение профиля</span>
            <span v-else-if="getProfile(row)">Ожидает размещение</span>
          </div>
        </b-td>

      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>

<script>
import dateformat from 'dateformat'
import moment from 'moment'
export default {
  name: "datatable",
  props:['profiles','rows'],

  // computed:{
  //   filteredData
  // }

  methods:{
    generateDate(iso){
      let date = new Date(iso)
      return  dateformat(date,'dd.mm.yyyy')
    },
    momentSTR(iso){
      return moment(iso, 'YYYY-MM-DD HH:mm').format('L');
    },

    getProfile(row){
      return this.profiles.find(e => e._id === row.profile)
    },
    getLogin(str){
      if (typeof str === 'string'){
        return str.split('@')[0]
      }
    },
  }
}
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  /*To not have transparent background.
  background-color: white;*/
}

.table{
  max-height: 700px;
}
</style>