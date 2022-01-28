<template>
  <mdb-modal v-show="show" @close="$emit('closeclick')">
    <mdb-modal-header>
      Добавить профиль
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-input
          label="ФИО"
          v-model="FIO"
          @change="validateFIO"
          small="Формат ФАМИЛИЯ ИМЯ ОТЧЕСТВО"
          :customValidation="validation.FIO > 0"
          :isValid="validation.FIO === 1"
          resetBtn
          :invalidFeedback="invalidFIOFeedback"
      />
      <a href="#" @click="generateFIO">Генерировать</a>
      <mdb-input
          label="Почта"
          v-model="mail"
          @change="changeMail"
          :customValidation="validation.mail > 0"
          :isValid="validation.mail === 1"
          resetBtn
          :invalidFeedback="invalidMailFeedback"
      />
      <a href="#" @click="checkMail">Проверить почту</a>
      <mdb-input
          label="Логин"
          v-model="login"
          @change="validateLogin"
          :customValidation="validation.login > 0"
          :isValid="validation.login === 1"
          :invalidFeedback="invalidLoginFeedback"
      />
      <a href="#" @click="generateLogin">Генерировать</a>
      <mdb-input
          label="Пароль"
          v-model="password"
          @change="validatePassword"
          :customValidation="validation.password > 0"
          :isValid="validation.password === 1"
          :invalidFeedback="invalidPasswordFeedback"
      />
      <a href="#" @click="generatePassword">Генерировать</a>
      <mdb-form-inline>
        <mdb-input type="radio" id="option1-1-1-1" name="groupOfMaterialRadios2" radioValue="m" v-model="gender" label="Мужчина"/>
        <mdb-input type="radio" id="option1-2-1-1" name="groupOfMaterialRadios2" radioValue="f" v-model="gender" label="Женщина"/>
      </mdb-form-inline>
      <mdb-input label="Дата рождения" v-model="birthDate"/>
      <a href="#" @click="generateDate">Генерировать</a>
      <mdb-input type="number" label="Возраст" v-model="age" small="Возраст считается автоматически" disabled />
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn color='danger' @click="$emit('close')" >Закрыть</mdb-btn>
      <mdb-btn color="primary" @click="fullGenerate">Полная генерация</mdb-btn>
      <mdb-btn @click="add" >Добавить</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
