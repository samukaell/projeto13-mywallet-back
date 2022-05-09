import { Router } from "express";
//controllers
import { inserirTransacao, getEntrada, getSaida } from "../controllers/transacaoController.js"; 
//Middlewares
import {validarToken} from "../middlewares/userMiddleware.js"

const transacaoRouter = Router();
transacaoRouter.use(validarToken);//sempre validar o token

transacaoRouter.post("/inserir", inserirTransacao);
transacaoRouter.get("/entrada", getEntrada);
transacaoRouter.get("/saida", getSaida);

export default transacaoRouter;