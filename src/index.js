import express, {json} from 'express';
import cors from 'cors';

import authRouter from './routers/auth-router.js';
import transactionsRouter from './routers/transactions-router.js';

const app = express();  
app.use(express.json());
app.use(cors());
app.use(json());

app.use(authRouter);
app.use(transactionsRouter);


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Rodando na porta ${port}`));
