
exports.up = function(knex, Promise) {
    return knex.schema.createTable('vendas', table => {
        table.increments('id').primary()
        table.string('lote').notNull()
        table.decimal('peso', 8, 3).notNull()
        table.decimal('valor').notNull()
        table.date('dataVenda').notNull()
        table.boolean('pago').defaultTo(false)
        table.date('dataPagamento')
        table.decimal('pagamentoParcial').defaultTo(0)


        table.integer('clienteId').references('id')
            .inTable('clientes').notNull()
        //table.timestamp('deletedAt')
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('vendas')     
};
