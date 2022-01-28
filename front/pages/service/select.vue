<template>
  <div>

    <mdb-select v-if="bankSelectModel" v-model="bankSelectModel" label="Выберите банк" />
    <mdb-select v-if="townSelectModel && bankId" v-model="townSelectModel" label="Выберите город" />
    <mdb-btn @click="showAddBankModal = true">Добавить банк</mdb-btn>
    <mdb-btn @click="showAddTownModal = true" v-if="bankId">Добавить город банка</mdb-btn>
    <mdb-btn @click="showAddOfficeModal = true" v-if="bankId && townId">Добавить отделение банка</mdb-btn>
    <mdb-btn @click="showAddDispenserModal = true" v-if="bankId && townId">Добавить банкомат</mdb-btn>
    <add-bank :show="showAddBankModal" @reload-select="reloadSelect" @close="showAddBankModal = false"/>
    <add-town :show="showAddTownModal && bankId" @reload-select="reloadSelect" @close="showAddTownModal = false" :bankId="bankId"/>
    <add-office :show="showAddOfficeModal && bankId && townId" @reload-select="reloadSelect" @close="showAddOfficeModal = false" :bankId="bankId" :townId="townId"/>
    <add-dispenser :show="showAddDispenserModal && bankId && townId" @reload-select="reloadSelect" @close="showAddDispenserModal = false" :bankId="bankId" :townId="townId" />

    <p>Отделения</p>
      <ul>
        <li v-for="office in officeSelect"> {{ office.text }}----- {{ office.value}}</li>
      </ul>

    <p>Банкоматы</p>
    <ul>
      <li v-for="dispenser in dispenserSelect"> {{ dispenser.text }}----- {{ dispenser.value}}</li>
    </ul>
  </div>
</template>

<script>
import AddBank from "../../components/Modals/service/select/addBank";
import AddTown from "../../components/Modals/service/select/addTown";
import AddOffice from "../../components/Modals/service/select/addOffice";
import AddDispenser from "../../components/Modals/service/select/addDispenser";
export default {
  name: "select",
  components: {AddDispenser, AddTown, AddBank,AddOffice},
  data(){
    return {
      showAddBankModal: false,
      showAddTownModal: false,
      showAddOfficeModal: false,
      showAddDispenserModal: false,
      bankSelectModel: [],
      townSelectModel: [],
      officeSelectModel: []
    }
  },

  watch:{
    bankSelect(){
      this.bankSelectModel = [...this.bankSelect]
    },
    townSelect(){
      this.townSelectModel = [...this.townSelect]
    }
  },

  computed:{
    bankSelect(){
      return this.$store.getters['select/newBankSelect']
    },
    allTowns(){
      return this.$store.getters['select/townSelectAll']
    },
    bankId(){
      if (this.bankSelectModel.some(e => e.selected)) return this.bankSelectModel.find(e => e.selected)._id
    },
    townId(){
      if (this.townSelectModel.some(e => e.selected)) return this.townSelectModel.find(e => e.selected)._id
    },
    townSelect(){
      if (this.bankId) return this.$store.getters['select/townSelectNew'](this.bankId)
      return []
    },
    officeSelect(){
      if (this.bankId && this.townId) return this.$store.getters['select/officeSelectNew'](this.bankId, this.townId)
      return []
    },
    dispenserSelect(){
      if (this.bankId && this.townId) return this.$store.getters['select/dispenserSelectNew'](this.bankId, this.townId)
      return []
    }
  },


  async mounted() {
    await this.$store.dispatch('select/loadAutoSelectBank')


  },


  methods:{
    async reloadSelect(){
      await this.$store.dispatch('select/loadAutoSelectBank')
    }
  }
}
</script>

<style scoped>

</style>