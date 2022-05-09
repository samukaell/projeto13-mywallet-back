import express, { json } from "express";
import dotenv from "dotenv";
import chalk from 'chalk';
import cors from "cors";
//Banco
import db from "./db.js";
//Importação das Routers
import usuariosRouter from "./routers/userRouter.js"
import transacaoRouter from "./routers/transacoesRouter.js";

//Configurações padrões
const app = express();
app.use(json());
app.use(cors());
dotenv.config();

//Routers
app.use(usuariosRouter);
app.use(transacaoRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(chalk.green.bold(`O servidor está em pé ${port}`));
});