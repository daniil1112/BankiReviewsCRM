<template>
  <mdb-modal v-if="row" v-show="show" @close="$emit('closeclick')">
    <mdb-modal-header>
      Изменить профиль
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-input label="ФИО" v-model="FIO"/>
      <mdb-input label="Почта" v-model="mail"/>
      <mdb-input label="Пароль" v-model="password"/>
      <mdb-form-inline disabled>
        <mdb-input type="radio" id="option1-1-1-1" name="groupOfMaterialRadios2" radioValue="m" v-model="row.gender" label="Мужчина" disabled/>
        <mdb-input type="radio" id="option1-2-1-1" name="groupOfMaterialRadios2" radioValue="f" v-model="row.gender" label="Женщина" disabled/>
      </mdb-form-inline>
      <mdb-input label="Дата рождения" v-model="row.birthDate" disabled/>
      <mdb-input type="number" label="Возраст" v-model="age" small="Возраст считается автоматически" disabled />
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="$emit('close')" >Закрыть</mdb-btn>
      <mdb-btn @click="update" :disabled=" mail === row.mail">Заменить</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
export default {
  name: "updateBreakageProfile",

  props:['row','show'],

  data(){
    return{
      FIO: '',
      mail: '',
      password: ''
    }
  },

  computed:{
    age() {
      let d = this.birthDate.split('.');
      if (d.length === 3) {
        return ((new Date().getTime() - new Date(d[2], d[1], d[0])) / (24 * 3600 * 365.25 * 1000)) | 0;
      }
      return 0;
    },
    user(){
      return this.$store.getters['auth/user']
    },
  },

  watch:{
    row(){
      this.setFIO()
      this.setMail()
      this.setBirthDate()
      this.setGender()
      this.setPassword()
    }
  },



  mounted() {

  },

  methods:{
    setFIO(){
      if (this.row.FIO) this.FIO = this.row.FIO
    },
    setMail(){
      if (this.row.mail) this.mail = this.row.mail
    },
    setBirthDate(){
      if (this.row.birthDate) this.birthDate = this.row.birthDate
    },
    setGender(){
      if (this.row.gender) this.gender = this.row.gender
    },
    setPassword(){
      if (this.row.password) this.password = this.row.password
    },

    async update(){
      const {FIO,mail,birthDate,age, password, gender, user, row} = this
      const res = await this.$axios.post('/profile/updateBreakage',{user, _id: row._id, FIO,mail,birthDate,age, password, gender})

      if (res.data.success){
        this.$notify.success({
          title: 'Изменено'
        })
        this.$emit('close')
        return this.$emit('reload-profiles')
      }

      this.$notify.error({
        title: 'Ошибка!'
      })
    },

  }


}
</script>

<style scoped>

</style>