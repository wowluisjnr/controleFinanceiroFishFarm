<template>
    <b-card>
        <div>
          <b-button v-b-modal.modal-prevent-closing>Open Modal</b-button>

          <div class="mt-3">
            Submitted Names:
            <div v-if="submittedNames.length === 0">--</div>
            <ul v-else class="mb-0 pl-3">
              <li v-for="name in submittedNames" :key="name">{{ name }}</li>
            </ul>
          </div>

          <b-modal
            id="modal-prevent-closing"
            ref="modal"
            title="Submit Your Name"
            @show="resetModal"
            @hidden="resetModal"
            
          >
            <form ref="form" @submit.stop.prevent="handleSubmit">
              <b-form-group
                :state="nameState"
                label="Name"
                label-for="name-input"
                invalid-feedback="Name is required"
              >
                <b-form-input
                  ref='name'
                  id="name-input"
                  v-model="name"
                  :state="nameState"
                  required
                ></b-form-input>
                </b-form-group>
                <b-form-group
                :state="testeState"
                label="Teste"
                label-for="teste-input"
                invalid-feedback="Name is required"
              >
                <b-form-input
                  ref="teste"
                  id="teste-input"
                  v-model="teste"
                  :state="testeState"
                  required
                ></b-form-input>
              </b-form-group>
            </form>
            <div slot="modal-footer" class="w-100">
                <b-button  variant="primary" @click="handleOk" class="float-right ml-2">
                    Salvar
                </b-button>
                <b-button   class="float-right"  >
                    Cancelar
                </b-button>
            </div>   
          </b-modal>
        </div>
    </b-card>
</template>

<script>
import { userKey } from '@/global'
import {mapState} from 'vuex'

export default {
    name: 'NotHelloWorld',
    data() {
      return {
        name: '',
        teste:'',
        nameState: null,
        testeState: null,
        submittedNames: []
      }
    },
    computed: mapState(['user']),
    methods:{


      checkFormValidity() {
        const valid = this.$refs.teste.checkValidity()
        this.nameState = this.$refs.name.checkValidity() ? 'valid' : 'invalid'
        this.testeState = valid ? 'valid' : 'invalid'
        return valid && this.refs.name.checkValidity()
      },
      resetModal() {
        this.name = ''
        this.nameState = null
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleSubmit()
      },
      handleSubmit() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return
        }
        // Push the name to submitted names
        this.submittedNames.push(this.name)
        // Hide the modal manually
        this.$nextTick(() => {
          this.$refs.modal.hide()
        })
      },

      
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
