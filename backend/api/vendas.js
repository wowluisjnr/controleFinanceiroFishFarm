module.exports = app =>{

    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) =>{
        const cliente = req.body
        cliente.userId = req.user.id
        if(req.params.id) cliente.id = req.params.id

        try{
            existsOrError(cliente.nome, 'Nome do cliente não informado')
            existsOrError(cliente.userId, 'Problemas na identificação do Usuário! Se percistir no erro contate o suporte.')
            
            const clienteFromDB = await app.db('clientes')
                .where({ nome: cliente.nome }).first()
            if(!cliente.id) {
                notExistsOrError(clienteFromDB, `O Cliente "${cliente.nome}" já esta cadastrado`)
            }

        } catch(msg) {
            return res.status(400).send(msg)
        }        

        if(cliente.id){
            app.db('clientes')
                .update(cliente)
                .where({id: cliente.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
            
        } else {
            app.db('clientes')
                .insert(cliente)
                .then(_ => res.status(204).send())
                .catch( err => res.status(500).send(err))
        }
        
    }

    const get = (req, res) => {
        const userId = req.user.id 
        app.db('vendas').whereExists(function() {
            this.select('*').from('clientes').whereRaw('vendas."clienteId" = clientes.id and clientes."userId" = ?', [userId] )
        }).orderBy('dataVenda', 'desc')
        .then(vendas => res.json(vendas))
        .catch(err => res.status(500).send(err))
    }

    const getByMonth = (req, res) => {
        const userId = req.user.id 
        const periodo = req.params
        
        //console.log(periodo.mes)
        if(periodo.mes<1){
            periodo.mesIni = 1
            periodo.mes = 12
        } else{
            periodo.mesIni = periodo.mes
        }
        periodo.dia = new Date(periodo.ano, periodo.mes, 0).getDate()
        //console.log(periodo)

        app.db('vendas').whereExists(function() {
            this.select('*').from('clientes').whereRaw('vendas."clienteId" = clientes.id and clientes."userId" = ?', [userId] )
        })
        .whereBetween('dataVenda',[`${periodo.ano}-${periodo.mesIni}-01`,`${periodo.ano}-${periodo.mes}-${periodo.dia}`])
        .orderBy('dataVenda', 'desc')
        .then(vendas => res.json(vendas))
        .catch(err => res.status(500).send(err))
    }

    return { get, getByMonth, save }
}