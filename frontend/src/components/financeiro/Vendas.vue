<template>
    <div>
        
        <b-row>
            <b-col md="10">
        <h1>Vendas</h1>
        <b-card>
            <b-row>
            <b-col md="6" class="my-1">
            <b-form-group>
                <b-input-group>
                    <!-- <b-form-input v-model="filter" placeholder="Pesquisar Cliente"></b-form-input>
                    <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''">Limpar</b-button>
                    </b-input-group-append> -->
                </b-input-group>
            </b-form-group>
            </b-col>

            <b-col md="6" class="my-1 d-flex justify-content-end">
            <b-form-group>
                <b-button variant="primary" v-b-modal.form-cliente> Nova Venda </b-button>

                <b-modal no-close-on-backdrop  @hidden="resetModal" 
                    v-model="showModal" id="form-cliente" title="Cadastro de Cliente">
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
                        <b-button   class="float-right"  @click="showModal=false" >
                            Cancelar
                        </b-button>
                    </div>
                    
                </b-modal>
            
            </b-form-group>
            </b-col>
                       
            </b-row>

            <div class="altura">
                <b-form-group v-if="!showMeses">
                    <a href="#" class="mr-3" @click="mudarPeriodoEsquerda(false)"><i class="fa fa-chevron-left"></i></a>
                    <b-button pill variant="outline-primary" @click="showMeses = true"
                        style="width:170px;"> 
                        {{meses[periodoVendas.mes-1]}} - {{periodoVendas.ano}} 
                    </b-button>
                    <a href="#" class="ml-3" @click="mudarPeriodoDireita(false)"><i class="fa fa-chevron-right"></i></a>
                </b-form-group>
                <div v-else>
                    <a href="#" class="mr-3" @click="mudarPeriodoEsquerda(true)"><i class="fa fa-chevron-left"></i></a>
                     {{periodoVendas.ano}}
                    <a href="#" class="ml-3" @click="mudarPeriodoDireita(true)"><i class="fa fa-chevron-right"></i></a><br>
                    <template v-for="mes in meses">
                        <b-button  pill class="mr-2" :pressed="mes == meses[periodoVendas.mes-1]" 
                        @click="periodoVendas.mes = meses.indexOf(`${mes}`)+1; carregarVendas(); showMeses=false"
                        variant="outline-primary" size="sm" :key="mes">{{mes}}</b-button>
                    </template>
                </div>
            </div>

            <b-table striped :items="vendas" :fields="fields" :busy="loadTable">
                <template slot="dataVenda" slot-scope="data">
                    {{ changeShowDate(data.item.dataVenda) }}                
                </template>
                <template slot="pago" slot-scope="data">
                    <b-badge v-if="data.item.pago" href="#" pill variant="success"><i class="fa fa-check"></i></b-badge>
                    <b-badge v-else href="#"  variant="danger"><i class="fa fa-close"></i></b-badge>                                    
                </template>
                <template slot="acoes" slot-scope="data">
                    <b-button variant="warning" class="mr-2" @click="carregarCliente(data.item)">
                        <i class="fa fa-pencil"></i>
                    </b-button>
                    <b-button variant="info">
                        <!-- Vizualisar vendas para o cliente -->
                        <i class="fa fa-eye"></i>
                    </b-button>
                </template>
                <div slot="table-busy" class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                </div>

            </b-table>
        </b-card>
        </b-col>
        <b-col md="2">
            <div class="mt-5">Total vendas R$ 13.000,00</div>
        </b-col>
        
        </b-row>
    </div>
</template>

<script>
//MOSTRA DIVIDAS DO ANO

import axios from 'axios'
import { baseApiUrl, showError, dateFormat } from '@/global'

export default {
    name:'Vendas',
    data() {
      return {       
        showModal:false,
        showMeses:false,
        loadTable: false,
        formSubmit: false,
        periodoVendas:{},
        cliente:{},
        vendas:[],
        fields: [
            { key: 'id', label:'Código', sortable: true },
            { key: 'lote', label:'Lote', sortable: true },
            { key: 'peso', label:'Peso' },
            { key: 'valor', label:'Valor' },
            { key: 'dataVenda', label:'Data da venda', sortable: true },
            { key: 'pago', label:'Pagamento Efetivado', sortable: true }, 
            { key: 'dataPagamento', label:'Data do pagamento' },
            { key: 'acoes', label:'' }         
        ],
        meses: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
      }
    },
    computed: {
        validation(){   
            if(this.formSubmit) return this.cliente.nome ? true : false         
            return this.cliente.nome ? true : null
        }
    },
    methods:{
        carregarVendas(){
            if(!this.periodoVendas.mes){
                const dataAtual = new Date()
                this.periodoVendas = { mes: dataAtual.getMonth()+1, ano: dataAtual.getFullYear() }
            } 
            this.loadTable = true
            
            const url = `${baseApiUrl}/vendas/${this.periodoVendas.mes}/${this.periodoVendas.ano}`
            axios.get(url).then(res => {
                this.vendas = res.data
                this.loadTable = false
            }).catch(showError)            
        },
        carregarCliente(cliente){
            this.cliente = { ...cliente }
            this.showModal = true
        },
        reset(){
            this.resetModal()            
            this.carregarVendas()
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
                    this.showModal = false
                    this.reset()
                })
                .catch(showError)}
        },
        changeShowDate(item){
            return item ? dateFormat(item) : ''
        },
        mudarPeriodoDireita(ano){
            if(this.periodoVendas.mes < 12 && !ano){
                this.periodoVendas.mes += 1
                this.carregarVendas()
            }else {
                this.periodoVendas.ano += 1
                //this.periodoVendas.mes = 1
            }
            
            
        },
        mudarPeriodoEsquerda(ano){
            if(this.periodoVendas.mes > 1 && !ano){
                this.periodoVendas.mes -= 1
                this.carregarVendas()
            }else {
                this.periodoVendas.ano -= 1
                //this.periodoVendas.mes = 12
            }
            
            
        }

    },
    mounted(){
        this.carregarVendas()
    }

}
</script>

<style>
.altura{
    height: 80px;
}

</style>
