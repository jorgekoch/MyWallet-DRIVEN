import express, {json} from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import joi from 'joi';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

dotenv.config();
const app = express();  
app.use(express.json());
app.use(cors());
app.use(json());


const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
mongoClient.connect()
.then(() => db = mongoClient.db())
.catch((err) => console.log(err.message));

const usuarioSchema = joi.object({
  nome: joi.string().required(),
  email: joi.string().email().required(),
  senha: joi.string().required(),
});

const sessaoSchema = joi.object({
  email: joi.string().email().required(),
  senha: joi.string().required(),
});


app.post("/sign-up", async (req, res) => {
  const usuario = req.body;

  const validation = usuarioSchema.validate(usuario, { abortEarly: false });
  
  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  try {
		const usuarioExistente = await db.collection("usuarios").findOne({email: usuario.email});
            if (usuarioExistente) return res.status(409).send("E-mail já cadastrado")

		const hash = bcrypt.hashSync(usuario.senha, 10);
        await db.collection("usuarios").insertOne(
            { 
                nome: usuario.nome,
                email: usuario.email,
                senha: hash
            }
         );

        res.sendStatus(201);
        } catch (err) {
            return res.status(500).send(err.message);
        }
});

app.post("/sign-in", async (req, res) => {
    const usuario = req.body;
    
    const validation = sessaoSchema.validate(usuario, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    }
    
    try {
        const usuarioCadastrado = await db.collection("usuarios").findOne({ 
            email: usuario.email 
        });

        if (!usuarioCadastrado) {
            return res.status(401).send("E-mail não cadastrado")
        }
    
        if (usuarioCadastrado && 
            bcrypt.compareSync(usuario.senha, usuarioCadastrado.senha)) {
            const token = uuid();
            const sessao = {
                userId: usuarioCadastrado._id,
                token
            };
            await db.collection("sessoes").insertOne(sessao);
            return res.status(200).send({ token });
        }
    
        return res.status(401).send("Senha incorreta");
    } catch (err) {
        return res.status(500).send(err.message);
    }
});



