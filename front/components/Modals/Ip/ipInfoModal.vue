<template>
  <mdb-modal v-show="show" @close="$emit('close')">
    <mdb-modal-header>
      Инфо
    </mdb-modal-header>
    <mdb-modal-body>
      <div v-if="selectedIp">
        <mdb-input :value="selectedIp.string" disabled  @click.native="doCopy(selectedIp.string)" label="Строка"/>
        <mdb-input v-if="selectedIp.userAgent" :value="selectedIp.userAgent" disabled  @click.native="doCopy(selectedIp.userAgent)" label="UserAgent"/>
      </div>

    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="$emit('close')" color="danger">Закрыть</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
export default {
name: "ipInfoModal",
  props: ['show','row'],

  computed:{
    ips(){
      return this.$store.getters['ip/allIps']
    },
    selectedIp(){
      if (!this.row.ip) return ''
      if (!this.ips) return ''
      return this.ips.find(e => e._id === this.row.ip)
    }
  },


  methods:{
    doCopy: function (string) {
      this.$copyText(string).then(function (e) {
        alert('Copied')
        console.log(e)
      }, function (e) {
        alert('Can not copy')
        console.log(e)
      })
    },
  }
}
</script>

<style scoped>

</style>