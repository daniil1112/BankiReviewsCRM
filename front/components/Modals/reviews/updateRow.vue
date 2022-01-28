<template>
  <mdb-modal v-if="row && show">
    <mdb-modal-header>
      Обновление отзыва
    </mdb-modal-header>
    <mdb-modal-body>
      <form class="was-validated">
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

        <mdb-select label="Отделение" v-if="town && isOffice" v-model="officeSelectModel" resetBtn/>
        <mdb-select label="Банкомат" v-if="town && isDispenser" v-model="dispenserSelectModel" resetBtn/>
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

        <label for="markSelectt">Оценка</label>
        <mdb-form-inline id="markSelectt" class="was-validated">
          <mdb-input type="radio" id="option5-111" name="groupOfMaterialRadios2" :radioValue=1 v-model="mark"  label="1"  required/>
          <mdb-input type="radio" id="option5-2222" name="groupOfMaterialRadios2" :radioValue=2 v-model="mark" label="2"  required/>
          <mdb-input type="radio" id="option5-333" name="groupOfMaterialRadios2" :radioValue=3 v-model="mark" label="3"  required/>
          <mdb-input type="radio" id="option5-444" name="groupOfMaterialRadios2" :radioValue=4 v-model="mark" label="4"  required/>
          <mdb-input type="radio" id="option5-555" name="groupOfMaterialRadios2" :radioValue=5 v-model="mark" label="5"  required/>
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
          <mdb-input type="radio" id="option111-1111211" name="groupOfMaterialRadios2232" radioValue="m" v-model="gender" label="Мужчина"/>
          <mdb-input type="radio" id="option111-221213111" name="groupOfMaterialRadios2123" radioValue="f" v-model="gender" label="Женщина"/>
        </mdb-form-inline>
      </form>

    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn class="modal-default-button-left" @click="$emit('close')">Отменить</mdb-btn>
      <mdb-btn class="modal-default-button" @click="update">Обновить</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
