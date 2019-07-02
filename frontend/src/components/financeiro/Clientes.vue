<template>
    <div>
        <h1>Clientes</h1>
        <b-card>
            <b-row>
            <b-col md="6" class="my-1">
            <b-form-group>
                <b-input-group>
                    <b-form-input v-model="filter" placeholder="Pesquisar Cliente"></b-form-input>
                    <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''">Limpar</b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-form-group>
            </b-col>

            <b-col md="6" class="my-1 d-flex justify-content-end">
            <b-form-group>
                <b-button variant="primary" v-b-modal.form-cliente> Novo Cliente </b-button>

                <b-modal no-close-on-backdrop  @hidden="resetModal" 
                    v-model="show" id="form-cliente" title="Cadastro de Cliente">
                    <b-form>
                        <input id="cliente-id" type="hidden" v-model="cliente.id" />
                        <label for="nome">* Nome</label>
                        <b-form-input id="nome" v-model="cliente.nome" :state="validation" placeholder="Nome do Cliente"></b-form-input>
                        <b-form-invalid-feedback :state="validation">
                            Nome do cliente é um campo obrigatório!!!
                        </b-form-invalid-feedback>
                        <label for="descricao">Descrição</label>
                        <b-form-input id="descricao" v-model="cliente.descricao" placeholder="Descrição"></b-form-input>
                        <label for="telefone" >Telefone</label>
                        <b-input id="telefone" v-model="cliente.telefone" placeholder="(00) 00000-0000"></b-input>
                    </b-form>
                    <div slot="modal-footer" class="w-100">
                        <b-button  variant="primary" class="float-right ml-2"  @click="adicionarCliente" >
                            Salvar
                        </b-button>
                        <b-button   class="float-right"  @click="show=false" >
                            Cancelar
                        </b-button>
                    </div>
                    
                </b-modal>
            
            </b-form-group>
            </b-col>
            </b-row>

            <b-table striped :items="clientes" :fields="fields" :filter="filter">
                <template slot="acoes" slot-scope="data">
                    <b-button variant="warning" class="mr-2" @click="carregarCliente(data.item)">
                        <i class="fa fa-pencil"></i>
                    </b-button>
                    <b-button variant="info">
                        <!-- Vizualisar vendas para o cliente -->
                        <i class="fa fa-eye"></i>
                    </b-button>
                </template>

            </b-table>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios'
import { baseApiUrl, showError } from '@/global'

export default {
    name:'Clientes',
    data() {
      return {
        filter: null,
        show:false,
        formSubmit: false,
        cliente:{},
        clientes:[],
        fields: [
            { key: 'id', label:'Código', sortable: true },
            { key: 'nome', label:'Nome', sortable: true },
            { key: 'descricao', label:'Descrição' },
            { key: 'telefone', label:'Telefone' },
            { key: 'acoes', label:'Ações' }         
        ]
      }
    },
    computed: {
        validation(){   
            if(this.formSubmit) return this.cliente.nome ? true : false         
            return this.cliente.nome ? true : null
        }
    },
    methods:{
        carregarClientes(){
            const url = `${baseApiUrl}/clientes`
            axios.get(url).then(res => {
                this.clientes = res.data
            })            
        },
        carregarCliente(cliente){
            this.cliente = { ...cliente }
            this.show = true
        },
        reset(){
            this.resetModal()            
            this.carregarClientes()
        },
        resetModal(){
            this.formSubmit = false
            this.cliente = {}
        },
        adicionarCliente(){
            //https://niksmr.github.io/vue-masked-input/    para mascaras.

            this.formSubmit = true    

            const id = this.cliente.id ? `/${this.cliente.id}` : ''
            const url =`${baseApiUrl}/clientes${id}`
            const method = this.cliente.id ? 'put' : 'post'
            if(this.validation)
            {axios[method](url, this.cliente).then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.show = false
                    this.reset()
                })
                .catch(showError)}
        }
    },
    mounted(){
        this.carregarClientes()
    }

}
</script>

<style>

</style>
