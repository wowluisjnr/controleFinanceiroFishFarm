<template>
    <div>
        
        <b-row>
            <b-col md="10">
        <h1>Vendas</h1>
        <b-card header-tag="header">
            <div slot="header">
            <b-row>
            <b-col md="6" class="d-flex justify-content-start" >
            <b-form-group>
                <b-button variant="light" v-b-modal.periodo-vendas><i class="fa fa-filter"></i> Filtrar por periodo</b-button>
            </b-form-group>
            </b-col>

            <b-col md="6" class="d-flex justify-content-end">                
                <b-form-group>
                    <b-button pill variant="primary"  v-b-modal.form-venda> Nova Venda </b-button>           
                </b-form-group>
            </b-col>
                       
            </b-row>
            </div>

            <div class="altura" v-if="dataFinalNula">
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
                    <template v-for="mes in mesesAbrev">
                        <b-button  pill class="mr-2" :pressed="mes == mesesAbrev[periodoVendas.mes-1]" 
                        @click="periodoVendas.mes = mesesAbrev.indexOf(`${mes}`)+1; carregarVendas(); showMeses=false"
                        variant="outline-primary" size="sm" :key="mes">{{mes}}</b-button>
                    </template>
                </div>                
            </div>
            <div class="altura d-flex justify-content-between" v-else>
                <h4><b-badge pill variant="light">  De {{`${this.periodoVendas.dia}/${this.periodoVendas.mes}/${this.periodoVendas.ano} a ${this.periodoVendas.diaFinal}/${this.periodoVendas.mesFinal}/${this.periodoVendas.anoFinal}`}}
                    </b-badge></h4>
                <div>
                    <b-button variant="light" @click="zerarDataFinal">Linpar</b-button>
                </div>
            </div>

            <b-table small striped :items="vendas" :fields="fields" :busy="loadTable">
                <template slot="cliente" slot-scope="data">
                    {{ buscarCliente(data.item.clienteId).nome }}                
                </template>                
                <template slot="dataVenda" slot-scope="data">
                    {{ changeShowDate(data.item.dataVenda) }}                
                </template>
                <template slot="pago" slot-scope="data">
                    <b-badge v-if="data.item.pago" href="#" pill variant="success"><i class="fa fa-check"></i></b-badge>
                    <b-badge v-else href="#"  variant="danger"><i class="fa fa-close"></i></b-badge>                                    
                </template>
                <template slot="dataPagamento" slot-scope="data">
                    {{data.item.dataPagamento ? changeShowDate(data.item.dataPagamento) : '--/--/----' }}                
                </template>
                <template slot="acoes" slot-scope="data">
                    <b-button size="sm" variant="warning" class="mr-2" @click="carregarVenda(data.item)">
                        <i class="fa fa-pencil"></i>
                    </b-button>
                    <b-button size="sm" variant="danger">
                        <i class="fa fa-trash"></i>
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
            <div class="mt-5">
                <p> Total de vendas no periodo <b-badge variant="primary"> R$ {{totalVendas}} </b-badge> </p>
                <p> Recebidos <b-badge variant="success"> R$ {{totalVendasRecebidas}} </b-badge> </p>
                <p> Não Recebidos <b-badge variant="danger"> R$ {{totalVendasNaoRecebidas}} </b-badge></p>
                <p>Peso medio - preço medio </p>
            </div>
        </b-col>        
        </b-row>

        <b-modal ref="modalCadastro" no-close-on-backdrop  @hidden="resetModal" size="lg"
            v-model="showModalNovo" id="form-venda" title="Nova venda">

            <b-form @submit.stop.prevent="vendaSubmit">
                <input id="venda-id" type="hidden" v-model="venda.id" />
                <b-row>
                    <b-col md="6">  
                        <b-form-group  id="input-valor" label="Insira o valor:" label-for="valor" invalid-feedback="Valor é obrigatorio" >                
                            <b-form-input ref="valor" id="valor" type="number" step="0.01" v-model="venda.valor" :state="valorState" required></b-form-input>
                        </b-form-group>                             
                        <b-form-group  id="input-lote" label="Lote:" label-for="lote" invalid-feedback="Lote é obrigatorio" >                
                            <b-form-input ref="lote" id="lote" v-model="venda.lote" :state="loteState" required></b-form-input>
                        </b-form-group>
                        <b-form-group id="input-quantidade" label="Quantidade de peixes:" label-for="quantidade" invalid-feedback="Quantidade de peixes é obrigatorio" >                
                            <b-form-input ref="quantidade" id="quantidade" type="number" v-model="venda.quantidadePeixe" :state="quantidadeState" required></b-form-input>
                        </b-form-group>
                        <b-form-checkbox class="pt-2"  id="checkbox-pago" v-model="venda.pago"                    
                            :value="true"
                            :unchecked-value="false">
                                Está pago
                        </b-form-checkbox>

                        <b-form-checkbox v-if="!venda.pago" class="pt-2"  id="checkbox-pagamento-parcial" v-model="showPagamentoParcial"                    
                            :value="true"
                            :unchecked-value="false">
                                Efetuar pagamento parcial
                        </b-form-checkbox> 
                        <b-form-group v-if="showPagamentoParcial && !venda.pago" id="input-parcial" label="Insira o valor:" label-for="parcial" invalid-feedback="Valor é obrigatorio" >                
                            <b-form-input ref="parcial" id="parcial" type="number" step="0.01" v-model="venda.pagamentoParcial"  required></b-form-input>
                        </b-form-group>                           
                                              
                    </b-col>
                    <b-col md="6">
                        <b-form-group id="input-data-venda" label="Data da venda:" label-for="data-venda" invalid-feedback="Informe a data corretamente">                
                            <b-form-input ref="dataVenda" id="data-venda" type="date" v-model="venda.dataVenda" :state="dataVendaState" required></b-form-input>
                        </b-form-group>
                        <b-form-group id="input-peso" label="Peso:" label-for="peso" invalid-feedback="Campo obrigatorio" >                
                            <b-form-input ref="peso" id="peso" type="number" step="0.001" v-model="venda.peso" :state="pesoState" required></b-form-input>
                        </b-form-group> 
                        <b-form-group id="input-cliente" label="Cliente" label-for="cliente" invalid-feedback="Selecione um cliente">
                            <b-form-select ref="clienteId" id="cliente" v-model="venda.clienteId" :options="clientes" :state="clienteIdState" required></b-form-select>
                        </b-form-group>
                                          
                                        
                        <b-form-group v-if="venda.pago" id="input-data-pagamento" label="Data Pagamento:" label-for="data-pagamento" invalid-feedback="Informe a data corretamente">                
                            <b-form-input ref="dataPagamento" id="data-pagamento" type="date" v-model="venda.dataPagamento" :state="dataPagamentoState" required></b-form-input>
                        </b-form-group> 
                    </b-col>
                </b-row>                            
            </b-form>

            <div slot="modal-footer" class="w-100">
                <b-button  variant="primary" class="float-right ml-2" @click="salvarVenda">
                    Salvar
                </b-button>
                <b-button   class="float-right"  @click="showModalNovo=false" >
                    Cancelar
                </b-button>
            </div>                    
        </b-modal>

        <b-modal no-close-on-backdrop v-model="showModalPeriodo" id="periodo-vendas" 
        title="Filtrar periodo de vendas">
            <b-form @submit="onSubmit" >
                <b-row>
                    <b-col md="6">
                        <b-form-group
                            id="input-data-inicio"
                            label="De:"
                            label-for="data-inicio" >                
                            <b-form-input id="data-inicio" type="date" v-model="form.dataInicio" required></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <b-form-group
                            id="input-data-fim"
                            label="Até:"
                            label-for="data-fim" >                
                            <b-form-input id="data-fim" type="date" v-model="form.dataFim" required ></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-button  variant="primary" type="submit" class="float-right ml-2" >
                    Filtrar
                </b-button>                
            </b-form>

            <div slot="modal-footer" class="w-100">       
                
            </div> 
        </b-modal>

    </div>
