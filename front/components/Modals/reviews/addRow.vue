<template>
  <mdb-modal v-show="show">
    <mdb-modal-header>
      Добавление отзыва
    </mdb-modal-header>
    <mdb-modal-body >
      <mdb-select label="Банк"
                  ref="bankSelect"
                  v-model="bankSelectModel"
                  @change="changeBank"
                  :customValidation="validation.bank !== 0"
                  :isValid="validation.bank === 1"
                  search
                  :visibleOptions="6"
                  resetBtn
                  :invalidFeedback="invalidFeedbackBank"

      />
<!--      <mdb-select-->
<!--          ref="bankSelect"-->
<!--          label="Банк"-->
<!--          v-model="bankSelectModel"-->
<!--          @change="changeBank"-->

<!--      />-->
      <mdb-select v-if="bank"
                  ref="townSelect"
                  label="Город"
                  v-model="townSelectModel"
                  @change="changeTown"
                  :customValidation="validation.town !== 0"
                  :isValid="validation.town === 1"
                  resetBtn
                  :invalidFeedback="invalidFeedbackTown"

      />


      <mdb-select
          label="Услуга(и)"
          @change="validateService"
          v-model="serviceSelectModel"
          v-if="bank"
          ref="serviceSelect"
          search
          multiple
          :customValidation="validation.service !== 0"
          :isValid="validation.service === 1"
          resetBtn
          :invalidFeedback="invalidFeedbackService"

      />

      <mdb-select
          @change="channelsChange"
          multiple
          search
          ref="channelsSelect"
          v-if="bank && town"
          v-model="channelsSelectModel"
          label="Каналы взаимодействия"
          placeholder="Каналы взаимодействия"
          :customValidation="validation.channels !== 0"
          :isValid="validation.channels === 1"
          resetBtn
          :invalidFeedback="invalidFeedbackChannels"
      />

      <mdb-select label="Отделение" v-if="town && isOffice" v-model="officeSelectModel" />
      <mdb-select label="Банкомат" v-if="town && isDispenser" v-model="dispenserSelectModel" />
      <mdb-input
          type='textarea'
          label="Заголовок"
          @change="validateTitle"
          v-model="title"
          :customValidation="validation.title > 0"
          :isValid="validation.title === 1"
          resetBtn
          :invalidFeedback="invalidFeedbackTitle"

      />
      <mdb-input
          type='textarea'
          label="Текст"
          @change="validateText"
          v-model="text"
          :customValidation="validation.text > 0"
          :isValid="validation.text === 1"
          resetBtn
          :invalidFeedback="invalidFeedbackText"

      />

      <label for="markSelect">Оценка</label>
      <mdb-form-inline id="markSelect" class="was-validated">
        <mdb-input type="radio" id="option5-1" name="groupOfMaterialRadios2" :radioValue=1 v-model="mark" label="1"  required/>
        <mdb-input type="radio" id="option5-2" name="groupOfMaterialRadios2" :radioValue=2 v-model="mark" label="2"  required/>
        <mdb-input type="radio" id="option5-3" name="groupOfMaterialRadios2" :radioValue=3 v-model="mark" label="3"  required/>
        <mdb-input type="radio" id="option5-4" name="groupOfMaterialRadios2" :radioValue=4 v-model="mark" label="4"  required/>
        <mdb-input type="radio" id="option5-5" name="groupOfMaterialRadios2" :radioValue=5 v-model="mark" label="5"  required/>
      </mdb-form-inline>




      <mdb-input
          label="Дата события"
          v-model="dateEvent"
          @change="validateDateEvent"
          small="Формат ДД.ММ.ГГГГ"
          :customValidation="validation.dateEvent > 0"
          :isValid="validation.dateEvent === 1"
          resetBtn
          :invalidFeedback="invalidFeedbackDateEvent"
      />

      <mdb-input type='textarea' label="Дополнительная информация" v-model="info" styleComp="width: 100%;"/>


      <mdb-input v-model="recommendedAge"  type="number" :min="20" :max="100" label="Рекомендованный возраст"/>

      <mdb-form-inline>
        <mdb-input type="radio" id="option111-11" name="groupOfMaterialRadios2232" radioValue="m" v-model="gender" label="Мужчина"/>
        <mdb-input type="radio" id="option111-22" name="groupOfMaterialRadios2123" radioValue="f" v-model="gender" label="Женщина"/>
      </mdb-form-inline>
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn class="modal-default-button-left" @click="$emit('close')" color="danger">Отменить</mdb-btn>
      <mdb-btn class="modal-default-button" @click="save">Добавить</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>


</template>

<script>


