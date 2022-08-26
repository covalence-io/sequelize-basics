import { NextFunction, Request, Response, Router } from 'express';
import todos from './todo';
import users from './user';

export default function api() {
    const router = Router();

    router
        .use((req, res, next) => {
            if (!req.body) {
                next(new Error('Bad request'));
                return;
            }

            next();
        })
        .use('/v1', apiV1())
        .use((req, res, next) => {
            res.status(404).json({
                error: 'Invalid route',
            });
        })
        .use((err: Error, req: Request, res: Response, next: NextFunction) => {
            res.status(500).json({
                error: err.message,
            });
        });

    return router;
}

function apiV1() {
    const router = Router();

    router
        .use((req, res, next) => {
            console.log('API V1');
            next();
        })
        .use('/todos', todos())
        .use('/users', users());

    return router;
}