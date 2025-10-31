import {Express, Request, Response} from 'express';
import path from 'path';
import fs from 'fs';

const publicDir = path.resolve(__dirname, '..', 'public');

// rute za prikaz stranica na frontendu
export const registerRoutes = (app: Express) => {
    app.get('/', (_: Request, res: Response) => {
        res.sendFile(path.join(publicDir, 'index', 'index.html'));
    });

    app.get('/:page', (req: Request, res: Response) => {
        const page = req.params.page;

        res.sendFile(path.join(publicDir, page, 'index.html'), (err) => {
            if (err) return res.status(404).send('Not found');
        });
    });
}