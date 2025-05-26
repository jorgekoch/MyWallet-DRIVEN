import { Router } from "express";
import { 
    transaction, 
    getTransactions, 
    editTransaction, 
    deleteTransaction 
    } from "../controllers/transactions-controller.js";
import { validarToken } from "../middlewares/validarToken.js";

const transactionsRouter = Router();

transactionsRouter.post("/transactions", validarToken, transaction);
transactionsRouter.get("/transactions", validarToken, getTransactions);
transactionsRouter.put("/transactions/:id", validarToken, editTransaction);
transactionsRouter.delete("/transactions/:id", validarToken, deleteTransaction);

export default transactionsRouter;