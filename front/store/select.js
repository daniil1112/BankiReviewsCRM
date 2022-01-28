export const actions = {
    async loadAutoSelectBank({ commit, state }, user) {
        const res = await this.$axios.post('/service/select/loadSelect')
        if (res.data.bankSelect) commit('setBankSelect',res.data.bankSelect)
        if (res.data.townSelect) commit('setTownSelect', res.data.townSelect)
        if (res.data.officeSelect) commit('setOfficeSelect',res.data.officeSelect)
        if (res.data.dispenserSelect) commit('setDispenserSelect', res.data.dispenserSelect)
    },
}
export const mutations = {
    setBankSelect(state, banks){
        state.newBankSelect = banks
    },
    setTownSelect(state, towns){
        state.townSelect = towns
    },
    setOfficeSelect(state, office){
        state.newOfficeSelect = office
    },
    setDispenserSelect(state, dispenser){
        state.newDispenserSelect = dispenser
    }
}

export const state = () => ({

    bankSelect:[
        {text:'ТКБ' , value: 'ТКБ'},
        // {text:'Возрождение' , value: 'Возрождение'},
        {text:'Дом.рф' , value: 'Дом.рф'}
    ],
    townSelect:[],
    // townSelect: [
    //     {text:'Москва' , value: 'Москва'},
    //     {text:'Санкт-Петербург' , value: 'Санкт-Петербург'},
    //     {text:'Ростов-на-Дону' , value: 'Ростов-на-Дону'}
    // ],
    channelsSelect: [
        {text: 'Сайт', value: 'Сайт'},
        {text: 'Онлайн-чат', value: 'Онлайн-чат'},
        {text: 'Контактный центр', value: 'Контактный центр'},
        {text: 'Интернет-банк', value: 'Интернет-банк'},
        {text: 'Мобильный банк (приложение)', value: 'Мобильный банк (приложение)'},
        {text: 'Офис обслуживания / отделение', value: 'Офис обслуживания / отделение'},
        {text: 'Банкомат', value: 'Банкомат'},
        {text: 'Представитель', value: 'Представитель'},
        {text: 'Коллекторы / отдел взыскания', value: 'Коллекторы / отдел взыскания'},
        {text: 'Другое', value: 'Другое'},

    ],
    serviceSelect:[
        {text: 'Дебетовая карта', value: 'Дебетовая карта'},
        {text: 'Кредитная карта', value: 'Кредитная карта'},
        {text: 'Ипотека', value: 'Ипотека'},
        {text: 'Автокредит', value: 'Автокредит'},
        {text: 'Потребительский кредит', value: 'Потребительский кредит'},
        {text: 'Реструктуризация / Рефинансирование', value: 'Реструктуризация / Рефинансирование'},
        {text: 'Вклад', value: 'Вклад'},
        {text: 'Инвестиционные продукты / брокерское обслуживание', value: 'Инвестиционные продукты / брокерское обслуживание'},
        {text: 'Денежный перевод', value: 'Денежный перевод'},
        {text: 'Дистанционное обслуживание физических лиц', value: 'Дистанционное обслуживание физических лиц'},
        {text: 'Обслуживание юрлиц', value: 'Обслуживание юрлиц'},
        {text: 'Расчетно-кассовое обслуживание', value: 'Расчетно-кассовое обслуживание'},
        {text: 'Эквайринг', value: 'Эквайринг'},
        {text: 'Зарплатный проект', value: 'Зарплатный проект'},
        {text: 'Депозит', value: 'Депозит'},
        {text: 'Кредитование бизнеса', value: 'Кредитование бизнеса'},
        {text: 'Банковская гарантия', value: 'Банковская гарантия'},
        {text: 'Лизинг', value: 'Лизинг'},
        {text: 'Другое', value: 'Другое'},
        {text: 'Дистанционное обслуживание юридических лиц', value: 'Дистанционное обслуживание юридических лиц'},
    ],
    offices:[
        {bank: 'ТКБ', town:'Москва', text:'Воронцовская', value:'ул. Воронцовская, д. 27/35'},
        {bank: 'ТКБ',town:'Москва', text:'Рябиновая', value:'ул. Рябиновая, д. 55, стр. 1'},
        {bank: 'ТКБ',town:'Москва', text:'Колобовский', value:'пер. 1-й Колобовский, д. 6, стр. 3'},
        {bank: 'ТКБ',town:'Москва', text:'Покровка', value:'ул. Покровка, д. 24/2, стр. 1'},
        {bank: 'ТКБ',town:'Москва', text:'Октябрьская', value:'ул. Октябрьская, д. 36'},
        {bank: 'Дом.рф', town:'Москва', text:'Лубинская', value:'Лубинская д 14 стр 1'},
        {bank: 'Дом.рф',town:'Санкт-Петербург', text:'Островская', value:'Островская д 14 стр 1'}
    ],
    dispensers:[
        {bank: 'ТКБ', town:'Москва', text:'Народного Ополчения', value:' ул.  Народного Ополчения, д.  44, корп. 1'},
        {bank: 'ТКБ', town:'Москва', text:'Товарищеский', value:' пер. Товарищеский, д.  4'},
        {bank: 'ТКБ', town:'Москва', text:'Сущевская', value:'  ул.  Сущевская, д.  21, стр. 8'},
        {bank: 'ТКБ', town:'Москва', text:'Колобовский', value:' пер. 1-й Колобовский, д.  6, стр. 3'},
        {bank: 'ТКБ', town:'Москва', text:'Большая Юшуньская', value:' ул.  Большая Юшуньская, д.  1а'},
        {bank: 'ТКБ', town:'Москва', text:'Большой Златоустинский', value:' пер. Большой Златоустинский, д.  2/8, стр. 1'},
        {bank: 'ТКБ', town:'Москва', text:'Варшавское', value:' ш.  Варшавское, д.  138а'},
        {bank: 'ТКБ', town:'Москва', text:'Новорязанская', value:' ул.  Новорязанская, д.  24'},
        {bank: 'ТКБ', town:'Москва', text:'Дмитровское', value:' ш.  Дмитровское, д.  118, корп. 1'},
        {bank: 'ТКБ', town:'Москва', text:'Павловская', value:' ул.  Павловская, д.  18, стр. 2'},
        {bank: 'ТКБ', town:'Москва', text:'Перерва', value:' ул.  Перерва, д.  39'},
        {bank: 'ТКБ', town:'Москва', text:'Тургеневская', value:' пл.  Тургеневская, д.  2'},
        {bank: 'ТКБ', town:'Москва', text:'Рябиновая', value:' ул.  Рябиновая, д.  55, стр. 1'},
        {bank: 'ТКБ', town:'Москва', text:'Знамя Октября', value:' п.  Знамя Октября, мкр. Родники, д.  4'},
        {bank: 'ТКБ', town:'Москва', text:'просп. Мира', value:' просп. Мира, д.  3, корп. 1'},
        {bank: 'ТКБ', town:'Москва', text:'Воронцовская', value:' ул.  Воронцовская, д.  35 Б, корп. 1'},
        {bank: 'ТКБ', town:'Москва', text:'Воронцовская 27/35', value:' ул.  Воронцовская, д.  27/35'},
        {bank: 'ТКБ', town:'Москва', text:'Стремянный', value:' пер. Стремянный, д.  11'},
        {bank: 'ТКБ', town:'Москва', text:'Варшавское', value:' ш.  Варшавское, д.  138'},
        {bank: 'ТКБ', town:'Москва', text:'Матвеевская', value:' ул.  Матвеевская, д.  20, корп. 3'},
        {bank: 'ТКБ', town:'Москва', text:'Чапаевский', value:' пер. Чапаевский, д.  12'},
        {bank: 'ТКБ', town:'Москва', text:'Нагорный', value:' Нагорный пр-д, д.  6г'},
        {bank: 'ТКБ', town:'Москва', text:'Ломоносовский', value:' просп. Ломоносовский, д.  25, корп. 1'},
        {bank: 'ТКБ', town:'Москва', text:'44-й км МКАД', value:' 44-й км МКАД, д.  1'},
        {bank: 'Дом.рф', town:'Москва', text:'Народного Ополчения', value:' ул.  Народного Ополчения, д.  44, корп. 1'}

    ],

    bankSettings:[
        {
            bank: 'ТКБ',
            towns: [
                {text: 'Москва', value: 'Москва'},
            ],
        },
        {
            bank: 'Дом.рф',
            towns:[
                {text:'Москва' , value: 'Москва'},
                {text:'Санкт-Петербург' , value: 'Санкт-Петербург'},
            ],
        }
    ],
    newBankSelect: [],
    newOfficeSelect: [],
    newDispenserSelect: []

})
export const getters = {
    bankSelect: s => s.bankSelect,
    townSelect: s=> (bank) =>{
        if (bank) return s.bankSettings.find(e => e.bank===bank).towns
    },
    channelsSelect: s => s.channelsSelect,
    serviceSelect: (s) => s.serviceSelect,
    officeSelect: (s) => (bank, town) => {
        if (bank) {
            return s.offices.filter( e => e.bank === bank && e.town === town)
        }
    },
    dispenserSelect: (s) => (bank, town) => {
        if (bank) {
            return s.dispensers.filter( e => e.bank === bank && e.town === town)
        }
    },
    newBankSelect: (s) => s.newBankSelect,
    townSelectAll: (s) => s.townSelect,
    townSelectNew: (s) => (bank) => s.townSelect.filter(e => e.bankId === bank),
    officeSelectNew: (s) => (bank, town) => s.newOfficeSelect.filter(e => e.bankId === bank && e.townId === town),
    dispenserSelectNew: (s) => (bank, town) => s.newDispenserSelect.filter(e => e.bankId === bank && e.townId === town),
    dispenserSelectAll: (s) => s.newDispenserSelect,
    officeSelectAll: (s) => s.newOfficeSelect

}
