<template>
  <div v-if="row">
    <p><span>Банк - <a :href="getBankLink(row)">{{getBankName(row)}}</a></span></p>
    <label for="channelsShow">Каналы вз-я</label>
    <ul id="channelsShow">
      <li v-for="channel in row.channels">{{channel}}</li>
    </ul>
    <label for="address">Адреса</label>
    <ul id="address">
      <li v-if="row.office && office">
        <mdb-input :value="office.value" @click.native="doCopy(office.value)" label="Офис" disabled/>
      </li>
      <li v-if="row.dispenser && dispenser">
        <mdb-input :value="dispenser.value" @click.native="doCopy(dispenser.value)" label="Банкомат" disabled/>
      </li>
    </ul>
    <label for="servicesShow">Услуги</label>
    <ul id="servicesShow">
      <li v-for="service in row.service">{{service}}</li>
    </ul>
    <p>Оценка    {{row.mark}}</p>
    <mdb-input type="textarea" :value="row.title" disabled @click.native="doCopy(row.title)" label="Заголовок" />
    <mdb-input type="textarea" :value="row.text" disabled @click.native="doCopy(row.text)" label="Текст отзыва" />
    <div v-if="profile">
      <mdb-input :value="profile.FIO" disabled @click.native="doCopy(profile.FIO)" label="ФИО" />
      <span>Дата рождения {{refactorBirthDate(profile.birthDate)}}</span>
    </div>
    <mdb-input v-if="row.phone" :value="row.phone" disabled @click.native="doCopy(row.phone.replace('+7',''))" label="Телефон" />
    <span>Пол: {{parsedGender(row.gender)}}</span>
    <mdb-input v-if="row.dateEvent" :value="row.dateEvent" disabled @click.native="doCopy(row.dateEvent)" label="Дата события" />

  </div>
</template>

<script>
export default {
  name: "reviewInfo",
  props: ['row'],


  computed:{
    bankSelect(){
      return this.$store.getters['select/newBankSelect']
    },
    officeSelect(){
      return this.$store.getters['select/officeSelectAll']
    },
    dispenserSelect(){
      return this.$store.getters['select/dispenserSelectAll']
    },
    office(){
      if (!this.row.office) return
      return this.officeSelect.find(e => e._id === this.row.office)
    },
    dispenser(){
      if (!this.row.dispenser) return
      return this.dispenserSelect.find(e => e._id === this.row.dispenser)
    },
    profiles(){
      return this.$store.getters['profile/allProfiles']
    },
    profile(){
      if (!this.profiles || !this.row.profile || ! this.profiles.find(e => e._id !== this.row.profile)) return false
      return this.profiles.find(e => e._id === this.row.profile)
    },
  },


  methods:{
    getBankName(row){
      if (this.bankSelect && this.bankSelect.find(e => e._id === row.bank)) return this.bankSelect.find(e => e._id === row.bank).text
      return ''
    },
    getBankLink(row){
      if (this.bankSelect && this.bankSelect.find(e => e._id === row.bank)) return this.bankSelect.find(e => e._id === row.bank).link
      return ''
    },
    parsedGender(str){
      if (str === 'm') return 'Мужской'
      return 'Женский'
    },
    doCopy: function (string) {
      this.$copyText(string).then(function (e) {

      }, function (e) {
      })
    },
    refactorBirthDate(str){
      str = str.split('.');
      switch (str[1]){
        case '01':
          str[1] = 'Января'
          break
        case '02':
          str[1] = 'Февраля'
          break
        case '03':
          str[1] = 'Марта'
          break
        case '04':
          str[1] = 'Апреля'
          break
        case '05':
          str[1] = 'Мая'
          break
        case '06':
          str[1] = 'Июня'
          break
        case '07':
          str[1] = 'Июля'
          break
        case '08':
          str[1] = 'Августа'
          break
        case '09':
          str[1] = 'Сентября'
          break
        case '10':
          str[1] = 'Октября'
          break
        case '11':
          str[1] = 'Ноября'
          break
        case '12':
          str[1] = 'Декабря'
          break
      }
      return str.join(' ')
    }
  }
}
</script>

<style scoped>

</style>