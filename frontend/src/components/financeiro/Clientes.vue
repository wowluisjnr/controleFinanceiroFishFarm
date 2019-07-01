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

                <b-modal id="form-cliente" title="Cadastro de Cliente" cancelTitle='Cancelar' okTitle='Salvar'>
                    <label for="nome">Nome</label>
                    <b-form-input id="nome" ></b-form-input>
                    <label for="descricao">Descrição</label>
                    <b-form-input id="descricao" ></b-form-input>
                    <label for="telefone">Telefone</label>
                    <b-input id="telefone" ></b-input>
                </b-modal>
            
            </b-form-group>
            </b-col>
            </b-row>

            <b-table striped :items="items">

            </b-table>
        </b-card>
    </div>
</template>

<script>
export default {
    name:'Clientes',
    data() {
      return {
        filter:'',
        items: [
          { nome: 'Gela Guela', descricao: 'Praia do segredo', telefone: '99999-9999', acoes: 'editar, ver dividas'},
          { nome: 'Coló', descricao: 'Barraca praia do funil', telefone: '99999-9999', acoes: ''},
          { nome: 'Mulher veáca', descricao: 'Praia do funil', telefone: '99999-9999', acoes: ''}
        ]
      }
    }


}
</script>

<style>

</style>
