import db from "./../db.js";
import joi from "joi";
import dayjs from "dayjs"
/*
    Transacoes -> {
        userId:"_idUsuario", 
        tipo: entrada || saida
        {
            nome: "nome da transação"
            valor: 10.00
        }

*/
export async function inserirTransacao(req,res){
    const userSchema = joi.object({
        tipo: joi.string().valid('entrada','saida').required(),
        nome: joi.string().required(),
        valor: joi.number().required()
    });
    const {error} = userSchema.validate(req.body);
    if(error) return res.sendStatus(422);

    const {nome,valor,tipo} = req.body 

    const {user} = res.locals;
    try {
        await db.collection("transacoes").insertOne({nome,valor,tipo,data:`${dayjs().date()}/${dayjs().month()}`, userId: user._id});
        res.sendStatus(201); // criado

    } catch (error) {
        console.log("Error insercao da transação.", error);
        res.status(500).send("Error insercao da transação.");
    }
}

export async function getEntrada(req, res) {
    const {user} = res.locals;
    try {
      const listaTransacao = await db.collection("transacoes").find({userId: user._id ,tipo:'entrada'}).toArray();
      // deletando a propriedade  userId e _id
      listaTransacao.map(transacao=>{
        delete transacao.userId;
        delete transacao._id;
        return listaTransacao; 
      });
      
      res.send(listaTransacao);
    } catch (e) {
      console.log(e);
      return res.status(500).send("Erro na lista de Entrada das transações!", e);
    }
}
export async function getSaida(req, res) {
    const {user} = res.locals;
    try {
      const listaTransacao = await db.collection("transacoes").find({userId: user._id ,tipo:'saida'}).toArray();
      // deletando a propriedade  userId e _id
      listaTransacao.map(transacao=>{
        delete transacao.userId;
        delete transacao._id;
        return listaTransacao; 
      });
      
      res.send(listaTransacao);
    } catch (e) {
      console.log(e);
      return res.status(500).send("Erro na lista de Saida das transações!", e);
    }
}