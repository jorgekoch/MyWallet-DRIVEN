import { db } from "../config/database.js";
import { usuarioSchema, sessaoSchema } from "../schemas/auth-schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export async function getSignUp (req, res) {
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
            return res.status(422).send(err.message);
        }
};


export async function getSignIn (req, res) {
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
            return res.status(404).send("E-mail não cadastrado")
        }
    
        if (usuarioCadastrado && 
            bcrypt.compareSync(usuario.senha, usuarioCadastrado.senha)) {
            const token = jwt.sign({}, process.env.JWT_SECRET);
            const sessao = {
                userId: usuarioCadastrado._id,
                token
            };
            await db.collection("sessoes").insertOne(sessao);
            return res.status(200).send({ token });
        } else {
            return res.status(401).send("Senha incorreta");
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
};