function randomPassword(len = 8, minUpper = 0, minLower = 0, minNumber = -1, minSpecial = -1) {
  let chars = String.fromCharCode(...Array(127).keys()).slice(33),//chars
      A2Z = String.fromCharCode(...Array(91).keys()).slice(65),//A-Z
      a2z = String.fromCharCode(...Array(123).keys()).slice(97),//a-z
      zero2nine = String.fromCharCode(...Array(58).keys()).slice(48),//0-9
      specials = chars.replace(/\w/g, '')
  if (minSpecial < 0) chars = zero2nine + A2Z + a2z
  if (minNumber < 0) chars = chars.replace(zero2nine, '')
  let minRequired = minSpecial + minUpper + minLower + minNumber
  let rs = [].concat(
      Array.from({length: minSpecial ? minSpecial : 0}, () => specials[Math.floor(Math.random() * specials.length)]),
      Array.from({length: minUpper ? minUpper : 0}, () => A2Z[Math.floor(Math.random() * A2Z.length)]),
      Array.from({length: minLower ? minLower : 0}, () => a2z[Math.floor(Math.random() * a2z.length)]),
      Array.from({length: minNumber ? minNumber : 0}, () => zero2nine[Math.floor(Math.random() * zero2nine.length)]),
      Array.from({length: Math.max(len, minRequired) - (minRequired ? minRequired : 0)}, () => chars[Math.floor(Math.random() * chars.length)]),
  )
  return rs.sort(() => Math.random() > Math.random()).join('')
}
function randomInteger(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
import randomDateGenerator from 'random-date-generator'

// import generatepassword from 'generate-password'
import dateformat from 'dateformat'
export default {
  name: "addProfile",
  props:['show'],
  data(){
    return{
      FIO: '',
      mail: '',
      login: '',
      birthDate: '',
      gender: 'm',
      password: '',
      validation:{
        FIO: 0,
        mail: 0,
        login: 0,
        password: 0
      }
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

    invalidFIOFeedback(){
      if (this.validation.FIO === 2) return 'Введите ФИО'
      if (this.validation.FIO === 3) return 'ФИО имеет неверный формат'
    },
    invalidMailFeedback(){
      if (this.validation.mail === 2) return 'Введите почту'
      if (this.validation.mail === 3) return 'Почта имеет неверный формат'
    },
    invalidLoginFeedback(){
      if (this.validation.login === 2) return 'Введите логин'
      if (this.validation.login === 3) return 'Поле "Логин" должно содержать от 3 до 16 символов.'
    },
    invalidPasswordFeedback(){
      if (this.validation.password === 2) return 'Введите пароль'
      if (this.validation.password === 3) return 'Поле "пароль" должно содержать от 8 до 16 символов.'
      if (this.validation.password === 4) return 'Поле "пароль" должно содержать хотя-бы 1 цифру.'
    }
  },

  methods:{
    async add(){
      const {FIO,mail,birthDate,age, password, gender, login} = this
      this.validateMail()
      this.validateFIO()
      this.validateLogin()
      this.validatePassword()


      if (this.validation.mail !== 1 || this.validation.FIO !== 1 || this.validation.login !== 1 || this.validation.password !== 1) return this.$notify.error({
        title: 'Ошибка',
        message: 'Проверьте введенные данные'
      })
      const res = await this.$axios.post('profile/add',{FIO,mail,birthDate,age, password, gender,login})

      if (res.data.profile){
        this.$notify.success({
          title: 'Добавлено'
        })
        this.resetForm()
        return this.$emit('reload-profiles')
      }

      this.$notify.error({
        title: 'Ошибка!'
      })
    },

    resetForm(){
      this.FIO = ''
      this.mail = ''
      this.birthDate = ''
      this.gender = 'm'
      this.password = ''
      this.login = ''
    },
    validateFIO(){
      if (this.FIO.trim().length === 0) return this.validation.FIO = 2
      if (!this.FIO.match('[А-Яа-яё]{1,}\\ +[А-Яа-яё]{1,}\\ +[А-Яа-яё]{1,}\\ *')) return this.validation.FIO = 3
      return this.validation.FIO = 1
    },
    changeMail(){
      this.login = this.mail.split('@')[0]
      this.validateMail()
    },
    validateMail(){
      const mail = this.mail.trim()
      if (mail.length === 0) return this.validation.mail = 2
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(this.mail)) return this.validation.mail = 3
      this.validation.mail = 1
    },
    validateLogin(){
      if (this.login.trim().length === 0) return this.validation.login = 2
      if (this.login.trim().length < 3 || this.login.trim().length > 16) return this.validation.login = 3
      return this.validation.login = 1
    },
    generateDate(){
      let startDate = new Date(1980, 1, 1);
      let endDate = new Date(1962, 1, 1);
      this.birthDate = dateformat(randomDateGenerator.getRandomDateInRange(startDate, endDate),'dd.mm.yyyy')
    },
    validatePassword(){
      if (this.password.trim().length === 0) this.validation.password = 2
      else if (this.password.trim().length < 8) this.validation.password = 3
      else if (this.password.trim().search(/\d+/) === -1) this.validation.password = 4
      else this.validation.password = 1
    },
    generatePassword(){
      this.password = randomPassword(randomInteger(13,20),3,3, 2, 0)
    },

    async generateFIO(){
      try {
        let gender = this.gender === 'm' ? 'man' : 'woman'
        let {result} = (await this.$axios.post('parse/parseFIO',{gender})).data
        if (!result.LastName) return this.$notify.error({
          title: 'Ошибка',
          message: 'Данные не загрузились!!!'
        })
        let {FirstName, LastName, FatherName} = result
        FirstName = FirstName.trim()
        LastName = LastName.trim()
        FatherName = FatherName.trim()


        this.FIO = `${LastName} ${FirstName} ${FatherName}`
      }catch (e) {
        this.$notify.error({
          title: 'Ошибка',
          message: 'Что-то пошло не так!!!'
        })
      }

    },

    async generateLogin(){
      let FIO = this.FIO
      let surname = FIO.split(' ')[0]
      let firstname = FIO.split(' ')[1] ? FIO.split(' ')[1] : ''
      let patronymic = FIO.split(' ')[1] ? FIO.split(' ')[2] : ''
      let birthday = this.birthDate
      if (!FIO || !surname || !firstname || !patronymic || !birthday) return this.$notify.error({
        title: 'Ошибка',
        message: 'Слишком мало полей для генерации'
      })
      let {result} = (await this.$axios.post('parse/parseLogin',{
        surname, firstname, patronymic, birthday
      })).data

      this.login = result
    },
    async fullGenerate(){
      let gender = this.gender === 'm' ? 'man' : 'woman'
      let {result} = (await this.$axios.post('parse/parseFIO',{gender})).data
      let {FirstName, LastName, FatherName, DateOfBirth, Login} = result
      FirstName = FirstName.trim()
      LastName = LastName.trim()
      FatherName = FatherName.trim()
      this.FIO = `${LastName} ${FirstName} ${FatherName}`
      this.birthDate = DateOfBirth
      this.login = Login
      this.generatePassword()

    },
    async checkMail(){
      let mail = this.mail
      let data = (await this.$axios.post('parse/checkMail', {
        mail
      })).data
      console.log(data)

      if (!data.checkStart) return this.$notify.error({
        title: 'Ошибка',
        message: 'Проверка не была запущена'
      })
      if (!data.checkEnd) return this.$notify.error({
        title: 'Ошибка',
        message: 'Проверка была запущена, но что-то пошло не так'
      })

      if (data.free) return this.$notify.success({
        title: 'Проверка заверешена',
        message: 'Почта свободна'
      })

      return this.$notify.error({
        title: 'Проверка заверешена',
        message: 'Почта занята'
      })
    },


},



}
</script>

<style scoped>

</style>