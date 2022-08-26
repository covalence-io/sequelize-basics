import { Router } from 'express';
const { User, Todo } = require('../sequelize/models');

export default function users() {
    const router = Router();

    router
        .get('/:id', async (req, res, next) => {
            try {
                const u = await User.findOne({
                    where: {
                        id: Number(req.params.id),
                    },
                    include: [
                        {
                            model: Todo,
                            attributes: ['id', 'text']
                        }
                    ]
                });

                if (!u) {
                    throw new Error('User does not exist');
                }

                res.json(u.toJSON());
            } catch (e) {
                next(e);
            }
        })
        .post('/', async (req, res, next) => {
            try {
                const model = req.body;
                const u = await User.create({
                    first_name: model.first_name,
                    last_name: model.last_name,
                    email: model.email,
                });

                res.json(u.toJSON());
            } catch (e) {
                next(e);
            }
        });

    return router;
}