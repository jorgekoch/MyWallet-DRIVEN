import { Router } from "express";
import { getSignIn, getSignUp } from "../controllers/auth-controller.js";
import { validarToken } from "../middlewares/validarToken.js";

const authRouter = Router();

authRouter.post("/sign-up", getSignUp);
authRouter.post("/sign-in", getSignIn);

export default authRouter;