import {Express, Request, Response} from 'express';
import path from 'path';
import { UserInfo } from './types';

const publicDir = path.resolve(__dirname, '..', 'public');

// rute za prikaz stranica na frontendu
export const registerRoutes = (app: Express) => {
    app.get('/', (_: Request, res: Response) => {
        res.sendFile(path.join(publicDir, 'index', 'index.html'));
    });

    app.get('/user-info', (req: Request, res: Response) => {
        const result: UserInfo = {
            isAuthenticated: false,
            user: null
        }

        const isAuthenticated = req.oidc.isAuthenticated();

        if (!isAuthenticated) {
            return res.json(result);
        }

        result.isAuthenticated = true;
        result.user = {
            name: req.oidc.user?.name
        };
        
        res.json(result)
    });
    
    app.get('/:page', (req: Request, res: Response) => {
        const page = req.params.page;
        const anonymousPages = ['index'];

        if (!anonymousPages.includes(page) && !req.oidc.isAuthenticated()) {
            return res.redirect('/');
        }

        res.sendFile(path.join(publicDir, page, 'index.html'), (err) => {
            if (err) return res.status(404).send('Not found');
        });
    });
}