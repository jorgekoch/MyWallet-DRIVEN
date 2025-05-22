import {db} from "../index.js"
export async function validarToken (req, res, next) {
// verificar autenticação
const {authorization} = req.headers;
const token = authorization?.replace("Bearer", "").trim();
if(!token) return res.sendStatus(401);    

try {
    const sessao = await db.collection('sessoes').findOne({token});
    if(!sessao) return res.sendStatus(401);  

    next();
    } catch (error) {
    return res.sendStatus(401);     
}}
