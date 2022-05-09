import db from "./../db.js";
import joi from "joi";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";


//Usuarios -> {nome:"1°usuario", email:"usuario@email.com",senha:"123", tokne:"asças4d54sad54s"}
//Sessao => {token:"asças4d54sad54s",userId:_id}

export async function getUsuarios(req, res) {
  try {
    const users = await db.collection("usuarios").find().toArray();
    // deletando a propriedade senha e _id
    users.map(user=>{
      delete user.senha;
      delete user._id;
      return users; 
    })
    res.send(users);
  } catch (e) {
    console.log(e);
    return res.status(500).send("Erro na lista de usuarios!", e);
  }
}

export async function getUserLogado(req, res) {
  try {
    const users = await db.collection("sessao").find().toArray();
    // deletando a propriedade senha e _id
    users.map(user=>{
      delete user._id;
      return users; 
    })
    res.send(users);
  } catch (e) {
    console.log(e);
    return res.status(500).send("Erro na lista de usuarios logados!", e);
  }
}

export async function cadastro(req,res){
  const {nome,email,senha} = req.body;
  try {
    const SALT = 10;//padrão
    await db.collection("usuarios").insertOne({nome: nome,email:email, senha: bcrypt.hashSync(senha, SALT)});
    res.status(201).send("OK"); //Usuario cadastrado
  } catch (error) {
    console.log("Error creating user.", error);
    res.status(500).send("Error creating user.");
  }
}

export async function login(req, res) {
  const userSchema = joi.object({
    email: joi.string().email().required(),
    senha: joi.string().required()
  });
  const {error} = userSchema.validate(req.body);
  if(error) return res.sendStatus(422);

  try {
    const user = await db.collection("usuarios").findOne({email: req.body.email});//Encontrando o usuario
    if(!user) return res.sendStatus(404);//Se não encontrar
    if(user && bcrypt.compareSync(req.body.senha, user.senha)) { //Comparando senhas
      const token = uuid();//Atribuindo o token

      //verificar se tem um usuario logado
      const log =  await db.collection("sessao").findOne({userId: user._id});
      if(log){
        //deslogar usuario
        await db.collection("sessao").deleteOne({userId: user._id});

        return res.status(500).send("Usuario já logado")//Usuario ja logado
      } 
        

      //logando usuario
      await db.collection("sessao").insertOne({nome: user.nome,token, userId: user._id});
      res.send({nome:user.nome,token:token});
      console.log("Usuario LOGADO!");
    } else {
      res.sendStatus(404); // Não encontrado
    }

  } catch (error) {
    console.log("Error logging in user.", error);
    res.status(500).send("Error logging in user.");
  }
}

export async function deslogar(req,res){

  const {authorization} = req.headers;
  const token = authorization?.replace("Bearer", "").trim(); //Separnado o token para ter apenas o token
  if(!token) return res.status(401).send("Sem token!");

  try {
    //encontrado o usuario
    const user = await db.collection("sessao").findOne({token});
    if(!user) return res.status(404).send("Não esta na sessão!"); //Token não encontrado
    //apagando da sessao
    await db.collection("sessao").deleteOne({userId: user.userId});
    res.status(200).send("Usuario desconectado");
  } catch(error) {
    console.log("Erro na sessao", error);
    res.status(500).send("Erro ao tentar deslogar o usuario");
  }

}