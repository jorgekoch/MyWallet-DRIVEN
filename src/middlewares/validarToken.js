import {db} from "../config/database.js";

export async function validarToken (req, res, next) {
const {authorization} = req.headers;
const token = authorization?.replace("Bearer", "").trim();
if(!token) return res.sendStatus(401);    

try {
    const sessao = await db.collection("sessoes").findOne({token});
    if(!sessao) return res.sendStatus(401);  

    const user = await db.collection("usuarios").findOne({
        _id: sessao.userId
    });
    if(!user) return res.sendStatus(401);

    res.locals.user = user;

    next();
    } catch (error) {
    return res.sendStatus(401);     
}}
