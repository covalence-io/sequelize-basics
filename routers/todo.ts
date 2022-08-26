import { Router } from 'express';
const { Todo } = require('../sequelize/models');

export default function todos() {
    const router = Router();

    router
        .post('/', async (req, res, next) => {
            try {
                const model = req.body;
                const t = await Todo.create({
                    user_id: model.user_id,
                    text: model.text,
                });

                res.json(t.toJSON());
            } catch (e) {
                next(e);
            }
        });

    return router;
}