export default {
  name: "addRow",
  props: ['show'],

  data(){
    return{
      title: '',
      dateEvent: '',
      text: '',
      mark: 0,
      recommendedAge: 0,
      info: '',
      gender: 'm',
      validation:{
        bank: 0,
        town: 0,
        title: 0,
        text: 0,
        service: 0,
        channels: 0,
        dateEvent: 0
      },
      bankSelectModel: [],
      townSelectModel: [],
      channelsSelectModel: [],
      serviceSelectModel: [],
      channels:[],
      officeSelectModel: [],
      dispenserSelectModel: [],
    }
  },

  watch:{
    bankSelect(){
      this.bankSelectModel = [...this.bankSelect]
    },
    townSelect(){
      this.townSelectModel = [...this.townSelect]
    },
    officeSelect(){
      this.officeSelectModel = [...this.officeSelect]
    },
    bankSelectModel(){
      this.townSelectModel.forEach((e,i) => {
        if (e.selected) this.townSelectModel[i].selected = false
      })
      this.channelsSelectModel.forEach((e,i) => {
        if (e.selected) this.channelsSelectModel[i].selected = false
      })
      this.serviceSelectModel.forEach((e,i) => {
        if (e.selected) this.channelsSelectModel[i].selected = false
      })
      if (this.townSelect) this.townSelectModel = [...this.townSelect]
      if (this.channelsSelect) this.channelsSelectModel = [...this.channelsSelect]
      if (this.serviceSelect) this.serviceSelectModel = [...this.serviceSelect]
    },
    channelsSelectModel(){
      let channels = this.channelsSelectModel.filter(e => e.selected)
      let values = []
      channels.forEach(e => values.push(e.value))
      if (values.length > 0) {
        this.channels = [...values]
      }
      if (this.officeSelect) this.officeSelectModel = [...this.officeSelect]
      if (this.dispenserSelect) this.dispenserSelectModel = [...this.dispenserSelect]
    }
  },



  computed:{
    invalidFeedbackDateEvent(){
      if (this.validation.dateEvent < 2 ) return ''
      if (this.validation.dateEvent === 2) return 'Дата имеет неверный формат'
    },
    invalidFeedbackBank() {
      if (this.validation.bank < 2 ) return ''
      if (this.validation.bank === 2) return 'Выберите банк'
    },
    invalidFeedbackService() {
      if (this.validation.service < 2 ) return ''
      if (this.validation.service === 2) return 'Выберите услугу(и)'
    },
    invalidFeedbackChannels() {
      if (this.validation.service < 2 ) return ''
      if (this.validation.service === 2) return 'Выберите канал(ы) взаимодействия'
    },

    invalidFeedbackTown(){
      if (this.validation.town < 2 ) return ''
      if (this.validation.town === 2) return 'Выберите город'
    },
    invalidFeedbackTitle(){
      if (this.validation.title === 2 ) return 'Введите заголовок'
      if (this.validation.title === 3 ) return 'Короткий заголовок'
      return ''
    },
    invalidFeedbackText(){
      if (this.validation.text === 2 ) return 'Введите текст'
      if (this.validation.text === 3 ) return 'Короткий текст'
      return ''
    },
    bankId(){
      if (this.bankSelectModel.some(e => e.selected)) return this.bankSelectModel.find(e => e.selected)._id
    },
    officeId(){
      if (this.officeSelectModel.some(e => e.selected)) return this.officeSelectModel.find(e => e.selected)._id
      return 0
    },
    dispenserId(){
      if (this.dispenserSelectModel.some(e => e.selected)) return this.dispenserSelectModel.find(e => e.selected)._id
      return 0
    },
    townId(){
      if (this.townSelectModel.some(e => e.selected)) return this.townSelectModel.find(e => e.selected)._id
    },
    townSelect(){
      return this.$store.getters['select/townSelectNew'](this.bankId)
    },
    officeSelect(){
      if (this.bankId && this.townId) return this.$store.getters['select/officeSelectNew'](this.bankId, this.townId)
      return []
    },
    dispenserSelect(){
      if (this.bankId && this.townId) return this.$store.getters['select/dispenserSelectNew'](this.bankId, this.townId)
      return []
    },
    serviceSelect(){
      return this.$store.getters['select/serviceSelect']
    },
    service(){
      let res = []
      this.serviceSelectModel.filter(e => e.selected).forEach(e =>res.push(e.value))
      return res
    },
    bankSelect(){
      return this.$store.getters['select/newBankSelect']
    },
    channelsSelect(){
      return this.$store.getters['select/channelsSelect']
    },
    town(){
      let town = this.townSelectModel.find(e => e.selected)
      if (town) return town.value
    },
    bank(){
      let bank = this.bankSelectModel.find(e => e.selected)
      if (bank) return bank.value
    },
    office(){
      if (this.isOffice){
        let office = this.officeSelectModel.find(e => e.selected)
        if (office) return office.value
      }
    },
    dispenser(){
      if (this.isDispenser){
        let dispenser = this.dispenserSelectModel.find(e => e.selected)
        if (dispenser) return dispenser.value
      }
    },

    isOffice(){
      return this.channelsSelectModel.some(e => e.value === 'Офис обслуживания / отделение' && e.selected)
    },
    isDispenser(){
      return this.channelsSelectModel.some(e => e.value === 'Банкомат' && e.selected )
    },
    date(){
      if (this.dateEvent.match('\\d{2}\\.\\d{2}\\.\\d{2,4}')) {
        let arr = this.dateEvent.split('.');
        switch (arr[1]){
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

        return `${arr[0]} ${arr[1]} ${arr[2]}`

      }
      return this.dateEvent
    }
  },

  mounted() {
    this.bankSelectModel = [...this.bankSelect]
    if (this.townSelect && this.townSelect.length > 0) this.townSelectModel = [...this.townSelect]
    this.channelsSelectModel = [...this.channelsSelect]
    this.serviceSelectModel = [...this.serviceSelect]
    this.officeSelectModel= []
    this.dispenserSelectModel = []
  },

  methods:{
    changeBank(){
      this.validateBank()
      this.townSelectModel = []
      if (this.townSelect && this.townSelect.length > 0) this.townSelectModel = [...this.townSelect]
    },
    changeTown(){
      this.validateTown()
    },
    channelsChange(){
      if (!this.isDispenser) this.dispenserSelectModel = []
      if (!this.isOffice) this.officeSelectModel = []
      this.validateChannels()
    },

    clearBank(){
      this.bankSelectModel = []
      this.bankSelectModel = [...this.bankSelect]
      this.bankSelectModel.forEach((e,i) => {
        if (this.bankSelectModel[i].selected) this.bankSelectModel[i].selected = false
      })
    },
    clearTownSelect(){
      if (this.townSelect ) this.townSelectModel = [...this.townSelect]
    },
    clearService(){
      this.serviceSelectModel = [
        ...this.serviceSelect
      ]
    },
    setDefault(){
      this.clearBank()
      this.clearTownSelect()
      this.clearService()
      this.title = ''
      this.text = ''
      this.mark = 5
      this.info = ''
      this.gender = ''
      this.recommendedAge = 0
    },
    async save(){
      let channels = this.channelsSelect.filter(e => e.selected)
      let values = []
      channels.forEach(e => values.push(e.value))
      this.validateTown()
      this.validateTitle()
      this.validateBank()
      this.validateText()
      this.validateService()
      this.validateChannels()
      this.validateDateEvent()
      if (this.validation.bank !== 1 || this.validation.service !== 1 || this.validation.text !== 1 || this.validation.title !== 1 || this.validation.town !== 1 || this.validation.channels !==1 || this.validation.dateEvent !==1 || !this.mark){
        return this.$notify.error({
          title: 'Ошибка при проверке',
          message: 'Проверьте введенные данные'
        })
      }



      const {bankId, title, text, mark, info, gender, townId, recommendedAge, date, service,officeId, dispenserId} = this
      const {result} = (await this.$axios.post('/table/setTitleTextAndBank', {
        user: this.auth, bank: bankId, title, text, mark, info, gender, town: townId, recommendedAge, office: officeId, channels:values, dispenser: dispenserId,service,
        dateEvent:date
      })).data


      if (result) {
        this.$notify.success({
          title:'Удача',
          message: 'Отзыв добавлен'
        })
        this.$emit('reload-table')
        this.setDefault()
        this.$emit('close')
      }
    },


    validateBank(){
      if (this.bankId) this.validation.bank = 1
      else this.validation.bank = 2
      this.$refs.bankSelect.validate()
    },

    validateTown(){
      if (this.townId) this.validation.town = 1
      else this.validation.town = 2

      if (this.$refs.townSelect) {
        this.$refs.townSelect.validate()
      }

    },
    validateTitle(){
      if (!this.title) this.validation.title = 2
      else if (this.title.length < 5) this.validation.title = 3
      else this.validation.title = 1
    },
    validateText(){
      if (!this.text) this.validation.text = 2
      else if (this.text.length < 20) this.validation.text = 3
      else this.validation.text = 1
    },
    validateService(){
      if (!this.serviceSelectModel.some(e => e.selected)) this.validation.service = 2
      else this.validation.service = 1
      if (this.$refs.serviceSelect) {
        setTimeout(this.$refs.serviceSelect.validate,1)
      }
    },
    validateChannels(){
      if (!this.channelsSelectModel.some(e => e.selected)) this.validation.channels = 2
      else this.validation.channels = 1
      if (this.$refs.channelsSelect) setTimeout(this.$refs.channelsSelect.validate, 1)
    },
    validateDateEvent(){
      let dateEvent = this.dateEvent.trim()
      if (dateEvent.length === 0 || dateEvent.match('\\d{2}\\.\\d{2}\\.\\d{4}')) return this.validation.dateEvent = 1;
      return this.validation.dateEvent = 2;
    }
  }
}
</script>

<style scoped>

</style>