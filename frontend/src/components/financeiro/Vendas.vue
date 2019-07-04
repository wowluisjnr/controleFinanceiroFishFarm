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
                    <template v-for="mes in mesesAbrev">
                        <b-button  pill class="mr-2" :pressed="mes == mesesAbrev[periodoVendas.mes-1]" 
                        @click="periodoVendas.mes = mesesAbrev.indexOf(`${mes}`)+1; carregarVendas(); showMeses=false"
                        variant="outline-primary" size="sm" :key="mes">{{mes}}</b-button>
                    </template>
                </div>
                <!-- <div class="altura"></div> -->
            </div>

            <b-table small striped :items="vendas" :fields="fields" :busy="loadTable">
                <template slot="dataVenda" slot-scope="data">
                    {{ changeShowDate(data.item.dataVenda) }}                
                </template>
                <template slot="pago" slot-scope="data">
                    <b-badge v-if="data.item.pago" href="#" pill variant="success"><i class="fa fa-check"></i></b-badge>
                    <b-badge v-else href="#"  variant="danger"><i class="fa fa-close"></i></b-badge>                                    
                </template>
                <template slot="acoes" slot-scope="data">
                    <b-button size="sm" variant="warning" class="mr-2" @click="carregarCliente(data.item)">
                        <i class="fa fa-pencil"></i>
                    </b-button>
                    <b-button size="sm" variant="danger">
                        <!-- Vizualisar vendas para o cliente -->
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
            <div class="mt-5">Total vendas R$ 13.000,00</div>
        </b-col>        
        </b-row>

        <b-modal no-close-on-backdrop  @hidden="resetModal" size="lg"
            v-model="showModalNovo" id="form-venda" title="Nova venda">

            <b-form>
                <input id="venda-id" type="hidden" v-model="venda.id" />          
                <b-form-group
                    id="input-lote"
                    label="Lote:"
                    label-for="lote" >                
                    <b-form-input id="lote" v-model="venda.lote" required></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-peso"
                    label="Peso:"
                    label-for="peso" >                
                    <b-form-input id="peso" type="number" v-model="venda.peso" required></b-form-input>
                </b-form-group>                
            </b-form>

            <div slot="modal-footer" class="w-100">
                <b-button  variant="primary" class="float-right ml-2">
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
import { baseApiUrl, showError, dateFormat } from '@/global'

export default {
    name:'Vendas',
    data() {
      return {    
        showModalNovo:false,
        showModalPeriodo:false,
        showMeses:false,
        loadTable: false,
        formSubmit: false,
        periodoVendas:{},
        venda:{},
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
        meses: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        mesesAbrev:["Jan.", "Fev.", "Mar.", "Abr.", "Mai.", "Jun.", "Jul.", "Ago.", "Set.","Out.", "Nov.", "Dez."],
        form:{
            dataInicio:'',
            dataFim:''
        }

      }
    },
    computed: {
        // validation(){   
        //     if(this.formSubmit) return this.cliente.nome ? true : false         
        //     return this.cliente.nome ? true : null
        // }
    },
    methods:{
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
        },
        onSubmitVenda(evt) {
            //evt.preventDefault()
            this.showModalNovo = false
            
        },
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
            }).catch(showError)            
        }, 
        resetModal(){

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
        }

    },
    mounted(){
        this.carregarVendas()
    }

}
</script>

<style>
.altura{
    height: 60px;
}

</style>
