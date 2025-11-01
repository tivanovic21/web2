import {Express, Request, Response} from 'express';
import path from 'path';

const publicDir = path.resolve(__dirname, '..', 'public');

// rute za prikaz stranica na frontendu
export const registerRoutes = (app: Express) => {
    app.get('/', (req: Request, res: Response) => {
        if (req.cookies?.session) {
            return res.sendFile(path.join(publicDir, 'index', 'index.html'));
        }

        res.sendFile(path.join(publicDir, 'login', 'index.html'));
    });

    app.get('/:page', (req: Request, res: Response) => {
        const page = req.params.page;

        res.sendFile(path.join(publicDir, page, 'index.html'), (err) => {
            if (err) return res.status(404).send('Not found');
        });
    });
}