</template>

<script>
//MOSTRA DIVIDAS DO ANO

import axios from 'axios'
import { baseApiUrl, showError, dateFormat, dateDefaltValidation } from '@/global'

export default {
    name:'Vendas',
    data() {
      return {   
          valorState:null,
          dataVendaState:null,     
          loteState:null,
          pesoState:null,  
          quantidadeState:null,  
          dataPagamentoState:null,
          clienteIdState:null,
        showPagamentoParcial:false,
        dataFinalNula:true,
        showModalNovo:false,
        showModalPeriodo:false,
        showMeses:false,
        loadTable: false,
        periodoVendas:{},
        venda:{},
        totalVendas: 0,
        totalVendasRecebidas: 0,
        totalVendasNaoRecebidas: 0,
        vendas:[],
        fields: [
            
            { key: 'lote', label:'Lote', sortable: true },
            { key: 'peso', label:'Peso' },
            { key: 'quantidadePeixe', label: 'Quantidade'},
            { key: 'cliente', label: 'Cliente'},
            { key: 'valor', label:'Valor' },
            { key: 'dataVenda', label:'Data da venda', sortable: true },
            { key: 'pago', label:'Efetivado', sortable: true }, 
            { key: 'dataPagamento', label:'Data do pagamento' },
            { key: 'acoes', label:'' }         
        ],
        clientes:[],
        meses: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        mesesAbrev:["Jan.", "Fev.", "Mar.", "Abr.", "Mai.", "Jun.", "Jul.", "Ago.", "Set.","Out.", "Nov.", "Dez."],
        form:{
            dataInicio:'',
            dataFim:''
        }

      }
    },
    computed: {
        
    },
    methods:{
        
        carregarVendas(){
            if(!this.periodoVendas.mes){
                const dataAtual = new Date()                
                this.periodoVendas = { ...{
                    dia: 1,
                    mes: dataAtual.getMonth()+1, 
                    ano: dataAtual.getFullYear()
                    }
                }
            } 
            this.loadTable = true
            
            const url = `${baseApiUrl}/vendas/${
                this.periodoVendas.dia}/${
                this.periodoVendas.mes}/${
                this.periodoVendas.ano}/${
                this.periodoVendas.diaFinal}/${
                this.periodoVendas.mesFinal}/${
                this.periodoVendas.anoFinal}`

            axios.get(url).then(res => {
                this.vendas = res.data
                this.loadTable = false

                this.totalVendas = res.data.reduce((total, obj) =>{                    
                    return total + parseFloat(obj.valor)
                }, 0)
                this.totalVendasRecebidas = res.data.reduce((total, obj) =>{ 
                    return obj.pago || obj.pagamentoParcial ? total + (!obj.pago ? parseFloat(obj.pagamentoParcial) : parseFloat(obj.valor)) : total + 0
                }, 0)
                this.totalVendasNaoRecebidas = this.totalVendas - this.totalVendasRecebidas
            }).catch(showError)            
        },
        carregarVenda(venda){
            this.venda = { ...venda}
            this.showPagamentoParcial = parseInt(venda.pagamentoParcial) ? true : false
            this.carregarData()
            this.showModalNovo = true
        },
        carregarClientes(){
            axios.get(`${baseApiUrl}/clientes`).then(res => {
                this.clientes = res.data.map( cliente => {
                    cliente.value = cliente.id
                    cliente.text = cliente.nome
                    return cliente
                })
            }).catch(showError)
        }, 
        buscarCliente(id){
            return this.clientes.find(cliente => {
                if(cliente.id == id){
                    return true
                }
            })
        },
        resetModal(){
            this.venda ={}
            
             this.carregarData()
            
            this.valorState=null
            this.dataVendaState=null     
            this.loteState=null
            this.pesoState=null  
            this.quantidadeState=null  
            this.dataPagamentoState=null      
            this.clienteIdState = null

        }, 
        carregarData(){
            const dataAtual = new Date()            
            if(!this.venda.dataPagamento) this.venda.dataPagamento = `${dataAtual.getFullYear()}-${
                dataAtual.getMonth()<9 ? '0'+(dataAtual.getMonth()+1) : dataAtual.getMonth()+1}-${
                dataAtual.getDate()<10 ? '0'+dataAtual.getDate():dataAtual.getDate}`
            else{
                this.venda.dataPagamento = dateDefaltValidation(this.venda.dataPagamento)
            }
            if(!this.venda.dataVenda)
                this.venda.dataVenda = this.venda.dataPagamento 
            else{
                this.venda.dataVenda = dateDefaltValidation(this.venda.dataVenda)
            }
        },
        salvarVenda(bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault()
            // Trigger submit handler
            this.vendaSubmit()
        }, 
        vendaSubmit(){
            if (!this.validarFormulario()) {
                return
            }
            const id = this.venda.id ? `/${this.venda.id}` : ''
            const url =`${baseApiUrl}/vendas${id}`
            const method = this.venda.id ? 'put' : 'post'

            axios[method](url, this.venda).then(()=>{
                this.$toasted.global.defaultSuccess()
                this.showModalNovo=false
                this.carregarVendas()
            }).catch(showError)

            // this.$nextTick(() => {
                
            // })

        },  
        onSubmit(evt) {
            evt.preventDefault()

            const dataIni = this.form.dataInicio.split('-')
            const dataFin = this.form.dataFim.split('-')

            this.periodoVendas.dia = dataIni[2]
            this.periodoVendas.mes = dataIni[1]
            this.periodoVendas.ano = dataIni[0]

            this.periodoVendas.diaFinal = dataFin[2]
            this.periodoVendas.mesFinal = dataFin[1]
            this.periodoVendas.anoFinal = dataFin[0]

            this.carregarVendas()            
            this.showModalPeriodo = false
            this.dataFinalNula = false
        },   
        validarFormulario(){
            const valor = this.$refs.valor.checkValidity()
            const dataVenda = this.$refs.dataVenda.checkValidity()
            const lote = this.$refs.lote.checkValidity()
            const peso = this.$refs.peso.checkValidity()
            const quantidade = this.$refs.quantidade.checkValidity()

            const dataPagamento = this.$refs.dataPagamento ? this.$refs.dataPagamento.checkValidity() : null

            this.valorState = valor ? 'valid' : 'invalid'
            this.dataVendaState = dataVenda ? 'valid' : 'invalid'            
            this.loteState = lote ? 'valid' : 'invalid'
            this.pesoState = peso ? 'valid' : 'invalid'
            this.quantidadeState = quantidade ? 'valid' : 'invalid'
            this.clienteIdState = this.venda.clienteId ? 'valid' : 'invalid'           

            if(dataPagamento !== null)
                this.dataPagamentoState = dataPagamento ? 'valid' : 'invalid'

            this.venda.dataPagamento = dataPagamento == null ? null : this.venda.dataPagamento
            return valor && dataVenda && lote && peso && quantidade 
        },
        changeShowDate(item){
            return item ? dateFormat(item) : ''
        },
        mudarPeriodoDireita(ano){
            if(this.periodoVendas.mes < 12 && !ano){
                this.periodoVendas.mes += 1
                this.carregarVendas()
            }else if(!ano) {
                this.periodoVendas.ano += 1
                this.periodoVendas.mes = 1
                this.carregarVendas()
            }else {
                this.periodoVendas.ano +=1
            }           
        },
        mudarPeriodoEsquerda(ano){
            if(this.periodoVendas.mes > 1 && !ano){
                this.periodoVendas.mes -= 1
                this.carregarVendas()
            }else if(!ano) {
                this.periodoVendas.ano -= 1
                this.periodoVendas.mes = 12
                this.carregarVendas()
            }else {
                this.periodoVendas.ano -=1
            }           
        },
        zerarDataFinal(){
            this.dataFinalNula = true
            this.periodoVendas.mes=null
            this.periodoVendas.diaFinal = null
            this.periodoVendas.mesFinal = null
            this.periodoVendas.anoFinal = null
            this.carregarVendas()
        }

    },
    mounted(){
        this.carregarVendas()
        this.carregarClientes()
    }

}
</script>

<style>
.altura{
    height: 60px;
}

</style>
