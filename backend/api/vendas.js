module.exports = app =>{

    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) =>{
        console.log(req.body)

        let venda = {}
        if(!req.body.pago){
            venda.id = req.body.id
            venda.valor = req.body.valor
            venda.lote = req.body.lote
            venda.peso = req.body.peso
            venda.quantidadePeixe =  req.body.quantidadePeixe
            venda.dataVenda =  req.body.dataVenda
            venda.pago = req.body.pago
            venda.clienteId =  req.body.clienteId
        }
        else{
            venda = { ...req.body}
        }

        try{
            existsOrError(venda.valor, 'Valor da venda não informado')
            existsOrError(venda.lote, 'Lote do pescado não informado.')
            existsOrError(venda.peso, 'Peso do pescado não informado.')
            existsOrError(venda.quantidadePeixe, 'Quantidade de peixes vendidas não informada.')
            existsOrError(venda.dataVenda, 'Data da venda não informada.')
            existsOrError(venda.clienteId, 'Cliente não informado.')           
        } catch(msg) {
            return res.status(400).send(msg)
        }        

        if(venda.id){
            app.db('vendas')
                .update(venda)
                .where({id: venda.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
            
        } else {
            app.db('vendas')
                .insert(venda)
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
        
        if(periodo.mesFinal == 'undefined' || !periodo.mesFinal || periodo.mesFinal =='null'){ 
            periodo.mesFinal = periodo.mes
            periodo.anoFinal = periodo.ano
            periodo.diaFinal = new Date(periodo.ano, periodo.mes, 0).getDate()
        } 
        
        //console.log(periodo)

        app.db('vendas').whereExists(function() {
            this.select('*').from('clientes').whereRaw('vendas."clienteId" = clientes.id and clientes."userId" = ?', [userId] )
        })
        .whereBetween('dataVenda',[`${periodo.ano}-${periodo.mes}-${periodo.dia}`,`${periodo.anoFinal}-${periodo.mesFinal}-${periodo.diaFinal}`])
        .orderBy('dataVenda', 'desc')
        .then(vendas => res.json(vendas))
        .catch(err => res.status(500).send(err))
    }

    return { get, getByMonth, save }
}