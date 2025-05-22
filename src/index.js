import express, {json} from 'express';
import cors from 'cors';

import { getSignIn, getSignUp } from './controllers/auth-controller.js';
import { transaction, getTransactions, editTransaction, deleteTransaction } from './controllers/transactions-controller.js';
import { validarToken } from './middlewares/validarToken.js';

const app = express();  
app.use(express.json());
app.use(cors());
app.use(json());

app.post("/sign-up", getSignUp);
app.post("/sign-in", getSignIn);
app.post("/transactions", validarToken, transaction);
app.get("/transactions", validarToken, getTransactions);
app.put("/transactions/:id", validarToken, editTransaction);
app.delete("/transactions/:id", validarToken, deleteTransaction);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
