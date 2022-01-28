<template>
  <mdb-modal v-show="show" @close="$emit('close')">
    <mdb-modal-header>
      <mdb-btn @click="profile = true">Профиль</mdb-btn>
      <mdb-btn @click="profile = false">Отзыв</mdb-btn>
    </mdb-modal-header>
    <mdb-modal-body>
      <div v-if="row">
        <mdb-modal-body>
          <create-profile-info :row="row" v-if="profile"/>
          <review-info  :row="row" v-else/>
        </mdb-modal-body>
      </div>
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="$emit('close')" color="danger">Закрыть</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>
<script>
import CreateProfileInfo from "../profiles/createProfileInfo";
import ReviewInfo from "./reviewInfo";
export default {
name: "allInfo",
  props:['row','show'],
  components: {ReviewInfo, CreateProfileInfo},
  data(){
    return{
      profile: true
    }
  }
}
</script>

<style scoped>

</style>