import { Router } from "express";
//controllers
import { cadastro, getUsuarios, login, deslogar, getUserLogado } from "../controllers/userController.js"; 
//Middlewares
import {acharUsuarioBd} from "../middlewares/userMiddleware.js"

const usuariosRouter = Router();

usuariosRouter.get("/usuarios", getUsuarios);
usuariosRouter.get("/logados", getUserLogado);
usuariosRouter.post("/cadastro", acharUsuarioBd, cadastro);
usuariosRouter.post("/login", login);
usuariosRouter.post("/deslogar", deslogar);

export default usuariosRouter;