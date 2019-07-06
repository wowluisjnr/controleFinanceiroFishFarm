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
                .where({ nome: cliente.nome, userId: cliente.userId }).first()
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
        app.db('clientes').select('id','nome', 'descricao', 'telefone')
            //.whereNull('deletedAt')
            .where({userId})
            .then(clientes => res.json(clientes))
            .catch(err => res.status(500).send(err))
    }

    return { get, save }
}