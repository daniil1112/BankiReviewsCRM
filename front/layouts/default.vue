<template>
      <main>
        <div>
          <nav>
            <nuxt-link to="/login">Вход</nuxt-link>
            <nuxt-link to="/table">Таблица</nuxt-link>
            <nuxt-link v-if="parseInt(this.$store.getters['auth/user']) === 3" to="/ip">Ip адреса</nuxt-link>
            <nuxt-link v-if="parseInt(this.$store.getters['auth/user']) === 2" to="/profiles">Профили</nuxt-link>
            <nuxt-link v-if="parseInt(this.$store.getters['auth/user'])" to="/datatable">Таблица для экспорта</nuxt-link>
            <nuxt-link v-if="parseInt(this.$store.getters['auth/user'])" to="/changes">Изменения статусов</nuxt-link>
            <ul>
              <li> <span>Загрузка таблицы:
                <mdb-btn v-if="this.$store.getters['table/successUpdate']" tag="a" size="sm" floating class="btn-slack" icon="check-circle" far></mdb-btn>
                <mdb-btn v-else tag="a" size="sm" floating class="btn-pin" icon="exclamation-circle"></mdb-btn>
                 Обновлено: {{profilesTimer}} сек назад</span></li>
              <li> <span>Загрузка профилей:
                <mdb-btn v-if="this.$store.getters['profile/successUpdate']" tag="a" size="sm" floating class="btn-slack" icon="check-circle" far></mdb-btn>
                <mdb-btn v-else tag="a" size="sm" floating class="btn-pin" icon="exclamation-circle"></mdb-btn>
                 Обновлено: {{profilesTimer}} сек назад</span></li>
              <li> <span>Загрузка ip:
                <mdb-btn v-if="this.$store.getters['ip/successUpdate']" tag="a" size="sm" floating class="btn-slack" icon="check-circle" far></mdb-btn>
                <mdb-btn v-else tag="a" size="sm" floating class="btn-pin" icon="exclamation-circle"></mdb-btn>
                 Обновлено: {{ipTimer}} сек назад</span></li>
              <li>Если не загрузилось нажми <mdb-btn @click="setIntervals" v-if="$store.getters['auth/user']">Загрузить</mdb-btn></li>
            </ul>
          </nav>
          <div>

            <nuxt/>
          </div>
        </div>

      </main>

</template>



<script>
export default {
  mounted() {
    setInterval(() => {
      this.profilesTimer = Math.round((new Date - this.$store.getters['profile/updateDate']) / 1000)
      this.tableTimer =  Math.round((new Date - this.$store.getters['table/updateDate']) / 1000)
      this.ipTimer = Math.round((new Date - this.$store.getters['ip/updateDate']) / 1000)
    }, 1000)
    if (localStorage && localStorage.auth) this.$store.dispatch('auth/setAuth', parseInt(localStorage.auth))
    setInterval(() => {
      if (localStorage){
        if (localStorage.auth) this.$store.dispatch('auth/setAuth', parseInt(localStorage.auth))
      }
    }, 5000)
  },

  data(){
    return {
      profilesTimer: '',
      tableTimer: '',
      ipTimer: ''
    }
  },
  methods:{
    setIntervals(){
      this.$store.dispatch('table/setInterval')
      this.$store.dispatch('profile/setInterval')
      this.$store.dispatch('ip/setInterval')
    }
  }



}
</script>