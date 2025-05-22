import { db } from "../config/database.js";
import { ObjectId } from "mongodb";
import { transactionSchema } from "../schemas/transaction-schema.js";

export async function transaction(req, res) {
    const { value, description, type } = req.body;
    const validation = transactionSchema.validate({ value, description, type }, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    }
    if (type !== "deposit" && type !== "withdraw") {
        return res.status(422).send("Tipo inválido");
    }
    if (value <= 0) {
        return res.status(422).send("Valor inválido");
    }

    try {
        await db.collection("transactions").insertOne({
            value,
            description,
            type
        });
        res.sendStatus(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export async function getTransactions(req, res) {
    try {
        const transactions = await db.collection("transactions").find({ userId: req.userId }).toArray();
        res.status(200).send(transactions);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export async function editTransaction(req, res) {
    const { id } = req.params;
    const { value, description, type } = req.body;

    const validation = transactionSchema.validate({ value, description, type }, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    }

    try {
        await db.collection("transactions").updateOne(
            { _id: new ObjectId(id) },
            { $set: { value, description, type } }
        );
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export async function deleteTransaction(req, res) {
    const { id } = req.params;

    try {
        await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};