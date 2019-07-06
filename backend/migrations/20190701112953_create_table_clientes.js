
exports.up = function(knex, Promise) {
    return knex.schema.createTable('clientes', table => {
        table.increments('id').primary()
        table.string('nome').notNull()
        table.string('descricao')
        table.string('telefone')
        table.integer('userId').references('id')
            .inTable('users').notNull()
        //table.timestamp('deletedAt')
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('clientes')   
};
