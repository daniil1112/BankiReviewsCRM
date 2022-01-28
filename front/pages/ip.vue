<template>
  <div>
    <mdb-btn @click="showCheckUserAgentModal = true">Проверить userAgent</mdb-btn>
    <mdb-table bordered responsive>
      <mdb-table-head>
        <th>#</th>
        <th>Добавлен</th>
        <th>IP</th>
        <th>Строка</th>
        <th>Локация</th>
        <th>UserAgent</th>
        <th>Использован</th>
        <th>Брак</th>
        <th>Требуется продление</th>
        <th>Действия</th>
      </mdb-table-head>
      <mdb-table-body>
        <tr v-for="ip in ips">
          <td>{{ip._id}}</td>
          <td>{{generateDate(ip.dateAdd)}}</td>
          <td>{{ip.ip}}</td>
          <td>{{ip.string}}</td>
          <td>{{ip.town}}</td>
          <td>{{ip.userAgent}}</td>
          <td>
            <span v-if="ip.used">Да</span>
            <span v-else>Нет</span>
          </td>
          <td>
            <span v-if="ip.breakage">Да</span>
            <span v-else>Нет</span>
          </td>
          <td>
            <span v-if="ip.adopted">Нет</span>
            <span v-else>Да</span>
          </td>
          <td>
            <mdb-btn @click="showUserAgentModal(ip)">Прикрепить useragent</mdb-btn>
            <mdb-btn color='danger' @click="deleteRow(ip)" v-if="!ip.used && !ip.breakage">Удалить</mdb-btn>
            <mdb-btn @click="updateRowIp(ip)" >Изменить</mdb-btn>
          </td>
        </tr>
      </mdb-table-body>
    </mdb-table>
    <mdb-btn @click="showAddModal=true">Добавить адреса</mdb-btn>
    <add-ips-modal :show="showAddModal" @reload="reload" @close="showAddModal = false"/>
    <update-ip-modal :show="updateIpModalShow"  :row="updateRow" @close="updateIpModalShow = false"  />
    <add-user-agent-modal :show="addUserAgentModal" :row="updateRow" @reload="reload" @close="addUserAgentModal = false"/>
    <check-user-agent-modal :show="showCheckUserAgentModal" @close="showCheckUserAgentModal = false" />
  </div>
</template>

<script>
import AddIpsModal from "../components/Modals/Ip/addIpsModal";
import AddUserAgentModal from "../components/Modals/Ip/addUserAgentModal";
import CheckUserAgentModal from "../components/Modals/Ip/checkUserAgentModal";
import UpdateIpModal from "../components/Modals/Ip/updateIpModal";
import dateformat from 'dateformat'
export default {
  name: "ip",
  components: {UpdateIpModal, CheckUserAgentModal, AddUserAgentModal, AddIpsModal},
  computed:{
    user(){
      return this.$store.getters['auth/user']
    },
    ips(){
      return this.$store.getters['ip/allIps']
    }
  },

  data(){
    return {
      showAddModal: false,
      addUserAgentModal: false,
      updateRow: false,
      showCheckUserAgentModal: false,
      updateIpModalShow: false
    }
  },

  async mounted() {
    await this.$store.dispatch('select/loadAutoSelectBank')
    this.setIntervalReload()
    await this.reload()
    await this.loadAll()

  },

  methods:{
    generateDate(iso){
      let date = new Date(iso)
      return  dateformat(date,'dd.mm.yyyy')
    },
    updateRowIp(row){
      this.updateIpModalShow = true
      this.updateRow = row
    },
    showUserAgentModal(row){
      this.addUserAgentModal = true
      this.updateRow = row
    },
    async loadAll(){
      const {user} = this
      // await this.$store.dispatch('ip/setInterval')
    },
    async reload(){
      const {user} = this
      await this.$store.dispatch('ip/loadAll')
    },
    async deleteRow(row) {
      const {user} = this

      const {success} = (await this.$axios.post('/ip/deleteIp', {user, _id: row._id})).data

      if (success) {
        this.$notify.success({
          title: 'Успешно удалено'
        })
        await this.reload()
      } else {
        this.$notify.error({
          title: 'Ошибка при улалении'
        })
      }


    },

    setIntervalReload(){
      this.$store.dispatch('table/setInterval')
      this.$store.dispatch('profile/setInterval')
      this.$store.dispatch('ip/setInterval')
    }
  }
}
</script>

<style scoped>

</style>