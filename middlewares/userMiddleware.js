import db from "./../db.js";
import joi from "joi";

export async function validarToken(req, res, next) {
  const {authorization} = req.headers;
  const token = authorization?.replace("Bearer", "").trim(); //Separnado o token para ter apenas o token
  if(!token) return res.status(401).send("Sem token!");

  try {
    const sessao = await db.collection("sessao").findOne({token});
    if(!sessao) return res.status(401).send("Não esta na sessão!"); //Token não encontrado

    const user = await db.collection("usuarios").findOne({_id: sessao.userId});
    if(!user) return res.sendStatus(404); //Usuario não encontrado

    res.locals.user = user;
    next();
  } catch(error) {
    console.log("token", error);
    res.status(500).send("Error checking token.");
  }
}

export async function acharUsuarioBd(req, res, next) {
    const userSchema = joi.object({
        nome: joi.string().required(),
        email: joi.string().email().required(),
        senha: joi.string().required()
    });
    const {error} = userSchema.validate(req.body);
    if(error) {
      return res.sendStatus(422)
    };

    const {email} = req.body;

    try {
        const user = await db.collection("usuarios").findOne({email:email});
        if(user) return res.status(401).send("Ja cadastrado"); //Usuario ja existe
        
        next();
      } catch(error) {
        console.log("token", error);
        res.status(500).send("Error na verificação do cadastro do usuario");
      }
  }