export default {
  name: "updateRow",
  props: ['row', 'show'],


  data(){
    return {
      mounting : true,
      bankSelectModel: [],
      townSelectModel: [],
      serviceSelectModel: [],
      channelsSelectModel: [],
      officeSelectModel: [],
      dispenserSelectModel: [],
      title: '',
      text: '',
      mark: 0,
      dateEvent: '',
      recommendedAge: 20,
      gender: '',
      info: '',
      validation:{
        bank: 0,
        town: 0,
        title: 0,
        text: 0,
        service: 0,
        channels: 0,
        dateEvent: 0
      },
    }
  },

  mounted() {
    if (this.bankSelect) {
      this.bankSelectModel = [...this.bankSelect]
      this.bankSelectModel.forEach((e,i) => {
        if (e.selected) this.bankSelectModel[i].selected = false
        if (e._id === this.row.bank) this.bankSelectModel[i].selected = true
      })
    }
    if (this.townSelect){
      this.townSelectModel = [...this.townSelect]
      this.townSelectModel.forEach((e,i) => {
        if (e.selected) this.townSelectModel[i].selected = false
        if (e._id === this.row.town) {
          this.townSelectModel[i].index = i
          this.townSelectModel[i].selected = true
        }
      })

    }
    if (this.serviceSelect){
      this.serviceSelectModel = [...this.serviceSelect]
      this.serviceSelectModel.forEach((e,i) => {
        if (e.selected) this.serviceSelectModel[i].selected = false
        if (this.row.service.some( z => z === e.value)) this.serviceSelectModel[i].selected = true
      })
    }
    if (this.channelsSelect){
      this.channelsSelectModel = [...this.channelsSelect]
      this.channelsSelectModel.forEach((e,i) => {
        if (e.selected) this.channelsSelectModel[i].selected = false
        if (this.row.channels.some( z => z === e.value)) this.channelsSelectModel[i].selected = true
      })
    }
    if (this.officeSelect){
      this.officeSelectModel = [...this.officeSelect]
      this.officeSelectModel.forEach((e,i) => {
        if (e.selected) this.officeSelectModel[i].selected = false
        if (this.row.office && this.row.office === e._id) this.officeSelectModel[i].selected = true
      })
    }
    if (this.dispenserSelect){
      this.dispenserSelectModel = [...this.dispenserSelect]
      this.dispenserSelectModel.forEach((e,i) => {
        if (e.selected) this.dispenserSelectModel[i].selected = false
        if (this.row.dispenser && this.row.dispenser === e._id) this.dispenserSelectModel[i].selected = true

      })
    }
    this.title = this.row.title
    this.text = this.row.text
    this.mark = this.row.mark
    if (this.row.recommendedAge) this.recommendedAge = this.row.recommendedAge
    this.setDateEvent()
    this.gender = this.row.gender
    this.info = this.row.info

    setTimeout(() => {this.mounting = false},100)

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
    auth(){
      return this.$store.getters['auth/user']
    },
    service(){
      let services = this.serviceSelectModel.filter(e => e.selected)
      let values = [];
      services.forEach(e => values.push(e.value))
      return values
    },
    office(){
      if (this.isOffice){
        let office = this.officeSelectModel.find(e => e.selected)
        if (office) return office._id
      }
    },
    dispenser(){
      if (this.isDispenser){
        let dispenser = this.dispenserSelectModel.find(e => e.selected)
        if (dispenser) return dispenser._id
      }
    },
    bankId(){
      let bank = this.bankSelectModel.find(e => e.selected)
      if (bank) return bank._id
    },
    townId(){
      let town = this.townSelectModel.find(e => e.selected)
      if (town) return town._id
    },
    bank(){
      let bank = this.bankSelectModel.find(e => e.selected)
      if (bank) return bank.value
    },
    bankSelect(){
      return this.$store.getters['select/newBankSelect']
    },
    townSelect(){
      return this.$store.getters['select/townSelectNew'](this.bankId)
    },
    serviceSelect(){
      return this.$store.getters['select/serviceSelect']
    },
    town(){
      let town = this.townSelectModel.find(e => e.selected)
      if (town) return town.value
    },
    channelsSelect(){
      return this.$store.getters['select/channelsSelect']
    },
    officeSelect(){
      return this.$store.getters['select/officeSelectNew'](this.bankId,this.townId)
    },
    dispenserSelect(){
      return this.$store.getters['select/dispenserSelectNew'](this.bankId,this.townId)
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


  methods:{
    changeTown(){
      this.validateTown()
    },
    clearTownSelect(){
      if (this.townSelect){
        this.townSelectModel = [...this.townSelect]
        this.townSelectModel.forEach((e,i) => {
          if (e.selected) this.townSelectModel[i].selected = false
        })
      } else this.townSelectModel = []
      this.validateTown()
    },
    clearChannelsSelect(){
      if (this.channelsSelect){
        this.channelsSelectModel = [...this.channelsSelect]
        this.channelsSelectModel.forEach((e,i) => {
          if (e.selected) this.channelsSelectModel[i].selected = false
        })
      } else this.channelsSelectModel = []
    },
    clearServiceSelect(){
      if (this.serviceSelect){
        this.serviceSelectModel = [...this.serviceSelect]
        this.serviceSelectModel.forEach((e,i) => {
          if (e.selected) this.serviceSelectModel[i].selected = false
        })
      } else this.serviceSelectModel = []
    },
    clearOfficeSelect(){
      if (this.officeSelect){
        this.officeSelectModel = [...this.officeSelect]
        this.officeSelectModel.forEach((e,i) => {
          if (e.selected) this.officeSelectModel[i].selected = false
        })
      }
      else this.officeSelectModel = []
    },
    clearDispenserSelect(){
      if (this.dispenserSelect){
        this.dispenserSelectModel = [...this.dispenserSelect]
        this.dispenserSelectModel.forEach((e,i) => {
          if (e.selected) this.dispenserSelectModel[i].selected = false
        })
      } else this.dispenserSelectModel = []
    },

    channelsChange(){
      if (!this.isOffice) this.clearOfficeSelect()
      if (!this.isDispenser) this.clearDispenserSelect()
      this.validateChannels()
    },

    changeBank(){
      if (!this.mounting){
        this.clearTownSelect()
        this.clearChannelsSelect()
        this.clearServiceSelect()
        this.clearDispenserSelect()
        this.clearOfficeSelect()
        this.validateBank()
      }

    },

    async update(){
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



      const {bankId, title, text, mark, info, gender, townId, recommendedAge, date, office, dispenser, service, row} = this
      const {result} = (await this.$axios.post('/table/updateReview', {
        user: this.auth, bank: bankId, title, text, mark, info, gender, town: townId, recommendedAge, office, channels:values, dispenser,service,
        dateEvent:date, _id:row._id
      })).data


      if (result) {
        this.$notify.success({
          title:'Удача',
          message: 'Отзыв обновлен'
        })
        this.$emit('reload-table')
        // this.setDefault()
        this.$emit('close')
      }
    },
    setDateEvent(){
      let arr = this.row.dateEvent.split(' ');
      if (arr.length === 3) {
        switch (arr[1]){
          case 'Января':
            arr[1] = '01'
            break
          case 'Февраля':
            arr[1] = '02'
            break
          case 'Марта':
            arr[1] = '03'
            break
          case 'Апреля':
            arr[1] = '04'
            break
          case 'Мая':
            arr[1] = '05'
            break
          case 'Июня':
            arr[1] = '06'
            break
          case 'Июля':
            arr[1] = '07'
            break
          case 'Августа':
            arr[1] = '08'
            break
          case 'Сентября':
            arr[1] = '09'
            break
          case 'Октября':
            arr[1] = '10'
            break
          case 'Ноября':
            arr[1] = '11'
            break
          case 'Декабря':
            arr[1] = '12'
            break
        }
      }


      this.dateEvent = arr.join('.')
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