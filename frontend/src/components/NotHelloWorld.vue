<template>
    <b-card  header="featured"
      header-tag="header"
      footer="Card Footer"
      footer-tag="footer"
      title="Title">
      <div slot="header">
        <b-button size='sm'>teste</b-button>
      </div>

    </b-card>
</template>

<script>
import { userKey } from '@/global'
import {mapState} from 'vuex'

export default {
    name: 'NotHelloWorld',
    computed: mapState(['user']),
    methods:{
    logout(){
      localStorage.removeItem(userKey)
      this.$store.commit('setUser', null)
      this.$router.push({ path: '/auth' })
    }
  }

}
</script>

<style>

</style>
