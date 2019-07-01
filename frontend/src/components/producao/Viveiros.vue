<template>
    <b-card>
        <b-table :items="items">
            <template slot="status" slot-scope="data">
                <b-badge :variant="data.item.badge">{{data.item.status}}</b-badge>
            </template>
        </b-table>
    </b-card>
</template>

<script>
export default {
    name:'Viveiros',
    data() {
      return {
        items: [
          { codigo: 1, tamanho: '1000m²', tipo: 'Escavado', status: 'Pronto para povoamento' },
          { codigo: 2, tamanho: '900m²', tipo: 'Escavado', status: 'Povoado', badge:'success' },
          { codigo: 3, tamanho: '30m³', tipo: 'Suspenso', status: 'Seco', badge:'danger' },
          { codigo: 4, tamanho:'900m²', tipo:'Escavado', status: 'Em limpeza', badge:'warning'}
        ]
      }
    }

}
</script>

<style>

</style>
