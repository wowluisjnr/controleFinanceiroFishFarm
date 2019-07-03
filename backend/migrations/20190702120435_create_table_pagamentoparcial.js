
exports.up = function(knex, Promise) {
    return knex.schema.createTable('pagamentoparcial', table => {
        table.increments('id').primary()
        table.decimal('valor').notNull()
        table.date('dataPagamento').notNull()

        table.integer('vendaId').references('id')
            .inTable('vendas').notNull()
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('pagamentoparcial')   
};
