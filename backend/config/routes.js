// const user = require('../api/user')
const admin = require('./admin') //tem a função middware que verifica se é admin
//....post(user.save)

module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)    
    app.post('/validateAdmin', app.api.auth.validateAdmin)



    app.route('/users')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.user.get))
        .post(admin(app.api.user.save))

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        //.get(app.api.user.getId) //Função não sera usada
        .put(admin(app.api.user.save))
        .delete(admin(app.api.user.remove))

    app.route('/clientes')
        .all(app.config.passport.authenticate())
        .get(app.api.clientes.get)
        .post(app.api.clientes.save)

    app.route('/clientes/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.clientes.save)
    
    app.route('/vendas')
        .all(app.config.passport.authenticate())
        .get(app.api.vendas.get)
    //     .post(app.api.vendas.save)

    app.route('/vendas/:dia/:mes/:ano/:diaFinal/:mesFinal/:anoFinal')
        .all(app.config.passport.authenticate())
        .get(app.api.vendas.getByMonth)
    //    .put(app.api.vendas.save)

}