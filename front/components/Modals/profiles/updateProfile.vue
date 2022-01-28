<template>
  <mdb-modal v-show="show" @close="$emit('closebtn')">
    <mdb-modal-header>
      Изменить профиль
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-input
          label="ФИО"
          v-model="FIO"
          @change="validateFIO"
          small="Формат ИМЯ ФАМИЛИЯ ОТЧЕСТВО"
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
        <mdb-input type="radio" id="option1-1-11-1" name="groupOfMaterialRadios2" radioValue="m" v-model="gender" label="Мужчина"/>
        <mdb-input type="radio" id="option1-2-11-1" name="groupOfMaterialRadios2" radioValue="f" v-model="gender" label="Женщина"/>
      </mdb-form-inline>
      <mdb-input label="Дата рождения" v-model="birthDate"/>
      <a href="#" @click="generateDate">Генерировать</a>
      <mdb-input type="number" label="Возраст" v-model="age" small="Возраст считается автоматически" disabled />
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="$emit('close')" >Закрыть</mdb-btn>
      <mdb-btn @click="update">Обновить</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
function randomInteger(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
import randomDateGenerator from 'random-date-generator'
import generatepassword from 'generate-password'
import dateformat from 'dateformat'
export default {
name: "updateProfile",

  props:['row','show'],

  data(){
    return{
      FIO: '',
      mail: '',
      birthDate: '',
      gender: 'm',
      password: '',
      login: '',
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
    user(){
      return this.$store.getters['auth/user']
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
      if (this.validation.password === 4) return 'Поле "пароль" должно содержать хотябы 1 цифру.'
    }
  },

  watch:{
    row(){
      this.setFIO()
      this.setMail()
      this.setBirthDate()
      this.setGender()
      this.setPassword()
      this.setLogin()
    }
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
    setLogin(){
      if (this.row.login) this.login = this.row.login
    },

    async update(){
      const {FIO,mail,birthDate,age, password, gender, user, row, login} = this
      const res = await this.$axios.post('/profile/update',{user, _id: row._id, FIO,mail,birthDate,age, password, gender, login})

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

    async generateFIO(){
      let pol = '2'
      if (this.gender === 'm') pol = 1
      let {result} = (await this.$axios.post('parse/parseFIO', {
        fam: 1,
        imya: 1,
        otch: 1,
        pol: pol,
        count: 1
      })).data

      result = result.split('<html>')[1]
      result = result.split('<head>')[1]
      result = result.split('</head>')[1]
      result = result.split('<body>')[1]
      result = result.split('</body>')[0]
      result = result.split('</html>')[0]
      result = result.split('<br>')

      result.forEach((e, i) => result[i] = result[i].trim())

      this.FIO = result[0]
    },
    async generateLogin(){
      let FIO = this.FIO
      let surname = FIO.split(' ')[0]
      let firstname = FIO.split(' ')[1] ? FIO.split(' ')[1] : ''
      let patronymic = FIO.split(' ')[1] ? FIO.split(' ')[2] : ''
      let birthday = this.birthDate
      let {result} = (await this.$axios.post('parse/parseLogin',{
        surname, firstname, patronymic, birthday
      })).data

      this.login = result
    },
    generatePassword(){
      this.password = generatepassword.generate({
        length: randomInteger(10, 16),
        numbers: true
      });
    },

    changeMail(){
      this.login = this.mail.split('@')[0]
      this.validateMail()
    },
    generateDate(){
      let startDate = new Date(1980, 1, 1);
      let endDate = new Date(1962, 1, 1);
      this.birthDate = dateformat(randomDateGenerator.getRandomDateInRange(startDate, endDate),'dd.mm.yyyy')
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
    validatePassword(){
      if (this.password.trim().length === 0) this.validation.password = 2
      else if (this.password.trim().length < 8 || this.password.trim().length > 16) this.validation.password = 3
      else if (this.password.trim().search(/\d+/) === -1) this.validation.password = 4
      else this.validation.password = 1
    },
    validateFIO(){
      if (this.FIO.trim().length === 0) return this.validation.FIO = 2
      if (!this.FIO.match('[А-Яа-я]{3,}\\ +[А-Яа-я]{3,}\\ +[А-Яа-я]{3,}')) return this.validation.FIO = 3
      return this.validation.FIO = 1
    },

  }


}
</script>

<style scoped>

</style>